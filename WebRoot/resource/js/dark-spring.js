
"use strict"

/**
 * DarkSpring JS 元件
 *
 * @author DerrekTseng
 *
 */
class Dark {

	/** 當前的 document */
	document;

	/** 建構子 */
	constructor(document) {
		this.document = document;
	}

	/** 增加 Element 至 top 的元件存放區 */
	appendToTopObjectContainer($element) {
		this.getTopObjectContiner().append($element);
	}

	/** 取得 top 的元件存放區 */
	getTopObjectContiner() {
		return $('#top-object-container', this.getTopDocument());
	}

	/** 取得 top 的 docuemnt */
	getTopDocument() {
		return this.getTopDark().document;
	}

	/** 取得位於 top 的 Dark 物件  */
	getTopDark() {
		return top['dark'];
	}

	/** 判斷當前執行區域是否是 top */
	isTop() {
		return this === this.getTopDark();
	}

	/** 取得 index 的 template */
	getIndexTemplate(selector) {
		return $(selector, $('#index-template', this.getTopDocument())).clone(false);
	}

	/** 畫面遮蓋 */
	spinner(show) {
		if (show) {
			$('#spinner', this.document).addClass('show');
		} else {
			$('#spinner', this.document).removeClass('show');
		}
	}

	/* AJAX GET */
	doGet(option = {}) {
		option.method = "GET";
		this.doService(option);
	}

	/* AJAX POST */
	doPost(option = {}) {
		option.method = "POST";
		this.doService(option);
	}

	/** AJAX */
	doService(option = {}) {
		let $this = this;

		let url = option.url || null;
		let headers = option.headers || {};
		let method = option.method || null;
		let data = option.data || {};
		let async = option.async === false ? false : true;
		let success = option.success || null;
		let error = option.error || null;
		let spinner = option.spinner === false ? false : true;

		if (spinner) {
			$this.spinner(true);
		}

		$.ajax({
			url: url,
			headers: headers,
			method: method,
			data: data,
			async: async,
			success: function(res) {
				try {
					if (typeof success === "function") {
						success(res);
					}
				} finally {
					if (spinner) {
						$this.spinner(false);
					}
				}
			},
			error: function(err) {
				try {
					if (typeof error === "function") {
						error(err);
					}
				} finally {
					if (spinner) {
						$this.spinner(false);
					}
				}
			}
		});
	}

	/**
	 * 上傳檔案
	 */
	doUpload(options = {}) {

		let $this = this;

		if ($this.isTop()) {

			let url = options.url || "";
			let data = options.data || {};
			let beforeSend = options.beforeSend || null; // (files, callback) => { callback(true); }
			let abort = options.abort || null; // () => {}
			let success = options.success || null;  // (response) => { }
			let error = options.error || null; // (response) => { }
			let type = options.type || 'file';  // 'file'、'files'、'folder'

			let message = options.message || {
				list: "上傳清單",
				cancelTitle: "取消上傳",
				cancelMessage: "是否要取消上傳?"
			};

			let $fileUpload = document.createElement("input");

			$fileUpload.setAttribute("type", "file");

			if (type.toLocaleLowerCase() === 'files') {
				$fileUpload.setAttribute("multiple", "multiple");
			} else if (type.toLocaleLowerCase() === 'folder') {
				$fileUpload.setAttribute("multiple", "multiple");
				$fileUpload.setAttribute("webkitdirectory", "");
			}

			$fileUpload.addEventListener("change", () => {

				let formdata = new FormData();
				let files = []
				for (let i = 0; i < $fileUpload.files.length; i++) {
					formdata.append("files", $fileUpload.files[i]);
					files.push($fileUpload.files[i]);
				}

				formdata.append("data", JSON.stringify(data));

				let doUpload = () => {

					let uploading = {};

					let $xhr = new window.XMLHttpRequest();

					$xhr.upload.addEventListener("progress", (evt) => {
						if (evt.lengthComputable) {
							let percentComplete = evt.loaded / evt.total;
							percentComplete = parseInt(percentComplete * 100);
							$uploadMinimizeComponent.updateProgressBar(percentComplete);
							$uploadDialogContent.updateProgressBar(percentComplete);
							if (percentComplete === 100) {
								$uploadDialogContent.disableCancel();
							}
						}
					}, false);

					let title = "Upload " + files.length + " files";

					let $uploadMinimizeComponent = $this.getIndexTemplate("[data-index-template-min-upload-component]");

					let $topUploadingsComponent = $('#top-uploadings-component', $this.getTopDocument());

					let $topUploadMinimizeContainer = $('#top-uploadings-container', $topUploadingsComponent);

					$uploadMinimizeComponent.appendTo($topUploadMinimizeContainer);

					uploading.min = $uploadMinimizeComponent;

					$uploadMinimizeComponent.click(() => {
						uploading.dialog.show();
					});

					$('[data-index-template-min-upload-text]', $uploadMinimizeComponent).html(title);

					$uploadMinimizeComponent.updateProgressBar = (percent) => {
						$('[data-index-template-min-upload-progress-bar]', $uploadMinimizeComponent).css('width', percent + '%').attr('aria-valuenow', percent);
					};

					let $uploadDialogContent = $this.getIndexTemplate("[data-index-template-dialog-upload-component");

					let canceled = false;

					$this.table({
						table: $('table', $uploadDialogContent),
						data: files,
						thead: [[
							{ content: "<span></span>", attrs: { class: "none-select", style: 'width: 48px; text-align: center; vertical-align: middle;' } },
							{ content: message.list, attrs: { class: "none-select", style: 'text-align: center; vertical-align: middle;' } },
							{
								content: '<button type="button" class="btn btn-sm btn-sm-square btn-outline-primary"><i class="fas fa-times"></i></button>',
								attrs: { class: "none-select", style: 'width: 48px; vertical-align: middle;' }
							}
						]],
						theadEach: ($theads) => {
							$('button', $theads[0]).click(() => {
								uploading.cencalDialog = $this.confirm({
									title: message.cancelTitle,
									message: message.cancelMessage,
									callback: (confirmResult) => {
										if (confirmResult) {
											canceled = true;
											Object.values(uploading).forEach(val => {
												if (val) {
													val.remove();
												}
											});
											$xhr.abort();
											if (typeof abort === 'function') {
												abort();
											}
										}
									}
								});
							});
						},
						tbody: [[
							{ content: "", attrs: { colspan: "3" } }
						]],
						tbodyEach: ($trs, data) => {
							$("td", $trs[0]).html(data.webkitRelativePath)
						}
					});

					$uploadDialogContent.disableCancel = () => {
						$('button', $uploadDialogContent).remove();
					}

					$uploadDialogContent.updateProgressBar = (percent) => {
						$uploadDialogContent.data('percent', percent);
						$('span', $uploadDialogContent).html(percent + "%");
					}

					let $uploadDialogComponent = $this.dialog({
						title: title,
						shadow: true,
						resize: true,
						maximize: true,
						minimize: false,
						movable: true,
						width: "70vw",
						height: "70vh"
					}, $uploadDialogContent).hide();

					$('.dropdown-toggle', $topUploadingsComponent).bs().dropdown().show();

					uploading.dialog = $uploadDialogComponent;

					$uploadDialogComponent.doClose = () => {
						$uploadDialogComponent.hide();
					};

					$.ajax({
						url: url,
						headers: { 'X-Requested-With': 'XMLHttpRequest' },
						xhr: () => $xhr,
						method: "POST",
						data: formdata,
						contentType: false,
						processData: false,
						mimeType: 'multipart/form-data'
					}).done((response) => {
						Object.values(uploading).forEach(val => {
							if (val) {
								val.remove();
							}
						});
						if (typeof success === 'function') {
							success(response);
						}
					}).fail((response) => {
						Object.values(uploading).forEach(val => {
							if (val) {
								val.remove();
							}
						});
						if (typeof error === 'function') {
							if (!canceled) {
								error(response);
							}
						}
					});
				}

				if (typeof beforeSend === 'function') {
					beforeSend(files, (beforeSendResult) => {
						if (beforeSendResult) {
							doUpload();
						}
					});
				} else {
					doUpload();
				}

			});

			$fileUpload.click();

		} else {
			$this.getTopDark().doUpload(options);
		}
	}

