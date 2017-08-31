var utils = new function() {
	this.dist = function(a, b, c, d) {
		var x = a - c;
		var y = b - d;
		var v = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
		return v;
	};

	this.is_inside = function(x, y, a, b, c, d) {
		if(x > a && x < c &&
		   y > b && y < d) {
			return true;
		} else {
			return false;
		}
	};

	this.save_data_url = function(name, data) {
		var my_link = document.createElement("a");
		my_link.download = name;
		my_link.href = data;

		document.body.appendChild(my_link);
		my_link.click();
		document.body.removeChild(my_link);
	};

	this.createBox = function (text) {
		var box = document.createElement("div")
		box.setAttribute("class", "box");
		box.setAttribute("className", "box");

		if (text) {
			box.appendChild(document.createTextNode(text));
		}

		return box;
	};

	this.createInput = function (name, type, id, value, evt) {
		var box = this.createBox (name);
		var inp = document.createElement("input");
		inp.type = type;
		inp.id = id;

		if(type == "checkbox") {
			if (value) {
				inp.checked = "checked";
			}
		} else {
			inp.value = value;
		}

		if (evt) {
			inp.onchange = evt;
		}

		box.appendChild(inp);
		return box;
	};

	this.createSelect = function (name, id, value, options, evt) {
		var box = this.createBox (name);
		var sel = document.createElement("select");
		sel.id = id;

		if (evt) {
			sel.onchange = evt;
		}

		for (var i = 0; i < options.length; i++) {
			var opt_name = options[i];

			var opt = document.createElement("option");
			opt.appendChild(document.createTextNode(opt_name));

			if (opt_name == value) {
				opt.setAttribute("selected", "selected");
			}

			sel.appendChild(opt);
		}

		box.appendChild(sel);
		return box;
	};
}();
