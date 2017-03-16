const FERN = [
	{
		a: 0,
		b: 0,
		c: 0,
		d: 0.16,
		e: 0,
		f: 0,
		p: 0.01
	},
	{
		a: 0.85,
		b: 0.04,
		c: -0.04,
		d: 0.85,
		e: 0,
		f: 1.60,
		p: 0.85
	},
	{
		a: 0.2,
		b: -0.26,
		c: 0.23,
		d: 0.22,
		e: 0,
		f: 1.60,
		p: 0.07
	},
	{
		a: -0.15,
		b: 0.28,
		c: 0.26,
		d: 0.24,
		e: 0,
		f: 0.44,
		p: 0.07
	}
];

function apply(p, op) {
 	var x1 = op.a * p.x + op.b * p.y + op.e;
	var y1 = op.c * p.x + op.d * p.y + op.f;
	return {x:x1, y:y1};
}

function choose(opts) {
	var rand = Math.random();
	var i = 0;
	while (rand > opts[i].p) {
		rand -= opts[i].p;
		i += 1;
	}
	return opts[i];
}

var point;

function setup() {
    resize(window.innerWidth, window.innerHeight);

	background(0);
	point = {x: Math.random(), y: Math.random()};
	translate(width/2, height);
}

function plot(x, y) {
	rect(80*point.x, -80*point.y, 0.3, 0.3);
}

function draw() {
	for (var i = 0; i < 100; i ++) {
		var op = choose(FERN);
		point = apply(point, op);
		fill(255);
		plot(point.x, point.y);
	}
}
