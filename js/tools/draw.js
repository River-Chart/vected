core.register_tool(new function() {
	this.title = "draw";
	
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
			
			core.draw();
		} else {
			var my_shape = new shape([]);
			my_shape.position = {
				x : core.mouseX,
				y : core.mouseY
			};
			core.project.push(my_shape);
			core.project.select(core.project.shapes.length - 1);
			
			core.draw();
		}
	};
}());