	/**
	 * 下載檔案
	 */
	doDownolad(option = {}) {
		if (this.isTop()) {
			let url = option.url || "";
			let data = option.data || {};
			let urlQueryString = url + this.objectToQuerystring(data);
			let $a = this.getTopDocument().createElement("a");
			$a.setAttribute("href", urlQueryString);
			$a.setAttribute("download", "");
			$a.click();
		} else {
			this.getTopDark().doDownolad(option);
		}
	}

	/**
	 * 彈跳出 info 訊息
	 */
	info(message) {
		let $prompt = this.getIndexTemplate("[data-index-template-prompt]");
		$prompt.addClass("alert-dark");
		this.prompt(message, $prompt, 1500);
	}

	/**
	 * 彈跳出 success 訊息
	 */
	success(message) {
		let $prompt = this.getIndexTemplate("[data-index-template-prompt]");
		$prompt.addClass("alert-success");
		return this.prompt(message, $prompt, 1500);
	}

	/**
	 * 彈跳出 warning 訊息
	 */
	warning(message) {
		let $prompt = this.getIndexTemplate("[data-index-template-prompt]");
		$prompt.addClass("alert-warning");
		return this.prompt(message, $prompt, 1500);
	}

	/**
	 * 彈跳出 error 訊息
	 */
	error(message) {
		let $prompt = this.getIndexTemplate("[data-index-template-prompt]");
		$prompt.addClass("alert-danger");
		return this.prompt(message, $prompt, 3000);
	}

	/**
	 * 產生 Prompt 物件
	 */
	prompt(message, $prompt, dismiss) {
		let $this = this;
		if ($this.isTop()) {
			message = message || "";
			dismiss = isNaN(dismiss) ? 3000 : dismiss;
			$('span', $prompt).html(message);

			$this.appendToTopObjectContainer($prompt);

			let timeout = setTimeout(() => {
				$prompt.remove();
			}, dismiss);

			$('button', $prompt).click(() => {
				clearTimeout(timeout);
				$prompt.remove();
			});

			return $prompt;
		} else {
			return $this.getTopDark().prompt(message, $prompt, dismiss);
		}
	}

