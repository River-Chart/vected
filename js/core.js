var canvas;
var ctx;
var gui = {
};

var core = new function() {
	this.project = new project();
	this.mode = 0;
	this.tool = 0;
	this.tools = [];

	this.mouseX = 0;
	this.mouseY = 0;

	this.pmouseX_raw = 0;
	this.pmouseY_raw = 0;

	this.mouseX_raw = 0;
	this.mouseY_raw = 0;

	this.mouse_pressed = [false, false, false];

	this.snap = false;
	this.grid = true;
	this.grid_size = 32;
	this.preview = false;

	this.settings = [];
	this.shortcuts = [];

	this.registered_tabs = [];
	this.tabs = [];

	this.viewport = {
		x : 0,
		y : 0,
		zoom : 1
	};

	this.register_tab = function (t) {
		this.registered_tabs.push(t);
		return this.registered_tabs.length-1;
	};

	this.create_tab = function (type) {
		this.tabs.push (new this.registered_tabs[type] ());
	}

	this.register_tool = function(t) {
		this.tools.push(t);

		return this.tools.length-1;
	};

	this.register_setting = function(t) {
		this.settings.push(t);
	};

	this.register_shortcut = function(t) {
		this.shortcuts.push(t);
	};

	this.get_setting = function(t) {
		for(var i = 0; i < this.settings.length; i++) {
			if(this.settings[i].title == t) {
				return this.settings[i];
			}
		}
	};

	this.get_selected_shape = function() {
		if(this.project.selected_shape != -1) {
			return this.project.shapes[this.project.selected_shape];
		} else {
			return null;
		}
	};

	this.select_tool = function(i) {
		this.tool = i;
		if(this.tools[i].select) {
			this.tools[i].select();
		}
	};

	this.draw = function() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.translate(this.viewport.x, this.viewport.y);
		this.project.draw(!core.preview);
		ctx.translate(-this.viewport.x, -this.viewport.y);
	};

	this.draw_grid = function () {
		var w = gui.canvas_grid.width;
		var h = gui.canvas_grid.height;
		gui.ctx_grid.clearRect(0, 0, w, h);

		if (!this.grid) {
			return;
		}

		if (this.grid_size > 4) {
			gui.ctx_grid.beginPath ();
			var x = this.viewport.x%this.grid_size;
			for (var i = x; i < w+x; i+=this.grid_size) {
				gui.ctx_grid.moveTo (i+0.5, -0.5);
				gui.ctx_grid.lineTo (i+0.5, h+0.5);
			}

			var y = this.viewport.y%this.grid_size;
			for (var i = y; i < h+y; i+=this.grid_size) {
				gui.ctx_grid.moveTo (-0.5, i+0.5);
				gui.ctx_grid.lineTo (w+0.5, i+0.5);
			}

			gui.ctx_grid.lineWidth = 1;
			gui.ctx_grid.strokeStyle = "#ccc";
			gui.ctx_grid.stroke ();

			gui.ctx_grid.beginPath ();

			gui.ctx_grid.moveTo (0, this.viewport.y);
			gui.ctx_grid.lineTo (w, this.viewport.y);

			gui.ctx_grid.moveTo (this.viewport.x, 0);
			gui.ctx_grid.lineTo (this.viewport.x, h);

			gui.ctx_grid.lineWidth = 2;
			gui.ctx_grid.strokeStyle = "#666";
			gui.ctx_grid.stroke ();
		}
	};

	this.update_tools = function() {
		gui.tools.innerHTML = "";

		for (var i = 0; i < this.tabs.length; i++) {
			var div = document.createElement("div");
				div.setAttribute("class", "object");
				div.setAttribute("className", "object");

				var h1 = document.createElement("h1");
				h1.appendChild(document.createTextNode(this.tabs[i].name));
				div.appendChild(h1);

				this.tabs[i].draw (div);

			gui.tools.appendChild(div);

			gui.tools.appendChild(document.createElement("br"));
			gui.tools.appendChild(document.createElement("br"));
		}
	};

	//input
	this.mousedown = function(e) {
		core.mouse_pressed[e.which] = true;

		if(core.tools[core.tool].mousedown) {
			core.tools[core.tool].mousedown(e);
		}
	};

	this.mouseup = function(e) {
		core.mouse_pressed[e.which] = false;

		if(core.tools[core.tool].mouseup) {
			core.tools[core.tool].mouseup(e);
		}
	};

	this.mousemove = function(e) {
		var raw_x = e.pageX - 200;
		var raw_y = e.pageY;


		if (core.mouse_pressed[2] && !e.shiftKey) {
			var dx = raw_x - this.pmouseX_raw;
			var dy = raw_y - this.pmouseY_raw;

			core.viewport.x += dx;
			core.viewport.y += dy;

			core.draw();
			core.draw_grid();
		}

		core.mouseX_raw = raw_x - core.viewport.x;
		core.mouseY_raw = raw_y - core.viewport.y;

		if(!core.snap) {
			core.mouseX = core.mouseX_raw;
			core.mouseY = core.mouseY_raw;
		} else {
			core.mouseX = Math.floor(core.mouseX_raw/core.grid_size+0.5)*core.grid_size;
			core.mouseY = Math.floor(core.mouseY_raw/core.grid_size+0.5)*core.grid_size;
		}

		if(core.tools[core.tool].mousemove) {
			core.tools[core.tool].mousemove(e);
		}

		this.pmouseX_raw = raw_x;
		this.pmouseY_raw = raw_y;
	};

	this.keydown = function(e) {
		if(e.keyCode == 9) {
			var t = core.tool + 1;

			if(e.shiftKey) {
				t = core.tool - 1;
			}

			if(t > core.tools.length-1) {
				t = 0;
			}

			if(t < 0) {
				t = core.tools.length-1;
			}

			core.select_tool(t);

			return false;
		} else {
			if (document.activeElement.nodeName.toLowerCase() == "input") {
				return true;
			}

			if(core.tools[core.tool].keydown && core.tools[core.tool].keydown(e)) {
				return false;
			} else {
				console.log(e.keyCode)
				for(var i = 0; i < core.shortcuts.length; i++) {
					var s = core.shortcuts[i];
					if(s.key == e.keyCode && s.shiftKey == e.shiftKey && s.ctrlKey == e.ctrlKey) {
						if(s.run()) {
							return false;
						}
				  }
				}
			}
		}
	}
}();

function load() {
	canvas = document.getElementById("canvas");
	canvas.width = window.innerWidth - 200;
	canvas.height = window.innerHeight;

	canvas.onmousedown = core.mousedown;
	canvas.onmouseup = core.mouseup;
	canvas.onmousemove = core.mousemove;
	document.onkeydown = core.keydown;

	gui.canvas_grid = document.getElementById("canvas_grid");
	gui.canvas_grid.width = window.innerWidth - 200;
	gui.canvas_grid.height = window.innerHeight;

	// TODO: only resize canvas after window is resized
	window.onresize = function () {
		canvas.width = window.innerWidth - 200;
		canvas.height = window.innerHeight;

		gui.canvas_grid.width = window.innerWidth - 200;
		gui.canvas_grid.height = window.innerHeight;

		core.draw();
		core.draw_grid();
	};

	ctx = canvas.getContext("2d");

	gui.ctx_grid = canvas_grid.getContext("2d");
	gui.tools = document.getElementById("tools");

	core.create_tab (TAB_TOOLS);
	core.create_tab (TAB_SETTINGS);
	core.create_tab (TAB_OBJECT);

	core.update_tools();

	shortcut_list.init();
	core.draw_grid();
}
