function constrict(val, low, high) {
    return min(high, max(val, low));
}

function Rectangle(x, y, w, h, hp) {
    this.pos = new Vector(x, y);
    this.width = w;
    this.height = h;
    this.dead = false;

    this.hp = hp || 3;

    this.r = colours[this.hp-1][0];
    this.g = colours[this.hp-1][1];
    this.b = colours[this.hp-1][2];

    this.vel = new Vector(0, 0);

    this.draw = function() {
        fill(this.r, this.g, this.b);
        rect(this.pos.x, this.pos.y, this.width, this.height);
    }
    this.update = function() {
        this.pos.add(this.vel);

        this.pos.x = constrict(this.pos.x, 0+this.width/2, width-this.width/2);
        this.pos.y = constrict(this.pos.y, 0+this.height/2, height-this.height/2);
    }
    this.pointInside = function(vector) {
        return (vector.x > this.pos.x - this.width/2) && (vector.x < this.pos.x + this.width/2) && (vector.y > this.pos.y - this.height/2) && (vector.y < this.pos.y + this.height/2);
    }
    this.onCollide = function() {
        this.hp --;
        if (this.hp <= 0){
            this.dead = true;
            score++;
            return;
        }
        this.r = colours[this.hp-1][0];
        this.g = colours[this.hp-1][1];
        this.b = colours[this.hp-1][2];
    }
}

function Paddle(x, y, w, h) {
    Rectangle.call(this, x, y, w, h);
    this.r = 0;
    this.g = 0;
    this.b = 0;
}

var colours = [ [255, 0, 0], [0, 255, 0], [0, 0, 255] ];


function Ball(x, y, radius, speed) {
    this.pos = new Vector(x, y);
    this.radius = radius;
    this.vel = new Vector(speed, 0);
    this.vel.rotate(PI/4);
    this.speed = speed;
}
Ball.prototype.draw = function() {
    fill(0);
    ellipse(this.pos.x, this.pos.y, this.radius, this.radius);
}
Ball.prototype.update = function(rectangles) {
    this.pos.x += this.vel.x;
    for (var r of rectangles) {
        if (this.collides(r)) {
            r.onCollide();
            if (this.vel.x > 0) {
                this.pos.x = r.pos.x - r.width/2 - this.radius;
            }
            if (this.vel.x < 0) {
                this.pos.x = r.pos.x + r.width/2 + this.radius;
            }
            this.vel.x = -this.vel.x;
            break;
        }
    }
    if (this.pos.x - this.radius < 0) {
        this.pos.x = this.radius;
        this.vel.x = -this.vel.x;
    }
    if (this.pos.x + this.radius > width) {
        this.pos.x = width - this.radius;
        this.vel.x = -this.vel.x;
    }
    this.pos.y += this.vel.y;
    for (var r of rectangles) {
        if (this.collides(r)) {
            r.onCollide();
            if (this.vel.y > 0) {
                this.pos.y = r.pos.y - r.height/2 - this.radius;
            }
            if (this.vel.y < 0) {
                this.pos.y = r.pos.y + r.height/2 + this.radius;
            }
            this.vel.y = -this.vel.y;
            break;
        }
    }
    if (this.pos.y - this.radius < 0) {
        this.pos.y = this.radius;
        this.vel.y = -this.vel.y;
    }
    if (this.pos.y + this.radius > height) {
        this.pos.y = height - this.radius;
        this.vel.y = -this.vel.y;
    }
}
Ball.prototype.collides = function(rectangle) {
    for (var i = 0; i < 2 * PI; i += PI/8) {
        var pos = this.pos.copy();
        var rel = new Vector(this.radius, 0);
        rel.rotate(i);
        pos.add(rel);
        if (rectangle.pointInside(pos)) {
            return true;
        }
    }
    return false;
}

var blocks = [];
var ball;
var paddle;

var left;
var right;

var score;

function keyPressed(key) {
    if (key === 'A') {
        left = true;
    } if (key === 'D') {
        right = true;
    }
}

function keyReleased(key) {
    if (key === 'A') {
        left = false;
    } if (key === 'D') {
        right = false;
    }
}

function setup() {
    score = 0;

    ball = new Ball(width/2, height/2, 5, 4);
    paddle = new Paddle(width/2, height-20, 90, 10);

    var w = 55;
    var h = 10;
    for (var x = 0; x < 10; x++) {
        for (var y = 0; y < 10; y++) {
            blocks.push(new Rectangle(map(x, 0, 9, 150, width-150), map(y, 0, 9, 150, 250), w, h, floor(map(y, 0, 9, 3.3, 1) + random(0.4))));
        }
    }

    left = false;
    right = false;
}

function update() {
    ball.update(blocks);

    for (var i = 0; i < blocks.length; i ++) {
        if (blocks[i].dead) {
            blocks.splice(i, 1);
            i--;
        }
    }

    if (left && !right) {
        paddle.vel.x = -5;
    } else if (right && !left) {
        paddle.vel.x = 5;
    } else {
        paddle.vel.x = 0;
    }
    paddle.update();
    if ( ball.collides(paddle) && (ball.pos.y < paddle.pos.y - paddle.height/2) ) {
        ball.vel = new Vector(ball.speed, 0);
        ball.pos.y = paddle.pos.y - paddle.height/2 - ball.radius - 1;
        var angle = map(ball.pos.x - paddle.pos.x, -paddle.width/2, paddle.width/2, -PI, 0);
        ball.vel.rotate(angle);
    }
}

function draw() {
    background(255);
    fill(0);
    text('Score: '+score, 10, 30);

    ball.draw();

    for (var b of blocks) {
        b.draw();
    }

    paddle.draw();
}
