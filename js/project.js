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

	this.move_shape = function(from, to) {
		if(from < 0) {
			return;
		}

		if(to < 0 || to > this.shapes.length-1) {
			return;
		}

		var my_shape = this.shapes.splice(from, 1)[0];
		this.shapes.splice(to, 0, my_shape);

		this.selected_shape = to;

		console.log(this.shapes);
	}
}
