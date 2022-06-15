package net.derrek.spring.component;

import java.util.Collection;

import com.github.pagehelper.PageInfo;

public class FetchTable {
	Integer pageNum;
	Integer pageSize;
	Long totalSize;
	Collection<?> data;

	public FetchTable() {

	}

	public FetchTable(PageInfo<?> pageInfo) {
		this.pageNum = pageInfo.getPageNum();
		this.pageSize = pageInfo.getSize();
		this.totalSize = pageInfo.getTotal();
		this.data = pageInfo.getList();
	}

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

	public Long getTotalSize() {
		return totalSize;
	}

	public void setTotalSize(Long totalSize) {
		this.totalSize = totalSize;
	}

	public Collection<?> getData() {
		return data;
	}

	public void setData(Collection<?> data) {
		this.data = data;
	}
}
