<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
	
	<%@include file="/WEB-INF/template/page-head.jsp" %>
    
	<title>
		<sitemesh:write property="title" />
	</title>
	
	<sitemesh:write property="head" />
	
</head>

<body>
	
	<div id="dark-template" style="display: none">
		<sitemesh:write property="page.template" />
	</div>
	
	<div class="container-fluid position-relative d-flex p-0 dark-spring-main-container" style="overflow-y:scroll; height: 100vh">
	
        <div id="spinner" class="show bg-dark position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
            <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>

		<div class="container-fluid" style="padding-bottom: 24px;" >
		       
			<sitemesh:write property="page.body" />
			
			<a class="btn btn-lg btn-primary btn-lg-square back-to-top" style="display:none">
				<i class="bi bi-arrow-up"></i>
			</a>
		
		</div>
        
	</div>
	
	<%@include file="/WEB-INF/template/page-tail.jsp" %>
	
</body>

</html>