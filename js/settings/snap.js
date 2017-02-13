core.register_setting(new function() {
	this.title = "snap";

	this.get_input = function(i) {
		var str = "<input type=\"checkbox\" onchange=\"core.settings[" + i + "].change(this);\" " + (core.snap ? "checked=\"checked\"" : "") + "></input>"
		return str;
	};

	this.change = function(v) {
		core.snap = v.checked;
		core.update_tools();
	};
}());

core.register_setting(new function() {
	this.title = "grid size";

	this.get_input = function(i) {
		//console.log("hello");
		var str = "<input type=\"number\" onchange=\"core.settings[" + i + "].change(this);\" value=\"" + core.grid_size  + "\"></input>";
		return str;
	};

	this.change = function(v) {
		core.grid_size = parseInt(v.value);
		if(core.grid_size < 1) {
			core.grid_size = 1;
		}
		core.update_tools();
	};
}());
