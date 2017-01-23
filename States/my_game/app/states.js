function ComplexState(parent) {
    State.call(this, parent);

    this.complexObjects = [];

    this.complexUpdate = function() {};
    this.complexPreDraw = function() {};
    this.complexPostDraw = function() {};

    this.update = function(elapsed) {
        for (var obj of this.complexObjects) {
            obj.update(elapsed);
        }

        for (var i = 0; i < this.complexObjects.length; i ++) {
            if (this.complexObjects[i].dead) {
                this.complexObjects.splice(i, 1);
                i --;
            }
        }

        this.complexUpdate(elapsed);
    }

    this.draw = function() {
        this.complexPreDraw();

        for (var obj of this.complexObjects) {
            obj.draw();
        }

        this.complexPostDraw();
    }
}

function ComplexObject(x, y, time) {
    this.pos = new Vector(x, y);
    this.initTime = time || 1000;
    this.timer = time || 1000;
    this.dead = false;

    this.update = function(elapsed) {
        this.timer -= elapsed;
        if (this.timer < 0) {
            this.dead = true;
        }
    }

    this.draw = function() {
        fill(20, 60, 170);
        ellipse(this.pos.x, this.pos.y, map(this.timer, this.initTime, 0, 15, 0), map(this.timer, this.initTime, 0, 15, 0));
    }
}

function IntroState(parent) {
    State.call(this, parent);

    this.draw = function() {
        background(0);
        fill(255);
        fontFace('Arial');
        fontSize(40);
        centerText('Hello game', width/2, height/2);
        fontSize(16);
        centerText('Press space to continue...', width/2, height/2 + 40);
    }

    this.keyPressed = function(key) {
        this.parent.horizontalLoad(new MenuState(this.parent));
    }
}

function MenuState(parent) {
    State.call(this, parent);

    this.pos = 0;

    function borderBox(x, y, w, h, b, c1, c2) {
        fill(c1);
        rect(x, y, w+2*b, h+2*b);
        fill(c2);
        rect(x, y, w, h);
    }

    this.draw = function() {
        background(0);
        borderBox(width/2, map(this.pos + 0.5, 0, 10, 0, height)-7, 24, 24, 3, 255, 0);
        fill(255);
        fontSize(20);
        for (var i = 1/2; i < 10; i ++) {
            centerText(floor(i), width/2, map(i, 0, 10, 0, height));
        }
    }

    this.keyPressed = function(key) {
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

function InventoryState(parent) {
    ComplexState.call(this, parent);

    this.rows = 5;
    this.cols = 4;

    this.start = function() {
        fill(50, 50, 50, 0.8);
        bg();
    }

    this.complexPreDraw = function() {
        //background(10);
        fill(150);
        rect(30 + 50 * this.cols/2, 30 + 50 * this.rows/2, 50 * this.cols + 20, 50 * this.rows + 20);
        for (var x = 0; x < this.cols; x ++) {
            for (var y = 0; y < this.rows; y ++) {
                drawImage(slotImg, 30 + 50 * x, 30 + 50 * y);
            }
        }
    }

    this.keyPressed = function(key) {
        if (key == 'E') {
            this.parent.delete();
        }
    }
}

function WalkingState(parent) {
    ComplexState.call(this, parent);

    this.sprite = new Sprite(playerImg, 1, 1);

    this.pos = new Vector(width/2, height/2);
    this.vel = new Vector(0, 0);

    this.playerTarget = this.pos.copy();
    this.playerSpeed = 3;
    this.i = 0;
    this.complexPreDraw = function() {
        background(150);
        fill(255);
    }
    this.complexPostDraw = function() {
        this.sprite.draw(this.pos.x, this.pos.y, 60, 60, 0);
    }

    this.mousePressed = function(x, y) {
        this.playerTarget = new Vector(x, y);
        this.complexObjects.push(new ComplexObject(x, y, 200));
    }

    this.keyPressed = function(key) {
        if (key == 'E') {
            this.parent.verticalLoad(new InventoryState(this.parent));
        }
    }

    this.complexUpdate = function(elapsed) {

        var vel = this.playerTarget.copy();
        vel.sub(this.pos);
        var distance = vel.mag();
        if (distance > this.playerSpeed) {
            vel.normalise(this.playerSpeed);
        }
        this.vel = vectorLerp(this.vel, vel, 0.8);

        if (distance < this.vel.mag()) {
            this.vel = new Vector(0, 0);
            this.pos = this.playerTarget.copy();
        }

        this.pos.add(this.vel);
    }
}
