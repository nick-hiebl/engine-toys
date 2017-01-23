var EDGE_SIZE = 30;

var player;
var asteroids = [];
var bullets = [];

function keyPressed(key) {
    keyHandle(key, true);
    if (key == 'SPACE') {
        bullets.push(player.shoot());
    }
}
function keyReleased(key) {
    keyHandle(key, false);
}
function keyHandle(key, press) {
    if (key == 'UP' || key == 'W') {
        player.forwards = press;
    } else if (key == 'LEFT' || key == 'A') {
        player.left = press;
    } else if (key == 'RIGHT' || key == 'D') {
        player.right = press;
    }
}

function setup() {
    asteroids = [];
    bullets = [];
    player = new Player();

    SETTINGS.fill = false;
    SETTINGS.stroke = true;

    for (var i = 0; i < random(5, 10); i ++) {
        var ast = new Asteroid();
        while (ast.pos.dist(player.pos) < 2 * ast.r + player.r) {
            console.log('redrawing');
            ast = new Asteroid();
        }
        asteroids.push(ast);
    }
}

function update(dt) {
    player.update(dt);
    for (var ast of asteroids) {
        ast.update();
        if (ast.pos.dist(player.pos) < ast.r + player.r) {
            setup();
        }
    }
    for (var b of bullets) {
        b.update();
    }
    var to_add = [];
    for (var b of bullets) {
        for (var a of asteroids) {
            if (b.pos.dist(a.pos) < a.r) {
                a.dead = true;
                b.dead = true;
                c = a.breakup();
                to_add = to_add.concat(c);
                break;
            }
        }
    }
    for (var b = 0; b < bullets.length; b ++) {
        if (bullets[b].dead) {
            bullets.splice(b, 1);
            b--;
        }
    }
    for (var a = 0; a < asteroids.length; a ++) {
        if (asteroids[a].dead) {
            asteroids.splice(a, 1);
            a--;
        }
    }
    asteroids = asteroids.concat(to_add);
}

function draw() {
    //player.vel.rotate(random(-0.1, 0.1));
    fill(0);
    bg();
    fill(255);
    player.show();
    for (var ast of asteroids) {
        ast.show();
    } for (var b of bullets) {
        b.show();
    }
}
