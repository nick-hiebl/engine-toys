function my_rect(x, y, w, h) {
    ctx.fillRect(x, y, w, h);
}

var i = 0;
var hp = 400;

function update() {
    if (random(1) < 0.3 || hp < 20) {
        hp = map(random(1)*random(1), 0, 1, 20, 400);
    }
    else {
        hp -= 8;
    }
}

function draw() {
    if (random(1) < 0.1) {
        return;
    }
    background(0);
    fill(255, 0, 0);
    ellipse(width/2, height/2, 200, 200);
    fill(0);
    my_rect(width/2-200, height/2-200, 400, 400-hp);
}
