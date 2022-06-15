<%@ page language="java" import="net.derrek.spring.sitemesh.Decorators" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
<title>DarkPan</title>
<META name="decorator" content="<%=Decorators.page %>">
<script type="text/javascript">

$(document).ready(function(){
	
	$('#info-prompt-button').click(() => {
		dark.info($('#info-prompt-message').val());
	});
	
	$('#success-prompt-button').click(() => {
		dark.success($('#success-prompt-message').val());
	});
	
	$('#warning-prompt-button').click(() => {
		dark.warning($('#warning-prompt-message').val());
	});
	
	$('#error-prompt-button').click(() => {
		dark.error($('#error-prompt-message').val());
	});
	
});

</script>
</head>

<content tag="template">
	
</content>

<content tag="body">
     <div class="container-fluid pt-4 px-4">
     
         <div class="row g-4">
         	<div class="col-sm-12 col-xl-6">
	           <div class="bg-secondary rounded h-100 p-4">
	               <h6 class="mb-4">Info Prompt</h6>
	               <div class="m-n2">
	                   <button type="button" id="info-prompt-button" class="btn btn-light m-2">Info</button>
	               	   <input class="mb-4" id="info-prompt-message" type="text"/>
	               </div>
	           </div>
	       </div>
	       
	       <div class="col-sm-12 col-xl-6">
	           <div class="bg-secondary rounded h-100 p-4">
	               <h6 class="mb-4">Success Prompt</h6>
	               <div class="m-n2">
	                   <button type="button" id="success-prompt-button" class="btn btn-success m-2">Success</button>
	                   <input class="mb-4" id="success-prompt-message" type="text"/>
	               </div>
	           </div>
	       </div>
	       
	       <div class="col-sm-12 col-xl-6">
	           <div class="bg-secondary rounded h-100 p-4">
	               <h6 class="mb-4">Warning Prompt</h6>
	               <div class="m-n2">
	                   <button type="button" id="warning-prompt-button" class="btn btn-warning m-2">Warning</button>
	                   <input class="mb-4" id="warning-prompt-message" type="text"/>
	               </div>
	           </div>
	       </div>
	       
	       <div class="col-sm-12 col-xl-6">
	           <div class="bg-secondary rounded h-100 p-4">
	               <h6 class="mb-4">Error Prompt</h6>
	               <div class="m-n2">
	                   <button type="button" id="error-prompt-button" class="btn btn-danger m-2">Error</button>
	                   <input class="mb-4" id="error-prompt-message" type="text"/>
	               </div>
	           </div>
	       </div>
	       
         
         </div>
     </div>
</content>

</html>