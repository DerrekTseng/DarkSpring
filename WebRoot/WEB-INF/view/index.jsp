<%@ page language="java" import="com.dark.core.sitemesh.Decorators" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
<title>DarkPan</title>
<META name="decorator" content="<%=Decorators.index %>">
<script type="text/javascript">

var menus = [
	{ 
		type : "PAGE",
		url : "dashboard",
		icon : "fa fa-tachometer-alt me-2",
		text : "Dashboard",
	},
	{
		type : "DROPDOWN",
		icon : "fa fa-laptop me-2",
		text : "Elements",
		items : [
			{ url : "button", text : "Buttons"},
			{ url : "typography", text : "Typography"},
			{ url : "element", text : "Other Elements"}
		]
	},
	{ 
		type : "PAGE",
		url : "widget",
		icon : "fa fa-th me-2",
		text : "Widgets",
	},
	{ 
		type : "PAGE",
		url : "form",
		icon : "fa fa-keyboard me-2",
		text : "Forms",
	},
	{ 
		type : "PAGE",
		url : "table",
		icon : "fa fa-table me-2",
		text : "Tables",
	},
	{ 
		type : "PAGE",
		url : "chart",
		icon : "fa fa-chart-bar me-2",
		text : "Charts",
	},
	{
		type : "DROPDOWN",
		icon : "far fa-file-alt me-2",
		text : "Pages",
		items : [
			{ url : "signin", text : "Sign In"},
			{ url : "signup", text : "Sign Up"},
			{ url : "error", text : "404 Error"},
			{ url : "blank", text : "Blank Page"}
		]
	}
	
];

var $sidebar;

$(document).ready(function(){
	
	$sidebar = $('#sidebar');
	
	renderMenu(menus);
	
});

function renderMenu(data){
	
	$sidebar.empty();
	
	let first;
	
	data.forEach((item) => {
		
		if(item.type === "PAGE"){
			let $page = getTemplate("[data-menu-page]");
			
			$('i', $page).attr('class', item.icon);
			$('span', $page).html(item.text);
			
			$page.click( () => {
				setPage(item.url, $page);
			});

			$sidebar.append($page);
			
			first = first || $page;
			
		} else if(item.type === "DROPDOWN") {
			
			let $dropdown = getTemplate("[data-menu-dropdown]");

			let $a = $('a', $dropdown);
			
			$('i', $a).attr('class', item.icon);
			$('span', $a).html(item.text);
			
			let $dropdownMenu = $('.dropdown-menu', $dropdown);
			
			item.items.forEach( (i) => {
				
				let $item = getTemplate("[data-menu-dropdown-item]");
				
				$item.html(i.text);
				
				$item.click(() => {
					setPage(i.url, $item, $a);
				});
				
				$dropdownMenu.append($item);
				
				first = first || $item;
			});
			
			$sidebar.append($dropdown);
		}
	});
	
	first.click();
	
}

function setPage(url, i1, i2){
	$('#main-page').attr('src', url);
	$('a', $sidebar).removeClass("active");
	if(i1){
		i1.addClass("active");
	}
	if(i2){
		i2.addClass("active");
	}
}


</script>
</head>

<content tag="template">
	<a data-menu-page class="nav-item nav-link none-select clickable">
		<i></i>
		<span></span>
	</a>
	
	<div data-menu-dropdown class="nav-item dropdown">
	    <a class="nav-link dropdown-toggle none-select clickable" data-bs-toggle="dropdown">
	    	<i></i>
	    	<span></span>
	    </a>
	    <div class="dropdown-menu bg-transparent border-0"></div>
	</div>
	
	 <a data-menu-dropdown-item class="dropdown-item none-select clickable"></a>
</content>

<content tag="sidebar">
	<span class="navbar-brand mx-4 mb-3 none-select">
		<span class="text-primary" style="font-size:140%">
			<i class="fa fa-user-edit me-2"></i>
			DarkPan
		</span>
	</span>
	<div id="sidebar" class="navbar-nav w-100"></div>
</content>

<content tag="navbar">
	<a href="#" class="sidebar-toggler flex-shrink-0">
        <i class="fa fa-bars"></i>
    </a>
  
    <div class="navbar-nav align-items-center ms-auto">
                          
        <div class="nav-item dropdown">
            <a class="nav-link dropdown-toggle none-select clickable" data-bs-toggle="dropdown">
                <i class="fa fa-user me-lg-2"></i>
                <span class="d-none d-lg-inline-flex">John Doe</span>
            </a>
            <div class="dropdown-menu dropdown-menu-end bg-secondary border-0 rounded-0 rounded-bottom m-0">
                <a class="dropdown-item none-select clickable">My Profile</a>
                <a class="dropdown-item none-select clickable">Settings</a>
                <a class="dropdown-item none-select clickable">Log Out</a>
            </div>
        </div>
    </div>
</content>

<content tag="content">
	<iframe id="main-page" style="width: 100%; height: calc( 100% - 70px);"></iframe>
</content>

</html>