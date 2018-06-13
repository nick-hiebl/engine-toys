var connectionMatrix = [];
var connectedMatrix = [];
var nodes = [];
var num;
var potentialEdges = [];
function dfs(a, b, seen) {
    if (seen[a]) return false;
    if (connectedMatrix[a][b]) return true;
    if (a === b) {
        return true;
    }
    let temp = seen.slice();
    temp[a] = true;
    for (let n = 0; n < num; n ++) {
        if (connectionMatrix[a][n]) {
            if (dfs(n, b, temp)) {
                connectedMatrix[a][b] = true;
                connectedMatrix[b][a] = true;
                return true;
            }
        }
    }
}
var nextEdge;
function setup() {
    resize(window.innerWidth, window.innerHeight);
    num = min(300, floor(width * height / 10000));

    let boundary = 20;
    for (let n = 0; n < num; n ++) {
        nodes.push({x: random(boundary, width - boundary), y: random(boundary, height - boundary)});
        connectionMatrix.push(new Array(num).fill(false));
        connectedMatrix.push(new Array(num).fill(false));
    }
    for (let n = 0; n < num; n ++) {
        for (let o = 0; o < n; o ++) {
            potentialEdges.push({a: n, b: o, dist: dist(nodes[n].x, nodes[n].y, nodes[o].x, nodes[o].y)});
        }
    }
    potentialEdges.sort(function(a, b) {
        return -(a.dist - b.dist);
    });
}
var done = false;
function update() {
    if (!done) {
        done = true;
        for (let n = 0; n < num; n ++) {
            if (!dfs(0, n, new Array(num).fill(false))) {
                console.log(n);
                done = false;
                break;
            }
        }
        if (done) return nextEdge = undefined;
        nextEdge = potentialEdges.pop();
        if (!dfs(nextEdge.a, nextEdge.b, new Array(num).fill(false))) {
            connectionMatrix[nextEdge.a][nextEdge.b] = true;
            connectionMatrix[nextEdge.b][nextEdge.a] = true;
        }
    }
}
function draw() {
    background(0);
    fill(255);
    stroke(255);
    lineWidth(10);
    nodes.forEach(function(node){
        ellipse(node.x, node.y, 8);
    });
    for (let n = 0; n < num; n ++) {
        for (let o = 0; o < n; o ++) {
            if (connectionMatrix[n][o])
                line(nodes[n].x, nodes[n].y, nodes[o].x, nodes[o].y);
        }
    }
    if (nextEdge) {
        stroke(255,0,0);
        lineWidth(5);
        line(nodes[nextEdge.a].x, nodes[nextEdge.a].y, nodes[nextEdge.b].x, nodes[nextEdge.b].y);
    }
}
