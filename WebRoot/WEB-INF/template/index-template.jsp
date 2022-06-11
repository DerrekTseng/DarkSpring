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

.dark-spring-shadow {
	background: white;
	opacity: 0.2;
	width: 100vw;
	height: 100vh;
	left: 0px;
	top: 0px;
	position: fixed;
	z-index: 2147483645;
}

.dark-spring-dialog {
	position: fixed;
	inset: 0px;
	border-color: red;
	border-style: outset;
	border-width: 6px;
	min-width: 200px;
	min-height: 100px;
	z-index: 2147483646;
}

.dark-spring-dialog-header {
	width: 100%;
	border-bottom-color: red;
	border-bottom-style: ridge;
	min-height: 32px;
}

.dark-spring-dialog-header-title {
	white-space: nowrap;
	text-align: center;
	overflow: hidden;
	min-width: 90px;
	display: inline-block;
    vertical-align: middle;
    padding-left: 6px;
    padding-top: 3px;
    float: left;
    height: 32px;
}

.dark-spring-dialog-header-toolbar {
	white-space: nowrap;
	display: inline-block;
	float: right;
}

.dark-spring-dialog-header-toolbar>button {
	border-color: transparent;
}

.dark-spring-dialog-resize {
	background: transparent;
}

:root {
  --resizer-gap: 8px;
}

.dark-spring-dialog-resize-top {
	position: absolute;
	width: 100%;
	height: var(--resizer-gap);
	top: calc( 0px - var(--resizer-gap) );
	left: 0px;
}

.dark-spring-dialog-resize-right {
	position: absolute;
	width: var(--resizer-gap);
	height: 100%;
	top: 0px;
	right: calc( 0px - var(--resizer-gap) );
}

.dark-spring-dialog-resize-left {
	position: absolute;
	width: var(--resizer-gap);
	height: 100%;
	top: 0px;
	left: calc( 0px - var(--resizer-gap) );
}

.dark-spring-dialog-resize-bottom {
	position: absolute;
	width: 100%;
	height: var(--resizer-gap);
	bottom: calc( 0px - var(--resizer-gap) );
	left: 0px;
}

.dark-spring-dialog-resize-top-right {
	position: absolute;
	width: var(--resizer-gap);
	height: var(--resizer-gap);
	top: calc( 0px - var(--resizer-gap) );
	right: calc( 0px - var(--resizer-gap) );
	border-radius: 0px var(--resizer-gap) 0px 0px;
}

.dark-spring-dialog-resize-top-left {
	position: absolute;
	width: var(--resizer-gap);
	height: var(--resizer-gap);
	top: calc( 0px - var(--resizer-gap) );
	left: calc( 0px - var(--resizer-gap) );
	border-radius: var(--resizer-gap) 0px 0px 0px;
}

.dark-spring-dialog-resize-bottom-right {
	position: absolute;
	width: var(--resizer-gap);
	height: var(--resizer-gap);
	bottom: calc( 0px - var(--resizer-gap) );
	right: calc( 0px - var(--resizer-gap) );
	border-radius: 0px 0px var(--resizer-gap) 0px;
}

