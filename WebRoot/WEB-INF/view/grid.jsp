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
		{ content: "@{data_2}", attrs: { style: "text-align: center" } },
		{ content: "@{data_3}", attrs: { style: "text-align: center" } }
	]
];

var $table;

function removeAllColor(e){
	
	$('#table').removeClass("table-active");
	$('#table').removeClass("table-primary");
	$('#table').removeClass("table-secondary");
	$('#table').removeClass("table-success");
	$('#table').removeClass("table-danger");
	$('#table').removeClass("table-warning");
	$('#table').removeClass("table-info");
	$('#table').removeClass("table-light");
	$('#table').removeClass("table-dark");
	$("[data-table-color]").each((index, checkbox) => {
		if(!e.is($(checkbox))){
			$(checkbox).prop("checked", false);
		}
	});

}

$(document).ready(function(){
	    
	// table colors
	$('#table-active').change(() => {
		removeAllColor($('#table-active'));
		if($("#table-active").prop("checked")){
			$('#table').addClass("table-active");
		}
	});
	
	$('#table-primary').change(() => {
		removeAllColor($('#table-primary'));
		if($("#table-primary").prop("checked")){
			$('#table').addClass("table-primary");
		}
	});
	
	$('#table-secondary').change(() => {
		removeAllColor($('#table-secondary'));
		if($("#table-secondary").prop("checked")){
			$('#table').addClass("table-secondary");
		}
	});
	
	$('#table-success').change(() => {
		removeAllColor($('#table-success'));
		if($("#table-success").prop("checked")){
			$('#table').addClass("table-success");
		}
	});
	
	$('#table-danger').change(() => {
		removeAllColor($('#table-danger'));
		if($("#table-danger").prop("checked")){
			$('#table').addClass("table-danger");
		}
	});
	
	$('#table-warning').change(() => {
		removeAllColor($('#table-warning'));
		if($("#table-warning").prop("checked")){
			$('#table').addClass("table-warning");
		}
	});
	
	$('#table-info').change(() => {
		removeAllColor($('#table-info'));
		if($("#table-info").prop("checked")){
			$('#table').addClass("table-info");
		}
	});
	
	$('#table-light').change(() => {
		removeAllColor($('#table-light'));
		if($("#table-light").prop("checked")){
			$('#table').addClass("table-light");
		}
	});
	
	$('#table-dark').change(() => {
		removeAllColor($('#table-dark'));
		if($("#table-dark").prop("checked")){
			$('#table').addClass("table-dark");
		}
	});
	
	
	// Table Styles
	$('#table-hover').change(() => {
		$('#table').toggleClass("table-hover");
	});
	
	$('#table-striped').change(() => {
		$('#table').toggleClass("table-striped");
	});
	
	$('#table-borderless').click(() => {
		$('#table').removeClass("table-bordered");
		$('#table').toggleClass("table-borderless");
		$('#table-bordered').prop("checked", false);
	});
	
	$('#table-bordered').click(() => {
		$('#table').removeClass("table-borderless");
		$('#table').toggleClass("table-bordered");
		$('#table-borderless').prop("checked", false);
	});
	
	// Table Types
	$('#table-btn').click(() =>{
		$('#table-show').show();
		renderTable();
	});
	
	$('#pageTable-btn').click(() =>{
		$('#table-show').show();
		renderPageTable();
	});
	
	$('#fetchTable-btn').click(() =>{
		$('#table-show').show();
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
		$table = DarkSpring.table({
			table : $('#table'),
			data : data,
			thead : theadMeta,
			tbody : tbodyMeta
		});
	});
}

function renderPageTable(){
	doQuery((data) => {
		$table = DarkSpring.pageTable({
			table : $('#table'),
			data : data,
			thead : theadMeta,
			tbody : tbodyMeta
		});
	});
}

function renderFetchTable(){
	$table = DarkSpring.fetchTable({
		table : $('#table'),
		url : "getTableData",
		thead : theadMeta,
		tbody : tbodyMeta
	});
}

</script>
</head>

<content tag="template">
	
</content>

<content tag="body">
	
	<div class="container-fluid pt-4 px-4">
		<div class="row bg-secondary rounded mx-0 p-2">
			
			<div class="col-sm-12" >
				<h5 class="align-items-center justify-content-center none-select" style="text-align: center;">Table Color</h5>
			</div>
   
			<div class="col-sm-2 text-center">
				<input data-table-color class="btn-check" type="checkbox" id="table-active" >
				<label class="btn btn-outline-primary m-2" for="table-active">
					Active
				</label>
			</div>
			
			<div class="col-sm-2 text-center">
				<input data-table-color class="btn-check" type="checkbox" id="table-primary" >
				<label class="btn btn-outline-primary m-2" for="table-primary">
					Primary
				</label>
			</div>
			
			<div class="col-sm-2 text-center">
				<input data-table-color class="btn-check" type="checkbox" id="table-secondary" >
				<label class="btn btn-outline-primary m-2" for="table-secondary">
					Secondary
				</label>
			</div>
			
			<div class="col-sm-2 text-center">
				<input data-table-color class="btn-check" type="checkbox" id="table-success" >
				<label class="btn btn-outline-primary m-2" for="table-success">
					Success
				</label>
			</div>
			
			<div class="col-sm-2 text-center">
				<input data-table-color class="btn-check" type="checkbox" id="table-danger" >
				<label class="btn btn-outline-primary m-2" for="table-danger">
					Danger
				</label>
			</div>
			
			<div class="col-sm-2 text-center">
				<input data-table-color class="btn-check" type="checkbox" id="table-warning" >
				<label class="btn btn-outline-primary m-2" for="table-warning">
					Warning
				</label>
			</div>
			
			<div class="col-sm-2 text-center">
				<input data-table-color class="btn-check" type="checkbox" id="table-info" >
				<label class="btn btn-outline-primary m-2" for="table-info">
					Info
				</label>
			</div>
			
			<div class="col-sm-2 text-center">
				<input data-table-color class="btn-check" type="checkbox" id="table-light" >
				<label class="btn btn-outline-primary m-2" for="table-light">
					Light
				</label>
			</div>
			
			<div class="col-sm-2 text-center">
				<input data-table-color class="btn-check" type="checkbox" id="table-dark" >
				<label class="btn btn-outline-primary m-2" for="table-dark">
					dark
				</label>
			</div>
			
			
			
			
			<div class="col-sm-12 border border-right-0 border-left-0 border-top-0 border-danger mb-2 mt-2"></div>
			
			<div class="col-sm-12" >
				<h5 class="align-items-center justify-content-center none-select" style="text-align: center;">Table Styles</h5>
			</div>
			<div class="col-sm-3 text-center">
				 <input class="btn-check" type="checkbox" id="table-striped" >
                 <label class="btn btn-outline-primary m-2" for="table-striped">
                     Striped
                 </label>
			</div>
			<div class="col-sm-3 text-center">
                 <input class="btn-check" type="checkbox" id="table-hover" >
                 <label class="btn btn-outline-primary m-2" for="table-hover">
                     Hover
                 </label>
			</div>
			<div class="col-sm-3 text-center">
                 <input class="btn-check" type="checkbox" id="table-bordered" >
                 <label class="btn btn-outline-primary m-2" for="table-bordered">
                     Bordered
                 </label>
			</div>
		  	<div class="col-sm-3 text-center">
                 <input class="btn-check" type="checkbox" id="table-borderless" >
                 <label class="btn btn-outline-primary m-2" for="table-borderless">
                     Borderless
                 </label>
		  	</div>
			
			<div class="col-sm-12 border border-right-0 border-left-0 border-top-0 border-danger mb-2 mt-2""></div>
			
			<div class="col-sm-12" >
				<h5 class="align-items-center justify-content-center none-select" style="text-align: center;">Table Components</h5>
			</div>
		  	<div class="col-sm-4 text-center">
		  		<input type="radio" class="btn-check" name="table" id="table-btn" autocomplete="off">
		  		<label class="btn btn-outline-primary m-2" for="table-btn">Table</label>
		  	</div>
		  	<div class="col-sm-4 text-center">
		  		<input type="radio" class="btn-check" name="table" id="pageTable-btn" autocomplete="off">
		  		<label class="btn btn-outline-primary m-2" for="pageTable-btn">Page Table</label>
		  	</div>
		  	<div class="col-sm-4 text-center">
		  		<input type="radio" class="btn-check" name="table" id="fetchTable-btn" autocomplete="off">
		  		<label class="btn btn-outline-primary m-2" for="fetchTable-btn">Fetch Table</label>
		  	</div>
		</div>
	</div>
	 
	<div id="table-show" class="container-fluid pt-4 px-4" style="display: none">
		<div class="row bg-secondary rounded mx-0">
			<div class="table-responsive">
				<table id="table" class="table"></table>
			</div>
		</div>
	</div>
     
</content>

</html>