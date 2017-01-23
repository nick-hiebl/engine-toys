var my_image = new Sprite('monalisa.jpeg', 1, 1);
var my_data;

function constrict(val, low, high) {
    return min(high, max(low, val));
}

function Gene() {
    this.pos = new Vector(random(width), random(height));
    //this.colour = [randint(255), randint(255), randint(255)];
    this.colour = randint(255);
    this.character = 'abcdefghijklmnopqrstuvwxyz'[randint(26)];
    this.radius = random(30);

    this.draw = function() {
        fill(this.colour, 0.8);
        //fill(this.colour[0], this.colour[1], this.colour[2], 0.8);
        //text(this.character, this.pos.x, this.pos.y);
        ellipse(this.pos.x, this.pos.y, this.radius, this.radius);
    }

    this.copy = function() {
        var child = new Gene();
        child.pos = this.pos.copy();
        //child.colour = [this.colour[0], this.colour[1], this.colour[2]];
        child.colour = this.colour;
        child.character = this.character;
        child.radius = this.radius;
        return child;
    }

    this.mutate = function() {
        if (random(1) < 0.1) {
            this.pos.x += random(-2, 2);
            this.pos.y += random(-2, 2);
        }
        if (random(1) < 0.5) {
            this.colour = constrict(this.colour + randint(-5, 5), 0, 255);
            //this.colour[0] = constrict(this.colour[0] + randint(-5, 5), 0, 255);
            //this.colour[1] = constrict(this.colour[1] + randint(-5, 5), 0, 255);
            //this.colour[2] = constrict(this.colour[2] + randint(-5, 5), 0, 255);
        }
        if (random(1) < 0.1) {
            this.character = 'abcdefghijklmnopqrstuvwxyz'[randint(26)];
            this.radius = constrict(this.radius + random(-1, 1), 2, 40);
        }
    }
}

function ImageGuy() {
    this.genes = [];
    this.fitness = 1000000;
    for (var i = 0; i < 10; i ++) {
        this.genes.push(new Gene());
    }

    this.draw = function() {
        background(0);
        for (var gene of this.genes) {
            gene.draw();
        }
    }

    this.mutate = function() {
        for (var i = 0; i < this.genes.length; i ++) {
            if (random(1) < 0.005 || (this.genes[i].pos.x < 0 || this.genes[i].pos.x > width || this.genes[i].pos.y < 0 || this.genes[i].pos.y > height)) {
                this.genes.splice(i, 1);
                i--;
            }
        }
        if (random(1) < 0.08) {
            this.genes.push(new Gene());
        }
        for (var g of this.genes) {
            g.mutate();
        }
    }

    this.duplicate = function() {
        var child = new ImageGuy();
        child.genes = [];
        for (var g of this.genes) {
            child.genes.push(g.copy());
        }
        return child;
    }

    this.calculateFitness = function() {
        this.draw();
        var temp_data = ctx.getImageData(0, 0, width, height).data;

        for (var i = 0; i < temp_data.length; i += 4) {
            temp_data[i  ] = 255 - temp_data[i  ];
            temp_data[i+1] = 255 - temp_data[i+1];
            temp_data[i+2] = 255 - temp_data[i+2];
        }
        var error = 0;

        for (var i = 0; i < temp_data.length; i ++) {
            error += sqr( (temp_data[i]-my_data[i])/255 )
        }
        this.fitness = error + sqr(this.genes.length)/500;
        return this.fitness;
    }
}

var population = [];
var popsize = 50;

function setup() {
    resize(my_image.image.width, my_image.image.height);
    my_image.draw(width/2, height/2);

    my_data = ctx.getImageData(0, 0, width, height).data;

    for (var i = 0; i < my_data.length; i += 4) {
        my_data[i  ] = 255 - my_data[i  ];
        my_data[i+1] = 255 - my_data[i+1];
        my_data[i+2] = 255 - my_data[i+2];
    }
    for (var i = 0; i < popsize; i ++) {
        population.push(new ImageGuy());
    }
}

var fitnessTotal;

function update() {
    newPop = [];
    var i = 0;
    fitnessTotal = 0;

    while (newPop.length < popsize * 0.02) {
        newPop.push(population[i]);
        population[i].mutate();
        population[i].calculateFitness();
        fitnessTotal += population[i].fitness;
        i++;
    }

    var newbie = new ImageGuy();
    newbie.calculateFitness();
    fitnessTotal += newbie.fitness;
    newPop.push(newbie);

    var selectivity = 0.3;

    while(newPop.length < popsize) {
        var p1 = population[floor(sqr(random(1)) * popsize * selectivity)];

        var child = p1.duplicate();
        child.mutate();
        child.calculateFitness();
        fitnessTotal += child.fitness;
        newPop.push(child);
    }
    population = newPop;
    population.sort(function(a,b) {
        return (a.fitness - b.fitness);
    });
    console.log('sorted');

    fitnessTotal /= popsize;
}

function draw() {
    population[0].draw();
    fill(255);
    text('Fitness: ' + population[0].fitness.toLocaleString(), 18, 30);
    text('Mean fitness: ' + fitnessTotal.toLocaleString(), 18, height-30);
}
