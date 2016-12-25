core.register_tool(new function() {
	this.title = "select";
	this.selected_shapes = [];
	
	this.pmouseX = 0;
	this.pmouseY = 0;
	
	this.mousedown = function(e) {
		if(e.which == 1) {
			this.start_x = core.mouseX_raw;
			this.start_y = core.mouseY_raw;
			this.selected_shapes = [];
			core.draw();
		}
	};
	
	this.mousemove = function(e) {	
		if(core.mouse_pressed[1]) {
			core.draw();
			ctx.strokeStyle = "#ddaa55";
			ctx.strokeRect(this.start_x, this.start_y, core.mouseX_raw-this.start_x, core.mouseY_raw-this.start_y);
		} else if(core.mouse_pressed[2]) {
			for(var i = 0; i < this.selected_shapes.length; i++) {
				var s = core.project.shapes[this.selected_shapes[i]];
				
				s.position.x += core.mouseX - this.pmouseX;
				s.position.y += core.mouseY - this.pmouseY;
			}
			
			core.draw();
		}
		
		this.pmouseX = core.mouseX;
		this.pmouseY = core.mouseY;
	};
	
	this.mouseup = function(e) {
		if(e.which == 1) {
			for(var i = 0; i < core.project.shapes.length; i++) {
				var my_shape = core.project.shapes[i];
				 
				if(utils.is_inside(my_shape.position.x, my_shape.position.y,
							this.start_x, this.start_y,core.mouseX_raw, core.mouseY_raw)) {
			 		this.selected_shapes.push(i);
			 		core.project.select(i);
			 	}
			}
		
			core.draw();
		}
	};
}());