	/**
	 * 產生 Dialog 物件
	 */
	dialog(option = {}, $content = "") {
		let $this = this;
		if ($this.isTop()) {

			let title = option.title || "";
			let width = option.width || "300px";
			let height = option.height || "200px";

			let shadow = option.shadow === true ? true : false;
			let resize = option.resize === true ? true : false;
			let maximize = option.maximize === true ? true : false;
			let minimize = option.minimize === true ? true : false;
			let movable = option.movable === true ? true : false;
			let callback = option.callback || null;

			let $dialogComponent = $this.getIndexTemplate("[data-index-template-dialog-component]");
			let $shadow = $("[data-index-template-shadow]", $dialogComponent);
			let $dialog = $("[data-index-template-dialog]", $dialogComponent);
			let $contentContainer = $(".dark-spring-dialog-content", $dialog);

			let uuid = this.randomUUID();

			$dialogComponent.attr('id', uuid);
			$dialogComponent.data('id', uuid);

			let toolbarSize = 106;

			$dialog.data("defaultWidth", width);
			$dialog.data("defaultHeight", height);

			$dialog.css({
				width: width,
				height: height,
				margin: "auto"
			});

			$('.dark-spring-dialog-header-text', $dialog).html(title);

			if ($content) {
				$contentContainer.append($content);
			}

			$contentContainer.click(() => {
				$this.setDialogTop(uuid);
			});

			if (!shadow) {
				$shadow.hide();
			}

			if ($this.isMobileDevice()) {
				$shadow.on('touchmove', (e) => {
					e.preventDefault();
				});
				$shadow.on('touchstart', (e) => {
					e.preventDefault();
				});
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

				$dialog.resizing = (enabled) => {

					let releaseEvent = () => {
						if ($this.isMobileDevice()) {
							$(top).unbind('touchend');
							$(top).unbind('touchmove');
						} else {
							$(top).unbind('mousemove');
							$(window).unbind('mouseup');
							$resizers.unbind('mouseup');
						}
						$contentContainer.show();
						if (!shadow) {
							$shadow.hide();
						}
					}

					let registerInfo = (e) => {

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
						e.preventDefault();
					}

					let resolveSizing = (mousemovedX, mousemovedY, name) => {

						$shadow.show();

						$contentContainer.hide();

						let gapX = mousemovedX - $dialog.data('mousedownX');
						let gapY = mousemovedY - $dialog.data('mousedownY');

						let contentX = $dialog.data('contentX');
						let contentY = $dialog.data('contentY');

						let contentWidth = $dialog.data('contentWidth') + 6;
						let contentHeight = $dialog.data('contentHeight') + 6;

						let contentMinWidth = parseInt($dialog.css("min-width"));
						let contentMinHeight = parseInt($dialog.css("min-height"));

						if (name.includes("Top")) {
							if (contentHeight - gapY < contentMinHeight) {
								gapY = contentHeight - contentMinHeight;
							}
							contentY += gapY;
							contentHeight -= gapY;
						}
						if (name.includes("Right")) {
							contentWidth += gapX;
						}
						if (name.includes("Left")) {
							if (contentWidth - gapX < contentMinWidth) {
								gapX = contentWidth - contentMinWidth;
							}
							contentX += gapX;
							contentWidth -= gapX;
						}
						if (name.includes("Bottom")) {
							contentHeight += gapY;
						}

						let topWidth = $(top).width();
						let topHeight = $(top).height();

						if (contentX + contentWidth < topWidth && contentX > 0) {
							$dialog.css({
								left: contentX + "px",
								width: contentWidth + "px",
								margin: ''
							});
						}

						if (contentY + contentHeight < topHeight && contentY > 0) {
							$dialog.css({
								top: contentY + "px",
								height: contentHeight + "px",
								margin: ''
							});
						}

					}

					let registerMoveingEvent = ($resizer, name) => {
						releaseEvent();
						if ($this.isMobileDevice()) {

							$(top).on('touchend', (e) => {
								releaseEvent();
								e.preventDefault();
							});

							$(top).on('touchmove', (e) => {
								let mousemovedX = e.originalEvent.touches[0].pageX;
								let mousemovedY = e.originalEvent.touches[0].pageY;
								resolveSizing(mousemovedX, mousemovedY, name);
								e.preventDefault();
							});

						} else {

							$(window).mouseup((e) => {
								releaseEvent();
								e.preventDefault();
							});

							$resizer.mouseup((e) => {
								releaseEvent();
								e.preventDefault();
							});

							$(top).mousemove((e) => {
								let mousemovedX = e.pageX;
								let mousemovedY = e.pageY;
								resolveSizing(mousemovedX, mousemovedY, name);
								e.preventDefault();
							});

						}

						$this.setDialogTop(uuid);

					}

					let registerHolderEvent = ($resizer, name) => {
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
				$dialog.resizing = () => { };
				$(".dark-spring-dialog-resize", $dialog).css("cursor", "default");
			}

			if (minimize) {

				let $minDialog = $this.getIndexTemplate("[data-index-template-min-dialog-component]");

				$('[data-index-template-min-dialog-title]', $minDialog).html(title);

				$minDialog.attr("title", title);

				$("[data-index-template-dialog-minimize]", $dialog).click(() => {
					$dialogComponent.hide();
					$minDialog.appendTo("#top-dialogs-container");
				});

				$minDialog.click(() => {
					$minDialog.detach();
					$dialogComponent.show();
				});

			} else {
				toolbarSize -= 32;
				$("[data-index-template-dialog-minimize]", $dialog).remove();
			}

			if (maximize) {

				let $normalize = $("[data-index-template-dialog-normalize]", $dialog);
				let $maximize = $("[data-index-template-dialog-maximize]", $dialog);

				$normalize.click(() => {

					$normalize.hide();
					$maximize.show();
					$contentContainer.hide();

					let topWidth = $(top).width();
					let topHeight = $(top).height();

					let newWidth = parseInt(width) > topWidth ? topWidth + "px" : width;
					let newHeight = parseInt(height) > topHeight ? topHeight + "px" : height;

					$dialog.animate({
						width: newWidth,
						height: newHeight,
						inset: '0px',
						margin: "auto"
					}, 500, () => {
						$contentContainer.show();
						$dialog.resizing(true);
						$dialog.movable(true);
					});

				});

				$maximize.click(() => {

					$normalize.show();
					$maximize.hide();
					$contentContainer.hide();

					if ($dialog.css("margin").split(" ").length == 2) {
						$dialog.css({
							margin: "auto"
						});
					}

					$dialog.animate({
						width: '100%',
						height: "100vh",
						top: "0px",
						left: "0px",
						right: "0px",
						bottom: "0px"
					}, 500, () => {
						$dialog.css({
							height: $this.isMobileDevice() ? "-webkit-fill-available" : "100vh",
							margin: "auto",
							inset: '0px'
						});
						$contentContainer.show();
						$dialog.resizing(false);
						$dialog.movable(false);
					});

				});

			} else {
				toolbarSize -= 32;
				$("[data-index-template-dialog-normalize]", $dialog).remove();
				$("[data-index-template-dialog-maximize]", $dialog).remove();
			}

			if (movable) {

				$dialog.movable = (enabled) => {

					let $header = $(".dark-spring-dialog-header-title", $dialog);

					let resolveMoving = (mousemoveX, mousemoveY) => {

						$contentContainer.hide();

						$shadow.show();

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
						} else if (newX + contentWidth + 5 > windowWidth) {
							newX = windowWidth - contentWidth - 5;
						}

						if (newY < 0) {
							newY = 0;
						} else if (newY + contentHeight + 5 > windowHeight) {
							newY = windowHeight - contentHeight - 5;
						}

						$dialog.css({
							top: newY + "px",
							left: newX + "px",
							margin: ''
						});
					}

					let registerEvent = () => {

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

								resolveMoving(mousemoveX, mousemoveY);

							});

						} else {

							$(window).mouseup((e) => {
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

								resolveMoving(mousemoveX, mousemoveY);

							});

						}
					}

					let releaseEvent = () => {

						$contentContainer.show();

						if ($this.isMobileDevice()) {
							$(top).unbind('touchend');
							$(top).unbind('touchmove');
						} else {
							$(top).unbind('mousemove');
							$(window).unbind('mouseup');
							$header.unbind('mouseup');
						}

						if (!shadow) {
							$shadow.hide();
						}

					}

					if (enabled) {

						$('.dark-spring-dialog-header-title', $dialog).addClass("moveable");

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

						$('.dark-spring-dialog-header-title', $dialog).removeClass("moveable");

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
				$dialog.movable = () => { };
				$('.dark-spring-dialog-header-title', $dialog).removeClass("moveable");
			}

			$dialogComponent.doClose = () => {
				if (typeof callback === "function") {
					callback($dialogComponent.data("callbackData"));
				}
				$dialogComponent.remove();
			};

			$("[data-index-template-dialog-close]", $dialog).click(() => {
				$dialogComponent.doClose();
			});

			$this.appendToTopObjectContainer($dialogComponent);


			let shownDialogWidth = parseInt($dialog.width());
			let shownDialogHeight = parseInt($dialog.height());

			let shownTopWidth = parseInt($(top).width());
			let shownTopHeight = parseInt($(top).height());

			if (shownDialogWidth > shownTopWidth) {
				$dialog.css({
					width: shownTopWidth + "px"
				});
				$dialog.data("defaultWidth", shownTopWidth + "px");
			}

			if (shownDialogHeight > shownTopHeight) {
				$dialog.css({
					height: shownTopHeight + "px"
				});
				$dialog.data("defaultHeight", shownTopHeight + "px");
			}

			$dialog.data("defaultWidth", width);
			$dialog.data("defaultHeight", height);

			$('.dark-spring-dialog-header-title', $dialog).css({
				width: "calc( 100% - " + toolbarSize + "px )"
			});

			$('.dark-spring-dialog-header-toolbar', $dialog).css({
				width: (toolbarSize - 8) + "px"
			});


			$(".dark-spring-dialog-header", $dialog).on($this.isMobileDevice() ? "touchstart" : "mousedown", () => {
				$this.setDialogTop(uuid);
			});

			$this.setDialogTop(uuid);

			return $dialogComponent;
		} else {
			return $this.getTopDark().dialog(option, $content);
		}
	}

