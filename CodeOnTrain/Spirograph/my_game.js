class Ball {
	constructor(parent, radius) {
		this.parent = parent;
		this.radius = radius;

		this.theta = 0;
	}

	position() {
		if (!this.parent)
			return new Vector(0, 0);
		var vec = new Vector(1, 0);
		vec.heading = this.parent.thetaStack() + this.theta/this.radius;
		vec.magnitude = this.parent.radius + this.radius;
		vec.add(this.parent.position());
		return vec;
	}

	thetaStack() {
		if (!this.parent) return this.theta;
		return this.parent.thetaStack() + this.theta;
	}

	pointOnCircumference() {
		var p = this.position();
		var c = new Vector(this.radius, 0);
		c.heading = this.thetaStack() + this.theta;
		p.add(c);
		return p;
	}

	draw() {
		if (!this.parent) {
			ellipse(0, 0, this.radius);
		}
		else {
			var pos = this.position();
			ellipse(pos.x, pos.y, this.radius);
		}
	}
}

var balls = [];

function setup() {
    resize(window.innerWidth, window.innerHeight);
	var r = 64;
	for (var n = 0; n < 2; n ++) {
		var b = new Ball(balls[balls.length - 1], r);
		balls.push(b);
		r /= 2;
	}
}

var tick = 0;

function update() {
	for (var i = 0; i < 2; i ++) {
		var q = 0.003;
		for (var b of balls) {
			b.theta += q// * tick;
			q *= 3;
		}
		var p = balls[balls.length - 1].pointOnCircumference();
		points.push(p);
		tick += 1;
	}
}

var points = [];

function draw() {
	background(255);
	SETTINGS.stroke = true;
	SETTINGS.fill = false;
	stroke(0);
	save();
	translate(width/2, height/2);
	for (var b of balls)
		b.draw();

	stroke(255, 0, 0);
	for (var n = 1; n < points.length; n ++) {
		lineWidth(3);
		line(points[n].x, points[n].y, points[n-1].x, points[n-1].y);
		//ellipse(points[n].x, points[n].y, 1);
		//ellipse(p.x, p.y, 3, 3);
	}
	restore();
}
