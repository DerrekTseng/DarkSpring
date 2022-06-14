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
		dark.alert({
			title : "Alert Dialog",
			message : "Messages....",
			callback : function(){
				dark.info("Alert Closed!");
			}
		});
	});
	
	$('#confirm-button').click(() => {
		dark.confirm({
			title : "Confirm Dialog ",
			message : "Messages....",
			callback : function(confirm){
				if(confirm) {
					dark.info("Confirm Accept!");
				} else {
					dark.info("Confirm Cancel!");
				}
			}
		});
	});
	
	$('#window-button').click(() => {
		dark.window({
			title : "Window Confirm",
			width: "600px",
			height: "400px",
			shadow : $("#window-shadow").prop("checked"),
			resize : $("#window-resize").prop("checked"),
			maximize : $("#window-maximize").prop("checked"),
			minimize : $("#window-minimize").prop("checked"),
			movable  : $("#window-movable").prop("checked"),
			url : "dialog-window",
			callback : function (callbackData){
				if(callbackData){
					dark.info(callbackData);
				}
				$('#window-callback-result').html(callbackData);
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
	               
	               <div class="row mb-2">
		               <div class="form-check form-switch col-sm-6">
							<input class="form-check-input pointer" type="checkbox" role="switch" id="window-shadow" checked>
							<label class="form-check-label pointer" for="window-shadow">Shadow</label>
						</div>
						
						<div class="form-check form-switch col-sm-6">
							<input class="form-check-input pointer" type="checkbox" role="switch" id="window-resize" checked>
							<label class="form-check-label pointer" for="window-resize">Resize</label>
						</div>
						
						<div class="form-check form-switch col-sm-6">
							<input class="form-check-input pointer" type="checkbox" role="switch" id="window-maximize" checked>
							<label class="form-check-label pointer" for="window-maximize">Maximize</label>
						</div>
						
						<div class="form-check form-switch col-sm-6">
							<input class="form-check-input pointer" type="checkbox" role="switch" id="window-minimize" checked>
							<label class="form-check-label pointer" for="window-minimize">Minimize</label>
						</div>
						
						<div class="form-check form-switch col-sm-6">
							<input class="form-check-input pointer" type="checkbox" role="switch" id="window-movable" checked>
							<label class="form-check-label pointer" for="window-movable">Movable</label>
						</div>
						
	               </div>
					
	               
	               <div class="m-n2">
	                   <button type="button" id="window-button" class="btn btn-light m-2">Window</button>
	               </div>
	               
	                <div id="window-callback-result" class="m-n2">
	                
	                </div>
	               
	           </div>
	       </div>
	       
         </div>
     </div>
     
</content>

</html>