var Amissa = Amissa || {};

Amissa.UI = {};

Amissa.UI.notify = function(message, type) {
    document.getElementById('log').innerHTML = '<div class="update-' + type + '"> Day '+ Math.ceil(this.lost.day) + ': ' + message+'</div>' + document.getElementById('log').innerHTML;
};

Amissa.UI.refreshStats = function() {
    document.getElementById('stat-health').innerHTML = this.lost.health;
    document.getElementById('stat-food').innerHTML = Math.ceil(this.lost.food);
    document.getElementById('stat-energy').innerHTML = this.lost.energy;
    document.getElementById('stat-strength').innerHTML = this.lost.strength;

    document.getElementById('lost').style.left = (380 * this.lost.distance/Amissa.FINAL_DISTANCE) + 'px';
};

Amissa.UI.showAttack = function(power, food) {
    var attackDiv = document.getElementById('attack');
    attackDiv.classList.remove('hidden');
    
    this.power = power;
    this.food = food;

    document.getElementById('attack-description').innerHTML = 'Strength: ' + power;

    if(!this.attackInitiated) {
        document.getElementById('fight').addEventListener('click', this.fight.bind(this));
        document.getElementById('run').addEventListener('click', this.run.bind(this));
        this.attackInitiated = true;
    }
};

Amissa.UI.fight = function() {
    var dmg = Math.ceil(Math.max(0, this.power * 2 * Math.random() - this.lost.strength));
    if(dmg > this.lost.strength) {
        this.lost.health -= dmg;
        this.notify('You took ' + dmg + ' damage', 'negative');
    } else {
        this.lost.food += this.food;
        this.notify('You win this battle. You\'ve gained ' + this.food + ' food', 'positive');
    }
    this.lost.energy -= 35;
    document.getElementById('attack').classList.add('hidden');
    this.game.resume();
};

Amissa.UI.run = function() {
    var dmg = Math.ceil(Math.max(0, this.power * Math.random()/2));
    if(dmg < this.lost.strength) {
        this.lost.health -= dmg;
        this.notify('You took ' + dmg + ' damage running away', 'negative');
    } else {
        this.lost.health = 0;
        this.notify('You died running away', 'negative');
    }
    // document.getElementById('run').removeEventListener('click');
    document.getElementById('attack').classList.add('hidden');
    this.game.resume();
};