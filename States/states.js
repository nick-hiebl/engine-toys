class ComplexState extends State {
    constructor(parent) {
        super(parent)

        this.complexObjects = []
    }

    complexUpdate() {}
    complexPreDraw() {}
    complexPostDraw() {}

    update(elapsed) {
        for (var obj of this.complexObjects) {
            obj.update(elapsed)
        }

        for (var i = 0; i < this.complexObjects.length; i ++) {
            if (this.complexObjects[i].dead) {
                this.complexObjects.splice(i, 1)
                i --
            }
        }

        this.complexUpdate(elapsed)
    }

    draw() {
        this.complexPreDraw()

        for (var obj of this.complexObjects) {
            obj.draw()
        }

        this.complexPostDraw()
    }
}

class ComplexObject {
    constructor(x, y, time) {
        this.pos = new Vector(x, y)
        this.initTime = time || 1000
        this.timer = time || 1000
        this.dead = false
    }

    update(elapsed) {
        this.timer -= elapsed
        if (this.timer < 0) {
            this.dead = true
        }
    }

    draw() {
        fill(20, 60, 170)
        ellipse(this.pos.x, this.pos.y, map(this.timer, this.initTime, 0, 15, 0))
    }
}

class IntroState extends State {
    draw() {
        background(0)
        fill(255)
        fontFace('Arial')
        fontSize(40)
        centerText('Hello game', width/2, height/2)
        fontSize(16)
        centerText('Press space to continue...', width/2, height/2 + 40)
    }
    keyPressed(key) {
        this.parent.horizontalLoad(new MenuState(this.parent))
    }
}

class MenuState extends State {
    constructor(parent) {
        super(parent)
        this.pos = 0
    }

    borderBox(x, y, w, h, b, c1, c2) {
        fill(c1)
        rect(x, y, w+2*b, h+2*b)
        fill(c2)
        rect(x, y, w, h)
    }

    draw() {
        background(0)
        this.borderBox(width/2, map(this.pos + 0.5, 0, 10, 0, height)-7, 24, 24, 3, 255, 0)
        fill(255)
        fontSize(20)
        for (var i = 1/2; i < 10; i ++) {
            centerText(floor(i), width/2, map(i, 0, 10, 0, height))
        }
    }

    keyPressed(key) {
        if (key == 'UP' || key == 'W') {
            this.pos = Math.max(0, this.pos-1);
        }
        if (key == 'DOWN' || key == 'S') {
            this.pos = Math.min(9, this.pos+1);
        }
        if (key == 'SPACE') {
            handleScenes(this.pos);
        }
    }
}


function getPos(c, r) {
    return new Vector(55 + 50 * c, 55 + 50 * r);
}

class InventoryObject {
    constructor(colour, x, y) {
        this.place = new Vector(x, y)
        this.pos = getPos(x, y)
        this.colour = colour
    }

    draw() {
        fill(this.colour)
        ellipse(this.pos.x, this.pos.y, 5, 5)
    }

    goHome() {
        this.pos = getPos(this.place.x, this.place.y)
    }
}


function InventoryState(parent) {
    ComplexState.call(this, parent);

    this.rows = 5;
    this.cols = 4;

    this.inventory = [];
    var r = 5;
    while (r--) {
        this.inventory.push(new Array(this.cols).fill(null));
    }
    this.inventory[2][3] = new InventoryObject(0, 3, 2);

    this.start = function() {
        fill(50, 50, 50, 0.8);
        bg();
    }

    this.mouseState = {
        current: null
    }

    this.complexUpdate = function() {
        if (this.mouseState.current !== null) {
            this.mouseState.current.pos.x = MOUSE.x;
            this.mouseState.current.pos.y = MOUSE.y;
        }
    }

    this.complexPreDraw = function() {
        fill(150);
        //rect(30 + 50 * this.cols/2, 30 + 50 * this.rows/2, 50 * this.cols + 20, 50 * this.rows + 20);
        bg();
        for (var x = 0; x < this.cols; x ++) {
            for (var y = 0; y < this.rows; y ++) {
                let p = getPos(x, y);
                drawImage(slotImg, p.x, p.y);
            }
        }
        for (var row of this.inventory) {
            for (var item of row) {
                if (item !== null) {
                    item.draw();
                }
            }
        }
    }

    this.keyPressed = function(key) {
        if (key == 'E') {
            this.parent.delete();
        }
    }

    this.mousePressed = function(x, y) {
        var clickSuccess = false;

        for (var c = 0; c < this.cols; c ++) {
            for (var r = 0; r < this.rows; r ++) {
                var pos = getPos(c, r);
                if (abs(x - pos.x) < 25 && abs(y - pos.y) < 25) {
                    // Clicked
                    clickSuccess = true;
                    if (this.inventory[r][c] !== null && this.mouseState.current === null) {
                        this.mouseState.current = this.inventory[r][c];
                    }
                    else if (this.mouseState.current !== null && this.inventory[r][c] === null) {
                        var cur = this.mouseState.current;
                        var curp = cur.place;
                        this.inventory[curp.y][curp.x] = null;
                        this.inventory[r][c] = cur;
                        cur.place = new Vector(c, r);
                        cur.goHome();
                        this.mouseState.current = null;
                    }
                }
            }
        }
        if (!clickSuccess && this.mouseState.current !== null) {
            this.mouseState.current.goHome();
            this.mouseState.current = null;
        }
    }
}

class WalkingState extends ComplexState {
    constructor(parent) {
        super(parent)

        this.sprite = new Sprite(playerImg, 1, 1)

        this.pos = new Vector(width/2, height/2)
        this.playerTarget = this.pos.copy()
        this.playerSpeed = 3
        this.i = 0
    }

    complexPreDraw() {
        background(150)
        fill(255)
    }

    complexPostDraw() {
        this.sprite.draw(this.pos.x, this.pos.y, 60, 60, 0)
    }

    mousePressed(x, y) {
        this.playerTarget = new Vector(x, y)
        this.complexObjects.push(new ComplexObject(x, y, 200))
    }

    keyPressed(key) {
        if (key == 'E') {
            this.parent.verticalLoad(new InventoryState(this.parent))
        }
    }

    complexUpdate(elapsed) {
        var vel = this.playerTarget.copy()
        vel.sub(this.pos)
        var distance = vel.magnitude;
        if (distance > this.playerSpeed) {
            vel.magnitude = this.playerSpeed;
        }
        this.pos.add(vel);
    }
}
