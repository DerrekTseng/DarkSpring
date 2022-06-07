<%@ page language="java" import="com.dark.core.sitemesh.Decorators" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
<title>DarkPan</title>
<META name="decorator" content="<%=Decorators.page %>">
<script type="text/javascript">

$(document).ready(function(){
	
	$('#alert-button').click(() => {
		DarkSpring.alert();
	});
	
	$('#confirm-button').click(() => {
		DarkSpring.confirm();
	});
	
	$('#window-button').click(() => {
		DarkSpring.window();
	});
	
	$('#dialog-button').click(() => {
		DarkSpring.dialog({
			title : "test",
			shader : true,
			resize : true,
			maximize : true,
			minimize : true,
			movable : true,
			callback : function(){
				DarkSpring.info("Closed!");
			}
		});
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
	               <h6 class="mb-4">Alert Dialog</h6>
	               <div class="m-n2">
	                   <button type="button" id="alert-button" class="btn btn-light m-2">Alert</button>
	               </div>
	           </div>
	       </div>
	       <div class="col-sm-12 col-xl-6">
	           <div class="bg-secondary rounded h-100 p-4">
	               <h6 class="mb-4">Confirm Dialog</h6>
	               <div class="m-n2">
	                   <button type="button" id="confirm-button" class="btn btn-light m-2">Confirm</button>
	               </div>
	           </div>
	       </div>
	       <div class="col-sm-12 col-xl-6">
	           <div class="bg-secondary rounded h-100 p-4">
	               <h6 class="mb-4">Window Dialog</h6>
	               <div class="m-n2">
	                   <button type="button" id="window-button" class="btn btn-light m-2">Window</button>
	               </div>
	           </div>
	       </div>
	       
	       <div class="col-sm-12 col-xl-6">
	           <div class="bg-secondary rounded h-100 p-4">
	               <h6 class="mb-4">Test Dialog</h6>
	               <div class="m-n2">
	                   <button type="button" id="dialog-button" class="btn btn-light m-2">Window</button>
	               </div>
	           </div>
	       </div>
	       
         </div>
     </div>
     
</content>

</html>