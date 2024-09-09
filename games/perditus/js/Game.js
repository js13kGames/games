var Amissa = Amissa || {};

// Constants
Amissa.GAME_SPEED = 800;
Amissa.DAY_PER_STEP = 0.25;
Amissa.EVENT_PROB = 0.25;
Amissa.FOOD_RATE = 0.1;
Amissa.FINAL_DISTANCE = 1000;
Amissa.ENEMY_STRENGTH_AVG = 6;
Amissa.SPEED = 5;

Amissa.Game = {};

Amissa.Game.init = function() {
    this.ui = Amissa.UI;
    this.eventManager = Amissa.Event;

    // Setup
    this.lost = Amissa.Lost;
    this.lost.init({
        day: 0,
        health: 100,
        strength: 4,
        food: 10,
        energy: 75,
        distance: 0
    });

    this.lost.ui = this.ui;
    this.lost.eventManager = this.eventManager;

    this.ui.game = this;
    this.ui.lost = this.lost;
    this.ui.eventManager = this.eventManager;

    this.eventManager.game = this;
    this.eventManager.lost = this.lost;
    this.eventManager.ui = this.ui;

    // Start
    this.start();
}

Amissa.Game.start = function() {
    this.gameActive = true;
    this.previousTime = null;
    this.ui.notify('You awaken. You appear Lost in the cold woods.', 'neutral');
    this.step();
}

// Loop
Amissa.Game.step = function(timestamp) {
    if(!this.previousTime) {
        this.previousTime = timestamp;
        this.updateGame();
    }

    var progress = timestamp - this.previousTime;

    if(progress >= Amissa.GAME_SPEED) {
        this.previousTime = timestamp;
        this.updateGame();
    }

    if(this.gameActive) {
        window.requestAnimationFrame(this.step.bind(this));
    }
};

Amissa.Game.updateGame = function() {
    this.lost.day += Amissa.DAY_PER_STEP;

    // Check food
    this.lost.consumeFood();
    if(this.lost.food <= 0) {
        this.lost.food = 0;
        this.ui.notify('You\'re starving.', 'negative')
        this.lost.energy -= 2;
        if(this.lost.energy < 0) { this.lost.energy = 0; }
    }
    else if(this.lost.food >= 0) {
        this.lost.food -= Amissa.FOOD_RATE;
        this.lost.energy += 5;
        if(this.lost.energy > 100) { this.lost.energy = 100; }
    }
    
    // Check energy
    if(this.lost.energy > 0) {
        this.lost.health += 2;
        if(this.lost.health > 100) { this.lost.health = 100; }
    } else {
        this.lost.energy = 0;
        this.lost.health -= 2;
    }

    this.lost.updateDistance();
    this.ui.refreshStats();
    
    // Check distance
    if(this.lost.distance >= Amissa.FINAL_DISTANCE) {
        this.ui.notify('You have made it home safely.', 'positive');
        this.gameActive = false;
        return;
    }

    // Check health
    if(this.health <= 0) {
        this.health = 0;
        this.ui.notify('You have died.', 'negative');
        this.gameActive = false;
        return;
    }

    // Random event
    if(Math.random() <= Amissa.EVENT_PROB) {
        this.eventManager.generateEvent();
    }
};

Amissa.Game.pause = function() {
    this.gameActive = false;
};

Amissa.Game.resume = function() {
    this.gameActive = true;
    this.step();
};

Amissa.Game.init();