	/**
	 * 彈跳出 Alert 視窗
	 */
	alert(option = {}) {
		let $this = this;

		if ($this.isTop()) {
			let title = option.title || "";
			let message = option.message || "";
			let width = option.width;
			let height = option.height;
			let callback = option.callback;

			let dialogOption = {
				title: title,
				width: width,
				height: height,
				shadow: true,
				resize: true,
				maximize: false,
				minimize: false,
				movable: true,
				callback: (callbackData) => {
					if (typeof callback === 'function') {
						callback(callbackData);
					}
				}
			}

			let $content = $this.getIndexTemplate("[data-index-template-dialog-alert]");

			$('[data-index-template-dialog-alert-message]', $content).html(message);

			let $dialogComponent = $this.dialog(dialogOption, $content);

			$('[data-index-template-dialog-alert-close]', $content).click(() => {
				$dialogComponent.doClose();
			});

			return $dialogComponent;
		} else {
			return $this.getTopDark().alert(option);
		}
	}

	/**
	 * 彈跳出 confirm 視窗
	 */
	confirm(option = {}) {

		let $this = this;

		if ($this.isTop()) {
			let title = option.title || "";
			let message = option.message || "";
			let width = option.width;
			let height = option.height;
			let callback = option.callback;

			let dialogOption = {
				title: title,
				width: width,
				height: height,
				shadow: true,
				resize: true,
				maximize: false,
				minimize: false,
				movable: true,
				callback: (callbackData) => {
					if (typeof callback === 'function') {
						callback(callbackData);
					}
				}
			}

			let $content = $this.getIndexTemplate("[data-index-template-dialog-confirm]");

			$('[data-index-template-dialog-confirm-message]', $content).html(message);

			let $dialogComponent = $this.dialog(dialogOption, $content);

			$dialogComponent.data("callbackData", false);

			$('[data-index-template-dialog-confirm-cancel]', $content).click(() => {
				$dialogComponent.doClose();
			});

			$('[data-index-template-dialog-confirm-accept]', $content).click(() => {
				$dialogComponent.data("callbackData", true);
				$dialogComponent.doClose();
			});

			return $dialogComponent;
		} else {
			return $this.getTopDark().confirm(option);
		}
	}

	/**
	 * 彈跳出 window 視窗
	 */
	window(option = {}) {

		let $this = this;

		if ($this.isTop()) {

			let title = option.title || "";
			let url = option.url || "";
			let data = option.data || {};
			let width = option.width;
			let height = option.height;
			let callback = option.callback;
			let shadow = option.shadow === false ? false : true;
			let resize = option.resize === false ? false : true;
			let maximize = option.maximize === false ? false : true;
			let minimize = option.minimize === false ? false : true;
			let movable = option.movable === false ? false : true;

			let dialogOption = {
				title: title,
				width: width,
				height: height,
				shadow: shadow,
				resize: resize,
				maximize: maximize,
				minimize: minimize,
				movable: movable,
				callback: (callbackData) => {
					if (typeof callback === 'function') {
						callback(callbackData);
					}
				}
			}

			let $content = $this.getIndexTemplate("[data-index-template-dialog-window]");

			$content.attr("src", url + $this.objectToQuerystring(data));

			let $dialogComponent = $this.dialog(dialogOption, $content);

			let uuid = $dialogComponent.data('id');

			$dialogComponent.data("doCloseCallback", (callbackData) => {
				try {
					$dialogComponent.data("callbackData", callbackData);
				} catch (e) {
					$this.error(e);
				} finally {
					$dialogComponent.doClose();
				}
			});

			$content.on("load", () => {
				let $iframeBody = $content.contents().find('body');
				let doCloseScript = [];
				doCloseScript.push("<script>");
				doCloseScript.push("function doCloseWindow(callbackData) {");
				doCloseScript.push("dark.closeDialog('" + uuid + "', callbackData);");
				doCloseScript.push("}");

				doCloseScript.push("$(document).ready(function(){");
				doCloseScript.push("$('html').on(dark.isMobileDevice() ? 'touchstart' : 'mousedown', () => {");
				doCloseScript.push("dark.setDialogTop('" + uuid + "')");
				doCloseScript.push("});});");

				doCloseScript.push("</script>");
				$iframeBody.append($(doCloseScript.join(" ")));
			});

			return $dialogComponent;
		} else {
			return $this.getTopDark().window(option);
		}
	}

