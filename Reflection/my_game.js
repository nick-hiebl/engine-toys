var point;
var vel;
var center;

function randUnitVector(r) {
	let p = new Vector(r, 0);
	p.heading = random(100000);
	return p;
}

function setup() {
    resize(window.innerWidth, window.innerHeight);
	background(255);
	point = new Vector(random(0, width), random(0, height));
	vel = new Vector(0, 0);
	center = new Vector(width/2, height/2);
}
function update() {
	point.add(vel);
	vel.add(randUnitVector(0.1));
	let c = center.copy();
	c.sub(point);
	c.magnitude = Math.exp(c.magnitude/2000000000)/10;
	vel.add(c);
	vel.mul(0.999);
}
function unit(p) {
	return;
}
function flipX(p) {
	p.x = width - p.x;
}
function flipY(p) {
	p.y = height - p.y;
}
function flipXY(p) {
	flipX(p);
	flipY(p);
}
function diag(p) {
	let temp = p.x - width/2 + height/2;
	p.x = p.y - height/2 + width/2;
	p.y = temp;
}
function rot(p, q) {
	p.sub(center);
	p.heading += q;
	p.add(center);
}
function r(q) {
	return function(p) {
		rot(p, q);
	}
}
function draw() {
	background(255, 0.12);
	fill(0, 0.2);
	//ellipse(point.x, point.y, 6);
	const pi = Math.PI;
	var n = 1;
	for (var f of [
		r(0), r(pi/6), r(pi/3), r(pi/2), r(2*pi/3), r(5*pi/6),
		r(pi + 0.3), r(7*pi/6 + 0.3), r(4*pi/3 + 0.3), r(3*pi/2 + 0.3), r(5*pi/3 + 0.3), r(11*pi/6 + 0.3)
	])
	{
		let p = point.copy();
		n = 1 - n;
		f(p);
		if (n) {
			diag(p);
		}
		ellipse(p.x, p.y, 2);
		/*for (var f2 of [unit, diag]) {
			let p2 = p.copy();
			f2(p2);
			ellipse(p2.x, p2.y, 6);
		}*/
	}

}
