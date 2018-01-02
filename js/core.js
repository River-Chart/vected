var canvas;
var ctx;
var gui = {
};

var core = new function() {
	this.project = new project();
	this.mode = 0;
	this.tool = -1;
	this.tools = [];
	this.tool_edit = null;

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

	this.dialogs = [];
	this.dialog = {
		open_dialog: null,
		container  : null,
		overlay    : null
	};

	this.viewport = {
		x : 0,
		y : 0,
		zoom : 1
	};

	this.selected_shape = -1;

	// Tabs

	this.register_tab = function (t) {
		this.registered_tabs.push(t);
		return this.registered_tabs.length-1;
	};

	this.create_tab = function (type) {
		this.tabs.push (new this.registered_tabs[type] ());
	};

	// Dialog

	this.init_dialog = function () {
		this.dialog.container = document.getElementById ("dialog_container");
		this.dialog.overlay = document.getElementById ("overlay");

		this.dialog.container.style.display = "none";
		this.dialog.overlay.style.display = "none";

		this.dialog.overlay.onclick = function (evt) {
			core.close_dialog();
		};
	};

	this.register_dialog = function (def) {
		this.dialogs.push(def);
		return this.dialogs.length-1;
	};

	this.open_dialog = function (type) {
		if (!this.dialog.open_dialog) {
			this.dialog.container.style.display = "block";
			this.dialog.overlay.style.display = "block";

			this.dialog.open_dialog = new this.dialogs[type] (
				this.dialog.container
			);

			this.dialog.open_dialog.init ();
			return true;
		}

		return false;
	};

	this.close_dialog = function () {
		this.dialog.container.style.display = "none";
		this.dialog.overlay.style.display = "none";

		if (this.dialog.open_dialog) {
			this.dialog.open_dialog.close();
			this.dialog.open_dialog = null;

			this.dialog.container.innerHTML = "";
			return true;
		}
	};

	// Tools

	this.register_tool = function(t) {
		this.tools.push(t);

		return this.tools.length-1;
	};

	// Settings

	this.register_setting = function(t) {
		this.settings.push(t);
	};

	this.get_setting = function(t) {
		for(var i = 0; i < this.settings.length; i++) {
			if(this.settings[i].title == t) {
				return this.settings[i];
			}
		}
	};

	// Shortcuts

	this.register_shortcut = function(t) {
		this.shortcuts.push(t);
	};


	this.get_selected_shape = function () {
		if(this.selected_shape != -1) {
			return this.project.shapes[this.selected_shape];
		} else {
			return null;
		}
	};

	this.select_shape = function (id) {
		this.selected_shape = id;
	};

	this.select_tool = function(i) {
		this.tool = i;
		if(this.tools[i].select) {
			this.tools[i].select();
		}
		this.update_ui();
	};

	this.draw = function() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		ctx.translate (canvas.width/2, canvas.height/2);
		ctx.scale (this.viewport.zoom, this.viewport.zoom);
		ctx.translate(this.viewport.x, this.viewport.y);

		this.project.draw(!core.preview);

		if (this.tool == -1) {
			if (this.tool_edit.draw) {
				this.tool_edit.draw();
			}
		} else if(this.tools[this.tool].draw) {
			this.tools[this.tool].draw();
		}

		ctx.translate(-this.viewport.x, -this.viewport.y);
		ctx.scale (1/this.viewport.zoom, 1/this.viewport.zoom);
		ctx.translate (-canvas.width/2, -canvas.height/2);
	};

	this.draw_grid = function () {
		var w = gui.canvas_grid.width;
		var h = gui.canvas_grid.height;
		gui.ctx_grid.clearRect(0, 0, w, h);

		if (!this.grid) {
			return;
		}

		if (this.grid_size*this.viewport.zoom >= 4) {
			gui.ctx_grid.beginPath ();
			var x = (this.viewport.x*this.viewport.zoom+Math.ceil(canvas.width/2))%(this.grid_size*this.viewport.zoom);
			for (var i = x; i < w+x; i+=this.grid_size*this.viewport.zoom) {
				gui.ctx_grid.moveTo (i+0.5, -0.5);
				gui.ctx_grid.lineTo (i+0.5, h+0.5);
			}

			var y = (this.viewport.y*this.viewport.zoom+Math.ceil(canvas.height/2))%(this.grid_size*this.viewport.zoom);
			for (var i = y; i < h+y; i+=this.grid_size*this.viewport.zoom) {
				gui.ctx_grid.moveTo (-0.5, i+0.5);
				gui.ctx_grid.lineTo (w+0.5, i+0.5);
			}

			gui.ctx_grid.lineWidth = 1;
			gui.ctx_grid.strokeStyle = "#ccc";
			gui.ctx_grid.stroke ();
		}

		gui.ctx_grid.beginPath ();

		gui.ctx_grid.moveTo (0, this.viewport.y*this.viewport.zoom+Math.ceil(canvas.height/2));
		gui.ctx_grid.lineTo (w, this.viewport.y*this.viewport.zoom+Math.ceil(canvas.height/2));

		gui.ctx_grid.moveTo (this.viewport.x*this.viewport.zoom+Math.ceil(canvas.width/2), 0);
		gui.ctx_grid.lineTo (this.viewport.x*this.viewport.zoom+Math.ceil(canvas.width/2), h);

		gui.ctx_grid.lineWidth = 2;
		gui.ctx_grid.strokeStyle = "#666";
		gui.ctx_grid.stroke ();
	};

	this.update_ui = function() {
		gui.sidebar.innerHTML = "";

		for (var i = 0; i < this.tabs.length; i++) {
			var div = document.createElement("div");
				div.setAttribute("class", "object");
				div.setAttribute("className", "object");

				var h1 = document.createElement("h1");
				h1.appendChild(document.createTextNode(this.tabs[i].name));
				div.appendChild(h1);

				this.tabs[i].draw (div);

			gui.sidebar.appendChild(div);

			gui.sidebar.appendChild(document.createElement("br"));
			gui.sidebar.appendChild(document.createElement("br"));
		}

		gui.tools.innerHTML = "";
		for(var i = 0; i < this.tools.length; i++) {
			var tool_btn = document.createElement("button");

			if (i == this.tool) {
				tool_btn.setAttribute("class", "selected");
				tool_btn.setAttribute("className", "selected");
			}

			tool_btn.tool_id = i;
			tool_btn.onclick = function () {
				core.select_tool(this.tool_id);
			};

			tool_btn.appendChild(document.createTextNode(core.tools[i].title));
			gui.tools.appendChild(tool_btn);
		}
	};

	//input
	this.mousedown = function(e) {
		core.mouse_pressed[e.which] = true;

		if (core.tool == -1) {
			core.tool_edit.mousedown(e);
		} else if(core.tools[core.tool].mousedown) {
			if (e.which == 3) {
				core.tool = -1;
				core.update_ui();
			} else {
				core.tools[core.tool].mousedown(e);
			}
		}
	};

	this.mouseup = function(e) {
		core.mouse_pressed[e.which] = false;

		if (core.tool == -1) {
			core.tool_edit.mouseup(e);
		} else if(core.tools[core.tool].mouseup) {
			core.tools[core.tool].mouseup(e);
		}
	};

	this.mousemove = function(e) {
		var raw_x = e.pageX - 250;
		var raw_y = e.pageY;

		core.mouseX_raw = (raw_x- canvas.width/2)/core.viewport.zoom - core.viewport.x;
		core.mouseY_raw = (raw_y - canvas.height/2)/core.viewport.zoom - core.viewport.y;

		if (core.mouse_pressed[2] && !e.shiftKey) {
			var dx = core.mouseX_raw - this.pmouseX_raw;
			var dy = core.mouseY_raw - this.pmouseY_raw;

			core.viewport.x += dx;
			core.viewport.y += dy;

			core.draw();
			core.draw_grid();
		}

		core.mouseX_raw = (raw_x- canvas.width/2)/core.viewport.zoom - core.viewport.x;
		core.mouseY_raw = (raw_y - canvas.height/2)/core.viewport.zoom - core.viewport.y;

		if(!core.snap) {
			core.mouseX = core.mouseX_raw;
			core.mouseY = core.mouseY_raw;
		} else {
			core.mouseX = Math.floor(core.mouseX_raw/core.grid_size+0.5)*core.grid_size;
			core.mouseY = Math.floor(core.mouseY_raw/core.grid_size+0.5)*core.grid_size;
		}

		if (core.tool == -1) {
			core.tool_edit.mousemove(e);
		} else if(core.tools[core.tool].mousemove) {
			core.tools[core.tool].mousemove(e);
		}

		this.pmouseX_raw = core.mouseX_raw;
		this.pmouseY_raw = core.mouseY_raw;
	};

	this.wheel = function (evt) {
		if (evt.deltaY < 0) {
			core.viewport.zoom *= 1.2;
		} else {
			core.viewport.zoom *= 0.8;
		}

		core.viewport.zoom = Math.max (core.viewport.zoom, 0.1);
		core.draw ();
		core.draw_grid ();
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
			if (document.activeElement.nodeName.toLowerCase() == "input" && !core.dialog.open_dialog) {
				return true;
			}

			if (e.keyCode == 27) {
				if (core.dialog.open_dialog) {
					core.close_dialog();
				} else {
					core.tool = -1;
					core.update_ui();
				}
			} else if(core.tool != -1 && core.tools[core.tool].keydown) {
				if (core.tools[core.tool].keydown(e)) {
					return false;
				}
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
	canvas.width = window.innerWidth - 250;
	canvas.height = window.innerHeight;

	canvas.onmousedown = core.mousedown;
	canvas.onmouseup = core.mouseup;
	canvas.onmousemove = core.mousemove;
	canvas.onwheel = core.wheel;

	document.onkeydown = core.keydown;

	canvas.oncontextmenu = function (e) {
		e.preventDefault();
	};

	gui.canvas_grid = document.getElementById("canvas_grid");
	gui.canvas_grid.width = window.innerWidth - 250;
	gui.canvas_grid.height = window.innerHeight;

	// TODO: only resize canvas after window is resized
	window.onresize = function () {
		canvas.width = window.innerWidth - 250;
		canvas.height = window.innerHeight;

		gui.canvas_grid.width = window.innerWidth - 250;
		gui.canvas_grid.height = window.innerHeight;

		core.draw();
		core.draw_grid();
	};

	ctx = canvas.getContext("2d");

	gui.ctx_grid = canvas_grid.getContext("2d");
	gui.tools = document.getElementById("tools");
	gui.sidebar = document.getElementById("sidebar");

	core.init_dialog ();

	//core.create_tab (TAB_TOOLS);
	core.create_tab (TAB_SETTINGS);
	core.create_tab (TAB_OBJECT);

	core.update_ui();
	core.draw_grid();
}
