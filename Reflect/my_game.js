function sgn(x) {
	if (Math.abs(x) < 0.0001) return 0;
	if (x < 0) return -1;
	return 1;
}

class Line {
	constructor(a, b) {
		this.a = a;
		this.b = b;

		this.ab = b.copy();
		this.ab.sub(a);
	}

	get heading() {
		return this.ab.heading;
	}

	cross(point) {
		var temp = point.copy();
		temp.sub(this.a);
		return this.ab.x * temp.y - this.ab.y * temp.x;
	}

	intersect(other) {
		if (this.crossSuggestsIntersect(other) && other.crossSuggestsIntersect(this)) {
			return true;
		}
		return false;
	}

	crossSuggestsIntersect(other) {
		var c1 = sgn(this.cross(other.a));
		var c2 = sgn(this.cross(other.b));

		if (c1 == 0 || c2 == 0 || (c1 != c2)) {
			return true;
		}
		if (c1 == c2) {
			return false;
		}
		console.assert("You fucked up.");
	}

	draw() {
		stroke(0);
		lineWidth(1);
		line(this.a.x, this.a.y, this.b.x, this.b.y);
	}
}

class Particle {
	constructor(pos, vel) {
		this.pos = pos;
		this.vel = vel;
	}

	update(lines) {
		var next = this.pos.copy();
		next.add(this.vel);
		for (var i = 0; i < lines.length; i ++) {
			let line = lines[i];
			if (this.crossesLine(next, line)) {
				var a = (this.vel.heading - line.heading) % Math.PI;
				this.vel.heading -= 2 * a;

				next = this.pos.copy();
				next.add(this.vel);
				i = 0;
			}
		}
		this.pos.add(this.vel);
		if (this.pos.magnitude > 400) this.pos = new Vector(0, 0);
	}

	crossesLine(next, line) {
		var motion = new Line(this.pos.copy(), next.copy());
		if (motion.intersect(line)) {
			return true;
		} return false;
	}

	draw() {
		//fillColor('hsla(' + floor(t) + ', 90%, 60%, 0.2)')
		fill(0, 0.2);
		ellipse(this.pos.x, this.pos.y, 2);
	}
}

var t = 0;
var lines = [];
var particles = [];

var points = [
	vec(-1, -1), vec(-1, -2), vec(0, -2), vec(0, -1), vec(1, -1), vec(1, 0),
	vec(3, 0), vec(3, -1), vec(4, -1), vec(4, -2), vec(5, -1), vec(6, -1),
	vec(6, 0), vec(5, 0), vec(5, 1), vec(4, 2), vec(4, 1), vec(3, 1), vec(2, 2),
	vec(2, 1), vec(1, 1), vec(0, 2), vec(0, 1), vec(-1, 1), vec(-1, 0), vec(-2, 0)
];

function setup() {
    resize(window.innerWidth, window.innerHeight);

	for (var i = 0; i < points.length; i ++) {
		var p = points[i].copy();
		p.mul(50);
		points[i] = p;
	}

	var prev = points[points.length - 1].copy();
	var curr;
	for (var i = 0; i < points.length; i ++) {
		curr = points[i].copy();
		lines.push(new Line(curr.copy(), prev.copy()));
		prev = curr.copy();
	}
	//curr = new Vector(300, 0);
	//lines.push(new Line(curr.copy(), prev.copy()));

	for (var q = 0.02; q < Math.PI * 2; q += 0.05) {
		particles.push(new Particle(new Vector(0, 0), new Vector(2 * cos(q), 2 * sin(q))));
	}
}

function update() {
	t += 0.2;
	for (var p of particles) p.update(lines);
}

function draw() {
	background(255);
	save();
	translate(width/2, height/2);
	for (var line of lines) line.draw();
	for (var p of particles) p.draw();
	restore();
}
