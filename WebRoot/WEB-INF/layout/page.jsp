<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
	
	<%@include file="/WEB-INF/layout/page-head.jsp" %>
    
	<title>
		<sitemesh:write property="title" />
	</title>
	
	<sitemesh:write property="head" />
	
</head>

<body>
	
	<div id="dark-template" style="display: none">
		<sitemesh:write property="page.template" />
	</div>
	
	<div class="container-fluid position-relative d-flex p-0">
	
        <%-- Spinner Start --%>
        <div id="spinner" class="show bg-dark position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
            <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
        <%-- Spinner End --%>
        
        <div class="container-fluid">
			<sitemesh:write property="page.content" />
        </div>
        
	</div>
	
	<%@include file="/WEB-INF/layout/page-tail.jsp" %>
	
</body>

</html>