var canvas,
    ctx,
    currentScreen;

var width,
    height;

var update,
    draw,
    setup;

var keyPressed,
    keyReleased,
    mousePressed;

var myFont = {
    face: 'Arial',
    size: 20
}

var MOUSE = {
    x: 0,
    y: 0,
}

var SETTINGS = {
    stroke: false,
    fill: true
}

var PI = Math.PI;

function beginLoop() {

    var frameId = 0;
    var lastFrame = Date.now();



    function loop() {
        var thisFrame = Date.now();

        var elapsed = thisFrame - lastFrame;

        frameId = window.requestAnimationFrame(loop);

        //var update = update || undefined;

        if (update !== undefined) {
            //console.log(update);
            update(elapsed);
        }

        //var draw = draw || undefined;

        if (draw !== undefined) {
            draw();
        }

        lastFrame = thisFrame;
    }

    loop();
}

function abs(x) {
    return Math.abs(x);
}

function sqr(x) {
    return x * x;
}

function sqrt(x) {
    return Math.pow(x, 0.5);
}

function random(a, b) {
    if (b !== undefined) {
        return Math.random() * (b - a) + a;
    }
    return Math.random() * a;
}

function randint(a, b) {
    return floor(random(a, b));
}

var KEY = {
	ZERO: 48, ONE: 49, TWO: 50, THREE: 51, FOUR: 52,
	FIVE: 53, SIX: 54, SEVEN: 55, EIGHT: 56, NINE: 57,

	A: 65, B: 66, C: 67, D: 68, E: 69, F: 70, G: 71, H: 72,
	I: 73, J: 74, K: 75, L: 76, M: 77, N: 78, O: 79, P: 80,
	Q: 81, R: 82, S: 83, T: 84, U: 85, V: 86, W: 87, X: 88,
	Y: 89, Z: 90,

	SPACE: 32, SHIFT: 16,

	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40,
}

var REVERSE_KEY = {
    16:"SHIFT",32:"SPACE",37:"LEFT",38:"UP",39:"RIGHT",40:"DOWN",
    48:"ZERO",49:"ONE",50:"TWO",51:"THREE",52:"FOUR",53:"FIVE",
    54:"SIX",55:"SEVEN",56:"EIGHT",57:"NINE",
    65:"A",66:"B",67:"C",68:"D",69:"E",70:"F",71:"G",72:"H",73:"I",74:"J",
    75:"K",76:"L",77:"M",78:"N",79:"O",80:"P",81:"Q",82:"R",83:"S",84:"T",
    85:"U",86:"V",87:"W",88:"X",89:"Y",90:"Z"
}

function KEY_PRESSED(e) {
    if (e.keyCode == 32 && e.target == document.body) {
        e.preventDefault();
    }
    if (keyPressed !== undefined) {
        if (REVERSE_KEY[e.keyCode] !== undefined) {
            keyPressed(REVERSE_KEY[e.keyCode]);
        }
        else {
            keyPressed(e.keyCode);
        }
    }
}

function KEY_RELEASED(e) {
    if (keyReleased !== undefined) {
        if (REVERSE_KEY[e.keyCode] !== undefined) {
            keyReleased(REVERSE_KEY[e.keyCode]);
        }
        else {
            keyReleased(e.keyCode);
        }
    }
}

function MOUSE_PRESSED(e) {
    var rect = canvas.getBoundingClientRect();
    var x = e.pageX - rect.left;
    var y = e.pageY - rect.top;
    if (mousePressed !== undefined) {
        mousePressed(x, y);
    }
}

function MOUSE_MOVE(e) {
    var rect = canvas.getBoundingClientRect();
    MOUSE.x = e.clientX - rect.left;
    MOUSE.y = e.clientY - rect.top;
}

var Vector = function(x, y) {
    if (x !== undefined && y !== undefined) {
        this.x = x;
        this.y = y;
    }
    else {
        this.x = 0;
        this.y = 0;
    }
}

Vector.prototype.add = function(vec2) {
    this.x += vec2.x;
    this.y += vec2.y;
}

Vector.prototype.sub = function(vec2) {
    this.x -= vec2.x;
    this.y -= vec2.y;
}

Vector.prototype.mul = function(factor) {
    this.x *= factor;
    this.y *= factor;
}

Vector.prototype.mag = function() {
    return Math.pow(sqr(this.x) + sqr(this.y), 0.5);
}

Vector.prototype.normalise = function(n) {
    mag = this.mag();
    if (n !== undefined) {
        mag /= n;
    }
    if (mag != 0) {
        this.x /= mag;
        this.y /= mag;
    }
}

Vector.prototype.heading = function() {
    return Math.atan2(this.y, this.x);
}

Vector.prototype.rotate = function(theta) {
    var x = this.x;
    var y = this.y;
    this.x = x * Math.cos(theta) - y * Math.sin(theta);
    this.y = x * Math.sin(theta) + y * Math.cos(theta);
}

Vector.prototype.dist = function(other) {
    var x = this.x - other.x;
    var y = this.y - other.y;
    return sqrt(sqr(x) + sqr(y));
}

Vector.prototype.copy = function() {
    return new Vector(this.x, this.y);
}

function vec(x, y) {
    return new Vector(x, y);
}

