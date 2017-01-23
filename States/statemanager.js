class __STATE {
    constructor() {

    }
    draw() {}
    update() {}
    start() {}
    keyPressed() {}
    keyReleased() {}
    mousePressed() {}
}

class State extends __STATE {
    constructor(parent) {
        super();
        this.parent = parent;
    }
}

class StateManager {
    constructor() {
        this.states = [new State(this)];

        this.keyHandler = {};
    }

    get current() {
        return this.states[this.states.length - 1]
    }

    draw() {
        this.current.draw();
    }

    update(elapsed) {
        this.current.update(elapsed);
    }

    setup() {}

    start() {
        this.current.start();
    }

    keyPressed(key) {
        this.keyHandler[key] = true;
        this.current.keyPressed(key);
    }

    keyReleased(key) {
        this.keyHandler[key] = false;
        this.current.keyReleased(key);
    }

    mousePressed(x, y) {
        this.current.mousePressed(x, y);
    }

    verticalLoad(next) {
        this.states.push(next);
        next.start();
    }

    delete() {
        this.states.splice(this.states.length - 1, 1);
    }

    horizontalLoad(next) {
        this.delete();
        this.verticalLoad(next);
    }
}
