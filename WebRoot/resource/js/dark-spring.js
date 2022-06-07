class darkspring {

	constructor(document) {
		this.document = document;
	}

	/** 取得當前的 Document */
	currentDocument() {
		if (top.DarkSpring === this) {
			return top.DarkSpring.document;
		} else {
			return this.document;
		}
	}

	/** 將 element 加入至 top-object-container */
	appendToTopObjectContainer($element) {
		$('#top-object-container', top.DarkSpring.document).append($element);
	}

	/** 取得 index-template.jsp 中的模板 */
	getIndexTemplate(selector) {
		let document = top.DarkSpring.document;
		return $(selector, $('#index-template', document)).clone(false);
	}

	spinner(show) {
		let document = this.currentDocument();
		if (show) {
			$('#spinner', document).addClass('show');
		} else {
			$('#spinner', document).removeClass('show');
		}
	}

	doGet(option = {}) {
		option.method = "GET";
		this.doService(option);
	}

	doPost(option = {}) {
		option.method = "POST";
		this.doService(option);
	}

	doService(option) {
		let $this = this;

		let url = option.url || null;
		let headers = option.headers || {};
		let method = option.method || null;
		let data = option.data || {};
		let async = option.async === false ? false : true;
		let beforeSend = option.beforeSend || null;
		let success = option.success || null;
		let error = option.error || null;

		$this.spinner(true);

		$.ajax({
			url: url,
			headers: headers,
			method: method,
			data: data,
			async: async,
			beforeSend: function(jqXHR, settings) {
				if (typeof beforeSend === "function") {
					if (beforeSend(jqXHR, settings)) {
						return true;
					} else {
						$this.spinner(false);
						return false;
					}
				} else {
					return true;
				}
			},
			success: function(res) {
				try {
					if (typeof success === "function") {
						success(res);
					}
				} finally {
					$this.spinner(false);
				}
			},
			error: function(err) {
				try {
					if (typeof error === "function") {
						error(err);
					}
				} finally {
					$this.spinner(false);
				}
			}
		});
	}

	doUploadFile() {

	}

	doUploadFiles() {

	}

	doUploadFolder() {

	}

	doDownolad() {

	}

	info(message) {
		let $prompt = this.getIndexTemplate("[data-index-template-prompt]");
		$prompt.addClass("alert-dark");
		this.prompt(message, $prompt, 1500);
	}

	success(message) {
		let $prompt = this.getIndexTemplate("[data-index-template-prompt]");
		$prompt.addClass("alert-success");
		this.prompt(message, $prompt, 1500);
	}

	warning(message) {
		let $prompt = this.getIndexTemplate("[data-index-template-prompt]");
		$prompt.addClass("alert-warning");
		this.prompt(message, $prompt, 1500);
	}

	error(message) {
		let $prompt = this.getIndexTemplate("[data-index-template-prompt]");
		$prompt.addClass("alert-danger");
		this.prompt(message, $prompt, 3000);
	}

	prompt(message, $prompt, dismiss) {
		message = message || "";
		dismiss = isNaN(dismiss) ? 3000 : dismiss;
		$('span', $prompt).html(message);

		this.appendToTopObjectContainer($prompt);

		const timeout = top.window.setTimeout(() => {
			$prompt.fadeOut(500, () => $prompt.remove());
		}, dismiss);

		$('button', $prompt).click(() => {
			top.window.clearTimeout(timeout);
			$prompt.fadeOut(500, () => $prompt.remove());
		});

	}

	dialog(option = {}, $content = "") {

		let $this = this;

		let title = option.title || "";
		let width = option.width || "300px";
		let height = option.height || "200px";

		let shader = option.shader === false ? false : true;
		let resize = option.resize === true ? true : false;
		let maximize = option.maximize === true ? true : false;
		let minimize = option.minimize === true ? true : false;
		let movable = option.movable === true ? true : false;
		let callback = option.callback || null;

		let $dialogComponent = this.getIndexTemplate("[data-index-template-dialog-component]");
		let $shader = $("[data-index-template-shader]", $dialogComponent);
		let $dialog = $("[data-index-template-dialog]", $dialogComponent);
		let $contentContainer = $(".dark-spring-dialog-content", $dialog);

		$dialog.css({
			width: width,
			height: height
		});

		$('.dark-spring-dialog-header-text', $dialog).html(title);

		if ($content) {
			$contentContainer.append($content);
		}

		if (!shader) {
			$shader.remove();
		}

		if (resize) {

			let $resizers = $(".dark-spring-dialog-resize", $dialog);

			let $resizeTop = $(".dark-spring-dialog-resize-top", $dialog);
			let $resizeRight = $(".dark-spring-dialog-resize-right", $dialog);
			let $resizeLeft = $(".dark-spring-dialog-resize-left", $dialog);
			let $resizeBottom = $(".dark-spring-dialog-resize-bottom", $dialog);
			let $resizeTopRight = $(".dark-spring-dialog-resize-top-right", $dialog);
			let $resizeTopLeft = $(".dark-spring-dialog-resize-top-left", $dialog);
			let $resizeBottomRight = $(".dark-spring-dialog-resize-bottom-right", $dialog);
			let $resizeBottomLeft = $(".dark-spring-dialog-resize-bottom-left", $dialog);

			$dialog.resizing = function(enabled) {

				function releaseEvent() {
					if ($this.isMobileDevice()) {
						$(top).unbind('touchend');
						$(top).unbind('touchmove');
					} else {
						$(top).unbind('mousemove');
						$resizers.unbind('mouseleave');
						$resizers.unbind('mouseup');
					}
					$contentContainer.show();
				}

				function registerInfo(e) {
					e.preventDefault();
					if ($this.isMobileDevice()) {
						$dialog.data('mousedownX', e.originalEvent.touches[0].pageX);
						$dialog.data('mousedownY', e.originalEvent.touches[0].pageY);
					} else {
						$dialog.data('mousedownX', e.pageX);
						$dialog.data('mousedownY', e.pageY);
					}
					$dialog.data('contentWidth', $dialog.width());
					$dialog.data('contentHeight', $dialog.height());
					$dialog.data('contentX', $dialog[0].offsetLeft);
					$dialog.data('contentY', $dialog[0].offsetTop);
				}

				function resolveSizing(mousemovedX, mousemovedY, name) {

					let gapX = mousemovedX - $dialog.data('mousedownX');
					let gapY = mousemovedY - $dialog.data('mousedownY');

					let contentX = $dialog.data('contentX');
					let contentY = $dialog.data('contentY');

					let contentWidth = $dialog.data('contentWidth') + 6;
					let contentHeight = $dialog.data('contentHeight') + 6;

					switch (name) {
						case 'Top':
							contentY += gapY;
							contentHeight -= gapY;
							break;
						case 'Right':
							contentWidth += gapX;
							break;
						case 'Left':
							contentX += gapX;
							contentWidth -= gapX;
							break;
						case 'Bottom':
							contentHeight += gapY;
							break;
						case 'TopRight':
							contentY += gapY;
							contentHeight -= gapY;
							contentWidth += gapX;
							break;
						case 'TopLeft':
							contentY += gapY;
							contentHeight -= gapY;
							contentX += gapX;
							contentWidth -= gapX;
							break;
						case 'BottomRight':
							contentHeight += gapY;
							contentWidth += gapX;
							break;
						case 'BottomLeft':
							contentHeight += gapY;
							contentX += gapX;
							contentWidth -= gapX;
							break;
					}

					$dialog.css({
						top: contentY + "px",
						left: contentX + "px",
						width: contentWidth + "px",
						height: contentHeight + "px",
						margin: ''
					});

				}

				function registerMoveingEvent($resizer, name) {
					releaseEvent();
					if ($this.isMobileDevice()) {

						$(top).on('touchend', (e) => {
							e.preventDefault();
							releaseEvent();
						});

						$(top).on('touchmove', (e) => {
							e.preventDefault();
							let mousemovedX = e.originalEvent.touches[0].pageX;
							let mousemovedY = e.originalEvent.touches[0].pageY;
							resolveSizing(mousemovedX, mousemovedY, name);
						});

					} else {
						$resizer.mouseleave((e) => {
							e.preventDefault();
							releaseEvent();
						});

						$resizer.mouseup((e) => {
							e.preventDefault();
							releaseEvent();
						});

						$(top).mousemove((e) => {
							e.preventDefault();
							let mousemovedX = e.pageX;
							let mousemovedY = e.pageY;
							resolveSizing(mousemovedX, mousemovedY, name);
						});

					}
				}

				function registerHolderEvent($resizer, name) {
					if ($this.isMobileDevice()) {
						$resizer.on('touchstart', (e) => {
							registerInfo(e);
							registerMoveingEvent($resizer, name);
						});
					} else {
						$resizer.mousedown((e) => {
							registerInfo(e);
							registerMoveingEvent($resizer, name);
						});
					}
				}

				if (enabled) {
					registerHolderEvent($resizeTop, "Top");
					registerHolderEvent($resizeRight, "Right");
					registerHolderEvent($resizeLeft, "Left");
					registerHolderEvent($resizeBottom, "Bottom");
					registerHolderEvent($resizeTopRight, "TopRight");
					registerHolderEvent($resizeTopLeft, "TopLeft");
					registerHolderEvent($resizeBottomRight, "BottomRight");
					registerHolderEvent($resizeBottomLeft, "BottomLeft");
					$(".dark-spring-dialog-resize", $dialog).show();
				} else {
					if ($this.isMobileDevice()) {
						$(top).unbind('touchend');
						$(top).unbind('touchmove');
						$resizers.unbind('touchstart');
					} else {
						$(top).unbind('mousemove');
						$resizers.unbind('mousedown');
						$resizers.unbind('mouseleave');
						$resizers.unbind('mouseup');
					}
					$(".dark-spring-dialog-resize", $dialog).hide();
				}
			}

			$dialog.resizing(true);
		} else {
			$dialog.resizing = function() { };
			$(".dark-spring-dialog-resize", $dialog).remove();
		}

		if (minimize) {

		} else {
			$("[data-index-template-dialog-minimize]", $dialog).remove();
		}

		if (maximize) {

			let $normalize = $("[data-index-template-dialog-normalize]", $dialog);
			let $maximize = $("[data-index-template-dialog-maximize]", $dialog);

			$normalize.click(() => {

				$normalize.hide();
				$maximize.show();
				$contentContainer.hide();

				$dialog.animate({
					width: width,
					height: height,
					bottom: '0',
					left: '0',
					right: '0',
					top: '0',
					"margin-left": ($(top).width() / 2 - parseInt(width) / 2) + "px",
					"margin-top": ($(top).height() / 2 - parseInt(height) / 2) + "px",
				}, 500, () => {
					$contentContainer.show();
				});

				$dialog.movable(true);
			});

			$maximize.click(() => {

				$normalize.show();
				$maximize.hide();
				$contentContainer.hide();

				$dialog.animate({
					width: '100%',
					height: $this.isMobileDevice() ? "-webkit-fill-available" : "100vh",
					bottom: '0',
					left: '0',
					right: '0',
					top: '0',
					margin: '0'
				}, 500, () => {
					$contentContainer.show();
				});

				$dialog.movable(false);
			});

		} else {
			$("[data-index-template-dialog-normalize]", $dialog).remove();
			$("[data-index-template-dialog-maximize]", $dialog).remove();
		}

		if (movable) {

			$dialog.movable = function(enabled) {

				let $header = $(".dark-spring-dialog-header-text", $dialog);

				function registerEvent() {

					releaseEvent();

					if ($this.isMobileDevice()) {

						$(top).on('touchend', (e) => {
							e.preventDefault();
							releaseEvent();
						});

						$(top).on('touchmove', (e) => {
							e.preventDefault();

							let mousemoveX = e.originalEvent.touches[0].pageX;
							let mousemoveY = e.originalEvent.touches[0].pageY;

							let gapX = mousemoveX - $dialog.data('mousedownX');
							let gapY = mousemoveY - $dialog.data('mousedownY');

							let newX = $dialog.data('contentX') + gapX;
							let newY = $dialog.data('contentY') + gapY;

							let windowWidth = $(top).width();
							let windowHeight = $(top).height();

							let contentWidth = $dialog.width();
							let contentHeight = $dialog.height();

							if (newX < 0) {
								newX = 0;
							} else if (newX + contentWidth > windowWidth) {
								newX = windowWidth - contentWidth;
							}

							if (newY < 0) {
								newY = 0;
							} else if (newY + contentHeight > windowHeight) {
								newY = windowHeight - contentHeight;
							}

							$dialog.css({
								top: newY + "px",
								left: newX + "px",
								margin: ''
							});
						});

					} else {

						$header.mouseleave((e) => {
							e.preventDefault();
							releaseEvent();
						});

						$header.mouseup((e) => {
							e.preventDefault();
							releaseEvent();
						});

						$(top).mousemove((e) => {
							e.preventDefault();

							let mousemoveX = e.pageX;
							let mousemoveY = e.pageY;

							let gapX = mousemoveX - $dialog.data('mousedownX');
							let gapY = mousemoveY - $dialog.data('mousedownY');

							let newX = $dialog.data('contentX') + gapX;
							let newY = $dialog.data('contentY') + gapY;

							let windowWidth = $(top).width();
							let windowHeight = $(top).height();

							let contentWidth = $dialog.width();
							let contentHeight = $dialog.height();

							if (newX < 0) {
								newX = 0;
							} else if (newX + contentWidth > windowWidth) {
								newX = windowWidth - contentWidth;
							}

							if (newY < 0) {
								newY = 0;
							} else if (newY + contentHeight > windowHeight) {
								newY = windowHeight - contentHeight;
							}

							$dialog.css({
								top: newY + "px",
								left: newX + "px",
								margin: ""
							});
						});

					}
				}

				function releaseEvent() {

					if ($this.isMobileDevice()) {
						$(top).unbind('touchend');
						$(top).unbind('touchmove');
					} else {
						$(top).unbind('mousemove');
						$header.unbind('mouseleave');
						$header.unbind('mouseup');
					}

				}

				if (enabled) {

					$('.dark-spring-dialog-header-text', $dialog).addClass("moveable");

					if ($this.isMobileDevice()) {
						$header.on('touchstart', (e) => {
							e.preventDefault();

							$dialog.data('mousedownX', e.originalEvent.touches[0].pageX);
							$dialog.data('mousedownY', e.originalEvent.touches[0].pageY);

							$dialog.data('contentX', $dialog[0].offsetLeft);
							$dialog.data('contentY', $dialog[0].offsetTop);

							registerEvent();
						});
					} else {
						$header.mousedown((e) => {
							e.preventDefault();

							$dialog.data('mousedownX', e.pageX);
							$dialog.data('mousedownY', e.pageY);

							$dialog.data('contentX', $dialog[0].offsetLeft);
							$dialog.data('contentY', $dialog[0].offsetTop);

							registerEvent();
						});
					}

				} else {

					$('.dark-spring-dialog-header-text', $dialog).removeClass("moveable");

					if ($this.isMobileDevice()) {
						$(top).unbind('touchend');
						$(top).unbind('touchmove');
						$header.unbind('touchstart');
					} else {
						$(top).unbind('mousemove');
						$header.unbind('mousedown');
						$header.unbind('mouseleave');
						$header.unbind('mouseup');
					}
				}
			}

			$dialog.movable(true);

		} else {
			$dialog.movable = function() { };
			$('.dark-spring-dialog-header-text', $dialog).removeClass("moveable");
		}

		$dialogComponent.doClose = () => {
			if (typeof callback === "function") {
				callback($dialogComponent.callbackData);
			}
			$dialogComponent.remove();
		};

		$("[data-index-template-dialog-close]", $dialog).click(() => {
			$dialogComponent.doClose();
		});

		this.appendToTopObjectContainer($dialogComponent);
		return $dialogComponent;
	}

	alert() {

	}

	confirm() {

	}

	window() {

	}

	table() {

	}

	pageTable() {

	}

	fetchTable() {

	}

	isMobileDevice() {
		if (/Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			return true;
		} else {
			return false;
		}
	}

}

var DarkSpring = new darkspring(document);