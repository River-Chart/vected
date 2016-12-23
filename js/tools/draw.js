core.register_tool(new function() {
	this.title = "draw";
	this.selected_point = -1;
	
	this.mousedown = function(e) {
		var s = core.get_selected_shape();
		if(s && !e.shiftKey) {
			if(e.which == 1) {
				s.push({
					x : core.mouseX - s.position.x,
					y : core.mouseY - s.position.y
				});
			} else {
				if(s.path.points.length > 0) {
					s.path.points.pop();
				} else {
					core.project.shapes.splice(core.project.selected_shape, 1);
				}
			}
			
			this.selected_point = s.path.points.length-1;
			
			core.draw();
			core.update_tools();
		} else {
			var my_shape = new shape([]);
			my_shape.position = {
				x : core.mouseX,
				y : core.mouseY
			};
			core.project.push(my_shape);
			core.project.select(core.project.shapes.length - 1);
			
			this.selected_point = -2;
			
			core.draw();
			core.update_tools();
		}
	};
	
	this.mousemove = function() {
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
	
	this.mouseup = function() {
		this.selected_point = -1;
	};
}());
