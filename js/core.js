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
	
	this.mouseX_raw = 0;
	this.mouseY_raw = 0;
	
	this.snap = false;
	
	this.register_tool = function(t) {
		this.tools.push(t);
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
		this.project.draw();
	};
	
	this.update_tools = function() {
		gui.tools.innerHTML = "<h1>Tools</h1>";
		for(var i = 0; i < core.tools.length; i++) {
			gui.tools.innerHTML += "<button onclick=\"core.select_tool(" + i + ");\">" + core.tools[i].title + "</button>";
		}
		
		if(this.project.selected_shape != -1) {
			var s = core.get_selected_shape();
		
			var stroke = s.style.stroke;
			var fill = s.style.fill;
		
			gui.tools.innerHTML += "<br><br><h1>Object</h1>";
			gui.tools.innerHTML += "<div class=\"box\">stroke <input type=\"color\" id=\"color_stroke\" onchange=\"core.get_selected_shape().style.stroke = this.value; core.update_tools();\" value=\"" + stroke + "\"></input></div>";
			gui.tools.innerHTML += "<div class=\"box\">fill <input type=\"color\" id=\"color_fill\" onchange=\"core.get_selected_shape().style.fill = this.value; core.update_tools();\" value=\"" + fill + "\"></input></div>";
		}
	};
	
	//input
	this.mousedown = function(e) {
		if(core.tools[core.tool].mousedown) {
			core.tools[core.tool].mousedown(e);
		}
	};
	
	this.mouseup = function(e) {
		if(core.tools[core.tool].mouseup) {
			core.tools[core.tool].mouseup(e);
		}
	};
	
	this.mousemove = function(e) {
		var raw_x = e.pageX - 200;
		var raw_y = e.pageY;
		
		core.mouseX_raw = raw_x;
		core.mouseY_raw = raw_y;
		
		if(!core.snap) {
			core.mouseX = raw_x;
			core.mouseY = raw_y;
		} else {
			core.mouseX = Math.floor(raw_x/50+0.5)*50;
			core.mouseY = Math.floor(raw_y/50+0.5)*50;
		}
	
		if(core.tools[core.tool].mousemove) {
			core.tools[core.tool].mousemove(e);
		}
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
			if(core.tools[core.tool].keydown) {
				core.tools[core.tool].keydown(e);
			} else {
				console.log(e.keyCode);
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
