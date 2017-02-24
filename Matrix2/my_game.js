function hsl(h, s, l) {
    return 'hsl(' + h + ',' + s + '%,' + l + '%)';
}

class Symbol {
    constructor(x, y, speed, i) {
        this.x = x;
        this.y = y;
        this.char;
        this.charLoopLength = floor(random(10, 50));
        this.h = 126;
        this.s = 100;
        this.l = 60;
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
        function g(y, t, h) {
            h = h || height;
            return map((y + t)%h, 0, h, 0, 1);
        }
        var h = floor(160 * g(this.x, t, width) - 80);
        var s = g(-this.x, t, width) > 0.95 ? 100: 0;
        var l = this.l;
        fillColor(s > 30 ? hsl(200, 100, 60) : hsl(126, 100, 60));
        text(this.char, this.x, this.y);
    }
}

class Stream {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.symbols = [];
        this.speed = speed;
        this.numSymbols = floor(random(7, 15));

        this.minH = floor(random(360));
        this.maxH = this.minH + floor(random(100, 360));

        for (var i = 0; i < this.numSymbols; i ++) {
            this.symbols.push(new Symbol(this.x, this.y - FONTSIZE * 1.25 * i, this.speed,
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
var t = 0;

var FONTSIZE = 20;

function setup() {
    resize(window.innerWidth, window.innerHeight);
    for (var x = 0; x < width; x += FONTSIZE * 1.25) {
        s = new Stream(x, random(-500, 0), (floor(random(2)) ? 1 : 1  ) * random(2, 8));
        streams.push(s);
    }
    fontSize(FONTSIZE);
}

function update() {
    streams.forEach(function(s) {
        s.update();
    });
    t += 10;
}

function draw() {
    background(0, 100/255);
    ctx.imageSmoothingEnabled = true;
    streams.forEach(function(s) {
        s.draw();
    });
}
