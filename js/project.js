function project() {
	this.shapes = [];
	this.selected_shape = -1;
	
	this.push = function(obj) {
		this.shapes.push(obj);
	};
	
	this.draw = function() {
		for(var i = 0; i < this.shapes.length; i++) {
			this.shapes[i].draw();
			this.shapes[i].draw_points();
		}
	};
	
	this.select = function(s) {
		this.selected_shape = s;
	};
}
