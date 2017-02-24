const WORDS = "ALFA BRAVO CHARLIE DELTA ECHO FOXTROT GOLF HOTEL INDIA JULIETT KILO LIMA MIKE NOVEMBER OSCAR PAPA QUEBEC ROMEO SIERRA TANGO UNIFORM VICTOR WHISKEY XRAY YANKEE ZULU".split(" ");

class Symbol {
    constructor(x, y, speed, secretChar) {
        this.x = x;
        this.y = y;
        this.char;
        this.secretChar = secretChar || false;
        this.charLoopLength = floor(random(10, 50));
        this.charLoop = 0;
        this.speed = speed;
        this.newCharacter();
    }

    forceCharacter() {
        if (this.secretChar) {
            this.charLoop = -30;
            this.char = this.secretChar;
        }
    }

    newCharacter() {
        if (this.secretChar && random(1) < 0.01) {
            this.char = this.secretChar;
        } else {
            this.char = String.fromCharCode(
                floor(random(0x30A1, 0x30E3))
            );
        }
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
        if (this.char == this.secretChar) {
            fill(255, 90, 0);
        } else {
            fill(0, 255, 70);
        }
        centerText(this.char, this.x, this.y);
    }
}

class Stream {
    constructor(x, y, speed, word) {
        this.word = word;
        this.x = x;
        this.y = y;
        this.symbols = [];
        this.speed = speed;
        this.numSymbols = floor(random(7, 15));
        if (this.word) this.numSymbols = this.word.length;

        for (var i = 0; i < this.numSymbols; i ++) {
            this.symbols.push(new Symbol(this.x, this.y + FONTSIZE * 1.25 * i, this.speed, (this.word && i < this.word.length) ? this.word[i] : undefined));
        }
    }

    update() {
        this.symbols.forEach(function(symbol) {
            symbol.update();
        });
        if (random(1) < 0.001) {
            this.symbols.forEach(function(symbol) {
                symbol.forceCharacter();
            })
        }
    }

    draw() {
        this.symbols.forEach(function(symbol) {
            symbol.draw();
        });
    }
}

var streams = [];
var t = 0;

var FONTSIZE = 32;

function setup() {
    resize(window.innerWidth, window.innerHeight);
    var cols = floor(width/(FONTSIZE*1.25));
    var numWords = WORDS.length;
    var isWord = [];
    for (var i = 0; i < cols; i ++) {
        isWord.push(false);
    }
    var n = 0;
    console.assert(numWords < cols);
    while (n < numWords) {
        var p = floor(random(cols));
        if (!isWord[p]) {
            n ++;
            isWord[p] = true;
        }
    }
    n = 0;
    var x = 0;
    for (var i = 0; x < width; i ++) {
        s = new Stream(x + FONTSIZE/2, random(-500, 0), (floor(random(2)) ? 1 : 1  ) * random(2, 8), isWord[i] ? WORDS[n] : undefined);
        if (isWord[i]) {
            n ++;
        }
        streams.push(s);
        x += FONTSIZE * 1.25;
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
