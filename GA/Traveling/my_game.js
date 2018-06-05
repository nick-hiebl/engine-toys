
var Route = function(n) {
    this.num_cities = n;
    this.route = [];

    this.fitness = 100000;

    seen = [];

    for (var i = 0; i < n; i ++) {
        seen.push(false);
    } seen.push(true);
    for (var i = 0; i < n; i ++) {
        j = n;
        while (seen[j]) {
            j = floor(random(n));
        }
        seen[j] = true;
        this.route.push(j);
    }

    this.mutate = function() {
        if (random(1) < 0.1) {
            a = floor(random(this.num_cities));
            b = floor(random(this.num_cities));
            temp = this.route[b];
            this.route[b] = this.route[a];
            this.route[a] = temp;
        }
        if (random(1) < 0.02) {
            this.route.push(this.route.pop(0));
        }
    }

    this.reproduce = function(other) {
        new_route = [];
        for (var i = 0; i < this.num_cities; i ++) {
            if (random(1) < 0.7) {
                new_route.push(this.route[i]);
            } else {
                new_route.push(-1);
            }
        }

        for (var i = 0; i < other.num_cities; i ++) {
            // If this city is already in the child route.
            if (new_route.indexOf(other.route[i]) !== -1) {
                // Skip
                continue;
            }
            else {
                // Replace first empty spot with current city.
                new_route[new_route.indexOf(-1)] = other.route[i];
            }
        }

        var child = new Route(this.num_cities);
        child.route = new_route;

        return child;
    }
}

Route.prototype.calcFitness = function(a) {
    var total = 0;

    for (var i = 1; i < num_cities; i ++) {
        total += cities[this.route[i-1]].dist(cities[this.route[i]]);
    }
    total += cities[this.route[0]].dist(cities[this.route[num_cities-1]]);
    //console.log(total);
    this.fitness = total;
}

var population = [];
var popsize = 500;

var num_cities = 60;//floor(random(30, 50));
var cities = [];

function setup() {
    for (var i = 0; i < num_cities; i ++) {
        var city = new Vector(random(50, width-50), random(50, height-50));
        close = false;
        for (var j = 0; j < i; j ++) {
            if (city.dist(cities[j]) < 2) {
                i --;
                close = true;
                break;
            }
        }
        if (!close)
            cities.push(city);
    }
    for (var i = 0; i < popsize; i ++) {
        population.push(new Route(num_cities));
    }
}
var k = 0;
function update() {
    newPop = [];

    for (var i = 0; i < popsize; i ++) {
        //c1 = new Route(num_cities);
        //c1.route = population[i].route.slice();
        p1 = population[floor(random(popsize))];
        c1 = population[i].reproduce(p1);
        c1.mutate();

        p2 = population[floor(random(popsize))];
        c2 = population[i].reproduce(p2);
        c2.mutate();

        newPop.push(c1);
        newPop.push(c2);
        while (newPop.length > popsize) {
            newPop.pop();
        }
        if (newPop.length == popsize) {
            break;
        }
    }

    population = newPop;

    for (var i = 0; i < population.length; i ++) {
        population[i].calcFitness();
    }
    population.sort(function(a, b) {
        return a.fitness - b.fitness;
    });
}

function draw() {
    fill(0);
    bg();
    fill(255);
    for (var i = 0; i < num_cities; i ++) {
        ellipse(cities[i].x, cities[i].y, 15, 15);
    }
    stroke(255);
    lineWidth(9);
    best = population[0];
    for (var i = 0; i < num_cities - 1; i ++) {
        c1 = cities[best.route[i]];
        c2 = cities[best.route[i + 1]];
        //lineWidth(map(c1.dist(c2), 0, 150, 15, 5))
        line(c1.x, c1.y, c2.x, c2.y);
    }

    c1 = cities[best.route[0]];
    c2 = cities[best.route[num_cities - 1]];

    line(c1.x, c1.y, c2.x, c2.y);

    text(population[0].fitness.toLocaleString(), 3, 20);
}
