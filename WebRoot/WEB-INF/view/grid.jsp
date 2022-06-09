<%@ page language="java" import="com.darkspring.core.sitemesh.Decorators" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
<title>DarkPan</title>
<META name="decorator" content="<%=Decorators.page %>">
<script type="text/javascript">

$(document).ready(function(){
	doRenderTable();
});

function doRenderTable(){
	let data = [];

	for (let i = 0; i < 5; i++) {
		data.push({
			data_1: "A" + i,
			data_2: "B" + i,
			data_3: "C" + i
		});
	}
	
	DarkSpring.pageTable({
		table : $('#table'),
		data : data,
		thead : [
			[
				{ content: "col-1", sort: "data_1", attrs: { style: "text-align: center" } },
				{ content: "col-2", sort: "data_2", attrs: { style: "text-align: center" } },
				{ content: "col-3", sort: "data_3", attrs: { style: "text-align: center" } }
			]
		],
		tbody : [
			[
				{ content: "@{data_1}", attrs: { style: "text-align: center" } },
				{ content: "@{data_1}", attrs: { style: "text-align: center" } },
				{ content: "@{data_1}", attrs: { style: "text-align: center" } }
			]
		]
	});
}

</script>
</head>

<content tag="template">
	
</content>

<content tag="body">
	 <!-- Blank Start -->
     <div class="container-fluid pt-4 px-4">
         <div class="row bg-secondary rounded mx-0">
	         <div class="table-responsive">
	         	<table id="table" class="table"></table>
	         </div>
         </div>
     </div>
     <!-- Blank End -->
</content>

</html>