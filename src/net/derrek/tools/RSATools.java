package net.derrek.tools;

import javax.crypto.Cipher;

import java.io.ByteArrayOutputStream;
import java.io.Serializable;
import java.security.*;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.*;
import java.util.Base64;

public class RSATools {

	public static final String CHARSET = "UTF-8";
	public static final String RSA_ALGORITHM = "RSA";
	public static final String RSA_SIGNATURE_ALGORITHM = "SHA256WithRSA";

	public static class RSAKeyPair implements Serializable {

		private static final long serialVersionUID = -2024175666031498187L;

		private final String privateKey;
		private final String publicKey;

		private final String privateKeyFileFormat;
		private final String publicKeyFileFormat;

		public RSAKeyPair(String privateKey, String publicKey) {
			this.privateKey = privateKey;
			this.publicKey = publicKey;

			StringBuilder fileFormat = new StringBuilder();
			int count = 0;

			fileFormat.setLength(0);
			fileFormat.append("-----BEGIN PRIVATE KEY-----\n");
			count = 0;
			for (char c : privateKey.toCharArray()) {
				count++;
				fileFormat.append(c);
				if (count % 64 == 0) {
					fileFormat.append("\n");
				}
			}
			if (count % 64 != 0) {
				fileFormat.append("\n");
			}
			fileFormat.append("-----END PRIVATE KEY-----");
			privateKeyFileFormat = fileFormat.toString();

			fileFormat.setLength(0);
			fileFormat.append("-----BEGIN PUBLIC KEY-----\n");
			count = 0;
			for (char c : publicKey.toCharArray()) {
				count++;
				fileFormat.append(c);
				if (count % 64 == 0) {
					fileFormat.append("\n");
				}
			}
			if (count % 64 != 0) {
				fileFormat.append("\n");
			}
			fileFormat.append("-----END PUBLIC KEY-----");
			publicKeyFileFormat = fileFormat.toString();
		}

		public String getPrivateKey() {
			return privateKey;
		}

		public String getPublicKey() {
			return publicKey;
		}

		public String getPrivateKeyFileFormat() {
			return privateKeyFileFormat;
		}

		public String getPublicKeyFileFormat() {
			return publicKeyFileFormat;
		}

	}

	/**
	 * ???????????? RSA KeyPair
	 * 
	 * @param keySize
	 * @return
	 */
	public static RSAKeyPair createKeyPair(int keySize) {
		// ???RSA?????????????????????KeyPairGenerator??????
		KeyPairGenerator kpg;
		try {
			kpg = KeyPairGenerator.getInstance(RSA_ALGORITHM);
		} catch (NoSuchAlgorithmException e) {
			throw new IllegalArgumentException("No such algorithm-->[" + RSA_ALGORITHM + "]");
		}

		// ?????????KeyPairGenerator??????,????????????
		kpg.initialize(keySize);
		// ???????????????
		KeyPair keyPair = kpg.generateKeyPair();
		// ????????????
		Key publicKey = keyPair.getPublic();
		String publicKeyStr = Base64.getEncoder().encodeToString((publicKey.getEncoded()));
		// ????????????
		Key privateKey = keyPair.getPrivate();
		String privateKeyStr = Base64.getEncoder().encodeToString((privateKey.getEncoded()));

		RSAKeyPair rsaKeyPair = new RSAKeyPair(privateKeyStr, publicKeyStr);

		return rsaKeyPair;
	}

	/**
	 * ????????????
	 * 
	 * @param publicKey ?????????????????????base64?????????
	 * @throws Exception
	 */
	public static RSAPublicKey getPublicKey(String publicKey) throws NoSuchAlgorithmException, InvalidKeySpecException {
		// ??????X509?????????Key????????????????????????
		KeyFactory keyFactory = KeyFactory.getInstance(RSA_ALGORITHM);
		X509EncodedKeySpec x509KeySpec = new X509EncodedKeySpec(Base64.getDecoder().decode(publicKey));
		RSAPublicKey key = (RSAPublicKey) keyFactory.generatePublic(x509KeySpec);
		return key;
	}

	/**
	 * ????????????
	 * 
	 * @param privateKey ?????????????????????base64?????????
	 * @throws Exception
	 */
	public static RSAPrivateKey getPrivateKey(String privateKey) throws NoSuchAlgorithmException, InvalidKeySpecException {
		// ??????PKCS#8?????????Key????????????????????????
		KeyFactory keyFactory = KeyFactory.getInstance(RSA_ALGORITHM);
		PKCS8EncodedKeySpec pkcs8KeySpec = new PKCS8EncodedKeySpec(Base64.getDecoder().decode(privateKey));
		RSAPrivateKey key = (RSAPrivateKey) keyFactory.generatePrivate(pkcs8KeySpec);
		return key;
	}

	/**
	 * ????????????
	 * 
	 * @param data
	 * @param publicKey
	 * @return
	 */
	public static String publicEncrypt(String data, RSAPublicKey publicKey) {
		try {
			Cipher cipher = Cipher.getInstance(RSA_ALGORITHM);
			cipher.init(Cipher.ENCRYPT_MODE, publicKey);
			return Base64.getEncoder().encodeToString((rsaSplitCodec(cipher, Cipher.ENCRYPT_MODE, data.getBytes(CHARSET), publicKey.getModulus().bitLength())));
		} catch (Exception e) {
			throw new RuntimeException("????????????[" + data + "]???????????????", e);
		}
	}

