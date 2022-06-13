<%@ page language="java" import="com.darkspring.core.sitemesh.Decorators" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
<title>DarkSpring</title>
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
			{ type : "PAGE", url : "button", text : "Buttons"},
			{ type : "PAGE", url : "typography", text : "Typography"},
			{ type : "PAGE", url : "element", text : "Other Elements"}
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
			{ type : "PAGE", url : "signin", text : "Sign In"},
			{ type : "PAGE", url : "signup", text : "Sign Up"},
			{ type : "PAGE", url : "error", text : "404 Error"},
			{ type : "PAGE", url : "blank", text : "Blank Page"}
		]
	},
	{
		type : "DROPDOWN",
		icon : "fas fa-object-group me-2",
		text : "Components",
		items : [
			{ type : "PAGE", url : "grid", text : "Grid"},
			{ type : "PAGE", url : "prompt", text : "Prompt"},
			{ type : "PAGE", url : "upload", text : "Upload"},
			{ type : "PAGE", url : "dialog", text : "Dialog"},
			{ type : "PAGE", url : "icons", text : "Icons"},
			{ type : "PAGE", url : "test", text : "Test"}
		]
	}
	
];

$(document).ready(function(){
	
	registerIndexWindowEvent();
	
	renderMenu($('#sidebar'), menus);
	
});

function renderMenu($target, data){
	
	data.forEach((item) => {
		
		if(item.type === "PAGE"){
			
			let $page = getTemplate("[data-menu-page]");
			
			if(item.icon){
				$('i', $page).attr('class', item.icon);
			} else {
				$('i', $page).remove();
			}
			
			$('span', $page).html(item.text);
			
			$page.click( () => {
				setPage(item.url, $page);
			});

			$target.append($page);
			
			if(!$('#main-page').attr('src')){
				$page.click();
			}
			
		} else if(item.type === "DROPDOWN") {
			
			let $dropdown = getTemplate("[data-menu-dropdown]");
			
			let $a = $('a', $dropdown);
			
			if(item.icon){
				$('i', $a).attr('class', item.icon);
			}else{
				$('i', $a).remove();
			}
			
			$('span', $a).html(item.text);
			
			let $dropdownMenu = $('.dropdown-menu', $dropdown);
			
			renderMenu($dropdownMenu, item.items);
			
			$target.append($dropdown);
		}
	});
	
}

function setPage(url, $page){
	$('a', '#sidebar').removeClass("active");
	setSiderActive($page);
	$('a:first', $('[data-menu-dropdown]', '#sidebar')).not('.active').each((_index, item) => {
		if($(item).hasClass('show')){
			$(item).bs().dropdown().hide();
		}
	});
	
	$('#main-page').attr('src', url);
}

function setSiderActive($e){
	$e.addClass("active");
	if($e.parent().hasClass('dropdown-menu')){
		setSiderActive($('a:first', $e.parent().parent()));
	}
}

