core.tool_edit = (new function() {
	this.title = "Edit";
	this.draw_points = true;
	this.selected_point = -1;

	this.mousedown = function(e) {
		if(e.which == 1) {
			core.select_shape(-1);

			for(var i = 0; i < core.project.shapes.length; i++) {
				var my_shape = core.project.shapes[i];

				if(utils.dist(core.mouseX_raw, core.mouseY_raw,
						my_shape.position.x, my_shape.position.y) < 10) {
					this.selected_point = -2;
					core.select_shape(i);
				}

				for(var j = 0; j < my_shape.path.points.length; j++) {
					var p = my_shape.path.points[j];

					if(utils.dist(core.mouseX_raw, core.mouseY_raw,
							p.x + my_shape.position.x, p.y + my_shape.position.y) < 10) {
						this.selected_point = j;
						core.select_shape(i);
					}
				}
			}
		}

		core.update_tools();
	};

	this.mousemove = function(e) {
		if(this.selected_point != -1) {
			var s = core.get_selected_shape();
			if(this.selected_point == -2) {
				s.position = {
					x : core.mouseX,
					y : core.mouseY
				};
			} else {
				s.path.points[this.selected_point] = {
					x : core.mouseX - s.position.x,
					y : core.mouseY - s.position.y
				};
			}
		}

		core.draw();
	};

	this.mouseup = function(e) {
		if(e.which == 1) {
			this.selected_point = -1;
		}

		core.update_tools();
	};
}());
