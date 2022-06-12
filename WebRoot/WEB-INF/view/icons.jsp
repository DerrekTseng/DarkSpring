<%@ page language="java" import="com.darkspring.core.sitemesh.Decorators" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
<title>DarkPan</title>
<META name="decorator" content="<%=Decorators.page %>">
<script src="<c:url value='/resource/js/fa-icons.js' />"></script>
<script src="<c:url value='/resource/js/bootstrap-icons.js' />"></script>
<script src="<c:url value='/resource/js/glyphicon-icons.js' />"></script>

<script type="text/javascript">

$(document).ready(function(){
	let $t = $("[data-target]");
	
	let buffer = [];
	
	fa_icons.forEach((item) => {
		let $e = getTemplate('[data-icon-box]');
		$('.label', $e).html(item);
		$('i', $e).addClass(item);
		buffer.push(dark.getHtmlString($e));
	});
	
	bootstrap_icons.forEach((item) => {
		let $e = getTemplate('[data-icon-box]');
		$('.label', $e).html(item);
		$('i', $e).addClass(item);
		buffer.push(dark.getHtmlString($e));
	});
	
	glyphicon_icons.forEach((item) => {
		let $e = getTemplate('[data-icon-box]');
		$('.label', $e).html(item);
		$('i', $e).addClass("glyphicon").addClass(item);
		buffer.push(dark.getHtmlString($e));
	});
	
	$t.append(buffer.join(""));
	
	$('#filter-input').on('input', () => {
		let filterVal = $('#filter-input').val().toLowerCase();
		
		$('[data-icon-box]', $t).each((_index, item) => {
			let $item = $(item);
			let $label = $('.label' ,$item);
			$item.css({
				display : $label.html().includes(filterVal) ? 'block' : 'none'
			});
		});
	});
	
});

</script>
  <style>
    .icons {
      display: grid;
      max-width: 100%;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr) );
      gap: 1.25rem;
    }
    .icon {
      border-radius: .25rem;
    }
    .label {
      font-family: var(--bs-font-monospace);
    }
    .label {
      display: inline-block;
      width: 100%;
      overflow: hidden;
      padding: .25rem;
      font-size: .925rem;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  </style>
</head>

<content tag="template">
	<div data-icon-box class="icon">
         <i style=' margin: .25rem; font-size: 2.5rem;'></i>
         <div class='label'></div>
    </div>
</content>

<content tag="body">
	<div class="container-fluid bg-secondary rounded mt-4 p-2">
		<div style="width:100%; margin-bottom:8px">
			<input id="filter-input" class="form-control" type='text'/>
		</div>
		<div data-target class="icons"></div>
	</div>
</content>

</html>