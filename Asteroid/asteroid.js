function Asteroid() {
    this.vel = new Vector(random(1, 3), 0);
    this.vel.rotate(random(2*Math.PI));
    this.pos = new Vector(random(width), random(height));
    this.r = random(15, 50);
    this.angle = random(2*Math.PI);
    this.w = random(-0.05, 0.05);

    this.dead = false;

    this.calculateMesh();
}
Asteroid.prototype.calculateMesh = function() {
    this.mesh = [];
    n = 10;
    for (var i = 0; i < n; i ++) {
        q = 2 * Math.PI * i / n + random(-0.2, 0.2);
        r = this.r * random(0.6, 1.6);
        this.mesh.push(new Vector(r * cos(q), r * sin(q)));
    }
}
Asteroid.prototype.normaliseMesh = function(mesh) {
    this.mesh = [];
    for (var i of mesh) {
        this.mesh.push(i.copy());
        this.mesh[this.mesh.length-1].mul(this.r);
    }
}
Asteroid.prototype.show = function() {
    //ellipse(this.pos.x, this.pos.y, this.r, this.r);
    save();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    l = this.mesh.length;
    for (var i = 0; i < this.mesh.length; i ++) {
        line(this.mesh[i].x, this.mesh[i].y,
            this.mesh[(i+1)%l].x, this.mesh[(i+1)%l].y)
    }
    restore();
}
Asteroid.prototype.wrapBox = Player.prototype.wrapBox;
Asteroid.prototype.update = function() {
    this.pos.add(this.vel);
    this.wrapBox();
    this.angle += this.w;
}
Asteroid.prototype.breakup = function() {
    var children = [];
    if (this.r < 20) {
        return children;
    }
    var baby_mesh = [];
    for (var m of this.mesh) {
        baby_mesh.push(m.copy());
        baby_mesh[baby_mesh.length-1].mul(1/this.r);
    }
    for (var i = 0; i < random(1.1,2.6); i ++) {
        child = new Asteroid();
        child.pos = this.pos.copy();
        child.r = this.r * random(0.3, 0.6);
        child.vel.mul(0.3);
        child.vel.add(this.vel);
        child.w = this.w + random(-0.02, 0.02);
        child.normaliseMesh(baby_mesh);
        children.push(child);
    }
    return children;
}
