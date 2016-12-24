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
