package net.derrek.spring.component;

import java.util.Collection;

public class ResponseList<T> extends ResponseBase {

	Collection<T> data;

	public Collection<T> getData() {
		return data;
	}

	public void setData(Collection<T> data) {
		this.data = data;
		super.setSuccess();
	}

}
