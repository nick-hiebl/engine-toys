class Quad {
    constructor(x=0,y=0,w=-1,h=-1, lim=5) {
        this.x = x;
        this.y = y;
        this.w = w+1 ? w : width;
        this.h = h+1 ? h : height;

        this.parent = false;
        this.children = [];

        this.limit = lim;

        this._points = [];
    }

    static contains(p, x, y, w, h) {
        return x < p.x && p.x < x + w && y < p.y && p.y < y + h;
    }

    contains_point(x, y) {
        if (y == undefined) {
            y = x.y;
            x = x.x;
        }
        //return this.x < x && x < this.x + this.w && this.y < y && y < this.y + this.h;
        return Quad.contains({x: x, y: y}, this.x, this.y, this.w, this.h);
    }

    make_children() {
        console.assert(!this.parent, "This already has four children. That's enough.");
        this.parent = true;

        var x = this.x,
            y = this.y,
            w = this.w/2,
            h = this.h/2;

        this.add_child(    x,     y, w, h);
        this.add_child(x + w,     y, w, h);
        this.add_child(    x, y + h, w, h);
        this.add_child(x + w, y + h, w, h);
    }

    add_child(x, y, w, h) {
        var child = new Quad(x, y, w, h, this.limit);

        this.children.push(child);
        for (var p of this._points) {
            if (child.contains_point(p)) {
                child.add_point(p);
            }
        }
    }

    add_point(p) {
        console.assert(this.contains_point(p), "Quad.add_point passed a point it does not contain.");
        if (this.contains_point(p)) {
            this._points.push(p);
            if (!this.parent && this._points.length > this.limit) {
                this.make_children();
            }
            if (this.parent) {
                for (var child of this.children) {
                    if (child.contains_point(p)) {
                        child.add_point(p);
                    }
                }
            }
        }
    }

    draw() {
        nRect(this.x, this.y, this.w, this.h);
        if (this.parent) {
            for (var child of this.children) {
                child.draw();
            }
        }
        else {
            for (var p of this._points) {
                ellipse(p.x, p.y, 3, 3);
            }
        }
    }

    overlap(x, y, w, h) {
        //console.log(x < this.x + this.w, x+w > this.x, y < this.y + this.h, y+h > this.y);
        //console.log(x, this.x + this.w);
        //console.log(x+w, this.x);
        //console.log(y, this.y + this.h);
        //console.log(y+h, this.y);
        return (x < this.x + this.w && x + w > this.x && y < this.y + this.h && y + h > this.y);
    }

    query_range(x, y, w, h) {
        if (this.overlap(x, y, w, h)) {
            if (this.parent) {
                var total = [];
                for (var child of this.children) {
                    total = total.concat(child.query_range(x, y, w, h));
                }
                return total;
            }
            //console.log('OVERLAP')
            var total = [];
            for (var p of this._points) {
                if (Quad.contains(p, x, y, w, h)) {
                    total.push(p);
                    //console.log(p);
                }
            }
            //console.log(total)
            return total;
        }
        //console.log("No overlap");
        return [];
    }
}

var q;

function setup() {
    q = new Quad(0, 0, width, height, 4);
}

function update() {
    if (random(1.5) > 1) {
        var p = {
            x: random(width),
            y: random(height)
        };

        q.add_point(p);
    }
}

function mousePressed(x, y) {
    q.add_point({x: x, y: y});
}

function draw() {
    SETTINGS.fill = true;
    background(255);
    SETTINGS.stroke = true;
    SETTINGS.fill = false;
    stroke(0);

    q.draw();
    var w = h = 100;
    //console.log(MOUSE.x, MOUSE.y);
    //console.log(MOUSE.x,  - w/2, MOUSE.y,  - h/2);
    var list = q.query_range(MOUSE.x - w/2, MOUSE.y - h/2, w, h);
    //console.log(list);

    for (var p of list) {
        stroke(255, 0, 0);
        ellipse(p.x, p.y, 5, 5);
    }
    stroke(0);
    rect(MOUSE.x, MOUSE.y, w, h);
}
