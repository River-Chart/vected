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
	
	this.draw = function() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		this.project.draw();
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
		core.mouseX = e.pageX;
		core.mouseY = e.pageY;
	
		if(core.tools[core.tool].mousemove) {
			core.tools[core.tool].mousemove(e);
		}
	};
}();

function load() {
	canvas = document.getElementById("canvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	canvas.onmousedown = core.mousedown;
	canvas.onmouseup = core.mouseup;
	canvas.onmousemove = core.mousemove;
	
	ctx = canvas.getContext("2d");
	
	gui.tools = document.getElementById("tools");
	console.log(gui.tools);
	
	gui.tools.innerHtml = "";
	for(var i = 0; i < core.tools.length; i++) {
		gui.tools.innerHTML += "<button onclick=\"core.tool = " + i + "\">" + core.tools[i].title + "</button>";
	}
}
