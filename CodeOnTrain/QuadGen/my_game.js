function hsl(col) {
	var c = 'hsl(' + col.h + ', ' + col.s + '%, ' + col.l +'%)'
	strokeColor(c);
}

class Quad {
	constructor(x, y, w, h, limit) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;

		this.limit = limit || 4;

		this.parent = false;
		this.children = [];
		this.points = [];
	}

	overlap(x, y, w, h) {
		return (this.x < x + w && x < this.x + this.w && this.y < y + h && y < this.y + this.h);
	}

	contains(p) {
		return (this.x <= p.x && p.x < this.x + this.w && this.y <= p.y && p.y < this.y + this.h);
	}

	addPoint(p) {
		if (this.contains(p)) {
			if (this.parent) {
				for (var child of this.children) {
					child.addPoint(p);
				}
			}
			else {
				this.points.push(p);
				if (this.points.length > this.limit) {
					this.becomeParent();
				}
			}
		}
	}

	addChild(child) {
		console.assert(this.parent == true);
		this.children.push(child);
	}

	becomeParent() {
		this.parent = true;
		var x = this.x, y = this.y, w = this.w, h = this.h;
		this.addChild(new Quad(x, y, w/2, h/2, this.limit));
		this.addChild(new Quad(x + w/2, y, w/2, h/2, this.limit));
		this.addChild(new Quad(x, y + h/2, w/2, h/2, this.limit));
		this.addChild(new Quad(x + w/2, y + h/2, w/2, h/2, this.limit));

		var points = this.points;
		this.points = [];
		for (var p of points) {
			for (var child of this.children) child.addPoint(p);
		}
	}

	draw() {
		stroke(0, 255, 70);
		SETTINGS.stroke = true;
		SETTINGS.fill = false;
		nRect(this.x, this.y, this.w, this.h);
		for (var c of this.children) c.draw();
		for (var p of this.points) ellipse(p.x, p.y, 3, 3);
	}

	query(x, y, w, h) {
		var matches = [];
		if (!this.overlap(x, y, w, h)) return matches;
		if (this.parent) {
			for (var c of this.children) {
				var points = c.query(x, y, w, h);
				for (var point of points) {
					matches.push(point);
				}
			}
		}
		else {
			for (var point of this.points) {
				if (x <= point.x && point.x <= x + w && y <= point.y && point.y <= y + h) {
					matches.push(point);
				}
			}
		}
		return matches;
	}
}

function nRect(x, y, w, h) {
	rect(x + w/2, y + h/2, w, h);
}

function contains(list, val) {
	for (let n of list) if (n == val) return true;
	return false;
}

class Tile {
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;

		this.level = 0;

		this.roadFrom = [];
	}

	get4Adjacent() {
		var adjacents = [];
		for (var x of [-1, 1]) {
			var query = q.query(this.x + x * this.w - 1, this.y - 1, 2, 2);
			console.assert(query.length < 2);
			if (query.length < 1) continue;
			adjacents.push(query[0]);
		} for (var y of [-1, 1]) {
			var query = q.query(this.x - 1, this.y + y * this.h - 1, 2, 2);
			console.assert(query.length < 2);
			if (query.length < 1) continue;
			adjacents.push(query[0]);
		}
		return adjacents;
	}

	checkAdjacent(level) {
		var neighbours = this.get4Adjacent();
		if (neighbours.length < 4) return false;
		for (var n of neighbours) if (n.level < level) return false;
		return true;
	}

	upgrade() {
		if (!this.checkAdjacent(this.level)) return;
		var x = this.x,
			y = this.y,
			w = this.w,
			h = this.h;
		if (this.level === 0) {
			this.town = new Vector(random(x + w/5, x + w - w/5), random(y + h/5, y + h - h/5));
			this.level = 1;
		} else if (this.level === 1) {
			this.level = 2;
			this.neighbour = undefined;

			var opt = this.get4Adjacent();
			console.assert(opt.length == 4);
			while (opt.length > 0 && this.neighbour === undefined) {
				let n = floor(random(opt.length));
				if (!contains(this.roadFrom, opt[n])) {
					this.neighbour = opt[n];
					this.neighbour.roadFrom.push(this);
				}
			}
		} else if (this.level === 2) {
			this.colour = {
				h: floor(random(360)),
				s: floor(random(70, 100)),
				l: floor(random(50, 80)),
			}
			this.level = 3;
		}
	}

	draw() {
		stroke(255);
		nRect(this.x, this.y, this.w, this.h);
		if (this.level >= 1)
			ellipse(this.town.x, this.town.y, 3, 3);
		if (this.level >= 3) {
			hsl(this.colour);
		}
		if (this.level >= 2) {
			ellipse(this.town.x, this.town.y, 6, 6);
			console.log(this.neighbour);
			if (this.neighbour === undefined) {
				fontSize(64);
				centerText("There's a problem. Tell Nick.", width/2, height/2);
			}
			else
				line(this.town.x, this.town.y, this.neighbour.town.x, this.neighbour.town.y);
		}
	}
}

var q;

var offset = {
	x: 0,
	y: 0
}

function dothing() {
	for (var i = 0; i < 100; i ++) {
		mousePressed(random(0, width), random(0, height));
	}
}

function dothing2() {
	for (var i = 0; i < 100; i ++) {
		var x = random(0, width);
		var y = random(0, x);
		var x_sign = (random(2) < 1) ? 1 : -1;
		var y_sign = (random(2) < 1) ? 1 : -1;
		mousePressed(width/2 + (x - y) * x_sign, height/2 + y * y_sign);
	}
}

const QUAD_SIZE = 1000000;

function setup() {
    resize(window.innerWidth, window.innerHeight);
	background(0);
	q = new Quad(-QUAD_SIZE/2, -QUAD_SIZE/2, QUAD_SIZE, QUAD_SIZE, 5);
}

const TILE_SIZE = 100;

function draw() {
	SETTINGS.fill = true;
	SETTINGS.stroke = false;
	background(0);
	save();
	translate(-offset.x, -offset.y);
	stroke(255);
	SETTINGS.fill = false;
	SETTINGS.stroke = true;
	var points = q.query(offset.x - width/2, offset.y - height/2, width * 2, height * 2);
	for (var point of points) {
		//ellipse(point.x, point.y, 3, 3);
		point.draw();
		//console.log(point.x, point.y);
	}
	restore();
}

function keyPressed(key) {
	if (key == 'A') {
		offset.x -= 20;
	}
	if (key == 'W') {
		offset.y -= 20;
	}
	if (key == 'S') {
		offset.y += 20;
	}
	if (key == 'D') {
		offset.x += 20;
	}
}

function mousePressed(x, y) {
	x = floor(x);
	y = floor(y);
	x += offset.x;
	x = floor(x/TILE_SIZE) * TILE_SIZE;
	y += offset.y;
	y = floor(y/TILE_SIZE) * TILE_SIZE;
	var query = q.query(x-1, y-1, 2, 2);
	console.assert(query.length < 2);
	if (query.length === 0) {
		q.addPoint(new Tile(x, y, TILE_SIZE, TILE_SIZE));
	}
	if (query.length === 1) {
		query[0].upgrade();
	}
}
