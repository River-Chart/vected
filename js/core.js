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
	this.grid_size = 32;
	this.preview = false;

	this.settings = [];
	this.shortcuts = [];

	this.viewport = {
		x : 0,
		y : 0,
		zoom : 1
	}

	this.register_tool = function(t) {
		this.tools.push(t);
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
	}


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

	this.update_tools = function() {
		gui.tools.innerHTML = "<h1>Tools</h1>";
		for(var i = 0; i < core.tools.length; i++) {
			gui.tools.innerHTML += "<button onclick=\"core.select_tool(" + i + ");\">" + core.tools[i].title + "</button>";
		}

		gui.tools.innerHTML += "<br><br><h1>Settings</h1>";
		for(var i = 0; i < this.settings.length; i++) {
			gui.tools.innerHTML += "<div class=\"box\">" + this.settings[i].title + this.settings[i].get_input(i) + "</div>";

		}

		if(this.project.selected_shape != -1) {
			var s = core.get_selected_shape();

			var stroke = s.style.stroke;
			var fill = s.style.fill;

			var draw_fill = s.style.draw_fill;
			var draw_stroke = s.style.draw_stroke;

			var closed = s.path.closed;
			var curve = s.path.curve;
			var arc = s.path.arc;

			var stroke_width = s.style.stroke_width;
			var stroke_cap = s.style.stroke_cap;

			str = "<br><br><div class=\"object\">";

			str += "<h1>Object</h1>";
			str += "<div class=\"box\">stroke <input type=\"color\" id=\"color_stroke\" onchange=\"core.get_selected_shape().style.stroke = this.value; core.update_tools();\" value=\"" + stroke + "\"></input></div>";
			str += "<div class=\"box\">fill <input type=\"color\" id=\"color_fill\" onchange=\"core.get_selected_shape().style.fill = this.value; core.update_tools();\" value=\"" + fill + "\"></input></div>";

			str += "<br>";
			str += "<div class=\"box\">stroke <input type=\"checkbox\" id=\"draw_stroke\" onchange=\"core.get_selected_shape().style.draw_stroke = this.checked; core.draw(); core.update_tools();\" " + (draw_stroke ? "checked=\"checked\"" : "") + "></input></div>";
			str += "<div class=\"box\">fill <input type=\"checkbox\" id=\"draw_fill\" onchange=\"core.get_selected_shape().style.draw_fill = this.checked; core.draw(); core.update_tools();\" " + (draw_fill ? "checked=\"checked\"" : "") + "></input></div>";

			str += "<br>";
			str += "<div class=\"box\">closed <input type=\"checkbox\" id=\"path_closed\" onchange=\"core.get_selected_shape().path.closed = this.checked; core.draw(); core.update_tools();\" " + (closed ? "checked=\"checked\"" : "") + "></input></div>";
			str += "<div class=\"box\">curve <input type=\"checkbox\" id=\"path_curve\" onchange=\"core.get_selected_shape().path.curve = this.checked; core.draw(); core.update_tools();\" " + (curve ? "checked=\"checked\"" : "") + "></input></div>";
			str += "<div class=\"box\">arc <input type=\"checkbox\" id=\"path_arc\" onchange=\"core.get_selected_shape().path.arc = this.checked; core.draw(); core.update_tools();\" " + (arc ? "checked=\"checked\"" : "") + "></input></div>";

			str += "<br>";
			str += "<div class=\"box\">stroke width <input type=\"number\" id=\"stroke_width\" onchange=\"core.get_selected_shape().style.stroke_width = parseInt(this.value); core.draw(); core.update_tools();\" value=\"" + stroke_width + "\"></input></div>";

			var options = "<option " + ("flat" == stroke_cap ? "selected=\"selected\"" : "") + ">flat</option><option " + ("square" == stroke_cap ? "selected=\"selected\"" : "") + ">square</option><option " + ("round" == stroke_cap ? "selected=\"selected\"" : "") + ">round</option>";
			str += "<div class=\"box\">stroke cap <select id=\"stroke_cap\" onchange=\"core.get_selected_shape().style.stroke_cap = this.options[this.selectedIndex].text; core.draw(); core.update_tools();\">" + options + "</select></div>";

			str += "</div>";

			gui.tools.innerHTML += str;
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

	ctx = canvas.getContext("2d");

	gui.tools = document.getElementById("tools");
	core.update_tools();
}
