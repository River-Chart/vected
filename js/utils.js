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
}();
