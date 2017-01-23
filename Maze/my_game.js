function Square(x, y, width, height, edges) {
    this.seen = false;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.edges = edges || [false, false, false, false];
    this.radius = 2;
}
Square.prototype.draw = function() {
    fill(255);
    for (var x = 0; x < 2; x ++) {
        for (var y = 0; y < 2; y ++) {
            ellipse(this.x + x * this.width, this.y + y * this.height, this.radius, this.radius);
        }
    }
    if (this.edges[0]) {
        line(this.x, this.y, this.x + this.width, this.y);
    } if (this.edges[1]) {
        line(this.x + this.width, this.y, this.x + this.width, this.y + this.height);
    } if (this.edges[2]) {
        line(this.x, this.y + this.height, this.x + this.width, this.y + this.height);
    } if (this.edges[3]) {
        line(this.x, this.y, this.x, this.y + this.height);
    }
}

function neighboursOf(n) {
    var output = [];
    var pots = [];
    if (n % cols > 0) {
        pots.push(n-1);
    } if (n % cols < cols-1) {
        pots.push(n+1);
    } if (floor(n / cols) > 0) {
        pots.push(n - cols);
    } if (floor(n / cols) < rows - 1) {
        pots.push(n + cols);
    }
    for (var p of pots) {
        if (!grid[p].seen) {
            output.push(p);
        }
    }
    if (output.length > 0)
        return output;
    return [];
}

var grid;

var scale = 20;

var rows, cols;

var stack = [];

function setup() {
    stack.push(0);
    grid = [];
    rows = floor(height/scale);
    cols = floor(width/scale);
    for (var i = 0; i < rows * cols; i ++) {
        var row = floor(i/cols);
        var col = i % cols;
        grid.push(new Square(col*scale, row*scale, scale, scale, [true, true, true, true]));
    }
}

function update() {
    var current = stack[stack.length - 1];
    var neighbours = neighboursOf(current);
    if (neighbours.length <= 0) {
        stack.pop();
        return;
    }
    var next = neighbours[randint(neighbours.length)];
    stack.push(next);
    grid[next].seen = true;
    if (next == current + 1) {
        grid[current].edges[1] = false;
        grid[next].edges[3] = false;
    } else if (next == current - 1) {
        grid[current].edges[3] = false;
        grid[next].edges[1] = false;
    } else if (next > current) {
        grid[current].edges[2] = false;
        grid[next].edges[0] = false;
    } else {
        grid[current].edges[0] = false;
        grid[next].edges[2] = false;
    }
}

function draw() {
    background(0);
    fill(255);
    stroke(255);
    for (var s of grid) {
        s.draw();
    }

    fill(100, 0, 200);
    var current = stack[stack.length - 1];
    var x = scale * (current % cols) + scale/2;
    var y = scale * floor(current/cols) + scale/2;
    ellipse(x, y, scale/2, scale/2);
}
