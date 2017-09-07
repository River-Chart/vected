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
				this.shapes[i].draw_points(this.selected_shape == i);
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
	};

	this.save = function() {
		var data = JSON.stringify(this.shapes);
		data = "data:text/plain;charset=utf-8," + encodeURIComponent(data);
		utils.save_data_url("img.vected", data);
	};

	this.load = function() {
		var d = prompt("Data");
		if(d) {
			var data = JSON.parse(d);
			this.shapes = [];

			for(var it = 0; it < data.length; it++) {
				var my_shape = new shape();

				my_shape.position = data[it].position;
				my_shape.path = data[it].path;
				my_shape.style = data[it].style;

				this.shapes.push(my_shape);
			}
			core.draw();
		}
	};

	this.export = function() {
		var data = canvas.toDataURL("image/png");
		utils.save_data_url("export.png", data);
	}
}
