core.register_tool(new function() {
	this.title = "pencil";
	
	this.pmouseX = 0;
	this.pmouseY = 0;
	
	this.distance = 0;
	
	this.mousedown = function(e) {
		if(e.which == 1) {
			var my_shape = new shape([]);
			my_shape.position = {
				x : core.mouseX,
				y : core.mouseY
			};
			
			my_shape.style.draw_fill = false;
			my_shape.path.curve = true;
			
			core.project.push(my_shape);
			core.project.select(core.project.shapes.length - 1);
			
			s.push({
				x : 0,
				y : 0
			});
		
			core.draw();
			core.update_tools();
		}
	};
	
	this.mousemove = function(e) {
		if(core.mouse_pressed[1]) {
			this.distance += utils.dist(this.pmouseX, this.pmouseY, core.mouseX, core.mouseY);
		
			var s = core.get_selected_shape();
			
			if(this.distance > 10) {
				s.push({
					x : core.mouseX - s.position.x,
					y : core.mouseY - s.position.y
				});
				
				this.distance = 0;
			}
			
			core.draw();
		}
		
		this.pmouseX = core.mouseX;
		this.pmouseY = core.mouseY;
	};
	
	this.mouseup = function(e) {
		if(e.which == 1) {
			
			core.draw();
			core.update_tools();
		}
	};
}());
