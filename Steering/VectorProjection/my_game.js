function dot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
}

var a;
var b;

function setup() {
    resize(window.innerWidth, window.innerHeight);
    a = new Vector(random(0.1, 0.4) * width, random(0.2, 0.7) * height);
    b = new Vector(random(0.6, 0.9) * width, random(0.3, 0.8) * height);
}

function keyPressed(key) {
    if (key == 'R') {
        setup();
    }
}

function draw() {
    background(255);
    fill(0);
    fontSize(15);
    text('Press \'r\' to get a new line', 10, 30)
    stroke(0);
    lineWidth(3)
    ellipse(a.x, a.y, 5, 5);
    ellipse(b.x, b.y, 5, 5);
    line(a.x, a.y, b.x, b.y);
    ellipse(MOUSE.x, MOUSE.y, 5, 5);
    line(a.x, a.y, MOUSE.x, MOUSE.y);

    var ba = b.copy().sub(a);
    var ma = new Vector(MOUSE.x, MOUSE.y).sub(a);

    var dotProduct = dot(ba, ma);
    dotProduct /= ba.magnitude;
    //dotProduct /= ma.magnitude;
    var c = ba.normalise(dotProduct).add(a);
    line(c.x, c.y, MOUSE.x, MOUSE.y);
    fill(255, 0, 0);
    ellipse(c.x, c.y, 5, 5);
}
