var tile_height = 20;
var shx = shy = 4;
class Entity {
    constructor(x, y, w, h, xvel) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.xvel = xvel;
    }

    update(dt) {
        this.x += this.xvel * dt;
    }

    collides(x, y, w, h) {
        if ((abs(x - this.x) < w/2 + this.width/2) && (abs(y - this.y) < h/2 + this.height/2)) {
            return true;
        }
        return false;
    }

    draw() {
        fill(0, 0, 0, 0.6);
        rect(this.x, this.y, this.width, this.height);
        fill(40, 0.3);
        rect(this.x + shx, this.y + shy, this.width, this.height);
    }
}

class Row {
    constructor(y, h, mode, speed=10) {
        this.y = y;
        this.height = h;
        this.mode = mode;
        this.entities = [];
        this.speed = speed;
        this.rate_min = 50/abs(speed);
        this.rate_max = 200/abs(speed);
        this.rate = 0;
        this.last_created = 0;
    }

    reset() {
        this.entities = [];
        this.rate = 0;
    }

    create_entity() {
        let x = -50;
        if (this.speed < 0) {
            x = width + 50;
        }
        this.entities.push(new Entity(x, this.y, this.height * 0.8, this.height * 0.8, this.speed));
    }

    update(dt) {
        if (this.mode === "enemy") {
            if (this.last_created >= this.rate) {
                this.create_entity();
                this.last_created = -dt;
                this.rate = random(this.rate_min, this.rate_max);
            }
            this.last_created += dt;
        }
        for (var i = 0; i < this.entities.length; i ++) {
            let e = this.entities[i];
            e.update(dt);
            if (this.speed > 0 && e.x - e.width > width) {
                this.entities.splice(i, 1);
                i --;
            } else if (this.speed < 0 && e.x + e.width < 0) {
                this.entities.splice(i, 1);
                i --;
            }
        }
    }

    handle_collision(player_pos, dt) {
        if (this.mode === "enemy") {
            return "dead";
        } else if (this.mode === "logs") {
            player_pos += this.speed * dt;
            return "moved";
        } else {
            return "unsure";
        }
    }

    collides(player_pos, player_dimensions) {
        for (var i of this.entities) {
            if (i.collides(player_pos.x, player_pos.y, player_dimensions.x, player_dimensions.y)) {
                return true;
            }
        }
        return false;
    }

    draw() {
        for (var i of this.entities) {
            i.draw();
        }
    }
}
var player_dimensions;
var player_pos;
var player_speed = 200;
var keys = {};
var player;
function keyPressed(key) {
    keys[key] = true;
}
function keyReleased(key) {
    keys[key] = false;
}
function move_player(dt) {
    if (keys['A']) player_pos.x += -player_speed * dt;
    if (keys['D']) player_pos.x += player_speed * dt;
    if (keys['W']) player_pos.y += -player_speed * dt;
    if (keys['S']) player_pos.y += player_speed * dt;
}
var rows = [];
function sgn(x) {
    if (x > 0) return 1;
    return -1;
}
function baddy_row(y) {
    var vel = sgn(random(2)-1) * random(40, 100);

    return new Row(y, 30, "enemy", vel);
}
function setup() {
    rows = [];
    for (var i = 0; i < floor(height/50); i ++) {
        if (random(1) > 0.3) {
            var row = baddy_row(i * 50);
            for (var j = 0; j < 200; j ++) {
                row.update(0.1);
            }
            rows.push(row);
        }
    }
    player_dimensions = new Vector(20, 20);
    player_pos = new Vector(width/2, height);
    player = new Entity(player_pos.x, player_pos.y, player_dimensions.x, player_dimensions.y, 0);
}
function draw() {
    background(110, 140, 40);
    for (var row of rows) {
        row.draw();
    }
    player.draw();
}
function update(dt) {
    move_player(dt/1000);
    player.x = player_pos.x;
    player.y = player_pos.y;
    for (var row of rows) {
        row.update(dt/1000);
        if (row.collides(player_pos, player_dimensions)) {
            var effect = row.handle_collision(player_pos, dt);
            if (effect === "dead") {
                setup();
            }
        }
    }
}
