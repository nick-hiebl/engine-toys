function Bullet(ship) {
    this.speed = 30;
    this.pos = ship.pos.copy();
    this.vel = new Vector(this.speed, 0);
    this.vel.rotate(ship.heading);

    this.dead = false;
}
Bullet.prototype.update = function() {
    this.pos.add(this.vel);
}
Bullet.prototype.show = function() {
    ellipse(this.pos.x, this.pos.y, 3, 3);
}

function Player() {
    this.pos = new Vector(width/2, height/2);
    this.vel = new Vector(0, 0);
    this.acc = new Vector(0, 0);
    this.r = 10;
    this.heading = 0;
    this.forwards = false;
    this.left = false;
    this.right = false;
    this.speed = 0.1;
    this.rotSpeed = 0.1;
}
Player.prototype.update = function(dt) {
    //this.heading = this.vel.heading();
    this.handleKeys();
    this.vel.add(this.acc);
    this.acc.mul(0);
    this.pos.add(this.vel);

    this.wrapBox();
}
Player.prototype.wrapBox = function() {
    this.pos.x = (this.pos.x + EDGE_SIZE) % (width + 2 * EDGE_SIZE) - EDGE_SIZE;
    if (this.pos.x + EDGE_SIZE < 0) {
        this.pos.x += width + 2 * EDGE_SIZE;
    }
    this.pos.y = (this.pos.y + EDGE_SIZE) % (height + 2 * EDGE_SIZE) - EDGE_SIZE;
    if (this.pos.y + EDGE_SIZE < 0) {
        this.pos.y += height + 2 * EDGE_SIZE;
    }
}
Player.prototype.handleKeys = function() {
    if (this.forwards) {
        myAcc = new Vector(1, 0);
        myAcc.mul(this.speed);
        myAcc.rotate(this.heading);
        this.addForce(myAcc);
    }
    this.vel.mul(0.99);

    if (this.right && !this.left) {
        //this.vel.rotate(this.rotSpeed);
        this.heading += this.rotSpeed;
    } else if (this.left && !this.right) {
        //this.vel.rotate(-this.rotSpeed);
        this.heading += -this.rotSpeed;
    }
}
Player.prototype.addForce = function(f) {
    this.acc.add(f);
}
Player.prototype.show = function() {
    stroke(255);
    save();
    translate(this.pos.x, this.pos.y);
    rotate(this.heading + Math.PI/2);
    triangle(-this.r, this.r, this.r, this.r, 0, -this.r * 1.5);
    restore();
}
Player.prototype.shoot = function() {
    return new Bullet(this);
}
