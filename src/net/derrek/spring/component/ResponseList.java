package net.derrek.spring.component;

import java.util.Collection;

public class ResponseList<T> extends ResponseBase {

	Collection<T> data;

	public static <E> ResponseList<E> success(Collection<E> data) {
		ResponseList<E> responseList = new ResponseList<>();
		responseList.setData(data);
		return responseList;
	}

	public static ResponseList<?> error(Throwable throwable) {
		ResponseList<?> responseList = new ResponseList<>();
		responseList.setError(throwable);
		return responseList;
	}

	public Collection<T> getData() {
		return data;
	}

	public void setData(Collection<T> data) {
		this.data = data;
		super.setSuccess();
	}

}
