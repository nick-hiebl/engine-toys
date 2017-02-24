var streams = [];
var fSize = 32;
function char() {
    return String.fromCharCode(floor(random(0x30A1, 0x30E3)));
}
function setup() {
    fontSize(fSize);
    resize(window.innerWidth, window.innerHeight);
    for (var x = 0; x < width; x += fSize) {
        var s = [], n = floor(random(10, 20)), sp = random(3, 12);
        for (var i = 0; i < n; i ++) {
            s.push({
                char: char(), y: -i * fSize, speed: sp, loopSpeed: random(1/50,1/10), loop: 0
            });
        }
        streams.push(s);
    }
}
function update() {
    streams.forEach(function(stream) {
        stream.forEach(function(s) {
            s.y = s.y > height + 30 ? -30 : s.speed + s.y;
            s.loop = s.loop > 1 ? 0 : s.loopSpeed + s.loop;
            if (s.loop > 1) {
                s.char = char();
            }
        });
    });
}
function draw() {
    background(0, 0.7);
    fill(0, 255, 70);
    fontSize(fSize/1.25);
    for (var i = 0; i < streams.length; i ++) {
        var first = true;
        for (var s of streams[i]) {
            centerText(s.char, i * fSize + fSize/2, s.y);
        }
    }
}
