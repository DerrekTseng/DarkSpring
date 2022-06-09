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
			beforeSend: function(jqXHR, settings) {
				if (typeof beforeSend === "function") {
					if (beforeSend(jqXHR, settings)) {
						return true;
					} else {
						if (spinner) {
							$this.spinner(false);
						}
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

			if (!shadow) {
				$shadow.remove();
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
			shadow: true,
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
			shadow: true,
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

	grid(gridConfig = this.gridConfig()) {
		class Grid {
			constructor(gridConfig) {
				let $this = this;

				$this.$gridConfig = gridConfig;
				$this.list = [];
				$this._data = new Map();

				$this.$table = $this.$gridConfig.table;
				$this.$title = $("<caption align='top' class='container-fluid'>");
				$this.$spinner = DarkSpring.getIndexTemplate("[data-index-template-table-spinner]");
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
									$td.html(DarkSpring.tranPattern(DarkSpring.getHtmlString(item.content), listItem));
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
								$this.$gridConfig.tbody.rendered($trs);
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
						tbodyListCallback($this.$gridConfig.data);
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

					$("[data-pager-num]", $this.$pager).val(pageNum);

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
					} else {
						$("[data-pager-next]", $this.$pager).attr('disabled', false);
						$("[data-pager-last]", $this.$pager).attr('disabled', false);
					}

					if (pageCount <= 1) {
						$("[data-pager-num]", $this.$pager).attr('disabled', true);
					} else {
						$("[data-pager-num]", $this.$pager).attr('disabled', false);
					}

				}

				$this.renderer.pagerEvent = () => {
					let $pager = DarkSpring.getIndexTemplate("[data-index-template-table-pager]");
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

	tableDefaultSorter() {
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
							key.forEach(function(item) {
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
					}).forEach(function(item) {
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

	table(option = {}) {

		let table = option.table || null;
		let data = option.data || [];
		let thead = option.thead || [];
		let theadEach = option.theadEach || null;
		let tbody = option.tbody || [];
		let tbodyEach = option.tbodyEach || null;

		let config = this.gridConfig();

		config.setTable(table);
		config.setData(data);
		thead.forEach((i) => {
			config.addTheadMeta(i);
		});
		config.setTbodyRendered(theadEach);

		tbody.forEach((i) => {
			config.addTbodyMeta(i);
		});

		config.setTbodyRendered(tbodyEach);

		config.setTheadSorter(this.tableDefaultSorter());
		return this.grid(config);
	}

	pageTable(option = {}) {
		let table = option.table || null;
		let data = option.data || [];
		let thead = option.thead || [];
		let theadEach = option.theadEach || null;
		let tbody = option.tbody || [];
		let tbodyEach = option.tbodyEach || null;
		let pageNum = option.pageNum || 1;
		let pageSize = option.pageSize || 10;

		let config = this.gridConfig();

		config.setTable(table);
		config.setData(data);
		thead.forEach((i) => {
			config.addTheadMeta(i);
		});
		config.setTbodyRendered(theadEach);

		tbody.forEach((i) => {
			config.addTbodyMeta(i);
		});

		config.setTbodyRendered(tbodyEach);

		config.setTheadSorter(this.tableDefaultSorter());

		config.setPagerEnabled(true);

		config.pager.pageNum = pageNum;
		config.pager.pageSize = pageSize;
		config.pager.totalSize = data.length;

		config.setPagerFeed(($grid, callback) => {

			let pageNum = $grid.$gridConfig.pager.pageNum;
			let pageSize = $grid.$gridConfig.pager.pageSize;
			let totalSize = $grid.$gridConfig.pager.totalSize;

			let sliceStart = (pageNum - 1) * pageSize;
			let sliceEnd = sliceStart + pageSize;
			if (sliceEnd > totalSize - 1) {
				sliceEnd = totalSize;
			}
			callback($grid.$gridConfig.data.slice(sliceStart, sliceEnd));
		});

		return this.grid(config);;
	}

	fetchTable(option = {}) {
		let table = option.table || null;
		let url = option.url || null;
		let parameter = option.parameter || {};
		let thead = option.thead || [];
		let theadEach = option.theadEach || null;
		let tbody = option.tbody || [];
		let tbodyEach = option.tbodyEach || null;
		let pageNum = option.pageNum || 1;
		let pageSize = option.pageSize || 10;

		let config = this.gridConfig();

		config.fetch = {};
		config.fetch.url = url;
		config.fetch.parameter = parameter;

		config.setTable(table);

		thead.forEach((i) => {
			config.addTheadMeta(i);
		});
		config.setTbodyRendered(theadEach);

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

			DarkSpring.doPost({
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

		return this.grid(config);
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

	tranPattern(text, item) {
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
	}

}

var DarkSpring = new darkspring(document);