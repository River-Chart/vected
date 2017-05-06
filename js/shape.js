function shape(points) {
	this.position = {
		x : 0,
		y : 0
	};

	this.path = {
		points : (points || []),
		closed : false,
		curve : false,
		arc : false,
	};

	this.style = {
		fill : "#444",
		stroke : "#444",
		draw_fill : true,
		draw_stroke : true,

		stroke_width : 1,
		stroke_cap : "butt"
	};

	this.draw = function() {
		if(this.path.points.length > 0) {
			ctx.fillStyle = this.style.fill;
			ctx.strokeStyle = this.style.stroke;
			ctx.lineWidth = this.style.stroke_width;
			ctx.lineCap = this.style.stroke_cap;

			ctx.translate(this.position.x, this.position.y);
			ctx.beginPath();

			ctx.moveTo(this.path.points[0].x, this.path.points[0].y);

			if(this.path.curve) {
				for(var i = 1; i < this.path.points.length; i += 2) {
					var p = this.path.points[i];

					var j = i+1;

					if(j > this.path.points.length-1) {
						if(this.path.closed) {
							j = 0;
						} else {
							j = this.path.points.length-1;
						}
					}

					var p2 = this.path.points[j];
					ctx.quadraticCurveTo(p.x, p.y, p2.x, p2.y);
				}
			} else if(this.path.arc) {
				if (this.path.points.length > 1) {
					var p1 = this.path.points[0];
					var p2 = this.path.points[1];

					ctx.ellipse(0, 0, Math.abs(p1.x), Math.abs(p2.y), 0, 0, 2*Math.PI);
				} else {
					var p1 = this.path.points[0];
					var r = utils.dist(0, 0, p1.x, p1.y);
					ctx.arc(0, 0, r, 0, Math.PI*2);
				}
			} else {
				for(var i = 1; i < this.path.points.length; i++) {
					var p = this.path.points[i];

					ctx.lineTo(p.x, p.y);
				}
			}

			if(this.path.closed) {
				ctx.closePath();
			}

			if(this.style.draw_stroke) {
				ctx.stroke();
			}

			if(this.style.draw_fill) {
				ctx.fill();
			}

			ctx.translate(-this.position.x, -this.position.y);
		}
	};

	this.draw_points = function() {
		ctx.translate(this.position.x, this.position.y);

		ctx.fillStyle = "#f0aa55";
		ctx.strokeStyle = "#444";
		ctx.lineWidth = 1;
		ctx.lineCap = "butt"

		ctx.beginPath();
		ctx.arc(0, 0, 5, 0, Math.PI*2);
		ctx.stroke();
		ctx.fill();

		ctx.fillStyle = "#f0f0f0";
		ctx.strokeStyle = "#444";

		for(var i = 0; i < this.path.points.length; i++) {
			var p = this.path.points[i];

			ctx.beginPath();
			ctx.arc(p.x, p.y, 5, 0, Math.PI*2);
			ctx.stroke();
			ctx.fill();
		}

		ctx.translate(-this.position.x, -this.position.y);
	};

	this.push = function(p) {
		this.path.points.push(p);
	};
}
