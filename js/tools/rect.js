var TOOL_RECT = core.register_tool(new function() {
	this.title = "Rect";

	this.rect = {
		start : {x:0, y:0},
		end : {x:0, y:0}
	};

	this.mousedown = function(e) {
		if (e.which == 3) {
			core.tool = -1;
			return;
		} else if (e.which == 1) {
			var index = core.project.push(new shape());
			core.select_shape(index);

			var s = core.get_selected_shape();
			this.rect.start = {x:core.mouseX, y:core.mouseY};
			this.rect.end = {x:core.mouseX, y:core.mouseY};

			s.position.x = this.rect.start.x;
			s.position.y = this.rect.start.y;

			s.path.closed = true;
		}

		core.draw();
	};

	this.mousemove = function() {
		if(core.mouse_pressed[1]) {
			var s = core.get_selected_shape();

			this.rect.end = {x:core.mouseX, y:core.mouseY};

			var x1 = this.rect.start.x;
			var x2 = this.rect.end.x;
			var y1 = this.rect.start.y;
			var y2 = this.rect.end.y;


			s.position.x = (x1+x2)/2;
			s.position.y = (y1+y2)/2;

			s.path.points = [
				{x:x1-s.position.x, y:y1-s.position.y},
				{x:x2-s.position.x, y:y1-s.position.y},
				{x:x2-s.position.x, y:y2-s.position.y},
				{x:x1-s.position.x, y:y2-s.position.y}
			];

			core.draw();
		}
	};

	this.mouseup = function (e) {
		if(e.which == 1) {
			this.rect = {
				start : {x:0, y:0},
				end : {x:0, y:0}
			};
			core.draw();

		}
	};
}());

core.register_shortcut(new function() {
	this.ctrlKey = false;
	this.shiftKey = false;
	this.key = 82;
	this.name = "Tool: Rect";

	this.run = function() {
		core.tool = TOOL_RECT;
		core.update_tools();
		core.draw();
		return true;
	};
}());
