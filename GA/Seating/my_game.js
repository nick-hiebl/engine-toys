var GRID_SIZE = 6;
var SEATS = sqr(GRID_SIZE);
var SCALE = 20;

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function seat_to_pos(seat) {
    var row = floor(seat/GRID_SIZE);
    var col = seat % GRID_SIZE;
    return new Vector(col, row);
}

function linear(m, b) {
    return function(x) {
        return m * x + b;
    }
}

function root(m) {
    return function(x) {
        return m * sqrt(x);
    }
}

function make_fill(r,g,b,a) {
    return function() {
        fill(r,g,b,a);
    }
}

function rect_array(rows, cols, content) {
    var output = [];
    for (var i = 0; i < rows; i ++) {
        var temp = [];
        for (var j = 0; j < cols; j ++) {
            temp.push(content);
        }
        output.push(temp);
    }
}

function count(array, item) {
    var count = 0;
    for (var i = 0; i < array.length; i ++) {
        if (array[i] == item) {
            count ++;
        }
    }
    return count;
}

function Arrangement(n, data, relationships) {
    this.seats = n;
    this.data = data;
    this.relationships = relationships;

    this.arr = [];

    for (var i of data.groups) {
        for (var j = 0; j < data[i]; j ++) {
            this.arr.push(i);
        }
    }
    while (this.arr.length < this.seats) {
        this.arr.push(-1);
    }

    this.arr = shuffle(this.arr);

    this.fitness = -100;

    this.draw = function() {
        background(50);
        //ellipse(width/2, height/2, 20, 20);
        var things = [];
        for (var i = 0; i < this.seats; i ++) {
            var item = this.arr[i];
            var pos = seat_to_pos(i);

            var FACTOR = 80
            fill(0);
            ellipse(FACTOR + pos.x * FACTOR, FACTOR + pos.y * FACTOR, FACTOR/2.5, FACTOR/2.5);
            this.data.colours[item]();
            ellipse(FACTOR + pos.x * FACTOR, FACTOR + pos.y * FACTOR, FACTOR/3, FACTOR/3);
        }

        text(this.fitness.toLocaleString(), 18, 30);
    }

    this.calculateFitness = function() {
        var score = 0;
        for (var i = 0; i < this.seats; i ++) {
            if (this.arr[i] == -1) {
                continue;
            }
            //console.log('i', this.arr[i]);
            for (var j = i+1; j < this.seats; j ++) {
                if (this.arr[j] == -1) {
                    continue;
                }
                var o1 = this.arr[i];
                var o2 = this.arr[j];

                var v1 = seat_to_pos(i);
                var v2 = seat_to_pos(j);

                var dist = v1.dist(v2);
                //console.log(this.relationships);
                //console.log(o1, o2);
                score += this.relationships[(o1+o2)](dist);
            }
        }
        score = map(score, -20, 100, 0, 100);
        this.fitness = score;
        return score;
    }

    this.mutate = function() {
        if (random(1) < 0.05) {
            var i = randint(this.seats);
            var j = randint(this.seats);

            var temp = this.arr[j];
            this.arr[j] = this.arr[i];
            this.arr[i] = temp;

            return true;
        }
        return false;
    }

    this.crossover = function(other) {
        var start = randint(this.seats);
        var length = randint(this.seats);

        var child = new Arrangement(this.seats, this.data, this.relationships);

        var new_arr = [];
        for (var i = 0; i < this.seats; i ++) {
            if ((i >= start && i < start + length) || (i < start - this.seats + length)) {
                new_arr.push(this.arr[i]);
            } else {
                new_arr.push(-2);
            }
        }

        for (var i = 0; i < other.seats; i ++) {
            // If this city is already in the child route.
            if (count(new_arr, other.arr[i]) >= this.data[other.arr[i]]) {
                // Skip
                continue;
            }
            else {
                // Replace first empty spot with current city.
                new_arr[new_arr.indexOf(-2)] = other.arr[i];
            }
        }

        if (new_arr.indexOf(-2) !== -1) {
            console.log(new_arr);
        }

        child.arr = new_arr;

        return child;
    }
}

var data = {
    groups: ['engineer', 'manager', 'marketing'],
    'engineer': 13,
    'manager': 4,
    'marketing': 8,
    '-1': 11,
    colours: {
        'engineer': make_fill(255, 100, 0),
        'manager': make_fill(0, 100, 200),
        'marketing': make_fill(60, 255, 60),
        '-1': make_fill(255),
    }
};

var relationships = {
    'engineerengineer': linear(-0.3, 0),
    'engineermanager': linear(0, 0),
    'engineermarketing': root(2, 0),
    'managerengineer': linear(0, 0),
    'managermarketing': linear(0, 0),
    'managermanager': linear(-1, 0),
    'marketingengineer': root(2),
    'marketingmanager': linear(0, 0),
    'marketingmarketing': linear(-2, 0),
}

var popsize = 100;
var population = [];
var fitnessSum = 0;

function setup() {
    for (var i = 0; i < popsize; i++) {
        population.push(new Arrangement(SEATS, data, relationships));
    }
}

function update() {
    newPop = [];
    var i = 0;
    while (newPop.length < popsize * 0.02) {
        newPop.push(population[i]);
        i++;
    }
    newPop.push(new Arrangement(SEATS, data, relationships));
    i = 0;
    while (newPop.length < popsize) {
        var p1 = population[i];
        var p2 = population[randint(0, SEATS/2)];

        var child = p1.crossover(p2);
        newPop.push(child);
    }

    fitnessSum = 0;

    population = newPop;
    for (var i = 0; i < population.length; i ++) {
        if (i > popsize * 0.02) {
            population[i].mutate();
        }
        population[i].calculateFitness();
        fitnessSum += population[i].fitness;
    }

    population.sort(function(a, b) {
        return -(a.fitness - b.fitness);
    });

    fitnessSum /= popsize;
}

function draw() {
    population[0].draw();
    text('Mean fitness: ' + fitnessSum.toLocaleString(), 18, height-30)
}
