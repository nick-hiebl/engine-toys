class Line {
    constructor() {
        this.m = -1;
        this.b = 1;
        this.learning_rate = 0.05;
    }
    guess(x) {
        return this.m * x + this.b;
    }
    draw() {
        lineWidth(3);
        stroke(0, 255, 70);
        line(0, this.guess(0)*height, width, this.guess(1)*height);
    }
    gradient_descent(batch) {
        var dm = 0;
        var db = 0;
        for (var sample of batch) {
            var guess = this.m * sample.x + this.b;
            var error = sample.y - guess;

            dm += sample.x * error * this.learning_rate;
            db += error * this.learning_rate;
        }
        if (batch.length) {
            this.m += dm/batch.length;
            this.b += db/batch.length;
        }
    }
}

class Parabola {
    constructor() {
        this.a = 0;
        this.b = 1;
        this.c = 0;
        this.learning_rate = 0.15;
    }
    guess(x) {
        return this.a*x*x + this.b*x + this.c;
    }
    draw() {
        stroke(255, 0, 0);
        var delta = 10/width;
        for (var x = 0; x <= 1; x += delta) {
            line(x*width, this.guess(x)*height, (x+delta)*width, this.guess(x+delta)*height);
        }
    }
    gradient_descent(batch) {
        var da = 0, db = 0, dc = 0;
        for (var sample of batch) {
            var guess = this.guess(sample.x);
            var error = sample.y - guess;

            da += sample.x*sample.x * error * Math.E*Math.E * this.learning_rate;
            db += sample.x * error * Math.E * this.learning_rate;
            dc += error * this.learning_rate;
        }
        if (batch.length) {
            this.a += da/batch.length;
            this.b += db/batch.length;
            this.c += dc/batch.length;
        }
    }
}
class Exponential {
    constructor() {
        this.a = 0.1;
        this.b = 1;
        this.k = 1;
        this.c = 0.1;
        this.learning_rate = 0.05;
    }
    guess(x) {
        return this.a + this.b * Math.exp(this.k * x + this.c);
    }
    draw() {
        stroke(0, 255, 255);
        var delta = 0.1;
        for (var x = 0; x <= 1; x += delta) {
            //console.log('drawing');
            line(x*width, this.guess(x)*height, (x+delta)*width, this.guess(x+delta)*height);
        }
    }
    gradient_descent(batch) {
        var da = 0, dk = 0, db = 0, dc = 0;
        for (var sample of batch) {
            var expo = this.b * Math.exp(this.k*sample.x + this.c);
            var guess = this.a + expo;
            var error = sample.y - guess;

            da += error * this.learning_rate;
            dk += sample.x * expo * error * this.learning_rate;
            db += (expo/this.b) * error * this.learning_rate;
            dc += expo * error * this.learning_rate;
        }
        if (batch.length) {
            this.a += da/batch.length;
            this.k += dk/batch.length;
            this.b += db/batch.length;
            this.c += dc/batch.length;
        }
    }
}

var l = new Line();
var p = new Parabola();
var e = new Exponential();

var data;

function mousePressed(x, y) {
    var d = new Vector(x/width, y/height);
    data.push(d);
    //l.gradient_descent(data);
}

function setup() {
    resize(window.innerWidth, window.innerHeight);
    data = [];
}

function update() {
    resize(window.innerWidth, window.innerHeight);
    for (var i = 0; i < 10; i ++) {
        l.gradient_descent(data);
        p.gradient_descent(data);
        for (var j = 0; j < 5; j ++) {
            e.gradient_descent(data);
        }
    }
}

function draw() {
    background(0);
    l.draw();
    p.draw();
    e.draw();
    fill(255);
    for (var d of data) {
        ellipse(d.x*width, d.y*height, 3, 3);
    }
}
