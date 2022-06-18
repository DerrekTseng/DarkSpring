package net.derrek.tools;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.xml.bind.DatatypeConverter;

public class CryptoTools {

	public static byte[] JSByteToJavaByte(List<Integer> list) {
		byte[] bytes = new byte[list.size()];
		for (int i = 0; i < bytes.length; i++) {
			bytes[i] = list.get(i).byteValue();
		}
		return bytes;
	}

	public static List<Integer> JavaByteToJSByte(byte[] bytes) {
		List<Integer> list = new ArrayList<>();
		for (int i = 0; i < bytes.length; i++) {
			list.add(Byte.toUnsignedInt(bytes[i]));
		}
		return list;
	}

	public static byte[] equalityEncrypt(byte[] data, byte[] key) {
		return equalityCrypto(data, key, true);
	}

	public static byte[] equalityDecrypt(byte[] data, byte[] key) {
		return equalityCrypto(data, key, false);
	}

	private static interface EqualityCryptoAlgorithm {

		void algorithm(int[] nexts);

		default byte next(int[] nexts) {
			algorithm(nexts);
			return fix(nexts);
		}

		default byte fix(int[] nexts) {
			if (nexts[1] > 128) {
				nexts[1] -= 256;
			}
			if (nexts[1] < -128) {
				nexts[1] += 256;
			}
			return (byte) nexts[1];
		}
	}

	private static class EqualityEncryptAlgorithm implements EqualityCryptoAlgorithm {
		public void algorithm(int[] nexts) {
			nexts[1] = nexts[0] % 2 == 0 ? nexts[1] - nexts[2] : nexts[1] + nexts[2];
		}
	}

	private static class EqualityDecryptAlgorithm implements EqualityCryptoAlgorithm {
		public void algorithm(int[] nexts) {
			nexts[1] = nexts[0] % 2 == 0 ? nexts[1] + nexts[2] : nexts[1] - nexts[2];
		}
	}

	private static byte[] equalityCrypto(byte[] data, byte[] key, boolean isEncrypt) {
		byte[] result = new byte[data.length];

		int[] nexts = new int[3];

		EqualityCryptoAlgorithm elgorithm = isEncrypt ? new EqualityEncryptAlgorithm() : new EqualityDecryptAlgorithm();

		byte[][] keyPartitions;

		if (key.length > data.length) {
			keyPartitions = new byte[key.length / data.length + 1][];
			for (int keyCount = 0; keyCount < keyPartitions.length; keyCount++) {
				if ((keyCount + 1) * data.length > key.length) {
					keyPartitions[keyCount] = Arrays.copyOfRange(key, keyCount * data.length, key.length);
				} else {
					keyPartitions[keyCount] = Arrays.copyOfRange(key, keyCount * data.length, (keyCount + 1) * data.length);
				}
			}
		} else {
			keyPartitions = new byte[1][];
			keyPartitions[0] = key;
		}

		for (byte[] keyPartition : keyPartitions) {

			for (int dataCount = 0, keyCount = 0; dataCount < data.length; dataCount++, keyCount++) {

				keyCount = keyCount == keyPartition.length ? 0 : keyCount;

				nexts[0] = keyPartition[keyCount]; // nextKey

				nexts[1] = data[dataCount]; // nextData

				nexts[2] = (dataCount + nexts[0]) % 256; // nextDisplacement

				result[dataCount] = elgorithm.next(nexts);

			}

		}

		return result;

	}

	public static String bytesToString(byte[] bytes) {
		return DatatypeConverter.printHexBinary(bytes);
	}

	public static byte[] stringToBytes(String string) {
		return DatatypeConverter.parseHexBinary(string);
	}

	/**
	 * 單方向加密 無法反解密
	 * 
	 * @author DerrekTseng
	 */
	public static class oneWayHash {

		public static String MD5(String str) {
			return doHash(str, "MD5");
		}

		public static String SHA256(String str) {
			return doHash(str, "SHA-256");
		}

		public static String SHA512(String str) {
			return doHash(str, "SHA-512");
		}

