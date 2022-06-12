$(document).ready(function() {
	"use strict";

	// Spinner
	var spinner = function() {
		setTimeout(function() {
			if ($('#spinner').length > 0) {
				$('#spinner').removeClass('show');
			}
		}, 1);
	};
	spinner();

	// Back to top button
	$('.dark-spring-main-container, window').scroll(function() {
		if ($(this).scrollTop() > 300) {
			$('.back-to-top').fadeIn('fast');
		} else {
			$('.back-to-top').fadeOut('fast');
		}
	});
	
	$('.back-to-top').on("click", function() {
		$('.dark-spring-main-container, html, body', document).animate({ 
			scrollTop: 0 
		}, 500);
		return false;
	});


	// Sidebar Toggler
	$('.sidebar-toggler').click(function() {
		$('.sidebar, .content').toggleClass("open");
		return false;
	});


	// Chart Global Color
	Chart.defaults.color = "#6C7293";
	Chart.defaults.borderColor = "#000000";

});