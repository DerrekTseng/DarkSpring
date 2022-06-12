<%@ page language="java" import="com.darkspring.core.sitemesh.Decorators" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
<title>DarkPan</title>
<META name="decorator" content="<%=Decorators.page %>">
<script type="text/javascript">

$(document).ready(function(){
	    
	$('#file-button').click(() => {
		dark.doUpload({
			url : "doUpload",
			type : 'file',
			data : {},
			beforeSend : (files, callback) => {
				callback(true);
			},
			abort : () => {
				dark.info("上傳取消");
			},
			success : (response) => {
				dark.success("上傳成功");
			},
			error : () => {
				dark.error("上傳失敗");
			}
		});
	});
	
	$('#files-button').click(() => {
		dark.doUpload({
			url : "doUpload",
			type : 'files',
			data : {},
			beforeSend : (files, callback) => {
				callback(true);
			},
			abort : () => {
				dark.info("上傳取消");
			},
			success : (response) => {
				dark.success("上傳成功");
			},
			error : () => {
				dark.error("上傳失敗");
			}
		});
	});
	
	$('#folder-button').click(() => {
		dark.doUpload({
			url : "doUpload",
			type : 'folder',
			data : {},
			beforeSend : (files, callback) => {
				callback(true);
			},
			abort : () => {
				dark.info("上傳取消");
			},
			success : (response) => {
				dark.success("上傳成功");
			},
			error : () => {
				dark.error("上傳失敗");
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
					<h6 class="mb-4">Upload File</h6>
					<div class="m-n2">
						<button type="button" id="file-button" class="btn btn-light m-2">Upload File</button>
					</div>
				</div>
			</div>
			
			<div class="col-sm-12 col-xl-6">
				<div class="bg-secondary rounded h-100 p-4">
					<h6 class="mb-4">Upload Files</h6>
					<div class="m-n2">
						<button type="button" id="files-button" class="btn btn-light m-2">Upload Files</button>
					</div>
				</div>
			</div>
			
			<div class="col-sm-12 col-xl-6">
				<div class="bg-secondary rounded h-100 p-4">
					<h6 class="mb-4">Upload Folder</h6>
					<div class="m-n2">
						<button type="button" id="folder-button" class="btn btn-light m-2">Upload Folder</button>
					</div>
				</div>
			</div>
			
		</div>
	</div>
	
</content>

</html>