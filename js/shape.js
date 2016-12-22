function shape(points) {
	this.position = {
		x : 0,
		y : 0
	};

	this.path = {
		points : (points || []),
		closed : false
	};
	
	this.style = {
		fill : "#444",
		stroke : "#444"
	};
	
	this.draw = function() {
		if(this.path.points.length > 0) {
			ctx.fillStyle = this.style.fill;
			ctx.strokeStyle = this.style.stroke;
		
			ctx.translate(this.position.x, this.position.y);
			ctx.beginPath();
		
			ctx.moveTo(this.path.points[0].x, this.path.points[0].y);
		
			for(var i = 1; i < this.path.points.length; i++) {
				var p = this.path.points[i];
				ctx.lineTo(p.x, p.y);
			}
		
			ctx.stroke();
			ctx.fill();
			ctx.translate(-this.position.x, -this.position.y);
		}
	};
	
	this.draw_points = function() {
		ctx.translate(this.position.x, this.position.y);
		
		ctx.fillStyle = "#f0aa55";
		ctx.strokeStyle = "#444";
		
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