	/**
	 * 關閉指定 uuid 的 dialog
	 *
	 */
	closeDialog(uuid, callbackData) {
		let $this = this;
		if ($this.isTop()) {
			$('#' + uuid, top.document).data("doCloseCallback")(callbackData);
		} else {
			$this.getTopDark().closeDialog(uuid, callbackData);
		}
	}

	/**
	 * 設定指定 dialog 至最上層
	 */
	setDialogTop(uuid) {

		let $this = this;

		if ($this.isTop()) {

			let $topObjectContiner = $this.getTopObjectContiner();

			let $dialogComponents = $('[data-index-template-dialog-component]', $topObjectContiner);

			let $targetDialogComponent = $('#' + uuid, $topObjectContiner);

			let nextZindex = 1000;

			$dialogComponents.each((_index, dialogComponent) => {
				if (!$targetDialogComponent.is(dialogComponent)) {
					let dialogZindex = $(dialogComponent).data('z-index');
					if (nextZindex < dialogZindex) {
						nextZindex = dialogZindex;
					}
				}
			});

			$('[data-index-template-shadow]', $targetDialogComponent).css('z-index', nextZindex++);
			$('[data-index-template-dialog]', $targetDialogComponent).css('z-index', nextZindex++);

			$targetDialogComponent.data('z-index', nextZindex);

		} else {
			$this.getTopDark().setDialogTop(uuid);
		}
	}

	/**
	 * Grid 設定
	 */
	gridConfig() {
		class GridConfig {
			constructor() {
				this.table = null;
				this.data = null;
				this.thead = {
					meta: [],
					rendered: null,
					sorter: null
				};
				this.tbody = {
					meta: [],
					rendered: null
				};
				this.pager = {
					enabled: false,
					feed: null
				};
			}
			setTable(table) {
				this.table = table;
			}
			setData(data) {
				this.data = data;
			}
			addTheadMeta(meta) {
				this.thead.meta.push(meta);
			}
			setTheadRendered(rendered) {
				this.thead.rendered = rendered;
			}
			setTheadSorter(sorter) {
				this.thead.sorter = sorter;
			}
			addTbodyMeta(meta) {
				this.tbody.meta.push(meta);
			}
			setTbodyRendered(rendered) {
				this.tbody.rendered = rendered;
			}
			setPagerEnabled(enabled) {
				this.pager.enabled = enabled;
			}
			setPagerFeed(feed) {
				this.pager.feed = feed;
			}
		}
		return new GridConfig();
	}

