package com.dark.core.component;

import java.util.List;

import org.springframework.web.multipart.commons.CommonsMultipartFile;

public class RequestFile {
	
	List<CommonsMultipartFile> files;
	RequestFileParameter data;

	public List<CommonsMultipartFile> getFiles() {
		return files;
	}

	public void setFiles(List<CommonsMultipartFile> files) {
		this.files = files;
	}

	public RequestFileParameter getData() {
		return data;
	}

	public void setData(RequestFileParameter data) {
		this.data = data;
	}

}
