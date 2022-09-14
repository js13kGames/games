var Amissa = Amissa || {};

Amissa.Event = {};

Amissa.Event.eventTypes = [
    {
        type: 'STAT-CHANGE',
        notification: 'positive',
        stat: 'strength',
        value: 2,
        text: 'Thoughts of your family cause you to push on. Strength: +'
    },
    {
        type: 'STAT-CHANGE',
        notification: 'negative',
        stat: 'food',
        value: -2,
        text: 'Some of your food has gone bad. Food: -'
    },
    {
        type: 'STAT-CHANGE',
        notification: 'negative',
        stat: 'health',
        value: -15,
        text: 'Fell down a hill. Health: -'
    },
    {
        type: 'STAT-CHANGE',
        notification: 'negative',
        stat: 'strength',
        value: -2,
        text: 'You trip and twist your ankle. Strength: -'
    },
    {
        type: 'STAT-CHANGE',
        notification: 'negative',
        stat: 'energy',
        value: -5,
        text: 'You see something in the distance, panic, and begin sprinting. Energy: -'
    },
    {
        type: 'STAT-CHANGE',
        notification: 'negative',
        stat: 'health',
        value: -15,
        text: 'Sickness sets in. Health: -'
    },
    {
        type: 'STAT-CHANGE',
        notification: 'positive',
        stat: 'food',
        value: 3,
        text: 'Found some berries. Food: +'
    },
    {
        type: 'STAT-CHANGE',
        notification: 'negative',
        stat: 'food',
        value: -2,
        text: 'You crossed the river, but lost some food along the way. Food: -'
    },
    {
        type: 'NEUTRAL',
        notification: 'neutral',
        text: 'I just want to go home.'
    },
    {
        type: 'NEUTRAL',
        notification: 'neutral',
        text: 'You spot an odd formation of rocks, am I alone?'
    },
    {
        type: 'NEUTRAL',
        notification: 'neutral',
        text: 'You crossed a small river successfully.'
    },
    {
        type: 'NEUTRAL',
        notification: 'neutral',
        text: 'My head hurts. What happened?'
    },
    {
        type: 'NEUTRAL',
        notification: 'neutral',
        text: 'I just want to sleep'
    },
    {
        type: 'NEUTRAL',
        notification: 'neutral',
        text: 'Is that someone in the distance?'
    },
    {
        type: 'ATTACK',
        notification: 'negative',
        text: 'A bear appears from behind a tree'
    },
    {
        type: 'ATTACK',
        notification: 'negative',
        text: 'A pack of wolves surrounds you'
    },
    {
        type: 'ATTACK',
        notification: 'negative',
        text: 'A large cougar locks eyes with you'
    }
];

// Picks an event
Amissa.Event.generateEvent = function() {
    var eventIndex = Math.floor(Math.random() * this.eventTypes.length);
    var eventData = this.eventTypes[eventIndex];

    // Stat changes
    if(eventData.type == 'STAT-CHANGE') {
        this.stateChangeEvent(eventData);
    }

    // Attacks
    else if(eventData.type == 'ATTACK') {
        this.game.pause();
        this.ui.notify(eventData.text, eventData.notification);
        this.attackEvent(eventData);
    }

    else if(eventData.type == 'NEUTRAL') {
        this.ui.notify(eventData.text, eventData.notification);
    }
};

// Stat change events
Amissa.Event.stateChangeEvent = function(eventData) {
    if(eventData.value + this.lost[eventData.stat] >= 0) {
        this.lost[eventData.stat] += eventData.value;
        this.ui.notify(eventData.text + Math.abs(eventData.value), eventData.notification);
    }
};

// Attack events
Amissa.Event.attackEvent = function(eventData) {
    var power = Math.round((0.5 + 0.55 * Math.random()) * Amissa.ENEMY_STRENGTH_AVG);
    var food = Math.round((0.5 + 2 * 0.55 * Math.random()));
    this.ui.showAttack(power, food);
};