		private static String doHash(String str, String algorithm) {
			try {
				if (str == null || "".equals(str)) {
					return "";
				}
				MessageDigest messageDigest = MessageDigest.getInstance(algorithm);
				messageDigest.update(str.getBytes());
				return bytesToString(messageDigest.digest());
			} catch (Exception e) {
				throw new RuntimeException(e);
			}
		}
	}

	public static class CryptoFileNexter {

		private volatile int keyIndex = 0;
		private volatile int dataIndex = 0;

		private final EqualityCryptoAlgorithm elgorithm;

		private final int[] nexts = new int[3];

		private final byte[][] keyPartitions;

		public CryptoFileNexter(int dataLength, byte[] key, boolean isEncrypt) {

			this.elgorithm = isEncrypt ? new EqualityEncryptAlgorithm() : new EqualityDecryptAlgorithm();

			if (key.length > dataLength) {
				keyPartitions = new byte[key.length / dataLength + 1][];
				for (int keyCount = 0; keyCount < keyPartitions.length; keyCount++) {
					if ((keyCount + 1) * dataLength > key.length) {
						keyPartitions[keyCount] = Arrays.copyOfRange(key, keyCount * dataLength, key.length);
					} else {
						keyPartitions[keyCount] = Arrays.copyOfRange(key, keyCount * dataLength, (keyCount + 1) * dataLength);
					}
				}
			} else {
				keyPartitions = new byte[1][];
				keyPartitions[0] = key;
			}

		}

		public byte next(byte b) {

			for (byte[] keyPartition : keyPartitions) {
				keyIndex = keyIndex >= keyPartition.length ? keyIndex % keyPartition.length : keyIndex;

				nexts[0] = keyPartition[keyIndex++]; // nextKey

				nexts[1] = b; // nextData

				nexts[2] = (dataIndex++ + nexts[0]) % 256; // nextDisplacement

				b = elgorithm.next(nexts);
			}

			return b;
		}

	}

	public static class CryptoFileInputStream extends InputStream {

		private final FileInputStream fileInputStream;

		private final CryptoFileNexter nexter;

		public CryptoFileInputStream(String name, byte[] key) throws IOException {
			fileInputStream = new FileInputStream(name);
			nexter = new CryptoFileNexter(fileInputStream.available(), key, false);
		}

		public CryptoFileInputStream(File file, byte[] key) throws IOException {
			fileInputStream = new FileInputStream(file);
			nexter = new CryptoFileNexter(fileInputStream.available(), key, false);
		}

		@Override
		public int read() throws IOException {
			return nexter.next((byte) fileInputStream.read());
		}

		@Override
		public int available() throws IOException {
			return fileInputStream.available();
		}

		@Override
		public void close() throws IOException {
			fileInputStream.close();
		}

	}

	public static class CryptoFileOutputStream extends OutputStream {

		private final FileOutputStream fileOutputStream;

		private final CryptoFileNexter nexter;

		public CryptoFileOutputStream(int dataLength, File file, byte[] key) throws FileNotFoundException {
			fileOutputStream = new FileOutputStream(file);
			nexter = new CryptoFileNexter(dataLength, key, true);
		}

		public CryptoFileOutputStream(int dataLength, String file, byte[] key) throws FileNotFoundException {
			fileOutputStream = new FileOutputStream(file);
			nexter = new CryptoFileNexter(dataLength, key, true);
		}

		public CryptoFileOutputStream(int dataLength, File file, byte[] key, boolean append) throws FileNotFoundException {
			fileOutputStream = new FileOutputStream(file, append);
			nexter = new CryptoFileNexter(dataLength, key, true);
		}

		public CryptoFileOutputStream(int dataLength, String file, byte[] key, boolean append) throws FileNotFoundException {
			fileOutputStream = new FileOutputStream(file, append);
			nexter = new CryptoFileNexter(dataLength, key, true);
		}

		@Override
		public void write(int b) throws IOException {
			fileOutputStream.write(nexter.next((byte) b));
		}

		@Override
		public void flush() throws IOException {
			fileOutputStream.flush();
		}

		@Override
		public void close() throws IOException {
			fileOutputStream.close();
		}

	}
}
