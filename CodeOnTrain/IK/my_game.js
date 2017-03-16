var IKSystem = {
	x: 0,
	y: 0,
	arms: [],
	lastArm: null,

	create: function() {
		var obj = Object.create(this);
		obj.init();
		return obj;
	},
	init: function() {},
	addArm: function(length) {
		var arm = Arm.create(0, 0, length, 0);
		if (this.lastArm) {
			arm.x = this.lastArm.getEndX();
			arm.y = this.lastArm.getEndY();
			arm.parent = this.lastArm;
		} else {
			arm.x = this.x;
			arm.y = this.y;
		}
		this.arms.push(arm);
		this.lastArm = arm;
		arm.num = this.arms.length;
	},
	draw: function() {
		for (var i = 0; i < this.arms.length; i ++) {
			if (i % 2 == this.arms.length % 2) {
				stroke(255, 0, 0);
				fill(255, 0, 0);
			} else {
				stroke(80, 200, 110);
				fill(80, 200, 110);
			}
			this.arms[i].draw();
		}
		ellipse(this.lastArm.getEndX(), this.lastArm.getEndY(), 10, 10);
	},
	drag: function(x, y) {
		this.lastArm.drag(x, y);
	}
}

var Arm = {
	x: 0,
	y: 0,
	length: 0,
	baseLength: 0,
	angle: 0,
	num: 0,
	parent: null,

	create: function(x, y, length, angle) {
		var obj = Object.create(this);
		obj.init(x, y, length, angle);
		return obj;
	},
	init: function(x, y, length, angle) {
		this.x = x;
		this.y = y;
		this.length = length;
		this.baseLength = length;
		this.angle = angle;
	},
	draw: function() {
		//stroke(0);
		lineWidth(10);
		ellipse(this.x, this.y, 5);
		line(this.x, this.y, this.getEndX(), this.getEndY());
	},
	pointAt: function(x, y) {
		var dx = x - this.x,
			dy = y - this.y;
		this.angle = Math.atan2(dy, dx);
	},
	drag: function(x, y) {
		this.pointAt(x, y);
		var dx = x - this.x,
			dy = y - this.y;
		this.x = x - Math.cos(this.angle) * this.length;
		this.y = y - Math.sin(this.angle) * this.length;
		if (this.parent) {
			this.parent.drag(this.x, this.y);
		}
	},
	getEndX: function() {
		return this.x + this.length * Math.cos(this.angle);
	},
	getEndY: function() {
		return this.y + this.length * Math.sin(this.angle);
	}
}

var iks;
var x;
var v;

var food;

function newFood() {
	food = new Vector(random(0.1, 0.9)*width, random(0.1, 0.9)*height);
}

function setup() {
    resize(window.innerWidth, window.innerHeight);
	iks = IKSystem.create();
	x = new Vector(width/2, height/2);
	v = new Vector();
	for (var i = 0; i < 5; i ++) iks.addArm(20);
	newFood();
}

function update() {
	v.x += random(-1, 1);
	v.y += random(-1, 1);
	if (x.x < 50) {
		v.x += 5;
	}
	if (x.x > width - 50) {
		v.x -= 5;
	}
	if (x.y < 50) {
		v.y += 5;
	}
	if (x.y > height - 50) {
		v.y -= 5;
	}
	var force = food.copy();
	force.sub(x);
	force.magnitude = 1;///(Vector.dist(x, v));
	v.add(force);
	if (v.magnitude > 10) v.normalise(10);
	x.add(v);
	iks.drag(x.x, x.y);
	if (Vector.dist(x, food) < 20) {
		iks.addArm(20);
		newFood();
	}
}

function draw() {
	background(255);
	iks.draw();

	fillColor('green');
	ellipse(food.x, food.y, 20);
}
