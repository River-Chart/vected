core.register_tool(new function() {
	this.title = "snap";
	
	this.select = function() {
		core.snap = !core.snap;
		if(core.snap) {
			this.title = "snap [on]";
		} else {
			this.title = "snap [off]";
		}
		
		core.update_tools();
	};
}());
