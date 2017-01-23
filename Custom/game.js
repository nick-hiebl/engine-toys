class Player {
    constructor() {
        this.life = 10;
        this.x = 50;
        this.y = 50;
    }

    draw() {
        // Draw player
        fill(0);
        ellipse(this.x, this.y, 20, 20);

        // Draw life
        for (var z = 0; z < this.life; z ++) {
            fill(255, 0, 0);
            ellipse(z*30 + 20, 20, 12, 12);
        }
    }
}

function clamp(x, low, high) {
    return min(high, max(low, x));
}

class Scene {
    start(width, height, player) {
        this.width = width;
        this.height = height;

        this.player = player;
    }

    constructor(player) {
        this.start(800, 600, player);
    }

    update() {

    }

    draw() {
        var offset = this.getOffset();
        save();
        translate(offset.x, offset.y);
        this.player.draw();
        restore();
    }

    getOffset() {
        return new Vector(clamp(this.player.x, width/2, this.width - width/2), clamp(this.player.y, height/2, this.height - height/2));
    }

    getMouseCoords(x, y) {
        return x, y
    }
}

var myPlayer = new Player();
var myScene = new Scene(myPlayer);

function draw() {
    myScene.draw();
}

function update() {
    myScene.update();
}
