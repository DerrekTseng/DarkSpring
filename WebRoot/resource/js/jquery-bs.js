$.fn.extend({
	bs: function() {
		let $this = this;
		return {
			dropdown: () => {
				return bootstrap.Dropdown.getInstance($this[0]);
			},
			modal: (options = {}) => {
				let $modal = bootstrap.Modal.getOrCreateInstance($this[0]);
				bootstrap.Modal.getOrCreateInstance($this[0])._config = $.extend({}, bootstrap.Modal.getOrCreateInstance($this[0])._config, options);
				return $modal;
			}
		}
	}
});