	/**
	 * ????????????
	 * 
	 * @param data
	 * @param publicKey
	 * @return
	 */
	public static String publicEncrypt(String data, String publicKey) throws NoSuchAlgorithmException, InvalidKeySpecException {
		return publicEncrypt(data, getPublicKey(publicKey));
	}

	/**
	 * ????????????
	 * 
	 * @param data
	 * @param privateKey
	 * @return
	 */
	public static String privateDecrypt(String data, RSAPrivateKey privateKey) {
		try {
			Cipher cipher = Cipher.getInstance(RSA_ALGORITHM);
			cipher.init(Cipher.DECRYPT_MODE, privateKey);
			return new String(rsaSplitCodec(cipher, Cipher.DECRYPT_MODE, Base64.getDecoder().decode(data), privateKey.getModulus().bitLength()), CHARSET);
		} catch (Exception e) {
			throw new RuntimeException("????????????[" + data + "]???????????????", e);
		}
	}

	/**
	 * ????????????
	 * 
	 * @param data
	 * @param privateKey
	 * @return
	 */
	public static String privateDecrypt(String data, String privateKey) throws NoSuchAlgorithmException, InvalidKeySpecException {
		return privateDecrypt(data, getPrivateKey(privateKey));
	}

	/**
	 * ????????????
	 * 
	 * @param data
	 * @param privateKey
	 * @return
	 */
	public static String privateEncrypt(String data, RSAPrivateKey privateKey) {
		try {
			Cipher cipher = Cipher.getInstance(RSA_ALGORITHM);
			cipher.init(Cipher.ENCRYPT_MODE, privateKey);
			return Base64.getEncoder().encodeToString(rsaSplitCodec(cipher, Cipher.ENCRYPT_MODE, data.getBytes(CHARSET), privateKey.getModulus().bitLength()));
		} catch (Exception e) {
			throw new RuntimeException("????????????[" + data + "]???????????????", e);
		}
	}

	/**
	 * ????????????
	 * 
	 * @param data
	 * @param privateKey
	 * @return
	 */
	public static String privateEncrypt(String data, String privateKey) throws NoSuchAlgorithmException, InvalidKeySpecException {
		return privateEncrypt(data, getPrivateKey(privateKey));
	}

	/**
	 * ????????????
	 * 
	 * @param data
	 * @param publicKey
	 * @return
	 */
	public static String publicDecrypt(String data, RSAPublicKey publicKey) {
		try {
			Cipher cipher = Cipher.getInstance(RSA_ALGORITHM);
			cipher.init(Cipher.DECRYPT_MODE, publicKey);
			return new String(rsaSplitCodec(cipher, Cipher.DECRYPT_MODE, Base64.getDecoder().decode(data), publicKey.getModulus().bitLength()), CHARSET);
		} catch (Exception e) {
			throw new RuntimeException("????????????[" + data + "]???????????????", e);
		}
	}

	/**
	 * ????????????
	 * 
	 * @param data
	 * @param publicKey
	 * @return
	 */
	public static String publicDecrypt(String data, String publicKey) throws NoSuchAlgorithmException, InvalidKeySpecException {
		return publicDecrypt(data, getPublicKey(publicKey));
	}

	private static byte[] rsaSplitCodec(Cipher cipher, int opmode, byte[] datas, int keySize) {
		int maxBlock = 0;
		if (opmode == Cipher.DECRYPT_MODE) {
			maxBlock = keySize / 8;
		} else {
			maxBlock = keySize / 8 - 11;
		}
		try (ByteArrayOutputStream out = new ByteArrayOutputStream();) {
			int offSet = 0;
			byte[] buff;
			int i = 0;
			try {
				while (datas.length > offSet) {
					if (datas.length - offSet > maxBlock) {
						buff = cipher.doFinal(datas, offSet, maxBlock);
					} else {
						buff = cipher.doFinal(datas, offSet, datas.length - offSet);
					}
					out.write(buff, 0, buff.length);
					i++;
					offSet = i * maxBlock;
				}
			} catch (Exception e) {
				throw new RuntimeException("??????????????????[" + maxBlock + "]????????????????????????", e);
			}
			byte[] resultDatas = out.toByteArray();

			return resultDatas;
		} catch (Exception e) {
			return null;
		}
	}

	/**
	 * ?????????????????????
	 * 
	 * @param data       ??????
	 * @param privateKey ??????
	 * @return byte[] ????????????
	 */
	public static byte[] getSignature(byte[] data, String privateKey) {
		try {
			Signature sig = Signature.getInstance(RSA_SIGNATURE_ALGORITHM);
			sig.initSign(getPrivateKey(privateKey));
			sig.update(data);
			return sig.sign();
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	/**
	 * ????????????
	 * 
	 * @param data           ??????
	 * @param signatureBytes ????????????
	 * @param publicKey      ??????
	 * @return
	 */
	public static boolean verifySignature(byte[] data, byte[] signatureBytes, String publicKey) {
		try {
			Signature sig = Signature.getInstance(RSA_SIGNATURE_ALGORITHM);
			sig.initVerify(getPublicKey(publicKey));
			sig.update(data);
			return sig.verify(signatureBytes);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

}
