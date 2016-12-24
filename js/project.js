function project() {
	this.shapes = [];
	this.selected_shape = -1;
	
	this.push = function(obj) {
		this.shapes.push(obj);
	};
	
	this.draw = function(draw_points) {
		for(var i = 0; i < this.shapes.length; i++) {
			this.shapes[i].draw();
			if(draw_points) {
				this.shapes[i].draw_points();
			}
		}
	};
	
	this.select = function(s) {
		this.selected_shape = s;
	};
}