.dark-spring-dialog-resize-bottom-left {
	position: absolute;
	width: var(--resizer-gap);
	height: var(--resizer-gap);
	bottom: calc( 0px - var(--resizer-gap) );
	left: calc( 0px - var(--resizer-gap) );
	border-radius: 0px 0px 0px var(--resizer-gap);
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

.dark-spring-dialog-content {
	width: 100%;
	height : calc(100% - 16px);
	margin: 0px;
}

</style>

<div id="index-template" style="display:none">
    
    <%-- prompt --%>
    <div data-index-template-prompt class="alert alert-dismissible fade show dark-spring-prompt">
        <i class="fa fa-exclamation-circle me-2"></i>
        <span></span>
        <button type="button" class="btn-close"></button>
    </div>
    
    
    <%-- dialog --%>
    <div data-index-template-dialog-component>
    	<div data-index-template-shadow class="dark-spring-shadow"></div>
    	<div data-index-template-dialog class="bg-secondary rounded dark-spring-dialog">
			<div class="dark-spring-dialog-header">
				<div class="dark-spring-dialog-header-title none-select moveable">
					<div class="dark-spring-dialog-header-text"></div>
				</div>
				<div class="dark-spring-dialog-header-toolbar none-select">
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
				</div>
				
			</div>
			<div class="dark-spring-dialog-content"></div>
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
    
    <%-- maximize dialog --%>
    <div data-index-template-min-dialog-component class="dropdown-item none-select clickable">
    	<div class="d-flex align-items-center">
			<div class="ms-2" style="width:160px">
				<div data-index-template-min-dialog-title class="fw-normal mb-0" style="overflow: hidden;"></div>
			</div>
		</div>
    </div>
    
    <%-- alert dialog content --%>
    <div data-index-template-dialog-alert class="dark-spring-dialog-content">
		<div style="width:100%; height: calc( 100% - 52px)">
			<div class="col-sm-12 col-md-12 col-xl-12" style="overflow: auto; height: 100%; padding: 4px">
				<p data-index-template-dialog-alert-message style="word-break: break-all"></p>
			</div>
		</div>
		<div style="width:100%; position: absolute; bottom: 0px">
			<div class="col-sm-12 col-md-12 col-xl-12">
				<button data-index-template-dialog-alert-close type="button" class="btn btn-outline-primary m-2" style="float:right">
					<i class="fas fa-times me-2"></i>
					Close
				</button>
			</div>
		</div>
	</div>
    
    <%-- confirm dialog content --%>
    <div data-index-template-dialog-confirm class="dark-spring-dialog-content">
		<div style="width:100%; height: calc( 100% - 52px)">
			<div class="col-sm-12 col-md-12 col-xl-12" style="overflow: auto; height: 100%">
				<p data-index-template-dialog-confirm-message style="word-break: break-all"></p>
			</div>
		</div>
		<div style="width:100%; position: absolute; bottom: 0px">
			<div class="col-sm-12 col-md-12 col-xl-12">
				<button data-index-template-dialog-confirm-cancel type="button" class="btn btn-outline-primary m-2" style="float:left">
					<i class="fas fa-times me-2"></i>
					Cancel
				</button>
				<button data-index-template-dialog-confirm-accept type="button" class="btn btn-outline-primary m-2" style="float:right">
					<i class="fas fa-check me-2"></i>
					Accept
				</button>
				
			</div>
		</div>
	</div>
    
    <%-- window dialog content --%>
    <iframe data-index-template-dialog-window class="dark-spring-dialog-content"></iframe>
    
    <%-- table pager --%>
    <div data-index-template-table-pager class="row bg-secondary rounded align-items-center justify-content-center mx-0">
	    <div class="col-md-6 text-center">
		     <div class="btn-group" role="group">
		     
		        <button data-pager-first type="button" class="btn btn-outline-primary" style="width: 52px;">
		        	<i class="fas fa-angle-double-left"></i>
		        </button>
		        
		        <button data-pager-previous type="button" class="btn btn-outline-primary" style="width: 52px;">
		        	<i class="fas fa-angle-left"></i>
		        </button>
    
		        <select data-pager-num class="form-select form-select-sm" style="width: 82px; text-align: center;">
		        </select>
		        
	            <button data-pager-next type="button" class="btn btn-outline-primary" style="width: 52px;">
		       		<i class="fas fa-angle-right"></i>
		        </button>
		        
		        <button data-pager-last type="button" class="btn btn-outline-primary" style="width: 52px;">
		        	<i class="fas fa-angle-double-right"></i>
		        </button>
		     
		    </div>
	    </div>
    </div>
    
    <%-- table spinner --%>
    <div data-index-template-table-spinner style="z-index: 2147483647; opacity: 0.5" class="bg-dark d-flex align-items-center justify-content-center">
        <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
            <span class="sr-only">Loading...</span>
        </div>
    </div>
    

</div>