<%@ page language="java" import="com.darkspring.core.sitemesh.Decorators" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
<title>DarkPan</title>
<META name="decorator" content="<%=Decorators.page %>">
<script type="text/javascript">

var theadMeta = [
	[
		{ content: "col-1", sort: "data_1", attrs: { style: "text-align: center" } },
		{ content: "col-2", sort: "data_2", attrs: { style: "text-align: center" } },
		{ content: "col-3", sort: "data_3", attrs: { style: "text-align: center" } }
	]
];

var tbodyMeta = [
	[
		{ content: "@{data_1}", attrs: { style: "text-align: center" } },
		{ content: "@{data_1}", attrs: { style: "text-align: center" } },
		{ content: "@{data_1}", attrs: { style: "text-align: center" } }
	]
];


$(document).ready(function(){
	
	$('#table-borderless').change(() => {
		$('#table').toggleClass("table-borderless");
	});
	
	$('#table-bordered').change(() => {
		$('#table').toggleClass("table-bordered");
	});
	
	$('#table-dark').change(() => {
		$('#table').toggleClass("table-dark");
	});
	
	$('#table-hover').change(() => {
		$('#table').toggleClass("table-hover");
	});
	
	$('#table-striped').change(() => {
		$('#table').toggleClass("table-striped");
	});
	
	$('#table-btn').click(() =>{
		renderTable();
	});
	
	$('#pageTable-btn').click(() =>{
		renderPageTable();
	});
	
	$('#fetchTable-btn').click(() =>{
		renderFetchTable();
	});
});

function doQuery(callback){
	DarkSpring.doPost({
		url : "getTableData",
		success : (data) => {
			callback(data.data);
		}
	});
}

function renderTable(){
	doQuery((data) => {
		DarkSpring.table({
			table : $('#table'),
			data : data,
			thead : theadMeta,
			tbody : tbodyMeta
		});
	});
}

function renderPageTable(){
	doQuery((data) => {
		DarkSpring.pageTable({
			table : $('#table'),
			data : data,
			thead : theadMeta,
			tbody : tbodyMeta
		});
	});
}

function renderFetchTable(){
	
}

</script>
</head>

<content tag="template">
	
</content>

<content tag="body">
	 
	<div class="container-fluid pt-4 px-4">
		<div class="row bg-secondary rounded mx-0">
			<div class="col-sm-1"></div>
			<div class="col-sm-2 text-center">
				<div class="form-check">
                     <input class="form-check-input" type="checkbox" id="table-striped" >
                     <label class="form-check-label" for="table-striped">
                         table-striped
                     </label>
                 </div>
			
			</div>
			<div class="col-sm-2 text-center">
				 <div class="form-check">
	                 <input class="form-check-input" type="checkbox" id="table-hover" >
	                 <label class="form-check-label" for="table-hover">
	                     table-hover
	                 </label>
                 </div>
			</div>
			<div class="col-sm-2 text-center">
				<div class="form-check">
	                 <input class="form-check-input" type="checkbox" id="table-dark" >
	                 <label class="form-check-label" for="table-dark">
	                     table-dark
	                 </label>
                 </div>
			</div>
			<div class="col-sm-2 text-center">
				 <div class="form-check">
	                 <input class="form-check-input" type="checkbox" id="table-bordered" >
	                 <label class="form-check-label" for="table-bordered">
	                     table-bordered
	                 </label>
                 </div>
			</div>
		  	<div class="col-sm-2 text-center">
                 <div class="form-check">
	                 <input class="form-check-input" type="checkbox" id="table-borderless" >
	                 <label class="form-check-label" for="table-borderless">
	                     table-borderless
	                 </label>
                 </div>
		  	</div>
		  	<div class="col-sm-1"></div>
		</div>
	</div>
	
	<div class="container-fluid pt-4 px-4">
		<div class="row bg-secondary rounded mx-0">
		  	<div class="col-sm-4 text-center">
		  		<button id="table-btn" type="button" class="btn btn-primary m-2">Table</button>
		  	</div>
		  	<div class="col-sm-4 text-center">
		  		<button id="pageTable-btn" type="button" class="btn btn-primary m-2">PageTable</button>
		  	</div>
		  	<div class="col-sm-4 text-center">
		  		<button id="fetchTable-btn" type="button" class="btn btn-primary m-2">FetchTable</button>
		  	</div>
		</div>
	</div>
	 
	<div class="container-fluid pt-4 px-4">
		<div class="row bg-secondary rounded mx-0">
			<div class="table-responsive">
				<table id="table" class="table"></table>
			</div>
		</div>
	</div>
     
</content>

</html>