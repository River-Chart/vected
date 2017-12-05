var TAB_TOOLS = core.register_tab (function () {
	this.name = "Tools";

	this.draw = function (container) {
		for(var i = 0; i < core.tools.length; i++) {
			var tools_btn = document.createElement("button");

			if (i == core.tool) {
				tools_btn.setAttribute("class", "selected");
				tools_btn.setAttribute("className", "selected");
			}

			tools_btn.tool_id = i;
			tools_btn.onclick = function () {
				core.select_tool(this.tool_id);
			};

			tools_btn.appendChild(document.createTextNode(core.tools[i].title));
			container.appendChild(tools_btn);
		}
	};
});

var TAB_SETTINGS = core.register_tab (function () {
	this.name = "Settings";

	this.draw = function (container) {
		for(var i = 0; i < core.settings.length; i++) {
			var setting_box = utils.createBox();
			setting_box.innerHTML = core.settings[i].title + core.settings[i].get_input(i)
			container.appendChild(setting_box);
		}
	};
});

var TAB_OBJECT = core.register_tab (function () {
	this.name = "Object";

	this.draw = function (container) {
		if(core.selected_shape == -1) {
			return;
		}

		var s = core.get_selected_shape();

		if (!s) {
			return;
		}

		var stroke = s.style.stroke;
		var fill = s.style.fill;

		var draw_fill = s.style.draw_fill;
		var draw_stroke = s.style.draw_stroke;

		var closed = s.path.closed;
		var draw_type = s.path.draw_type;

		var stroke_width = s.style.stroke_width;
		var stroke_cap = s.style.stroke_cap;

		/*
		  Elements
		*/

		// Stroke
		container.appendChild(
			utils.createInput("Stroke", "color", "color_stroke", stroke, function () {
				core.get_selected_shape().style.stroke = this.value;
				core.update_tools();
				core.draw();
			})
		);

		// Fill
		container.appendChild(
			utils.createInput("Fill", "color", "color_fill", fill, function () {
				core.get_selected_shape().style.fill = this.value;
				core.update_tools();
				core.draw();
			})
		);

		container.appendChild(document.createElement("br"));

		// Draw stroke
		container.appendChild(
			utils.createInput("Stroke", "checkbox", "draw_stroke", draw_stroke, function () {
				core.get_selected_shape().style.draw_stroke = this.checked;
				core.update_tools();
				core.draw();
			})
		);

		// Draw fill
		container.appendChild(
			utils.createInput("Fill", "checkbox", "draw_fill", draw_fill, function () {
				core.get_selected_shape().style.draw_fill = this.checked;
				core.update_tools();
				core.draw();
			})
		);

		container.appendChild(document.createElement("br"));

		// Closed
		container.appendChild(
			utils.createInput("Closed", "checkbox", "path_closed", closed, function () {
				core.get_selected_shape().path.closed = this.checked;
				core.update_tools();
				core.draw();
			})
		);

		// Draw type
		container.appendChild(
			utils.createSelect("Draw type", "draw_type", draw_type,
				["default", "arc", "curve", "bezier"],
				function () {
					core.get_selected_shape().path.draw_type = this.options[this.selectedIndex].text;
					core.update_tools();
					core.draw();
				}
			)
		);

		container.appendChild(document.createElement("br"));

		// Stroke width
		container.appendChild(
			utils.createInput("Stroke width", "number", "stroke_width", stroke_width, function () {
				core.get_selected_shape().style.stroke_width = parseInt(this.value);
				core.update_tools();
				core.draw();
			})
		);

		// Stroke cap
		container.appendChild(
			utils.createSelect("Stroke cap", "stroke_cap", stroke_cap,
				["flat", "square", "round"],
				function () {
					core.get_selected_shape().style.stroke_cap = this.options[this.selectedIndex].text;
					core.update_tools();
					core.draw();
				}
			)
		);
	};
});
