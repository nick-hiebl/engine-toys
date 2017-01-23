class Angle3D {
    constructor(pitch, yaw) {
        this.pitch = pitch;
        this.yaw = yaw;
    }
}

class Camera {
    constructor(pos, orientation) {
        this.pos = pos;
        this.orientation = orientation;
    }
}

class Vec3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(other) {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
    }

    sub(other) {
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;
    }

    mul(factor) {
        this.x *= factor;
        this.y *= factor;
        this.z *= factor;
    }

    mag() {
        return Math.pow(sqr(this.x) + sqr(this.y) + sqr(this.z), 0.5);
    }

    get yaw() {
        return this.heading;
    }

    get pitch() {
        return Vector(new Vector(this.x, this.y).magnitude, this.z).heading;
    }

    get roll() {
        return 0;
    }

    normalise(n = 1) {
        var mag = this.magnitude;
        mag /= n;

        if (mag != 0) {
            this.x /= mag;
            this.y /= mag;
            this.z /= mag;
        }
    }

    get magnitude() {
        return Math.sqrt(sqr(this.x) + sqr(this.y) + sqr(this.z));
    }

    set magnitude(n) {
        this.normalise(n);
    }

    dist(other) {
        var x = this.x - other.x;
        var y = this.y - other.y;
        var z = this.z - other.z;
        return sqrt(sqr(x) + sqr(y) + sqr(z));
    }

    static dist(a, b) {
        return a.dist(b);
    }

    copy() {
        return new Vec3(this.x, this.y, this.z);
    }
}

class Line {
    constructor(a, b) {
        this.a = a;
        this.b = b;
    }

    /*interpolated(x) {
        var c = this.a.copy();
        var d = this.b.copy();

        var e = new Vec3();
        c.mul(1 - x);
        d.mul(x);

        e.add(c);
        e.add(d);

        return e;
    }*/

    draw(c, q, e) {
        /*var points = [];

        for (var n = 0; n <= 10; n ++) {
            var r = n / 10;
            var p = this.interpolated(r);

            points.push(THREE_DEE(p, c, q, e));
        }

        for (var i = 0; i < points.length - 1; i ++) {
            line(points[i].x, points[i].y, points[i+1].x, points[i+1].y);
        }*/
        var p1 = THREE_DEE(this.a, c);
        var p2 = THREE_DEE(this.b, c);

        line(p1.x, p1.y, p2.x, p2.y);
    }
}

function THREE_DEE(a, camera) {
    var d = new Vec3();

    var c = camera.pos;
    var q = camera.orientation;

    var x = a.x - c.x;
    var y = a.y - c.y;
    var z = a.z - c.z;

    var rot = new Vector(x, z);
    rot.heading += q.yaw;

    x = rot.x;
    z = rot.y;

    var rot = new Vector(y, z);
    rot.heading += q.pitch;

    y = rot.x;
    if (z < 0) {
        return 0;
    }

    z = rot.y;

    var b = new Vector();
    b.x = x / z * width/2;
    b.y = y / z * width/2;

    return b;
}

class Spot {
    constructor(x, y, z) {
        this.pos = new Vec3(x, y, z);
    }

    draw(c) {
        var p = THREE_DEE(this.pos, c);
        fill(255);
        ellipse(p.x, p.y, 2, 2);
    }
}

var lines = [];

function setup() {
    for (var ele = 0; ele <= 12; ele ++) {
        var qEle = map(ele, 0, 12, -PI/2, PI/2);
        for (var yaw = 0; yaw < 24; yaw += 1) {
            var qYaw = map(yaw, 0, 24, 0, 2*PI);

            var R = 1;
            var r = R * cos(qEle);
            var y = R * sin(qEle);

            var x = r * sin(qYaw);
            var z = r * cos(qYaw);

            //console.log(x, y, z)
            lines.push(new Spot(x, y, z));
        }
    }

}

var t = 0;

function draw() {
    t += 0.1;

    background(0);
    stroke(255);

    save();
    translate(width/2, height/2);

    var r = 8 - 2 * cos(t/20);

    var pos = new Vec3(r*sin(t/10), 3 * sin(t/30), r*cos(t/10));

    var camera = new Camera(pos, new Angle3D(0.1 * sin(t), - new Vector(pos.x, pos.z).heading - PI/2));

    for (var line of lines) {
        line.draw(camera);
    }

    restore();
}
