function hsl(v) {
    return 'hsl(' + v.h + ',' + v.s + '%,' + v.l + '%)';
}

class Symbol {
    constructor(x, y, speed, i) {
        this.x = x;
        this.y = y;
        this.char;
        this.charLoopLength = floor(random(10, 50));
        this.col = (i == -1) ? 'white' : hsl({h: floor(i), s: 100, l: 60 + floor(20 / (1 + sqr(i - 250)/20))});
        this.charLoop = 0;
        this.speed = speed;
        this.newCharacter();
    }

    newCharacter() {
        this.char = String.fromCharCode(
            floor(random(0x30A1, 0x30E3))
        );
    }

    update() {
        this.charLoop ++;
        if (this.charLoop >= this.charLoopLength) {
            this.charLoop = 0;
            this.newCharacter();
        }
        this.y += this.speed;
        if (this.y > height + 30) {
            this.y = -30;
        }
    }

    draw() {
        fillColor(this.col);
        text(this.char, this.x, this.y);
    }
}

class Stream {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.symbols = [];
        this.speed = speed;
        this.numSymbols = floor(random(7, 26));

        this.minH = floor(random(360));
        this.maxH = this.minH + floor(random(100, 360));

        for (var i = 0; i < this.numSymbols; i ++) {
            this.symbols.push(new Symbol(this.x, this.y - 25 * i, this.speed,
                (i == 0 && random(2) < 1) ? -1 : map(i / this.numSymbols, 0, 1, this.minH, this.maxH)
            ));
        }
    }

    update() {
        this.symbols.forEach(function(symbol) {
            symbol.update();
        });
    }

    draw() {
        this.symbols.forEach(function(symbol) {
            symbol.draw();
        });
    }
}

var streams = [];

function setup() {
    resize(window.innerWidth, window.innerHeight);
    for (var x = 0; x < width; x += 25) {
        s = new Stream(x, random(-500, 0), random(2, 8));
        streams.push(s);
    }
    fontSize(20);
}

function update() {
    streams.forEach(function(s) {
        s.update();
    });
}

function draw() {
    background(0, 150/255);
    ctx.imageSmoothingEnabled = true;
    streams.forEach(function(s) {
        s.draw();
    });
}
