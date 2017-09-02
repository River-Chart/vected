var shortcut_list = new function () {
	this.dialog = null;
	this.overlay = null;

	this.init = function () {
		this.overlay = document.getElementById("overlay");
		this.dialog = document.getElementById("dialog_shortcut_list");

		var that = this;

		this.input = document.createElement("input");
			this.input.type = "text";

			this.input.onchange = function () {
				that.update_list();

				for (var i = 0; i < core.shortcuts.length; i++) {
					if (core.shortcuts[i].name.toLowerCase().indexOf(that.input.value.toLowerCase()) != -1) {
						core.shortcuts[i].run();
						that.close();

						break;
					}
				}
			}

			this.input.oninput = function () {
				that.update_list();
			}
		this.dialog.appendChild(this.input);

		this.list = document.createElement("ul");
		this.dialog.appendChild(this.list);

		this.dialog.style.display = "none";
		this.overlay.style.display = "none";
	};

	this.update_list = function () {
		this.list.innerHTML = "";

		for (var i = 0; i < core.shortcuts.length; i++) {
			if (core.shortcuts[i].name.toLowerCase().indexOf(this.input.value.toLowerCase()) != -1) {
				var elm = document.createElement("li");
				elm.appendChild(document.createTextNode(core.shortcuts[i].name));

				var div = document.createElement("div");
				div.setAttribute("class", "r");
				div.setAttribute("className", "r");
				div.appendChild(document.createTextNode(this.shortcut_to_string(core.shortcuts[i])));
				elm.appendChild(div);

				this.list.appendChild(elm);
			}
		}
	}

	this.open = function () {
		var that = this;
		this.overlay.onclick = function () {
			that.close();
		}

		this.dialog.style.display = "block";
		this.overlay.style.display = "block";

		this.input.value = "";
		this.list.innerHTML = "";

		for (var i = 0; i < core.shortcuts.length; i++) {
			var elm = document.createElement("li");
			elm.appendChild(document.createTextNode(core.shortcuts[i].name));

			var div = document.createElement("div");
				div.setAttribute("class", "r");
				div.setAttribute("className", "r");
				div.appendChild(document.createTextNode(this.shortcut_to_string(core.shortcuts[i])));
			elm.appendChild(div);

			this.list.appendChild(elm);
		}

		this.input.focus();
	};

	this.close = function () {
		this.dialog.style.display = "none";
		this.overlay.style.display = "none";

		this.input.blur();
	};

	this.shortcut_to_string = function (s) {
		var str = "";
		if (s.ctrlKey) {
			str+= "Ctrl+"
		}

		if (s.shiftKey) {
			str+= "Shift+"
		}

		if (s.key == 32) {
			return str + "Space";
		} else {
			return str + String.fromCharCode(s.key);
		}
	};
} ();

core.register_shortcut(new function() {
	this.ctrlKey = false;
	this.shiftKey = false;
	this.key = 32;
	this.name = "Open Shortcut List";

	this.run = function() {
		shortcut_list.open();
		return true;
	};
}());
