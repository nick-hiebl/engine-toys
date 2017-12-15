function drawCage(x, y, state) {
    //rect(x, y - 10, 20, 20);
    ellipse(x, y - 10, 10, 10);
    lineWidth(5);
    line(x, y - 10, x, y + 50 + 100 * state);
    rect(x, y + 50 + 100 * state, 200, 100);
}

var wW, wH;

var yState;
var down, up;

function setup() {
    yState = 0;
    down = false;
    up = false;
}

function keyPressed(key) {
    if (key == 'W') {
        up = true;
    } else if (key == 'S') {
        down = true;
    }
}

function keyReleased(key) {
    if (key == 'W') {
        up = false;
    } else if (key == 'S') {
        down = false;
    }
}

function update(dt) {
    wW = window.innerWidth;
    wH = window.innerHeight;
    resize(window.innerWidth, window.innerHeight);

    if (up) {
        yState -= dt/1000;
    }
    if (down) {
        yState += dt/1000;
    }
    yState = Math.max(0, Math.min(1, yState));
}

function draw() {
    bg(0);
    fill(155);
    stroke(155);
    if (up) {
        rect(0, 0, 20, 20);
    }
    drawCage(wW/3, wH/2, yState);
    drawCage(2*wW/3, wH/2, 1 - yState);
}