	/**
	 * 產生 Grid 物件
	 *
	 */
	grid(gridConfig = this.gridConfig()) {

		let $dark = this;

		class Grid {
			constructor(gridConfig) {
				let $this = this;

				$this.$gridConfig = gridConfig;
				$this.list = [];
				$this._data = new Map();

				$this.$table = $this.$gridConfig.table;
				$this.$title = $("<caption align='top' class='container-fluid'>");
				$this.$spinner = $dark.getIndexTemplate("[data-index-template-table-spinner]");
				$this.$title.append($this.$spinner);

				new ResizeSensor($this.$table.parent(), () => {
					let x = $this.$table[0].offsetLeft;
					let y = $this.$table[0].offsetTop;
					let width = $this.$table.width();
					let height = $this.$table.height();
					$this.$spinner.css({
						position: "absolute",
						width: width,
						height: height,
						top: y + "px",
						left: x + "px",
					})
				});

				$this.$thead = $('<thead>');
				$this.$tbody = $('<tbody>');

				$this.$table.empty();
				$this.$table.append($this.$title);
				$this.$table.append($this.$thead);
				$this.$table.append($this.$tbody);

				$this.filteror = (list) => {
					return list;
				};

				$this.renderer = {};

				$this.renderer.thead = () => {
					let $trs = [];
					$this.$gridConfig.thead.meta.forEach((meta) => {
						let $tr = $('<tr>');
						meta.forEach((item) => {
							let $th = $("<th>");
							$th.html(item.content);
							if (typeof item.attrs === "object") {
								Object.keys(item.attrs).forEach((key) => {
									$th.attr(key, item.attrs[key]);
								});
							}
							if (item.sort && typeof $this.$gridConfig.thead.sorter === "function") {
								$this.$gridConfig.thead.sorter($this, $th, item.sort);
							}
							$tr.append($th);
						});
						$trs.push($tr);
						$this.$thead.append($tr);
					});
					if (typeof $this.$gridConfig.thead.rendered === "function") {
						$this.$gridConfig.thead.rendered($trs);
					}
				};

				$this.renderer.tbody = () => {

					$this.spinner(true);

					let tbodyListCallbackComplated = () => {
						$this.spinner(false);
					};

					let tbodyListCallback = (list) => {
						$this.$tbody.empty();
						list.forEach((listItem) => {
							let $trs = [];
							$this.$gridConfig.tbody.meta.forEach((meta) => {
								let $tr = $('<tr>');
								meta.forEach((item) => {
									let $td = $('<td>');
									$td.html($dark.tranPattern($dark.getHtmlString(item.content), listItem));
									if (typeof item.attrs === "object") {
										Object.keys(item.attrs).forEach((key) => {
											$td.attr(key, item.attrs[key]);
										});
									}
									$td.data("data", listItem);
									$tr.append($td);
								});
								$trs.push($tr);
								$this.$tbody.append($tr);
							});
							if (typeof $this.$gridConfig.tbody.rendered === "function") {
								$this.$gridConfig.tbody.rendered($trs, listItem);
							}
						});

						tbodyListCallbackComplated();
					};
					if ($this.$gridConfig.pager.enabled) {
						tbodyListCallbackComplated = () => {
							$this.spinner(false);
							$this.renderer.pagerUpdate();
						};
						$this.$gridConfig.pager.feed($this, tbodyListCallback);
					} else {
						tbodyListCallback($this.filteror($this.$gridConfig.data));
					}
				}

				$this.renderer.pagerUpdate = () => {
					let pageNum = $this.$gridConfig.pager.pageNum;
					let pageSize = $this.$gridConfig.pager.pageSize;
					let totalSize = $this.$gridConfig.pager.totalSize;
					let pageCount = Math.ceil(totalSize / pageSize);
					$this.$gridConfig.pager.pageCount = pageCount;

					$("[data-pager-num]", $this.$pager).empty();

					for (let count = 0; count < pageCount; count++) {
						let pc = count + 1;
						$("[data-pager-num]", $this.$pager).append("<option value='" + pc + "'>" + pc + "</option>");
					}

					if (pageCount == 0) {
						$("[data-pager-num]", $this.$pager).append("<option value='1'>" + 1 + "</option>");
						$("[data-pager-num]", $this.$pager).val(1);
						pageNum = 1;
						$this.$gridConfig.pager.pageNum = 1;
					} else {
						$("[data-pager-num]", $this.$pager).val(pageNum);
					}

					if (pageNum <= 1) {
						$("[data-pager-first]", $this.$pager).attr('disabled', true);
						$("[data-pager-previous]", $this.$pager).attr('disabled', true);
					} else {
						$("[data-pager-first]", $this.$pager).attr('disabled', false);
						$("[data-pager-previous]", $this.$pager).attr('disabled', false);
					}

					if (pageNum >= pageCount) {
						$("[data-pager-next]", $this.$pager).attr('disabled', true);
						$("[data-pager-last]", $this.$pager).attr('disabled', true);
						if (pageNum > pageCount && pageCount != 0) {
							$this.$gridConfig.pager.pageNum = pageCount;
							$("[data-pager-num]", $this.$pager).val(pageCount);
							$this.renderer.tbody();
							return;
						}
					} else {
						$("[data-pager-next]", $this.$pager).attr('disabled', false);
						$("[data-pager-last]", $this.$pager).attr('disabled', false);
					}

				}

				$this.renderer.pagerEvent = () => {
					let $pager = $dark.getIndexTemplate("[data-index-template-table-pager]");
					$this.$pager.append($pager);

					$("[data-pager-first]", $pager).click(() => {
						$this.$gridConfig.pager.pageNum = 1;
						$this.renderer.tbody();
					});

					$("[data-pager-previous]", $pager).click(() => {
						$this.$gridConfig.pager.pageNum--;
						$this.renderer.tbody();
					});

					$("[data-pager-next]", $pager).click(() => {
						$this.$gridConfig.pager.pageNum++;
						$this.renderer.tbody();
					});

					$("[data-pager-last]", $pager).click(() => {
						$this.$gridConfig.pager.pageNum = $this.$gridConfig.pager.pageCount;
						$this.renderer.tbody();
					});

					$("[data-pager-num]", $pager).change(() => {
						$this.$gridConfig.pager.pageNum = $("[data-pager-num]", $pager).val();
						$this.renderer.tbody();
					});

				}

				if ($this.$gridConfig.pager.enabled) {
					$this.$pager = $("<caption align='bottom' class='container-fluid'>");
					let $pager = $this.$pager;
					$this.$table.append($pager);
					$this.renderer.pagerEvent();
				}

				$this.renderer.thead();
				$this.renderer.tbody();

			}

			spinner(show) {

				let $this = this;

				if (show) {
					let x = $this.$table[0].offsetLeft;
					let y = $this.$table[0].offsetTop;
					let width = $this.$table.width();
					let height = $this.$table.height();
					$this.$spinner.css({
						position: "absolute",
						width: width,
						height: height,
						top: y + "px",
						left: x + "px",
					})
					$this.$spinner.addClass("show");
					$this.$spinner.show();
					$this.$spinner.appendTo($this.$title);
				} else {
					$this.$spinner.removeClass("show");
					$this.$spinner.hide();
					$this.$spinner.detach();
				}
			}

			data(key, value) {
				if (value === undefined) {
					return this._data.get(key);
				} else {
					this._data.set(key, value);
					return value;
				}
			}

		}
		return new Grid(gridConfig);
	}

	/**
	 * Grid 預設的 Thead Sorter
	 *
	 */
	gridDefaultSorter() {
		return ($grid, $th, key) => {

			if (!$grid.data('original-list')) {
				let originalList = [];
				$grid.$gridConfig.data.forEach((item) => {
					originalList.push(item);
				});
				$grid.data('original-list', originalList);
			}

			$th.data("sort", "");
			let $sort = $("<i data-sort-default class='fas fa-sort'></i>");
			let $sortAsc = $("<i data-sort class='fas fa-sort-up' style='color:red'></i>").hide();
			let $sortDesc = $("<i data-sort class='fas fa-sort-down' style='color:red'></i>").hide();

			$th.append($sort).append($sortAsc).append($sortDesc);

			$th.click(() => {

				let originalList = $grid.data('original-list');

				let sort = $th.data("sort");
				$("[data-sort]", $grid.$table).hide();
				$("[data-sort-default]", $grid.$table).show();
				$sort.hide();
				$("[data-sort]", $grid.$table).parent().data("sort", "");

				if (sort === "") {
					sort = "asc";
					$sortAsc.show();
				} else if (sort === "asc") {
					sort = "desc";
					$sortDesc.show();
				} else if (sort === "desc") {
					sort = "";
					$sort.show();
				}

				$th.data("sort", sort);

				if (sort === "asc" || sort === "desc") {
					let sortedData = [];
					let sortkeyArray = Array.isArray(key);
					originalList.map((value, index) => {
						return { index, value }
					}).sort((a, b) => {
						let aText = '', bText = '';
						if (sortkeyArray) {
							let aTextBuffer = [], bTextBuffer = [];
							key.forEach((item) => {
								aTextBuffer.push(JSON.stringify(a.value[item]));
								bTextBuffer.push(JSON.stringify(b.value[item]));
							});
							aText = aTextBuffer.join('');
							bText = bTextBuffer.join('');
						} else {
							aText = JSON.stringify(a.value[key]);
							bText = JSON.stringify(b.value[key]);
						}
						if (sort === 'desc') {
							return aText.localeCompare(bText, 'zh-Hant-TW');
						} else {
							return bText.localeCompare(aText, 'zh-Hant-TW');
						}
					}).map((obj) => {
						return obj.index;
					}).forEach((item) => {
						sortedData.push(originalList[item]);
					});
					$grid.$gridConfig.data = sortedData;
				} else {
					$grid.$gridConfig.data = originalList;
				}
				$grid.renderer.tbody();
			});
		}
	}

