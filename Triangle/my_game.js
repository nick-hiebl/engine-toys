function setup() {
    resize(window.innerWidth, window.innerHeight);

	x = random(50, 200);
	y = random(50, 200);
	background(0);

	list = [];
	for (var x = 0; x < width; x += 30) {
		var Y = random(-height, 0);
		var S = random(3, 6);
		for (var y = 0; y < 300; y += 30) {
			list.push([x, y + Y, S, String.fromCharCode(floor(random(97, 97+26)))]);
		}
	}
}
var list;

var x, y;

function update() {
	x = random(50, 200);
	y = random(50, 200);

	for (var p of list) {
		p[1] += p[2];
        if (random(100) < 1) {
            p[3] = String.fromCharCode(floor(random(97, 97+26)));
        }
		if (p[1] > height + 50) {
			p[1] = -10;
		}
	}
}

function draw() {
	background(0, 0.1);
	stroke(0, 255, 70);
	fill(0, 255, 70, 0.4);
	lineWidth(2);
	fontSize(30);
	for (var p of list)
		centerText(p[3], p[0] + 10, p[1]);
	fontSize(10);
	fill(255);
	stroke(255);
	save();
	translate(random(0, width), random(0, height));
	//translate(width/2, height/2);
	scale(random(1) > 0.5 ? -1 : 1, random(1) > 0.5 ? -1 : 1);
	rotate(random(1000));
	line(-x, y, x, y);
	line(x, y, x, -y);
	line(-x, y, x, -y);

	line(x-20, y, x-20, y-20);
	line(x-20, y-20, x, y-20);

	text((2 * y).toLocaleString(), x + 10, 0);
	centerText((2 * x).toLocaleString(), 0, y + 20);
	var hyp = 2 * sqrt(x * x + y * y);
	var w = measureText(hyp.toLocaleString());
	text(hyp.toLocaleString(), -w-10, 0);

	var angle = Math.atan2(y, x);
	var t = (angle * 180 / Math.PI).toLocaleString();
	w = measureText(t);
	text(t, -x + map(angle, 0, Math.PI/2, 50, 0), y - 5);
	SETTINGS.fill = false;
	SETTINGS.stroke = true;
	ellipse(-x + map(angle, 0, Math.PI/2, 50, 0) + w + 3, y - 11, 1.8);
	SETTINGS.fill = true;
	SETTINGS.stroke = false;

	restore();
}
