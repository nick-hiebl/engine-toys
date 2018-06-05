class Circle {
    constructor(x, y, col) {
        this.x = x;
        this.y = y;
        this.r = 1;
        this.dead = false;
        this.col = col || {
            r: random(255),
            g: random(255),
            b: random(255)
        }
    }

    check_others(others) {
        for (var c of others) {
            if (c !== this) {
                if (dist(this.x, this.y, c.x, c.y) < this.r + c.r + 2) {
                    this.dead = true;
                    return;
                }
            }
        }
    }

    update(others) {
        if (!this.dead) {
            this.r += 1/sqrt(this.r);
            this.check_others(others);
        }
    }

    draw() {
        lineWidth(2);
        SETTINGS.fill = false;
        SETTINGS.stroke = true;
        strokeColor(this.col);
        ellipse(this.x, this.y, this.r, this.r);
    }
}

function writeText() {
    background(0);
    save();
    translate(width/2, height/2);
    rotate(random(-0.5, 0.5));
    fontSize(140);
    fontFace("Arial Black");
    fill(255);
    centerText('SEND', 0, -60);
    centerText('NUDES', 0, 90);
    restore();
}

var my_image = new Sprite('windows.png', 1, 1);
var my_data;

var spots = [];
var circles = [];

function setup() {
    //resize(600, 600);
    //writeText();
    resize(my_image.image.width, my_image.image.height);
    my_image.image.crossOrigin = "Anonymous";
    my_image.draw(width/2, height/2);
    my_data = ctx.getImageData(0, 0, width, height).data;

    for (var i = 0; i < my_data.length/4; i ++) {
        if (my_data[i*4] > 10) {
            spots.push({
                pos: new Vector(i % width, floor(i / width)),
                col: {
                    r: my_data[4*i],
                    g: my_data[4*i + 1],
                    b: my_data[4*i + 2],
                }
            });
        }
    }
    background(0);
}

function update() {
    background(0);
    for (var i = 0; i < 10; i ++) {
        var pos = spots[floor(random(spots.length))];

        var newCircle = new Circle(pos.pos.x, pos.pos.y, pos.col);
        newCircle.check_others(circles);
        if (!newCircle.dead) {
            circles.push(newCircle);
        }
    }
    for (var c of circles) {
        c.update(circles);
    }
}

function draw() {
    for (var c of circles) {
        c.draw();
    }
}
