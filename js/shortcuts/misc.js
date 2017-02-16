core.register_shortcut(new function() {
	this.ctrlKey = false;
	this.shiftKey = false;
	this.key = 80;

	this.run = function() {
		core.preview = !core.preview;
		core.update_tools();
		core.draw();
		return true;
	};
}());

core.register_shortcut(new function() {
	this.ctrlKey = false;
	this.shiftKey = true;
	this.key = 65;

	this.run = function() {
		var s = core.get_selected_shape();
		if(s) {
			s.path.arc = !s.path.arc;
			core.update_tools();
			core.draw();
		}
	};
}());

core.register_shortcut(new function() {
	this.ctrlKey = false;
	this.shiftKey = true;
	this.key = 67;

	this.run = function() {
		var s = core.get_selected_shape();
		if(s) {
			s.path.curve = !s.path.curve;
			core.update_tools();
			core.draw();
		}
	};
}());
