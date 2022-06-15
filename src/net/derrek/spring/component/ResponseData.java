package net.derrek.spring.component;

public class ResponseData<T> extends ResponseBase {

	T data;

	public T getData() {
		return data;
	}

	public void setData(T data) {
		this.data = data;
		super.setSuccess();
	}

}
