<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<style>
.dark-spring-prompt {
	position: fixed;
	top: 32px;
	width: 60%;
	left: 0px;
	right: 0px;
	margin: auto;
	z-index: 2147483647;
	margin: auto;
}

.dark-spring-prompt>span {
	word-break: break-all;
}

.dark-spring-shader {
	background: white;
	opacity: 0.2;
	width: 100vw;
	height: 100vh;
	left: 0px;
	top: 0px;
	position: fixed;
	z-index: 2147483646;
}

.dark-spring-dialog {
	position: fixed;
	top: 0px;
	left: 0px;
	right: 0px;
	bottom: 0px;
	z-index: 2147483647;
	border-color: red;
	border-style: groove;
	min-width: 100px;
	min-height: 100px;
}

.dark-spring-dialog-header {
	border-bottom-color: red;
	border-bottom-style: groove;
}

.dark-spring-dialog-header-text {
	white-space: nowrap;
	text-align: center;
	overflow: hidden;
}

.dark-spring-dialog-header-toolbar {
	width: 1%;
	white-space: nowrap;
}

.dark-spring-dialog-header-toolbar>button {
	border-color: transparent;
}

.dark-spring-dialog-resize:hover {
	background: white;
	opacity: 0.2;
}

.dark-spring-dialog-resize-top {
	position: absolute;
	width: 100%;
	height: 16px;
	top: -16px;
	left: 0px;
}

.dark-spring-dialog-resize-right {
	position: absolute;
	width: 16px;
	height: 100%;
	top: 0px;
	right: -16px;
}

.dark-spring-dialog-resize-left {
	position: absolute;
	width: 16px;
	height: 100%;
	top: 0px;
	left: -16px;
}

.dark-spring-dialog-resize-bottom {
	position: absolute;
	width: 100%;
	height: 16px;
	bottom: -16px;
	left: 0px;
}

.dark-spring-dialog-resize-top-right {
	position: absolute;
	width: 16px;
	height: 16px;
	top: -16px;
	right: -16px;
}

.dark-spring-dialog-resize-top-left {
	position: absolute;
	width: 16px;
	height: 16px;
	top: -16px;
	left: -16px;
}

.dark-spring-dialog-resize-bottom-right {
	position: absolute;
	width: 16px;
	height: 16px;
	bottom: -16px;
	right: -16px;
}

.dark-spring-dialog-resize-bottom-left {
	position: absolute;
	width: 16px;
	height: 16px;
	bottom: -16px;
	left: -16px;
}

.dark-spring-dialog-resize-top:hover {
	cursor: n-resize;
}

.dark-spring-dialog-resize-right:hover {
	cursor: e-resize;
}

.dark-spring-dialog-resize-left:hover {
	cursor: w-resize;
}

.dark-spring-dialog-resize-bottom:hover {
	cursor: s-resize;
}

.dark-spring-dialog-resize-top-right:hover {
	cursor: ne-resize;
}

.dark-spring-dialog-resize-top-left:hover {
	cursor: nw-resize;
}

.dark-spring-dialog-resize-bottom-right:hover {
	cursor: se-resize;
}

.dark-spring-dialog-resize-bottom-left:hover {
	cursor: sw-resize;
}
</style>

<div id="index-template" style="display:none">
    
    <%-- prompt --%>
    <div data-index-template-prompt class="alert alert-dismissible fade show dark-spring-prompt">
        <i class="fa fa-exclamation-circle me-2"></i>
        <span></span>
        <button type="button" class="btn-close"></button>
    </div>
    
    
    <%-- window --%>
    <div data-index-template-dialog-component>
    	<div data-index-template-shader class="dark-spring-shader"></div>
    	<div data-index-template-dialog style="margin: auto;" class="bg-secondary rounded dark-spring-dialog">
			<div class="dark-spring-dialog-header">
				<table>
					<tr>
						<td class="dark-spring-dialog-header-text none-select moveable"></td>
						<td class="dark-spring-dialog-header-toolbar none-select">
							<button data-index-template-dialog-minimize type="button" class="btn btn-sm btn-outline-primary">
								<i class="fas fa-window-minimize"></i>
							</button>
							<button data-index-template-dialog-normalize type="button" class="btn btn-sm btn-outline-primary" style="display: none">
								<i class="fas fa-compress"></i>
							</button>
							<button data-index-template-dialog-maximize type="button" class="btn btn-sm btn-outline-primary">
								<i class="fas fa-expand"></i>
							</button>
							<button data-index-template-dialog-close type="button" class="btn btn-sm btn-outline-primary">
								<i class="fas fa-times"></i>
							</button>
						</td>
					</tr>
				</table>
			</div>
			<div class="dark-spring-dialog-content none-select"></div>
			<div class="dark-spring-dialog-resize dark-spring-dialog-resize-top"></div>
	    	<div class="dark-spring-dialog-resize dark-spring-dialog-resize-right"></div>
	    	<div class="dark-spring-dialog-resize dark-spring-dialog-resize-left"></div>
	    	<div class="dark-spring-dialog-resize dark-spring-dialog-resize-bottom"></div>
	    	<div class="dark-spring-dialog-resize dark-spring-dialog-resize-top-right"></div>
	    	<div class="dark-spring-dialog-resize dark-spring-dialog-resize-top-left"></div>
	    	<div class="dark-spring-dialog-resize dark-spring-dialog-resize-bottom-right"></div>
	    	<div class="dark-spring-dialog-resize dark-spring-dialog-resize-bottom-left"></div>
		</div>
    </div>
    
    

</div>