$.fn.extend({
	bs: function() {
		let $this = this;
		return {
			dropdown: () => {
				if (!$this.$dropdown) {
					$this.$dropdown = new bootstrap.Dropdown($this[0]);
				}
				return {
					show: () => {
						$this.$dropdown.show();
					},
					hide: () => {
						$this.$dropdown.hide();
					},
					toggle: () => {
						$this.$dropdown.toggle();
					},
					update: () => {
						$this.$dropdown.update();
					}
				}
			},
			modal: (option) => {
				if (!$this.$modal) {
					$this.$modal = new bootstrap.Modal($this[0], option);
				}
				return {
					show: (relatedTarget) => {
						$this.$modal.show(relatedTarget);
					},
					hide: () => {
						$this.$modal.hide();
					},
					toggle: () => {
						$this.$modal.toggle();
					},
					handleUpdate: () => {
						$this.$modal.handleUpdate();
					},
					dispose: () => {
						$this.$modal.dispose();
					}
				}
			}
		}
	}
});