	/**
	 * 無分頁 Table
	 *
	 *
	 */
	table(option = {}) {

		let $this = this;

		let table = option.table || null;
		let data = option.data || [];
		let thead = option.thead || [];
		let theadEach = option.theadEach || null;
		let tbody = option.tbody || [];
		let tbodyEach = option.tbodyEach || null;

		let config = $this.gridConfig();

		config.setTable(table);
		config.setData(data);
		thead.forEach((i) => {
			config.addTheadMeta(i);
		});
		config.setTheadRendered(theadEach);

		tbody.forEach((i) => {
			config.addTbodyMeta(i);
		});

		config.setTbodyRendered(tbodyEach);

		config.setTheadSorter($this.gridDefaultSorter());

		let $grid = $this.grid(config);

		$grid.doFilter = (key, value) => {
			$grid.filterKey = key;
			$grid.filterValue = value;
			$grid.renderer.tbody();
		}

		$grid.filteror = (list) => {
			return list.filter((item) => {
				if (item[$grid.filterKey] !== undefined) {
					if ($grid.filterKey && $grid.filterValue) {
						return JSON.stringify(item[$grid.filterKey]).includes($grid.filterValue);
					} else {
						return true;
					}
				} else {
					return true;
				}
			});
		}

		return $grid;
	}

	/**
	 * 前端分頁 Table
	 *
	 *
	 */
	pageTable(option = {}) {

		let $this = this;

		let table = option.table || null;
		let data = option.data || [];
		let thead = option.thead || [];
		let theadEach = option.theadEach || null;
		let tbody = option.tbody || [];
		let tbodyEach = option.tbodyEach || null;
		let pageNum = option.pageNum || 1;
		let pageSize = option.pageSize || 10;

		let config = $this.gridConfig();

		config.setTable(table);
		config.setData(data);
		thead.forEach((i) => {
			config.addTheadMeta(i);
		});
		config.setTheadRendered(theadEach);

		tbody.forEach((i) => {
			config.addTbodyMeta(i);
		});

		config.setTbodyRendered(tbodyEach);

		config.setTheadSorter($this.gridDefaultSorter());

		config.setPagerEnabled(true);

		config.pager.pageNum = pageNum;
		config.pager.pageSize = pageSize;
		config.pager.totalSize = data.length;

		config.setPagerFeed(($grid, callback) => {

			let pageNum = $grid.$gridConfig.pager.pageNum;
			let pageSize = $grid.$gridConfig.pager.pageSize;


			let returnList = $grid.$gridConfig.data.filter((item) => {
				if ($grid.filterKey && $grid.filterValue) {
					if (item[$grid.filterKey] !== undefined) {
						return JSON.stringify(item[$grid.filterKey]).includes($grid.filterValue);
					} else {
						return true;
					}
				} else {
					return true;
				}
			});

			$grid.$gridConfig.pager.totalSize = returnList.length;

			let totalSize = $grid.$gridConfig.pager.totalSize;

			let sliceStart = (pageNum - 1) * pageSize;
			let sliceEnd = sliceStart + pageSize;
			if (sliceEnd > totalSize - 1) {
				sliceEnd = totalSize;
			}

			callback(returnList.slice(sliceStart, sliceEnd));
		});

		let $grid = $this.grid(config);

		$grid.doFilter = (key, value) => {
			$grid.filterKey = key;
			$grid.filterValue = value;
			$grid.renderer.tbody();
		}

		return $grid;
	}

	/**
	 * 後端分頁 Table
	 *
	 *
	 *
	 */
	fetchTable(option = {}) {

		let $this = this;

		let table = option.table || null;
		let url = option.url || null;
		let parameter = option.parameter || {};
		let thead = option.thead || [];
		let theadEach = option.theadEach || null;
		let tbody = option.tbody || [];
		let tbodyEach = option.tbodyEach || null;
		let pageNum = option.pageNum || 1;
		let pageSize = option.pageSize || 10;

		let config = $this.gridConfig();

		config.fetch = {};
		config.fetch.url = url;
		config.fetch.parameter = parameter;

		config.setTable(table);

		thead.forEach((i) => {
			config.addTheadMeta(i);
		});
		config.setTheadRendered(theadEach);

		tbody.forEach((i) => {
			config.addTbodyMeta(i);
		});

		config.setTbodyRendered(tbodyEach);

		config.setPagerEnabled(true);

		config.pager.pageNum = pageNum;
		config.pager.pageSize = pageSize;

		config.setTheadSorter(($grid, $th, key) => {

			$grid.data("orderby", "");
			$th.data("sort", "");
			let $sort = $("<i data-sort-default class='fas fa-sort'></i>");
			let $sortAsc = $("<i data-sort class='fas fa-sort-up' style='color:red'></i>").hide();
			let $sortDesc = $("<i data-sort class='fas fa-sort-down' style='color:red'></i>").hide();

			$th.append($sort).append($sortAsc).append($sortDesc);

			$th.click(() => {
				let sort = $th.data("sort");

				$("[data-sort]", $grid.$table).hide();
				$("[data-sort-default]", $grid.$table).show();
				$sort.hide();

				$("[data-sort]", $grid.$table).parent().data("sort", "");

				if (sort === "") {
					sort = "asc";
					$sortAsc.show();
				} else if (sort === "asc") {
					sort = "desc";
					$sortDesc.show();
				} else if (sort === "desc") {
					sort = "";
					$sort.show();
				}

				$th.data("sort", sort);

				let orderbys = [];

				if (sort) {
					if (Array.isArray(key)) {
						key.forEach((k) => {
							orderbys.push(k + " " + sort);
						});
					} else {
						orderbys.push(key + " " + sort);
					}
				}

				$grid.data("orderby", orderbys.join(","));

				$grid.renderer.tbody();
			});
		});

		config.setPagerFeed(($grid, callback) => {

			let pageNum = $grid.$gridConfig.pager.pageNum;
			let pageSize = $grid.$gridConfig.pager.pageSize;

			let orderby = $grid.data("orderby");

			let url = $grid.$gridConfig.fetch.url;
			let parameter = $.extend({}, $grid.$gridConfig.fetch.parameter, {
				pageNum: pageNum,
				pageSize: pageSize,
				orderby: orderby
			});

			$this.doPost({
				url: url,
				data: parameter,
				spinner: false,
				success: (result) => {
					$grid.$gridConfig.pager.pageNum = result.pageNum;
					$grid.$gridConfig.pager.pageSize = result.pageSize;
					$grid.$gridConfig.pager.totalSize = result.totalSize;
					callback(result.data);
				}
			})


		});

		return $this.grid(config);
	}

