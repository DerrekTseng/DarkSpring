$.fn.extend({
	bs: function () {
		let $this = this;
		return {
			dropdown: () => {
				return {
					show: () => {
						(new bootstrap.Dropdown($this[0]).show());
					},
					hide: () => {
						(new bootstrap.Dropdown($this[0]).hide());
					}
				}
			},
		}
	}
});