function Sprite(src, cols, rows, scaleFactor) {
    rows = rows || 1;
    cols = cols || 1;

    this.rows = rows;
    this.cols = cols;

    if (typeof(src) == typeof('string')) {
        this.image = new Image();
        this.image.src = src;
    } else {
        this.image = src;
    }

    this.width = this.image.width/this.cols;
    this.height = this.image.height/this.rows;

    this.scaleFactor = scaleFactor || [1, 1];
}
Sprite.prototype.draw = function(x, y, w, h, i) {
    i = i || 0;
    var my_row = floor(i/this.cols);
    var my_col = i % this.cols;

    var sx = my_col * this.width;
    var sy = my_row * this.height;

    //var w = this.width * this.scaleFactor[0];
    //var h = this.height * this.scaleFactor[1];

    ctx.drawImage(this.image, sx, sy, this.width, this.height, x-w/2, y-h/2, w, h);
}

function drawImage(image, x, y, w, h) {
    w = w || image.width;
    h = h || image.height;

    ctx.drawImage(image, x, y, w, h);
}

function Timer(top, steps) {
    this.max = top;
    this.steps = steps;
    this.current = 0;

    this.update = function(elapsed) {
        this.current += elapsed;
        while (this.current >= this.max) {
            this.current -= this.max;
        }
    }
    this.val = function() {
        return floor(map(this.current, 0, this.max, 0, this.steps))
    }
}

function vectorLerp(vec1, vec2, weight) {
    var output = new Vector();
    output.x = vec1.x * weight + vec2.x * (1 - weight);
    output.y = vec1.y * weight + vec2.y * (1 - weight);
    return output;
}

function cos(x) {
    return Math.cos(x);
}
function sin(x) {
    return Math.sin(x);
}
function max(a, b) {
    return Math.max(a, b);
}
function min(a, b) {
    return Math.min(a, b);
}

function dist(x1, y1, x2, y2) {
    return sqrt( sqr(x1-x2) + sqr(y1-y2) );
}

function clear() {
    ctx.clearRect(0, 0, width, height);
}

function bg() {
    ctx.fillRect(0, 0, width, height);
}

function background(r,g,b,a) {
    var temp = ctx.fillStyle;
    fill(r,g,b,a);
    bg();
    ctx.fillStyle = temp;
}

function save() {
    ctx.save();
}

function restore() {
    ctx.restore();
}

function rect(x, y, w, h) {
    if (SETTINGS.stroke) {
        ctx.strokeRect(x-w/2, y-h/2, w, h);
    }
    if (SETTINGS.fill) {
        ctx.fillRect(x-w/2, y-h/2, w, h);
    }

}

function ellipse(x, y, w, h) {
    ctx.beginPath();
    ctx.ellipse(x, y, w, h, 0, 0, 2 * Math.PI);
    if (SETTINGS.stroke) {
        ctx.stroke();
    }
    if (SETTINGS.fill) {
        ctx.fill();
    }
}

function line(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function triangle(x1, y1, x2, y2, x3, y3) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x1, y1);
    if (SETTINGS.stroke) {
        ctx.stroke();
    }
    if (SETTINGS.fill) {
        ctx.fill();
    }
}

function makeColor(r,g,b) {
    return 'rgb(' + r + ',' + g + ',' + b + ')'
}

function makeColorA(r,g,b,a) {
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')'
}

function floor(x) {
    return Math.floor(x);
}

function fill(r, g, b, a) {
    if (g === undefined) {
        ctx.fillStyle = makeColor(floor(r), floor(r), floor(r));
    } else if (b === undefined) {
        ctx.fillStyle = makeColorA(floor(r), floor(r), floor(r), g);
    } else if (a === undefined) {
        ctx.fillStyle = makeColor(floor(r), floor(g), floor(b));
    } else {
        ctx.fillStyle = makeColorA(floor(r), floor(g), floor(b), a);
    }
}

function stroke(r, g, b, a) {
    if (g === undefined) {
        ctx.strokeStyle = makeColor(floor(r), floor(r), floor(r));
    } else if (b === undefined) {
        ctx.strokeStyle = makeColorA(floor(r), floor(r), floor(r), g);
    } else if (a === undefined) {
        ctx.strokeStyle = makeColor(floor(r), floor(g), floor(b));
    } else {
        ctx.strokeStyle = makeColorA(floor(r), floor(g), floor(b), a);
    }
}

function lineWidth(val) {
    ctx.lineWidth = val;
}

function updateFont() {
    ctx.font = myFont.size + 'px ' + myFont.face;
}

function fontFace(face) {
    myFont.face = face;
    updateFont();
}

function fontSize(size) {
    myFont.size = size;
    updateFont();
}

function text(text, x, y) {
    if (SETTINGS.fill) {
        ctx.fillText(text, x, y);
    }
    if (SETTINGS.stroke) {
        ctx.strokeText(text, x, y);
    }
}

function centerText(string, x, y) {
    var width = ctx.measureText(string).width;
    text(string, x - width/2, y);
}

function measureText(string) {
    return ctx.measureText(string).width;
}

function map(x, a, b, c, d) {
    return (x - a) * (d - c) / (b - a) + c
}

function translate(x, y) {
    ctx.translate(x, y);
}

function rotate(theta) {
    ctx.rotate(theta);
}

function scale(x, y) {
    if (y === undefined) {
        ctx.scale(x, x);
    } else {
        ctx.scale(x, y);
    }
}

window.onload = function() {
    canvas = document.querySelector('canvas#canvas');
    canvas.setAttribute('width', 800);
    canvas.setAttribute('height', 600);

    width = 800;
    height = 600;

    window.addEventListener("keydown", KEY_PRESSED, false);
    window.addEventListener("keyup", KEY_RELEASED, false);

    canvas.addEventListener("mousedown", MOUSE_PRESSED, false);
    canvas.addEventListener("mousemove", MOUSE_MOVE, false);


    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    updateFont();

    if (setup !== undefined) {
        setup();
    }

    beginLoop();
}
