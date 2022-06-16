package net.derrek.spring.component;

public class ResponseData<T> extends ResponseBase {

	T data;

	public static <E> ResponseData<E> create(E data) {
		ResponseData<E> responseData = new ResponseData<>();
		responseData.setData(data);
		return responseData;
	}
	
	public static ResponseData<?> error(Throwable throwable) {
		ResponseData<?> responseData = new ResponseData<>();
		responseData.setError(throwable);
		return responseData;
	}

	public T getData() {
		return data;
	}

	public void setData(T data) {
		this.data = data;
		super.setSuccess();
	}

}
