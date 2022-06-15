<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<meta charset="UTF-8">

<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
<link rel="icon" href="<c:url value='/favicon.ico' />" type="image/x-icon" />
<link rel="shortcut icon" href="<c:url value='/favicon.ico' />" type="image/x-icon" />
  
<%-- Google Web Fonts --%>
<link href="<c:url value='/resource/lib/googleapis/css/googleapis.com.css' />" rel="stylesheet">

<%-- Icon Font Stylesheet --%>
<link href="<c:url value='/resource/lib/font-awesome-5.15.3/css/all.min.css' />" rel="stylesheet">
<link href="<c:url value='/resource/lib/bootstrap-icons-1.8.2/bootstrap-icons.css' />" rel="stylesheet">
<link href="<c:url value='/resource/lib/glyphicons/css/glyphicons.css' />" rel="stylesheet">

<%-- Libraries Stylesheet --%>
<link href="<c:url value='/resource/lib/owlcarousel/assets/owl.carousel.min.css' />" rel="stylesheet">
<link href="<c:url value='/resource/lib/tempusdominus/css/tempusdominus-bootstrap-4.min.css' />" rel="stylesheet" />

<%-- Bootstrap Stylesheet --%>
<link href="<c:url value='/resource/lib/bootstrap/css/bootstrap.min.css' />" rel="stylesheet">

<%-- Customized Bootstrap Override --%>
<link href="<c:url value='/resource/css/bootstrap-override.css?v=' /> <%= java.util.UUID.randomUUID().toString() %>" rel="stylesheet">

<%-- Template Stylesheet --%>
<link href="<c:url value='/resource/css/style.css?v=' /> <%= java.util.UUID.randomUUID().toString() %>" rel="stylesheet">

<%-- JQuery --%>
<script src="<c:url value='/resource/lib/jquery-3.6.0/jquery-3.6.0.min.js' />"></script>

<script type="text/javascript">
	function getTemplate(selector){
		return $(selector, '#dark-template').clone(false);
	}
</script>