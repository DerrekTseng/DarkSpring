class darkspring {

	constructor(top, document) {
		this.top = top;
		this.document = document;
	}

	/** 取得當前的 Document */
	currentDocument() {
		if (this.top.DarkSpring === this) {
			return this.top.DarkSpring.document;
		} else {
			return this.document;
		}
	}

	/** 將 element 加入至 top-object-container */
	appendToTopObjectContainer($element) {
		$('#top-object-container', this.top.DarkSpring.document).append($element);
	}

	/** 取得 index-template.jsp 中的模板 */
	getIndexTemplate(selector) {
		let document = this.top.DarkSpring.document;
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
		let $prompt = this.getIndexTemplate("[data-index-template-info]");
		this.prompt(message, $prompt, 1500);
	}

	success(message) {
		let $prompt = this.getIndexTemplate("[data-index-template-success]");
		this.prompt(message, $prompt, 1500);
	}

	warning(message) {
		let $prompt = this.getIndexTemplate("[data-index-template-warning]");
		this.prompt(message, $prompt, 1500);
	}

	error(message) {
		let $prompt = this.getIndexTemplate("[data-index-template-error]");
		this.prompt(message, $prompt, 3000);
	}

	prompt(message, $prompt, dismiss) {
		message = message || "";
		dismiss = isNaN(dismiss) ? 3000 : dismiss;
		$('span', $prompt).html(message);

		this.appendToTopObjectContainer($prompt);

		const timeout = this.top.window.setTimeout(() => {
			$prompt.fadeOut(500, () => $prompt.remove());
		}, dismiss);

		$('button', $prompt).click(() => {
			this.top.window.clearTimeout(timeout);
			$prompt.fadeOut(500, () => $prompt.remove());
		});

	}

	dialog(option = {}, $content = "") {

		let title = option.title || "";
		let width = option.width || "60vw";
		let height = option.height || "50vh";

		let shader = option.shader === false ? false : true;
		let resize = option.resize === true ? true : false;
		let maximize = option.maximize === true ? true : false;
		let minimize = option.minimize === true ? true : false;
		let move = option.move === true ? true : false;
		let callback = option.callback || null;

		let $dialogComponent = this.getIndexTemplate("[data-index-template-dialog-component]");
		let $shader = $("[data-index-template-shader]", $dialogComponent);
		let $dialog = $("[data-index-template-dialog]", $dialogComponent);

		$dialog.css({
			width: width,
			height: height
		});

		$('.dark-spring-dialog-header-text', $dialog).html(title);

		if ($content) {
			$('.dark-spring-dialog-content', $dialog).append($content);
		}

		if (!shader) {
			$shader.remove();
		}

		if (resize) {

		} else {
			$(".dark-spring-dialog-resize-top", $dialog).remove();
			$(".dark-spring-dialog-resize-right", $dialog).remove();
			$(".dark-spring-dialog-resize-left", $dialog).remove();
			$(".dark-spring-dialog-resize-bottom", $dialog).remove();
			$(".dark-spring-dialog-resize-top-right", $dialog).remove();
			$(".dark-spring-dialog-resize-top-left", $dialog).remove();
			$(".dark-spring-dialog-resize-bottom-right", $dialog).remove();
			$(".dark-spring-dialog-resize-bottom-left", $dialog).remove();
		}

		if (minimize) {

		} else {
			$("[data-index-template-dialog-minimize]", $dialog).remove();
		}

		if (maximize) {

		} else {
			$("[data-index-template-dialog-normalize]", $dialog).remove();
			$("[data-index-template-dialog-maximize]", $dialog).remove();
		}

		if (move) {

		} else {
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


}

var DarkSpring = new darkspring(top, document);