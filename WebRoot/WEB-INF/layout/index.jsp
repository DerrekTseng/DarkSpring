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
        
         <%-- Sidebar Start --%>
        <div class="sidebar pe-4 pb-3">
            <nav class="navbar bg-secondary navbar-dark">
            	<sitemesh:write property="page.sidebar" />
            </nav>
        </div>
        <%-- Sidebar End --%>
        
        <%-- Content Start --%>
        <div class="content">
        
            <%-- Navbar Start --%>
            <nav class="navbar navbar-expand bg-secondary navbar-dark sticky-top px-4 py-0">
              	<sitemesh:write property="page.navbar" />
            </nav>
            <%-- Navbar End --%>
            
			<sitemesh:write property="page.content" />
        </div>
        <%-- Content End --%>
        
	</div>
	
	<%@include file="/WEB-INF/layout/page-tail.jsp" %>
	
</body>

</html>