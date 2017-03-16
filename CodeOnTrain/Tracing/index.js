function line(ctx, x1, y1, x2, y2) {
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
}

function ellipse(ctx, x, y, r) {
	ctx.beginPath();
	ctx.arc(x, y, r, r, 0, 2 * Math.PI);
	ctx.stroke();
}

function Arm(x, y, length, angle) {
	return {
		x: x,
		y: y,
		length: length,
		baseLength: length,
		angle: angle,
		parent: null,

		draw: function(ctx) {
			line(ctx, this.x, this.y, this.getEndX(), this.getEndY());
		},
		getAngle: function() {
			var angle = 0,
				parent = this.parent;
			while(parent != null) {
				angle += parent.angle;
				parent = parent.parent;
			}
			angle += this.angle;
			return angle;
		},
		getEndX: function() {
			var angle = this.getAngle();
			return this.x + this.length * Math.cos(angle);
		},
		getEndY: function() {
			var angle = this.getAngle();
			return this.y + this.length * Math.sin(angle);
		},
		update: function() {
			if (this.parent) {
				this.x = this.parent.getEndX();
				this.y = this.parent.getEndY();
			}
		}
	}
}

window.onload = function() {
	var mainCanvas = document.getElementById("main"),
		traceCanvas = document.getElementById("trace"),
		mainContext = mainCanvas.getContext("2d"),
		traceContext = traceCanvas.getContext("2d"),
		width = window.innerWidth,
		height = window.innerHeight;

	mainCanvas.setAttribute("width", width);
	mainCanvas.setAttribute("height", height);

	traceCanvas.setAttribute("width", width);
	traceCanvas.setAttribute("height", height);

	mainContext.strokeStyle = 'black';
	traceContext.strokeStyle = 'rgba(255, 0, 0, 0.1)';

	var arms = [];

	var r = 128;
	var mod = 1;
	for (var i = 0; i < 4; i ++) {
		let arm = Arm(width/2, height/2, r*mod, 0);
		if (i > 0) arm.parent = arms[i-1];
		arms.push(arm);
		arm.update();
		mod *= 0.5;
	}

	var t = 0;
	function update() {
		for (var iii = 0; iii < 157; iii ++) {

			var prevX = arms[arms.length-1].getEndX();
			var prevY = arms[arms.length-1].getEndY();

			var multi = 1;
			for (var arm of arms) {
				arm.angle = t * multi;
				//arm.length = arm.baseLength * (1 + Math.sin(t))
				multi *= 3;
				//multi*= i % 2 ? 3 : 1/3;
				arm.update();
			}

			line(traceContext, prevX, prevY, arms[arms.length-1].getEndX(), arms[arms.length-1].getEndY())

			t += 0.02;
		}
		mainContext.clearRect(0, 0, width, height);
		for (var arm of arms) {
			arm.draw(mainContext);
		}
		requestAnimationFrame(update);
	}

	update();
}