function registerIndexWindowEvent(){
	
	const top_dialogs_container_observer = new MutationObserver(() => {
		if($('.dropdown-item', "#top-dialogs-container").length == 0){
			$("#top-dialogs-component").fadeOut();			
		}else{
			$("#top-dialogs-component").fadeIn();
		}
	});
	
	top_dialogs_container_observer.observe($("#top-dialogs-container")[0], {
		childList: true,
		 subtree : true
	});
	
	const top_uploadings_container_observer = new MutationObserver(() => {
		if($('.dropdown-item', "#top-uploadings-container").length == 0){
			$("#top-uploadings-component").fadeOut();			
		}else{
			$("#top-uploadings-component").fadeIn();
		}
	});
	
	top_uploadings_container_observer.observe($("#top-uploadings-container")[0], {
		 childList: true,
		 subtree : true
	});
	
	let windowResize = () => {
		
		let topWidth = $(top).width();
		let topHeight = $(top).height();
		
		$('[data-index-template-dialog]', '#top-object-container').each((_index, dialog) => {
			
			let $dialog = $(dialog);
			
			let dialogX = $dialog[0].offsetLeft;
			let dialogY = $dialog[0].offsetTop;
			let dialogWidth = $dialog.width();
			let dialogHeight = $dialog.height();
			
			if(dialogX < 0 || dialogY < 0 || dialogX + dialogWidth > topWidth || dialogY + dialogHeight > topHeight) {
				
				let dialogDefaultWidth = parseInt($dialog.data("defaultWidth"));
				let dialogDefaultHeight = parseInt($dialog.data("defaultHeight"));
				
				if(dialogDefaultWidth > topWidth){
					dialogDefaultWidth = topWidth;
				}
				
				if(dialogDefaultHeight > topHeight){
					dialogDefaultHeight = topHeight;
				}
				
				let widthGap = ( topWidth / 2 - dialogDefaultWidth / 2 );
				let heightGap = ( topHeight / 2 - dialogDefaultHeight / 2 );
				
				if(widthGap < 0){
					widthGap = 0;
				}
				
				if(heightGap < 0){
					heightGap = 0;
				}
				
				widthGap += "px";
				heightGap += "px";
				
				$dialog.css({
					width : dialogDefaultWidth,
					height : dialogDefaultHeight,
					inset: '0px',
					margin : "auto"
				});
				
			}
			
		});
		
		if(dark.isMobileDevice()){
			
			if( topWidth < topHeight ){ // 直立
				
				$('#main-page').css({
					height: "calc( 100% - 164px)"
				});
				
			} else { // 橫放
				
				$('#main-page').css({
					height: "calc( 100% - 90px)"
				});
			}
			
			$('#index-main-container').css({
				"max-height": topHeight + "px",
				overflow: "hidden"
			})
			
			topHeight -= 92;
			
			$("#sidebar").css({
				"max-height": topHeight + "px",
				overflow: "auto"
			})
			
		}
	}
	
	$(window).resize(() => {
		windowResize();
	});
	
	windowResize();
	
}


</script>

<style>
.dark-spring-dropdown-menu {
	border : #ff00004d 3px groove !important;
	border-radius: 0px 0px 8px 8px !important;
}
</style>

</head>

<content tag="template">
	<a data-menu-page class="nav-item nav-link none-select clickable">
		<i></i>
		<span></span>
	</a>
	
	<div data-menu-dropdown class="nav-item dropdown">
	    <a class="nav-link dropdown-toggle none-select clickable" data-bs-auto-close="false" data-bs-toggle="dropdown">
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
			<i class="fab fa-envira me-2"></i>
			DarkSpring
		</span>
	</span>
	<div id="sidebar" class="navbar-nav w-100"></div>
</content>

<content tag="navbar">

	<div id="top-object-container" style="width:0px; height:0px"></div>

	<a class="sidebar-toggler flex-shrink-0 clickable">
        <i class="fa fa-bars"></i>
    </a>
  
    <div class="navbar-nav align-items-center ms-auto">
        
        <div id="top-dialogs-component" class="nav-item dropdown" style="display: none">
			<a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">
				<i class="fas fa-window-maximize me-lg-2"></i>
				<span class="d-none d-lg-inline-flex">Dialog</span>
			</a>
			<div id="top-dialogs-container" style="border: red" class="dark-spring-dropdown-menu dropdown-menu dropdown-menu-end bg-secondary border-0 rounded-0 rounded-bottom m-0">
				
			</div>
		</div>
        
        
        <%-- 檔案上傳元件 --%>
        <div id="top-uploadings-component" class="nav-item dropdown" style="display: none">
			<a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">
				<i class="fas fa-cloud-upload-alt me-lg-2"></i>
				<span class="d-none d-lg-inline-flex">Uploading</span>
			</a>
			<div id="top-uploadings-container" class="dark-spring-dropdown-menu dropdown-menu dropdown-menu-end bg-secondary border-0 rounded-0 rounded-bottom m-0">
				
			</div>
		</div>
        
        <%-- 使用者 Profile --%>
        <div class="nav-item dropdown">
            <a class="nav-link dropdown-toggle none-select clickable" data-bs-toggle="dropdown">
                <i class="fa fa-user me-lg-2"></i>
                <span class="d-none d-lg-inline-flex">Dark User</span>
            </a>
            <div class="dark-spring-dropdown-menu dropdown-menu dropdown-menu-end bg-secondary border-0 rounded-0 rounded-bottom m-0">
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