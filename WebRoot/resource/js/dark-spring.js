class darkspring {

	constructor(document) {
		this.document = document;
		this.fading = 300;
	}

	/** 將 element 加入至 top-object-container */
	appendToTopObjectContainer($element) {
		$element.appendTo($('#top-object-container', top.DarkSpring.document));
	}

	/** 取得 index-template.jsp 中的模板 */
	getIndexTemplate(selector) {
		return $(selector, $('#index-template', top.DarkSpring.document)).clone(false);
	}

	spinner(show) {
		if (show) {
			$('#spinner', this.document).addClass('show');
		} else {
			$('#spinner', this.document).removeClass('show');
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

	doDownolad(option = {}) {
		let url = option.url || "";
		let data = option.data || {};
		let urlQueryString = url + this.objectToQuerystring(data);
		let $a = document.createElement("a");
		$a.setAttribute("href", urlQueryString);
		$a.setAttribute("download", "");
		$a.click();
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
		if (this === top.DarkSpring) {
			let $this = this;
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

		} else {
			top.DarkSpring.prompt(message, $prompt, dismiss);
		}
	}

	dialog(option = {}, $content = "") {
		if (this === top.DarkSpring) {
			let $this = this;

			let title = option.title || "";
			let width = option.width || "300px";
			let height = option.height || "200px";

			let shader = option.shader === true ? true : false;
			let resize = option.resize === true ? true : false;
			let maximize = option.maximize === true ? true : false;
			let minimize = option.minimize === true ? true : false;
			let movable = option.movable === true ? true : false;
			let callback = option.callback || null;

			let $dialogComponent = $this.getIndexTemplate("[data-index-template-dialog-component]");
			let $shader = $("[data-index-template-shader]", $dialogComponent);
			let $dialog = $("[data-index-template-dialog]", $dialogComponent);
			let $contentContainer = $(".dark-spring-dialog-content", $dialog);

			let toolbarSize = 106;

			if (parseInt(width) > $(top).width()) {
				width = $(top).width() + "px";
			}

			if (parseInt(height) > $(top).height()) {
				height = $(top).height() + "px";
			}

			$dialog.data("defaultWidth", width);
			$dialog.data("defaultHeight", height);

			$dialog.css({
				width: width,
				height: height,
				margin: $this.marginString(
					($(top).height() / 2 - parseInt(height) / 2) + "px",
					($(top).width() / 2 - parseInt(width) / 2) + "px",
					($(top).height() / 2 - parseInt(height) / 2) + "px",
					($(top).width() / 2 - parseInt(width) / 2) + "px"
				)
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

						$contentContainer.hide();

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

					$dialog.animate({
						width: width,
						height: height,
						inset: '0px',
						margin: $this.marginString(
							($(top).height() / 2 - parseInt(height) / 2) + "px",
							($(top).width() / 2 - parseInt(width) / 2) + "px",
							($(top).height() / 2 - parseInt(height) / 2) + "px",
							($(top).width() / 2 - parseInt(width) / 2) + "px"
						)
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

					$dialog.animate({
						width: '100%',
						height: $this.isMobileDevice() ? "-webkit-fill-available" : "100vh",
						inset: '0px',
						margin: $this.marginString("0px", "0px", "0px", "0px")
					}, 500, () => {
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

				$dialog.movable = function(enabled) {

					let $header = $(".dark-spring-dialog-header-title", $dialog);

					function resolveMoving(mousemoveX, mousemoveY) {

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

								resolveMoving(mousemoveX, mousemoveY);

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

								resolveMoving(mousemoveX, mousemoveY);

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
				$dialog.movable = function() { };
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

			this.appendToTopObjectContainer($dialogComponent);

			$('.dark-spring-dialog-header-title', $dialog).css({
				width: "calc( 100% - " + toolbarSize + "px )"
			});

			$('.dark-spring-dialog-header-toolbar', $dialog).css({
				width: (toolbarSize - 8) + "px"
			});

			return $dialogComponent;
		} else {
			return top.DarkSpring.dialog(option, $content);
		}
	}

	alert(option = {}) {

		let title = option.title || "";
		let message = option.message || "";
		let width = option.width;
		let height = option.height;
		let callback = option.callback;

		let dialogOption = {
			title: title,
			width: width,
			height: height,
			shader: true,
			resize: true,
			maximize: false,
			minimize: false,
			movable: true,
			callback: function(callbackData) {
				if (typeof callback === 'function') {
					callback(callbackData);
				}
			}
		}

		let $content = this.getIndexTemplate("[data-index-template-dialog-alert]");

		$('[data-index-template-dialog-alert-message]', $content).html(message);

		let $dialogComponent = this.dialog(dialogOption, $content);

		$('[data-index-template-dialog-alert-close]', $content).click(() => {
			$dialogComponent.doClose();
		});

	}

	confirm(option = {}) {
		let title = option.title || "";
		let message = option.message || "";
		let width = option.width;
		let height = option.height;
		let callback = option.callback;

		let dialogOption = {
			title: title,
			width: width,
			height: height,
			shader: true,
			resize: true,
			maximize: false,
			minimize: false,
			movable: true,
			callback: function(callbackData) {
				if (typeof callback === 'function') {
					callback(callbackData);
				}
			}
		}

		let $content = this.getIndexTemplate("[data-index-template-dialog-confirm]");

		$('[data-index-template-dialog-confirm-message]', $content).html(message);

		let $dialogComponent = this.dialog(dialogOption, $content);

		$dialogComponent.data("callbackData", false);

		$('[data-index-template-dialog-confirm-cancel]', $content).click(() => {
			$dialogComponent.doClose();
		});

		$('[data-index-template-dialog-confirm-accept]', $content).click(() => {
			$dialogComponent.data("callbackData", true);
			$dialogComponent.doClose();
		});

	}

	window(option = {}) {
		let title = option.title || "";
		let url = option.url || "";
		let width = option.width;
		let height = option.height;
		let callback = option.callback;
		let shader = option.shader === false ? false : true;
		let resize = option.resize === false ? false : true;
		let maximize = option.maximize === false ? false : true;
		let minimize = option.minimize === false ? false : true;
		let movable = option.movable === false ? false : true;

		let dialogOption = {
			title: title,
			width: width,
			height: height,
			shader: shader,
			resize: resize,
			maximize: maximize,
			minimize: minimize,
			movable: movable,
			callback: function(callbackData) {
				if (typeof callback === 'function') {
					callback(callbackData);
				}
			}
		}

		let $content = this.getIndexTemplate("[data-index-template-dialog-window]");

		let uuid = this.randomUUID();

		$content.attr("src", url);

		let $dialogComponent = this.dialog(dialogOption, $content);

		$dialogComponent.attr('id', uuid);

		$dialogComponent.data("doCloseCallback", function(callbackData) {
			$dialogComponent.data("callbackData", callbackData);
			$dialogComponent.doClose();
		});

		$content.on("load", () => {
			let $iframeBody = $content.contents().find('body');
			let doCloseScript = [];
			doCloseScript.push("<script>");
			doCloseScript.push("function doCloseWindow(callbackData) {");
			doCloseScript.push("DarkSpring.closeWindow('" + uuid + "', callbackData);");
			doCloseScript.push("}");
			doCloseScript.push("</script>");
			$iframeBody.append($(doCloseScript.join(" ")));
		});
	}

	closeWindow(uuid, callbackData) {
		if (this === top.DarkSpring) {
			$('#' + uuid, top.document).data("doCloseCallback")(callbackData);
		} else {
			top.DarkSpring.closeWindow(uuid, callbackData);
		}
	}

	grid(config) {

		let $table = config.table || null;

		if (!$table) {
			throw "table cannot be null";
		}


		/////  thead theads 二選一 
		// 單一 header 
		let thead = config.thead || null;
		/* 格式
		[
			{ 
				tag: "td 或 th 預設為 th",
				content : "要放入的東西 可以是 String、JQuery 物件、DOM 物件",
				sort : 點擊後會傳入 sort() 裡面進行排序
				attrs : { 其他屬性 }
			 },
			 {
				同上	
			 }
		]
		*/
		// 多個 header
		let theads = config.theads || null;
		/* 格式
		[
			[ 同上方 thead 格式 ],
			[ 同上方 thead 格式 ],
		]
		*/

		if (thead && theads) {
			throw "thead and theads cannot be set together";
		}


		/////  tbody tbodys 二選一 與 thead和theads 類似 沒有 sort 但 content可以用@{key} 來進行替換
		let tbody = config.tbody || null;
		let tbodys = config.tbodys || null;

		if (tbody && tbodys) {
			throw "tbody and tbodys cannot be set together";
		}


		// 渲染 tr
		let render = config.render || {};
		/* 格式 未標記則忽略
			{
				thead : ($thead) => {},
				tbody : ($tbody, data) => {}
			}
		*/

		// 要如何處理資料
		let resolve = config.resolve || {};
		/* 格式
			{
				data : [ json 陣列，為 null 則，必須要定義 page ]
				page : { // data 為 null 則會直接觸發 onPage
					pageNum : 1,
					pageSize: 10,
					onPage : (pageNum, pageSize, data, sort) => { return } // 當上方 data 不為 null 時，這裡的 data 才會有值
																   // sort 為 JSON 物件 { key : "", direction : " '' 或 'asc' 或 'desc' " }
																   // 必須要 return { data: 資料, size: 總頁數 } 會呼叫  render.tbody 進行渲染
																    
				},
				filter : (pageNum, pageSize, data, sort, filter) => { return } // 當呼叫 $grid.filter(key, value) 時，會調用此method 
																			  //  前段參數與 resolve.page.onPage 相同
																			  // filter 則為 json 物件 { key:"", value:"" }
																			  // 必須要 return JSON陣列 會呼叫  render.tbody 進行渲染
				
			}
		 */

		$table.empty();

		let $thead = $("<thead>");
		let $tbody = $("<tbody>");
		$table.append($thead);
		$table.append($tbody);

		$table = $table.extend({
			_data: resolve.data,
			_treach: render.tbody,
			_isPage: resolve.page ? true : false,
			_pageNum: resolve.page ? resolve.page.pageNum : 1,
			_pageSize: resolve.page ? resolve.page.pageSize : 10,
			_totalSize: resolve.page ? 0 : null,
			_sortKey: "",
			_sortDir: "",
			_onPage: resolve.page ? resolve.page.onPage : null,
			_onFilter: resolve.filter,
			_tranPattern: (text, item) => {
				Object.keys(item).forEach(function(k) {
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
			},
			_getHtmlString: (obj = null) => {
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
			},
			_bindTbodyItems: (items, resultData) => {
				let $this = this;
				let $items = [];
				items.forEach((item) => {
					let $tItem = $("<" + (item.tag || "td") + ">");
					if (item.content) {
						$tItem.append($this.tranPattern($this.getHtmlString(item.content), resultData));
					}
					if (typeof item.attrs === "object") {
						Object.keys(item.attrs).forEach((key) => {
							$tItem.attr(key, item.attrs[key]);
						});
					}
					$items.push(($tItem));
				});
				return $items;
			},
			_bindTbodyResultData: (resultData) => {
				let $this = this;
				resultData.forEach((item) => {
					if (tbody) {
						let $tr = $("<tr>");
						let $tds = $this.bindTbodyItems(tbody, item);
						$tds.forEach((td) => {
							$tr.append(td);
						});
						if (typeof render.tbody === "function") {
							render.tbody($tr, item);
						}
						$tbody.append($tr);
					} else if (tbodys) {
						let $trs = [];
						tbodys.forEach((tbody) => {
							let $tr = $("<tr>");
							let $tds = $this.bindTbodyItems(tbody, item);
							$tds.forEach((td) => {
								$tr.append(td);
							});
							$trs.push($tr);
						});
						if (typeof render.tbody === "function") {
							render.tbody($trs, item);
						}
						$trs.forEach((tr) => {
							$tbody.append(tr);
						});
					} else {
						throw "One of the tbody and tbodys must be set";
					}
				});
			},
			_doBody: () => {
				$tbody.empty();
				if (this._data === null && this._isPage) {
					let resultData = this._onPage(this._pageNum, this._pageSize, null, { key: this._sortKey, direction: this._sortDir });
					this.bindTbodyResultData(resultData.data);
					this._totalSize = resultData.size;
				} else if (typeof this._data === "object" && this._isPage) {
					let resultData = this._onPage(this._pageNum, this._pageSize, this._data, { key: this._sortKey, direction: this._sortDir });
					this.bindTbodyResultData(resultData.data);
					this._totalSize = resultData.size;
				} else if (typeof this._data === "object") {
					this.bindTbodyResultData(this._data);
				} else if (this._data === null && !this._isPage) {
					throw "resolve.page must be set";
				}
			},
			_bindTheadItems: (items) => {
				let $this = this;
				let $items = [];
				items.forEach((item) => {
					let $tItem = $("<" + (item.tag || "th") + ">");
					if (item.content) {
						$tItem.append(item.content);
					}
					if (item.sort) {
						// TODO 要 append 排序圖示
						$tItem.click(() => {
							$this._sortKey = item.sort;
							$this._sortDir = ""; // 判斷當前欄位順序
							// 清除所有欄位順序

							$this._doBody();
						});
					}
					if (typeof item.attrs === "object") {
						Object.keys(item.attrs).forEach((key) => {
							$tItem.attr(key, item.attrs[key]);
						});
					}
					$items.push(($tItem));
				});
				return $items;
			},
			_doHead: () => {
				let $this = this;
				if (thead) {
					let $theadTr = $("<tr>");
					let $items = $this.bindTheadItems(thead);
					$items.forEach((item) => {
						$theadTr.append(item);
					});
					if (typeof render.thead === "function") {
						render.thead($theadTr);
					}
					$thead.append($theadTr);
				} else if (theads) {
					let $theadTrs = [];
					theads.forEach((thead) => {
						let $theadTr = $("<tr>");
						let $items = $this.bindTheadItems(thead);
						$items.forEach((item) => {
							$theadTr.append(item);
						});
						$theadTrs.push($theadTr);
					});
					if (typeof render.thead === "function") {
						render.thead($theadTrs);
					}
					$theadTrs.forEach((theadTr) => {
						$thead.append(theadTr);
					});
				} else {
					throw "One of the thead and theads must be set";
				}
			},
			_doPager: () => {
				if (this._isPage) {
					// let $pager = DarkSpring.getIndexTemplate("[pager]"); // TODO





					// this.append($pager);
				}
			}
		});

		$table._doHead();
		$table._doBody();
		$table._doPager();

		return $table;
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

	marginString(top, right, bottom, left) {
		let margins = [];
		margins.push(top.trim());
		margins.push(right.trim());
		margins.push(bottom.trim());
		margins.push(left.trim());
		return margins.join(" ");
	}

	randomUUID() {
		let d = Date.now();
		if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
			d += performance.now();
		}
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			let r = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d / 16);
			return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
		});
	}

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

}

var DarkSpring = new darkspring(document);