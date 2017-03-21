var grid = new Array();
const SIZE = 9;
const TILE = 90;

function setup() {
	resize(SIZE * TILE, SIZE * TILE);
	for (var x = 0; x < SIZE; x ++) {
		grid[x] = new Array();
		for (var y = 0; y < SIZE; y ++) {
			grid[x][y] = false;
		}
	}
	redraw();
}

function redraw() {
	background(180);
	for (var x = 0; x < SIZE; x ++) {
		for (var y = 0; y < SIZE; y ++) {
			stroke(0);
			SETTINGS.stroke = true;
			fill(grid[x][y] ? 0 : 180);
			nRect(x*TILE, y*TILE, TILE, TILE);
		}
	}
}

function mousePressed(x, y) {
	console.log()
	grid[floor(x/TILE)][floor(y/TILE)] = !grid[floor(x/TILE)][floor(y/TILE)];
	redraw();
}
