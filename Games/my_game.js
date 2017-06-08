var dx = 0, dy = 0;

function keyPressed(key) {
    switch(key) {
        case 'A':
            dx = -1;
            dy = 0;
            break;
        case 'W':
            dx = 0;
            dy = -1;
            break;
        case 'S':
            dx = 0;
            dy = 1;
            break;
        case 'D':
            dx = 1;
            dy = 0;
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
    tail.push(new Vector(head.x - dx, head.y - dy));
    if (head.x == apple.x && head.y == apple.y) {
        apple = newApple();
    }
    else {
        tail.splice(0, 1);
    }
}
function update() {
    d = new Date();
    if (d.getTime() - t > 300) {
        move();
        t = d.getTime();
    }
}
function draw() {
    background(255);
    fill(255, 0, 0);
    rect(head.x *tx, head.y *ty, tx, ty);
    for (var s of tail) rect(s.x *tx, s.y *ty, tx, ty);
    fill(0, 255, 0);
    rect(apple.x *tx, apple.y *ty, tx, ty);
}