	/**
	 * 利用 Template 產生物件
	 * 
	 * 參數 option:
	 * target = Jquery 物件，會將產生完的物件加入進去
	 * mode =  加入的模式 append | prepend ， 預設值 append
	 * data = Json Array
	 * template = 支援3種物件 Jquery Object, Dom Object, Html String 
	 *            會將裡面的 @{key} 轉換成 data 的 value
	 *            使用方式:
	 *					1. template : $('#template')
	 *					2. template : "<div>@{name}</div>"
	 *					3. template : document.getElementById("template")
	 *
	 * itemEach = function，每一個物件產生完成後後觸發 itemEach : ($e, data) => { }
	 *
	 */
	template(option = {}) {
		let $this = this;

		let target = option.target;
		let mode = (option.mode || "append").toLowerCase();
		let data = option.data || [];
		let itemEach = option.itemEach || null;
		let template = $this.getHtmlString(option.template) || "";

		let itemEachIsFunction = typeof itemEach === 'function';

		data.forEach(function(dataItem) {

			let $e = $($this.tranPattern(template, dataItem));

			if (mode == 'prepend') {
				target.prepend($e);
			} else {
				target.append($e);
			}

			if (itemEachIsFunction) {
				itemEach($e, dataItem);
			}
		});
	}

	/** 判斷是否是移動裝置 */
	isMobileDevice() {
		if (/Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			return true;
		} else {
			return false;
		}
	}

	/** 隨機一個 UUID */
	randomUUID() {
		let d = Date.now();
		if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
			d += performance.now();
		}
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
			let r = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d / 16);
			return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
		});
	}

	/** 將物件轉換成 url 的 Querystring */
	objectToQuerystring(obj = {}) {
		return Object.keys(obj).filter((key) => obj[key] != undefined && obj[key] != '').reduce((str, key, i) => {
			let delimiter, val;
			delimiter = (i === 0) ? '?' : '&';
			if (Array.isArray(obj[key])) {
				key = encodeURIComponent(key);
				let arrayVar = obj[key].reduce((str, item) => {
					if (typeof item == "object") {
						val = encodeURIComponent(JSON.stringify(item));
					} else {
						val = encodeURIComponent(item);
					}
					return [str, key, '=', val, '&'].join('');
				}, '');
				return [str, delimiter, arrayVar.trimRightString('&')].join('');
			} else {
				key = encodeURIComponent(key);
				if (typeof obj[key] == "object") {
					val = encodeURIComponent(JSON.stringify(obj[key]));
				} else {
					val = encodeURIComponent(obj[key]);
				}
				return [str, delimiter, key, '=', val].join('');
			}
		}, '');
	}

	/** 取得物件的 html */
	getHtmlString(obj = null) {
		if (obj) {
			if (typeof obj === 'string') {
				return obj;
			} else if (obj instanceof jQuery) {
				return obj.get(0).outerHTML
			} else if (obj instanceof HTMLElement) {
				return obj.outerHTML;
			} else {
				return "";
			}
		} else {
			return "";
		}
	}

	/** 將字串的 @{key} 轉換成 item 的值 */
	tranPattern(text, item) {
		Object.keys(item).forEach((k) => {
			let key = "@{" + k + "}";
			while (text.includes(key)) {
				text = text.replace(key, item[k]);
			}
			key = "@{" + k + ":date}";
			while (text.includes(key)) {
				let dateTime = ('' + item[k]).trim();
				let replacement = dateTime;
				if (dateTime.length == 14) {
					let t = [];
					t.push(dateTime.substring(0, 4));
					t.push('/');
					t.push(dateTime.substring(4, 6));
					t.push('/');
					t.push(dateTime.substring(6, 8));
					t.push(' ');
					t.push(dateTime.substring(8, 10));
					t.push(':');
					t.push(dateTime.substring(10, 12));
					t.push(':');
					t.push(dateTime.substring(12, 14));
					replacement = t.join('');
				} else if (dateTime.length == 8) {
					let t = [];
					t.push(dateTime.substring(0, 4));
					t.push('/');
					t.push(dateTime.substring(4, 6));
					t.push('/');
					t.push(dateTime.substring(6, 8));
					t.push(' ');
					t.push(dateTime.substring(8, 10));
					t.push(':');
					t.push(dateTime.substring(10, 12));
					t.push(':');
					t.push(dateTime.substring(12, 14));
					replacement = t.join('');
				}
				text = text.replace(key, replacement);
			}

			key = "@{" + k + ":time}";
			while (text.includes(key)) {
				let dateTime = ('' + item[k]).trim();
				let replacement = dateTime;
				if (dateTime.length == 6) {
					let t = [];
					t.push(dateTime.substring(0, 2));
					t.push(':');
					t.push(dateTime.substring(2, 4));
					t.push(':');
					t.push(dateTime.substring(4, 6));
					replacement = t.join('');
				} else if (dateTime.length == 9) {
					let t = [];
					t.push(dateTime.substring(0, 2));
					t.push(':');
					t.push(dateTime.substring(2, 4));
					t.push(':');
					t.push(dateTime.substring(4, 6));
					t.push('.');
					t.push(dateTime.substring(6, 9));
					replacement = t.join('');
				}
				text = text.replace(key, replacement);
			}
		});
		return text;
	}

}

var dark = new Dark(document);