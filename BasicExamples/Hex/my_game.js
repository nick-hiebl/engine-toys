
var grid = [];

var rows = 10;
var cols = 10;

// Gets position in 2D array and makes it into a co-ordinate.
function grid_pos_to_coords(x, y) {
    return {
        x: x * 22 + y * 10 + 50,
        y: y * 20 + 50
    }
}

// Trust me, this draws a hexagon.
function draw_hex(x, y, radius) {
    let hex = [];
    for (var i = 0; i < 6; i ++) {
        hex.push(new Vector(radius * sin(i/6 * 2 * Math.PI), radius * cos(i/6 * 2 * Math.PI)));
    }
    polygon(x, y, hex);
}

function setup() {
    resize(window.innerWidth, window.innerHeight);
    for (var y = 0; y < rows; y ++) {
        var row = [];
        for (var x = 0; x < cols; x ++) {
            row.push(x + cols * y);
        }
        grid.push(row);
    }

    background(255);
    fill(0);
    for (var y = 0; y < rows; y ++) {
        for (var x = 0; x < cols; x ++) {
            // Gets position in 2D array and makes it into a co-ordinate.
            var pos = grid_pos_to_coords(x, y);

            fillColor('black');
            // Trust me, this draws a hexagon.
            draw_hex(pos.x, pos.y, 11);

            fillColor('white');
            centerText(grid[y][x], pos.x, pos.y + 3)
        }
    }
}
