var MODE_NONE = 0;
var MODE_MOVE_POINT = 1;
var MODE_MOVE_SHAPE = 2;
var MODE_SELECT = 3;

core.tool_edit = (new function() {
	this.title = "Edit";
	this.draw_points = true;
	this.mode = MODE_MOVE_POINT;

	this.selected_point = -1;

	this.selection = {
		start : {x:0, y:0},
		end : {x:0, y:0},

		points : []
	};

	this.draw = function () {
		if (this.mode == MODE_SELECT) {
			ctx.lineWidth = 2/core.viewport.zoom;
			ctx.strokeStyle = "#ddaa55";

			ctx.strokeRect (
				this.selection.start.x, this.selection.start.y,
				this.selection.end.x-this.selection.start.x, this.selection.end.y-this.selection.start.y
			);
		}
	};

	this.mousedown = function(e) {
		if(e.which == 1) {
			core.select_shape(-1);

			for(var i = 0; i < core.project.shapes.length; i++) {
				var my_shape = core.project.shapes[i];

				if(utils.dist(core.mouseX_raw, core.mouseY_raw,
						my_shape.position.x, my_shape.position.y) < 10/core.viewport.zoom) {
					this.selected_point = -2;
					this.mode = MODE_MOVE_SHAPE;
					core.select_shape(i);
					core.update_tools();
					return;
				}

				for(var j = 0; j < my_shape.path.points.length; j++) {
					var p = my_shape.path.points[j];

					if(utils.dist(core.mouseX_raw, core.mouseY_raw,
							p.x + my_shape.position.x, p.y + my_shape.position.y) < 10/core.viewport.zoom) {
						this.selected_point = j;
						this.mode = MODE_MOVE_POINT;
						core.select_shape(i);
						core.update_tools();
						return;
					}
				}
			}

			this.mode = MODE_SELECT;
			this.selection.start = { x:core.mouseX_raw, y:core.mouseY_raw };
		}

		core.update_tools();
	};

	this.mousemove = function(e) {
		if (this.mode == MODE_SELECT) {
			this.selection.end = { x:core.mouseX_raw, y:core.mouseY_raw };
		} else if(this.selected_point != -1) {
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
			if (this.mode == MODE_SELECT) {
				// TODO
			}

			this.mode = MODE_NONE;
			this.selected_point = -1;
		}

		core.update_tools();
	};
}());
