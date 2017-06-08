var dx = 1, dy = 0;

function keyPressed(key) {
    switch(key) {
        case 'UP':
            timer *= 0.9;
            break;
        case 'DOWN':
            timer /= 0.9;
            break;
        case 'A':
            if (dx != 1) {
                dx = -1;
                dy = 0;
            }
            break;
        case 'W':
            if (dy != 1) {
                dx = 0;
                dy = -1;
            }
            break;
        case 'S':
            if (dy != -1) {
                dx = 0;
                dy = 1;
            }
            break;
        case 'D':
            if (dx != -1) {
                dx = 1;
                dy = 0;
            }
            break;
    }
}
var d = new Date();
var t = d.getTime();
var tiles_x = 20;
var tiles_y = 20;
var tx, ty;
var head = new Vector(floor(tiles_x/2), floor(tiles_y/2));
function setup() {
    tx = width/tiles_x;
    ty = height/tiles_y;
}
function newApple() {
    return new Vector(floor(random(tiles_x)), floor(random(tiles_y)));
}
var tail = [];
var apple = newApple();
function move() {
    console.log("moving");
    head.x += dx;
    head.y += dy;
    if (head.x < 0 || head.x >= tiles_x || head.y < 0 || head.y >= tiles_y) {
        die();
        return;
    }
    tail.push(new Vector(head.x - dx, head.y - dy));
    if (head.x == apple.x && head.y == apple.y) {
        apple = newApple();
    }
    else {
        tail.splice(0, 1);
    }
    for (var t of tail) {
        if (t.x == head.x && t.y == head.y) {
            die();
            return;
        }
    }
}
var timer = 300;
function update() {
    d = new Date();
    if (d.getTime() - t > timer) {
        move();
        t = d.getTime();
    }
}
function shadow(x, y) {
    fill(40, 0.3);
    r(x + 0.1, y + 0.1);
}
function led(x, y) {
    fill(0, 0.6);
    r(x, y);
}
function r(x, y) {
    nRect(x*tx, y*ty, tx * 0.95, ty * 0.95);
}
function draw_apple(x, y) {
    fill(40, 0.3);
    r2(x + 0.1, y + 0.1);
    fill(0, 0.6);
    r2(x, y);
}
function r2(x, y) {
    ellipse(x*tx+tx/2, y*ty+ty/2, tx/2 * 0.9, ty/2 * 0.9);
}
function draw() {
    background(110, 140, 40);
    shadow(head.x, head.y);
    for (var s of tail) shadow(s.x, s.y);
    led(head.x, head.y);
    for (var s of tail) led(s.x, s.y);
    draw_apple(apple.x, apple.y);
}
function die() {
    apple = newApple();
    tail = [];
    head = new Vector(floor(tiles_x/2), floor(tiles_y/2));
    dx = 1;
    dy = 0;
}
