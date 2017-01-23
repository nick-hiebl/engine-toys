function __STATE() {
    this.draw = function(){};
    this.update = function(){};
    this.start = function(){};
    this.keyPressed = function(){};
    this.keyReleased = function(){};
    this.mousePressed = function(){};
}

function State(parent) {
    __STATE.call(this);
    this.parent = parent;
}

function StateManager() {
    this.i = 0;
    this.states = [new State()];

    this.keyHandler = {};
}
StateManager.prototype.draw = function() {
    this.states[this.i].draw();
};
StateManager.prototype.update = function(elapsed) {
    this.states[this.i].update(elapsed);
};
StateManager.prototype.setup = function() {};
StateManager.prototype.start = function() {
    this.states[this.i].start();
};
StateManager.prototype.keyPressed = function(key) {
    this.keyHandler[key] = true;
    this.states[this.i].keyPressed(key);
};
StateManager.prototype.keyReleased = function(key) {
    this.keyHandler[key] = false;
    this.states[this.i].keyReleased(key);
};
StateManager.prototype.mousePressed = function(x, y) {
    this.states[this.i].mousePressed(x, y);
};
StateManager.prototype.verticalLoad = function(next) {
    this.states.push(next);
    this.i = this.states.length-1;
    next.start();
};
StateManager.prototype.delete = function() {
    this.states.splice(this.states.length-1, 1);
    this.i = this.states.length-1;
};
StateManager.prototype.horizontalLoad = function (next) {
    this.delete();
    this.verticalLoad(next);
};
