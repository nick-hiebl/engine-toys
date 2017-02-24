var streams = [];
var fSize = 58;
function char() {
    return String.fromCharCode(floor(random(0x30A1, 0x30E3)));
}
function setup() {
    fontSize(fSize);
    resize(window.innerWidth, window.innerHeight);
    for (var x = 0; x < width; x += fSize * 1.25) {
        var s = [], n = floor(random(5,9)), sp = random(7,20);
        for (var i = 0; i < n; i ++) {
            s.push({
                char: char(), y: i * fSize/2, speed: sp, loopSpeed: random(1/50,1/10), loop: 0
            });
        }
        streams.push(s);
    }
}
function update() {
    streams.forEach(function(stream) {
        stream.forEach(function(s) {
            s.y = s.y > height + 30 ? 0 : s.speed + s.y;
            s.loop = s.loop > 1 ? 0 : s.loopSpeed + s.loop;
            if (s.loop > 1) {
                s.char = char();
            }
        });
    });
}
function symbolDraw(s, x, y) {
    var r = 30 + y;
    var q = map(x, 0, width, 0, 2 * Math.PI) + map(y, 0, height, 0, Math.PI);
    var _x = r * cos(q) + width/2;
    var _y = r * sin(q) + height/2;
    save();
    translate(_x, _y);
    rotate(-Math.PI/2 + q + 0.7);
    var sc = map(y, 0, height, 0.5, 1.5);
    scale(sc, sc);
    centerText(s.char, 0, 0);
    restore();
}
function draw() {
    background(0);
    fill(0, 255, 70);
    fontSize(fSize/1.25);
    ctx.shadowBlur = fSize/2;
    ctx.shadowColor = "#00ff70";
    for (var i = 0; i < streams.length; i ++) {
        for (var s of streams[i]) {
            symbolDraw(s, i * fSize*1.25 + fSize/2, s.y);
        }
    }
}
