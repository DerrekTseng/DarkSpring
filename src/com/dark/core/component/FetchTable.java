package com.dark.core.component;

import java.util.Collection;

public class FetchTable {
	Integer pageNum;
	Integer pageSize;
	Integer totalSize;
	Collection<?> data;

	public Integer getPageNum() {
		return pageNum;
	}

	public void setPageNum(Integer pageNum) {
		this.pageNum = pageNum;
	}

	public Integer getPageSize() {
		return pageSize;
	}

	public void setPageSize(Integer pageSize) {
		this.pageSize = pageSize;
	}

	public Integer getTotalSize() {
		return totalSize;
	}

	public void setTotalSize(Integer totalSize) {
		this.totalSize = totalSize;
	}

	public Collection<?> getData() {
		return data;
	}

	public void setData(Collection<?> data) {
		this.data = data;
	}
}
