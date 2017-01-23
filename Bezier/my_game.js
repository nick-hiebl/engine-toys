function lerp(vecA, vecB, t) {
    var newy = new Vector(vecA.x * (1-t) + vecB.x * t, vecA.y * (1-t) + vecB.y * t)
    //console.log(vecA, vecB, newy)
    return newy;
}

var points = [
    //[new Vector(300, 500), new Vector(420, 420), new Vector(550, 500), new Vector(750, 300), new Vector(550, 150), new Vector(400, 180)],
    [],
];

var line_points = [];

var colors = ['grey', 'blue', 'green', 'pink', 'orange'];

var T = 0;

function setup() {
    points[0] = [new Vector(0, height), new Vector(width/2, height), new Vector(width/2, 0), new Vector(width, 0)];
    //for (var i = 0; i < 4; i ++) {
    //    points[0].push(new Vector(random(width), random(height)))
    //}
    var i = 0;
    while (points[i].length > 1) {
        var next_row = [];
        for (var x = 0; x < points[i].length - 1; x ++) {
            next_row.push(lerp(points[i][x], points[i][x+1], 0));
        }
        points.push(next_row);
        i ++;
    }
    line_points.push(points[points.length-1][0].copy());
}

function draw() {
    background(255);
    for (var depth = 0; depth < points.length; depth ++) {
        fillColor(colors[depth]);
        strokeColor(colors[depth]);
        lineWidth(map(depth, 0, points.length-1, 8, 4))
        ellipse(points[depth][0].x, points[depth][0].y, map(depth, 0, points.length-1, 10, 6));
        for (var i = 0; i < points[depth].length - 1; i ++) {
            var pos = points[depth][i];
            var pos2 = points[depth][i+1];
            line(pos.x, pos.y, pos2.x, pos2.y);
            ellipse(pos2.x, pos2.y, map(depth, 0, points.length-1, 15, 2.5));
        }
    }
    stroke(255, 0, 0);
    lineWidth(3.5);
    fill(255, 0, 0);
    for (var i = 0; i < line_points.length-1; i ++) {
        var p1 = line_points[i];
        var p2 = line_points[i+1];
        line(p1.x, p1.y, p2.x, p2.y);
        ellipse(p1.x, p1.y, 3.5);
    }

    fill(0);
    var sT = ''+floor(T * 10000)/10000;
    while (sT.length < 6) {
        sT += '0';
    }
    text('t = ' + sT, width/2, height-30);
}

function update(dt) {
    T = min(1, T + dt * 0.001 * 1/10);
    for (var i = 0; i < points.length-1; i ++) {
        for (var x = 0; x < points[i].length-1; x ++) {
            points[i+1][x] = lerp(points[i][x], points[i][x+1], T);
        }
    }
    line_points.push(points[points.length-1][0].copy());
}
