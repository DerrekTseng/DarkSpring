<%@ page language="java" import="com.dark.core.sitemesh.Decorators" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
<title>DarkPan</title>
<META name="decorator" content="<%=Decorators.page %>">
<script type="text/javascript">

$(document).ready(function(){
	    
	
});

</script>
</head>

<content tag="template">
	
</content>

<content tag="body">
	<div class="container-fluid pt-4 px-4">
         <div class="row vh-100 bg-secondary rounded align-items-center justify-content-center mx-0">
             <div class="col-md-6 text-center p-4">
                 <i class="bi bi-exclamation-triangle display-1 text-primary"></i>
                 <h1 class="display-1 fw-bold">404</h1>
                 <h1 class="mb-4">Page Not Found</h1>
                 <p class="mb-4">We’re sorry, the page you have looked for does not exist in our website!
                     Maybe go to our home page or try to use a search?</p>
                 <a class="btn btn-primary rounded-pill py-3 px-5" href="">Go Back To Home</a>
             </div>
         </div>
     </div>
</content>

</html>