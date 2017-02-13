core.register_shortcut(new function() {
	this.ctrlKey = false;
	this.shiftKey = false;
	this.key = 88;

	this.run = function() {
		var s = core.get_selected_shape();
		if(s && s.path.points.length > 0) {
			s.path.points.pop();
			core.draw();
			return true;
		}
	};
}());

core.register_shortcut(new function() {
	this.ctrlKey = false;
	this.shiftKey = true;
	this.key = 88;

	this.run = function() {
		var s = core.get_selected_shape();
		if(s) {
			core.project.shapes.splice(core.project.selected_shape, 1);
			core.draw();
			return true;
		}
	};
}());
