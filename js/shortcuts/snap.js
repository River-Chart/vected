core.register_shortcut(new function() {
	this.ctrlKey = false;
	this.shiftKey = false;
	this.key = 83;

	this.run = function() {
		core.snap = !core.snap;
		core.update_tools();
		return true;
	};
}());

core.register_shortcut(new function() {
	this.ctrlKey = false;
	this.shiftKey = false;
	this.key = 81;

	this.run = function() {
		if((core.grid_size / 2) % 1 == 0) {
			core.grid_size = core.grid_size / 2;
		}
		core.update_tools();
		return true;
	};
}());

core.register_shortcut(new function() {
	this.ctrlKey = false;
	this.shiftKey = false;
	this.key = 87;

	this.run = function() {
		core.grid_size = core.grid_size * 2;
		core.update_tools();
		return true;
	};
}());
