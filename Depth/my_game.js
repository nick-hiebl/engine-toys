function safe_sqrt(x, other) {
    if (x < 0) {
        return (other === undefined) ? 0 : other;
    }
    return sqrt(x)
}

function depth(x, y) {
    z = 0;
    //z = Math.max(z, safe_sqrt(80*80 - sqr(x-30) - sqr(y-50), 0)-30);
    q = new Vector(dX, dY).heading;
    z = Math.max(z, 2*safe_sqrt(40*40 - sqr(x-X) - sqr(y-Y), -100000) + 0);
    z = Math.max(z, depth2(x, y));
    return z;
}
function depth2(x, y) {
    m_v = new Vector(X, Y);
    m_q = m_v.heading;
    m_m = m_v.magnitude;

    v = new Vector(x, y);
    q = v.heading;
    m = v.magnitude;

    nX = m * cos(q - m_q + PI/2);
    nY = m * sin(q - m_q + PI/2);

    return safe_sqrt(40*40 - sqr(nX)/3 - sqr(nY - m_m), -100000);
}
function depth0(x, y) {
    return 0;
}

function Vect3D(x, y, z) {
    this.x = x;
    this.y = y;
    if (z === undefined) {
        this.z = depth(x, y);
    } else {
        this.z = z;
    }
}

var X = -30;
var Y = 0;
var dX = dY = 0;

var ROTATION = 0;

Vect3D.prototype.point = function() {
    a = 5*PI/6;
    x = -this.x * cos(ROTATION) - this.y * sin(ROTATION);
    y = -this.y * cos(ROTATION) + this.x * sin(ROTATION);
    z = this.z;
    u = x * cos(a) + y * cos(a + PI * 4/3) + z * cos(a - PI * 4/3);
    v = x * sin(a) + y * sin(a + PI * 4/3) + z * sin(a - PI * 4/3);
    return {x: u, y: v};
}

function myLine(v1, v2) {
    p1 = v1.point();
    p2 = v2.point();
    line(p1.x, p1.y, p2.x, p2.y);
}

var map = [];

var c = {
    x: -100,
    y: -100,
    z: 100
}

var minx = -20;
var maxx = 20;
var miny = -20;
var maxy = 20;
var xstep = 10;
var ystep = 10;

function setup() {
    console.log('setup called');
    for (var x = minx; x <= maxx; x ++) {
        row = [];
        for (var y = miny; y <= maxy; y ++) {
            row.push(new Vect3D(x*xstep, y*ystep));
        }
        map.push(row);
    }
    console.log('setup finished');
}

function update() {
    dX *= 0.99;
    dY *= 0.99;
    //d = new Vector(0, 0).dist(new Vector(X, Y));
    dX += random(-1, 1) - (X - 0) / 50;
    dY += random(-1, 1) - (Y - 0) / 50;
    X += dX;
    Y += dY;
    for (var i = 0; i < map.length; i ++) {
        x = (minx + i) * xstep;
        for (var j = 0; j < map[0].length; j ++) {
            y = (miny + j) * ystep;
            map[i][j].z = depth(x, y);
        }
    }
}

function draw() {
    fill(0);
    bg();
    stroke(255);
    save();
    translate(width/2, height/2);
    for (var x = 0; x < map.length; x ++) {
        for (var y = 0; y < map[x].length-1; y ++) {
            myLine(map[x][y], map[x][y+1]);
        }
    }
    for (var y = 0; y < map[0].length; y ++) {
        for (var x = 0; x < map.length - 1; x ++) {
            myLine(map[x][y], map[x+1][y]);
        }
    }
    restore();
    console.log('drawing');
}
