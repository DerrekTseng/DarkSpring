<%@ page language="java" import="com.darkspring.core.sitemesh.Decorators" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
<title>DarkPan</title>
<META name="decorator" content="<%=Decorators.page %>">
<script type="text/javascript">

$(document).ready(function(){
	    
	$('#close-btn').click(() => {
	
		let callbackData = $('#callback-data').val();
		
		doCloseWindow(callbackData);
		
	});
	
});

</script>
</head>

<content tag="template">
	
</content>

<content tag="body">
	
	<div class="container-fluid pt-4 px-4">
         <div class="row bg-secondary rounded align-items-center justify-content-center mx-0">
             <div class="col-md-6 text-center">
                <h3 style="text-align: center">Test open dialog window</h3>
         		<textarea id="callback-data" class="form-control" placeholder="CallbackData" style="height: 150px; resize: none"></textarea>
				<button id="close-btn" type="button" class="btn btn-primary m-2" style="float:right">
					<i class="fas fa-times me-2"></i>
					Close
				</button>
             </div>
         </div>
     </div>
	
</content>

</html>