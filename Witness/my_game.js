function makeMapper(width, height) {
    return function(x, y) {
        return new Vector(70 + map(x, 0, width-1, 0, 460), 70 + map(y, 0, height-1, 0, 460));
    }
}

function makeConnector(width, height) {
    return function (a, b) {
        if (abs(a%width - b%width) == 1 && (floor(a/width) == floor(b/width))) {
            return true;
        }
        if ( (a%width == b%width) && (abs(floor(a/width) - floor(b/width))) ) {
            return true;
        }
        return false;
    }
}

function makeValidator(width, height) {
    return function(a) {
        return a < width*height;
    }
}

function makeIndexer(width, height) {
    return function(x, y) {
        return x + y * width;
    }
}

function makeSplitter(width, height) {
    return function(n) {
        return {x: n % width, y: floor(n / width)};
    }
}

class Puzzle {
    constructor() {
        this.width = 5;
        this.height = 5;
        this.numPoints = this.width * this.height;
        this.mapper = makeMapper(this.width, this.height);
        this.connector = makeConnector(this.width, this.height);
        this.validator = makeValidator(this.width, this.height);
        this.indexer = makeIndexer(this.width, this.height);
        this.splitter = makeSplitter(this.width, this.height);

        this.startPos = this.index(0, this.height-1);

        this.exitPos = this.index(this.width-1, 0);
    }

    valid(n) {
        return this.validator(n);
    }

    connected(a, b) {
        return this.connector(a, b);
    }

    map(x, y) {
        return this.mapper(x, y);
    }

    indexMap(n) {
        var p = this.split(n);
        return this.map(p.x, p.y);
    }

    index(x, y) {
        return this.indexer(x, y);
    }

    split(n) {
        return this.splitter(n);
    }

    draw() {
        background(0);
        fill(80);
        stroke(80);
        lineWidth(20);
        for (var n = 0; n < this.numPoints; n ++) {
            var pos = this.indexMap(n);

            if (n == this.startPos)
                ellipse(pos.x, pos.y, 25, 25);
            else
                ellipse(pos.x, pos.y, 10, 10);

            if (n == this.exitPos) {
                var split = this.split(n);
                var exitPoint = this.indexMap(n);
                var endPoint = this.indexMap(n);
                if (split.y == 0) {
                    endPoint.y -= 40;
                }
                else if (split.x == this.width-1) {
                    endPoint.x += 40;
                } else if (split.y == this.height-1) {
                    endPoint.y += 40;
                } else if (split.x == 0) {
                    endPoint.x -= 40;
                }
                line(exitPoint.x, exitPoint.y, endPoint.x, endPoint.y);
                ellipse(endPoint.x, endPoint.y, 10, 10);
            }
        }

        for (var n = 0; n < this.numPoints; n ++) {
            for (var m = 0; m < this.numPoints; m ++) {
                if (this.connected(n, m)) {
                    var mPos = this.indexMap(m);
                    var nPos = this.indexMap(n);

                    line(mPos.x, mPos.y, nPos.x, nPos.y);
                }
            }
        }
    }
}

var puzz;

function setup() {
    puzz = new Puzzle();
    resize(600, 600);
}

function draw() {
    puzz.draw();
}
