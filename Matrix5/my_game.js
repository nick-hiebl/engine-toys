var streams = [];
var fSize = 58;
var h = 10000;
function char() {
    return String.fromCharCode(floor(random(0x30A1, 0x30E3)));
}
function setup() {
    fontSize(fSize);
    resize(window.innerWidth, window.innerHeight);
    for (var x = 0; x < 1; x += 0.1) {
        var s = [], n = floor(20), sp = 3;
        for (var i = 0; i < n; i ++) {
            s.push({
                char: char(), y: x * 8000 + i * fSize/2, speed: sp, loopSpeed: random(1/50,1/10), loop: 0
            });
        }
        streams.push(s);
    }
}
function update() {
    streams.forEach(function(stream) {
        stream.forEach(function(s) {
            s.y = s.y > h + 30 ? 0 : s.speed + s.y;
            s.loop = s.loop > 1 ? 0 : s.loopSpeed + s.loop;
            if (s.loop > 1) {
                s.char = char();
            }
        });
    });
}
function symbolDraw(s, x, y) {
    var q = map(y, 0, h, 0, h/30);
    for (var i = 0; i < 100000; i += Math.PI) {
        if (q > i) {
            q = i + (q - i) * 0.88;
        }
    }
    var r = 30 + q * 12;
    var _x = r * cos(q) + width/2;
    var _y = r * sin(q) + height/2;
    save();
    translate(_x, _y);
    rotate(q);
    var sc = map(y, 0, 100000, 0.5, 1.5);
    centerText(s.char, 0, 0);
    restore();
}
function draw() {
    background(0);
    fill(0, 255, 70);
    fontSize(fSize/1);
    for (var i = 0; i < streams.length; i ++) {
        for (var s of streams[i]) {
            symbolDraw(s, i * fSize*2 + fSize/2, s.y);
        }
    }
}
