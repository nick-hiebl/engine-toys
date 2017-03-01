const G = 0.8;
function hsl(h, s, l) {
	fillColor('hsl(' + h + ',' + s + '%,' + l + '%)');
}
class Particle {
	constructor(x, y, dx, dy, mass) {
		this.regen = true;

		this.hue = random(360);

		this.pos = new Vector(x, y);
		this.vel = new Vector(dx, dy);
		this.acc = new Vector(0, 0);

		this.mass = mass;
		this.radius = -1;
		this.setRadius();

		this.alive = true;
	}

	setRadius() {
		this.radius = Math.pow((0.75 * this.mass / Math.PI), 1/3);
	}

	calcAcc(other) {
		var a = other.pos.copy();
		a.sub(this.pos);
		a.mul(G * this.mass * other.mass / sqr(this.pos.dist(other.pos)) / this.mass);
		return a;
	}

	wrapScreen() {
		if (this.pos.x > width) {
			this.pos.x = 1;
		}
		if (this.pos.x < 0) {
			this.pos.x = width - 1;
		}
		if (this.pos.y > height) {
			this.pos.y = 1;
		}
		if (this.pos.y < 0) {
			this.pos.y = height - 1;
		}
	}

	collides(other) {
		return (Vector.dist(this.pos, other.pos) < Math.max(this.radius, other.radius) );
	}

	doCollide(other) {
		if (this.collides(other)) {
			if (this.mass >= other.mass) {
				if (this.alive && other.alive) {
					this.eat(other);
				}
			} else {
				if (this.alive) {
					this.makeOffShoot(this.mass * 0.2, other);
					this.mass *= 0.8;
					other.eat(this);
				}
			}
		}
	}

	makeOffShoot(mass, other) {
		if (mass < 30) {
			return;
		}
		var offshoot = new Particle(this.pos.x, this.pos.y, 0, 0, mass);

		var vel = new Vector(random(1, 2), 0);
		var temp = offshoot.pos.copy();
		temp.sub(other.pos);
		temp.magnitude = this.radius + other.radius;
		offshoot.pos.add(temp);
		vel.heading = temp.heading + random(-1, 1);
		var temp2 = this.vel.copy();
		temp2.mul(0.1);
		//vel.add(temp2);
		offshoot.vel = vel;
		particles.push(offshoot);
	}

	eat(other) {
		this.vel.mul(this.mass);
		other.vel.mul(other.mass);
		this.vel.add(other.vel);
		this.vel.mul(1/(this.mass + other.mass));
		this.mass += other.mass;
		this.setRadius();
		other.die();

		other.makeOffShoot(other.mass * 0.2, this);
	}

	die() {
		if (this.regen) {
			respawn();
			this.alive = false;
		}
	}

	draw() {
		hsl(this.hue, 80, 50);
		//console.log('drawing')
		ellipse(this.pos.x, this.pos.y, this.radius);
	}

	update(dt) {
		this.acc.mul(dt);
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		this.acc.mul(0);
		this.vel.mul(0.99);
		if (this.vel.magnitude > 20) {
			this.vel.magnitude = 20;
		}
		this.wrapScreen();
	}

	applyGravity(other) {
		this.doCollide(other);
		this.acc.add(this.calcAcc(other));
	}
}

function respawn() {
	if (particles.length > num) return;
	var child = new Particle(random(0, width), random(0, height), random(-1, 1), random(-1, 1), random(120, 1600));
	particles.push(child);
}

var particles = [];
var num = 30;

function setup() {
    resize(window.innerWidth, window.innerHeight);

	for (var i = 0; i < num; i ++) {
		respawn();
	}
}

function update(dt) {
	for (var i = 0; i < particles.length; i ++) {
		for (var j = 0; j < particles.length; j ++) {
			if (i == j) continue;
			particles[i].applyGravity(particles[j]);
		}
	}
	for (var i = 0; i < particles.length; i ++) {
		if (!particles[i].alive) {
			particles.splice(i, 1);
			i --;
		}
	}
	for (var p of particles) {
		p.update(dt/100000);
	}
}

function draw() {
	background(255, 0.2);
	fill(0);
	for (var p of particles) {
		p.draw();
	}
}
