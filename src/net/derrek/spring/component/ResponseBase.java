package net.derrek.spring.component;

public class ResponseBase {

	protected static final String SUCCESS_CODE = "200";

	protected static final String ERROR_CODE = "500";

	String statusCode;

	String message;

	public void setError(Throwable throwable) {
		this.setError(throwable.getMessage());
	}

	public void setError(String message) {
		this.statusCode = ERROR_CODE;
		this.message = message;
	}

	public void setSuccess() {
		this.statusCode = SUCCESS_CODE;
		this.message = "success";
	}

	public String getStatusCode() {
		return statusCode;
	}

	public void setStatusCode(String statusCode) {
		this.statusCode = statusCode;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
}
