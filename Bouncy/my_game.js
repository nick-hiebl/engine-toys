var squares;

var Square = function(x, y) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(3, 4);
    this.size = new Vector(16, 8);
    this.max_vel = 5;
    this.padding = 10;

    this.vel.rotate(random(Math.PI * 2));

    this.show = function() {
        fill(255);
        save();
        translate(this.pos.x, this.pos.y);
        rotate(this.vel.heading);
        ellipse(0, 0, this.size.x, this.size.y);
        restore();
    }

    this.update = function() {
        this.pos.add(this.vel);
        if (this.pos.x+this.padding > width || this.pos.x-this.padding < 0) {
            this.vel.x *= -1;
            this.vel.normalise(this.max_vel);
        } if (this.pos.y+this.padding > height || this.pos.y-this.padding < 0) {
            this.vel.y *= -1;
            this.pos.add(this.vel);
            this.vel.normalise(this.max_vel);
        }
    }
}

function setup() {
    squares = [];
    for (var i = 0; i < 5; i ++) {
        var temp = new Square(random(width/4, 3*width/4), random(height/4, 3*height/4));
        squares.push(temp);
    }
    fill(1);
    bg();
}

function update() {
    for (var i of squares) {
        i.update();
    }
}

function draw() {
    fill(0, 0.2);
    bg();
    for (var i of squares) {
        i.show();
    }
}
