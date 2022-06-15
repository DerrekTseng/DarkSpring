<%@ page language="java" import="net.derrek.spring.sitemesh.Decorators" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
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
    	<div class="row bg-secondary rounded align-items-center justify-content-center m-1 p-4">
    		<div class="col-12 text-center">
    			<i style="font-size: 300%" class='${className}'></i>
    		</div>
    		<div class="col-12 text-center mt-2">
    			<span>${className}</span>
    		</div>
    	</div>
    </div>
</content>

</html>