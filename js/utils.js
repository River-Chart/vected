var utils = new function() {
	this.dist = function(a, b, c, d) {
		var x = a - c;
		var y = b - d;
		var v = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
		return v;
	};
}();
