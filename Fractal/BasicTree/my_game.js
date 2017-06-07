function tree(length, r, angle, n) {
    if (n < 0) return;
    lineWidth(Math.log(length));
    line(0, 0, 0, -length);
    save();
    translate(0, -length);
    rotate(-angle);
    tree(length*r, r, angle, n-1);
    rotate(angle*2);
    tree(length*r, r, angle, n-1);
    restore();
}

function setup() {
    resize(window.innerWidth, window.innerHeight);
}

function draw() {
    background(0);
    stroke(255);
    save();
    translate(width/2, height);
    tree(240, map(MOUSE.y, 0, height, 0.8, 0), map(MOUSE.x, 0, width, 0, Math.PI), 10);
    restore();
    fill(255);
    fontSize(40);
    fontFace('Courier New')
    centerText("Mouse x indicates curliness, mouse y indicates size", width/2, 60);
}
