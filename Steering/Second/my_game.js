class Vehicle {
    constructor(x, y) {
        this.pos = new Vector(x, y);
        this.vel = Vector.randUnit();
        this.acc = new Vector();

        this.maxSpeed = random(100, 200);
        this.maxForce = random(3, 8);

        this.seekWeight = 1;
        //this.fleeWeight = random(1);
        //this.alignWeight = random(1);
    }

    approach(target, dt) {
        if (this.pos.dist(target) < 100) {
            this.arrive(target, dt);
        } else {
            this.seek(target, dt);
        }
    }

    arrive(target, dt) {
        var desired = target.copy();
        desired.sub(this.pos);
        desired.magnitude = map(desired.magnitude, 0, 100, 0, dt/1000 * this.maxSpeed);
        if (desired.magnitude < 2) {
            desired.mul(0.5);
        }
        desired.sub(this.vel);
        this.acc.add(desired.mul(this.seekWeight));
    }

    seek(target, dt) {
        var desired = target.copy();
        desired.sub(this.pos);
        desired.magnitude = dt/1000 * this.maxSpeed;
        desired.sub(this.vel);
        this.acc.add(desired.mul(this.seekWeight));
    }

    flee(targets, dt) {
        var desired = new Vector();
        for (var target of targets) {
            if (this.pos.dist(target) < 20) {
                let t = this.pos.copy();
                t.sub(target);
                t.magnitude = map(t.magnitude, 20, 0, 0, 1);
                desired.add(t);
            }
        }
        desired.normalise();
        desired.mul(dt/1000 * this.maxSpeed);
        desired.sub(this.vel);
        this.acc.add(desired.mul(this.fleeWeight));
    }

    align(others, dt) {
        var desired = new Vector();
        for (var other of others) {
            if (this.pos.dist(other.pos) < 50) {
                let t = other.vel.copy();
                t.magnitude = map(this.pos.dist(other.pos), 50, 0, 0, 1);
                desired.add(t);
            }
        }
        desired.normalise();
        desired.mul(dt/1000 * this.maxSpeed);
        desired.sub(this.vel);
        this.acc.add(desired.mul(this.alignWeight));
    }

    update(dt) {
        if (this.acc.magnitude == 0) {
            this.acc.mul(0);
        } else {
            this.acc.normalise();
            this.acc.mul(dt/1000 * this.maxForce);
        }
        this.vel.add(this.acc);
        if (this.vel.magnitude > this.maxSpeed) {
            this.vel.magnitude = this.maxSpeed * dt/1000;
        }
        this.pos.add(this.vel);
        var e = 10;
        if (this.pos.x < -e) {
            this.pos.x += width + 2*e;
        } if (this.pos.x > width + e) {
            this.pos.x -= (width + 2*e);
        } if (this.pos.y < -e) {
            this.pos.y += height + 2*e;
        } if (this.pos.y > height + e) {
            this.pos.y -= (height + 2*e);
        }

        this.acc.mul(0);
    }

    draw() {
        var h = this.vel.heading;

        fill(map(this.maxSpeed, 100, 200, 50, 255),
            map(this.maxForce, 3, 8, 50, 255),
            0);// map(this.alignWeight, 0, 1, 50, 200));
        triangle(this.pos.x + cos(h) * 5, this.pos.y + sin(h) * 5,
                this.pos.x + cos(h - 2.5) * 4, this.pos.y + sin(h - 2.5) * 4,
                this.pos.x + cos(h + 2.5) * 4, this.pos.y + sin(h + 2.5) * 4);
    }
}

var vehicles = [];

function setup() {
    resize(window.innerWidth, window.innerHeight);
    background(0);
    for (var i = 0; i < 200; i ++) {
        let v = new Vehicle(random(width), random(height))
        vehicles.push(v);
    }
}

function update(dt) {
    for (var v of vehicles) {
        //if (v.pos.dist(new Vector(MOUSE.x, MOUSE.y)) < 100) {
        v.approach(new Vector(MOUSE.x, MOUSE.y), dt);
        //}
        //v.flee(targets, dt);
        //v.align(vehicles, dt);
        //console.log(v.pos, v.vel);
        v.update(dt);
    }
}

function draw() {
    background(0);
    stroke(0);
    fill(200, 0.2);
    ellipse(MOUSE.x, MOUSE.y, 100, 100);
    for (var v of vehicles)
        v.draw();
}
