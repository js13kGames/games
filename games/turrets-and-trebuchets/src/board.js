var board = {
    // village = { pos, health, strength }
    // trebuchet = { pos, health, strength, radius, state }
    // powerup = { pos }
    villages: new Set(),
    trebuchets: new Set(),
    powerups: new Set(),
    activeTrebuchet: undefined, 
    hoveredTrebuchet: undefined, // while over the trebuchet itself
    hoveredVillage: undefined, // while over the village itself
    animation: undefined, // { from, to, attackType, state, elapsedMs } or { dx, dy, state }
    mousePos: undefined,
    villageAttacks: [],
    noOfHits: 0,
    highScore: 0,
    newHighScore: false,
    score: 0,
    level: 1,

    __rnd(n) { return Math.floor(Math.random() * n) },
    __rndPos() { return { x: 100 + this.__rnd(1000), y : 100 + this.__rnd(600) } },
    __sqDist(p1, p2) { return (p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y) },
    __dist(p1, p2) { return Math.sqrt(this.__sqDist(p1, p2)) },
    __inRange(p, t) { return this.__sqDist(p, t.pos) <= t.radius * t.radius },
    __over(p, t) { return this.__sqDist(p, t.pos) <= BaseRadius * BaseRadius },
    __chanceOfHit(from, to) { var d = this.__dist(from.pos, to.pos); return Math.min(100, Math.max(1, (700 - d) / 5.5)); },
    __shuffleArray(a) {
        for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = a[i];
          a[i] = a[j];
          a[j] = temp;
        }
    },

    // Village actions
    __createVillage() { return { pos: this.__rndPos(), health: 100, strength: Math.round(30 + ((4 * this.level) * this.__rnd(100)) / 100) } },
    __attackTrebuchet(v, t) { t.health -= v.strength },
    __updateVillage(v) { },
    __removeKilledVillages() {
        var vs = Array.from(this.villages);
        for (var i = 0; i < vs.length; i++) {
            if (vs[i].health <= 0) {
                this.villages.delete(vs[i]);
                this.score += vs[i].strength;
                if (this.__rnd(100) < 25) {
                    this.powerups.add( { pos : vs[i].pos } );
                }
            }
        }
    },

    // Trebuchet actions
    __createTrebuchet() { return { pos: this.__rndPos(), health: 100, strength: 50, radius: 4 * BaseRadius , state: TrebuchetState.LOAD_OR_MOVE } },
    __attackVillage(t, v) { v.health -= t.strength },
    __loadTrebuchet(t) { t.strength = Math.min(t.strength + 20, 100) },
    __moveTrebuchet(t, pos) { t.pos = pos },
    __removeKilledTrebuchets() {
        var ts = Array.from(this.trebuchets);
        for (var i = 0; i < ts.length; i++) {
            if (ts[i].health <= 0) {
                this.trebuchets.delete(ts[i]);
                if (this.activeTrebuchet == ts[i]) {
                    this.activeTrebuchet = undefined;
                }
            }
        }
    },

    __trebuchetPlacedHereWillUsePowerup(pos) {
        for (const p of this.powerups) {
            if (this.__dist(pos, p.pos) < 2 * BaseRadius) {
                return p;
            }
        }
    },

    __handlePowerup() {
        var powerup = this.__trebuchetPlacedHereWillUsePowerup(this.activeTrebuchet.pos);
        if (powerup) {
            this.activeTrebuchet.health = 100;
            this.powerups.delete(powerup);
        }
    },

    __canBePlacedAt(item, pos) {
        for (const v of this.villages) {
            var d = this.__dist(v, pos);
            if (v != item && this.__dist(v.pos, pos) < 2.3 * BaseRadius) {
                return false;
            }
        }
        for (const t of this.trebuchets) {
            if (t != item && this.__dist(t.pos, pos) < 2.3 * BaseRadius) {
                return false;
            }
        }
        return true;
    },

    __moveTrebuchetsAfterEarthquake() {
        for (var t of this.trebuchets) {
            while (true) {
                var pos = this.__rndPos();
                if (this.__canBePlacedAt(t, pos)) {
                    t.pos = pos;
                    this.__handlePowerup();
                    break;
                }
            }
        }
    },

    __startEarthquakeIfApplicable() {
        if (this.noOfHits == 0 && this.villageAttacks.length == 0) {
            this.animation = { dx: 0, dy: 0, state: AnimationState.EARTHQUAKE, elapsedMs: 0 }; 
        }
        else {
            this.animation = undefined;
        }
    },

    __load() {
        this.__loadTrebuchet(this.activeTrebuchet);
        this.activeTrebuchet.state = TrebuchetState.FIRE;
        this.__attackWithVillagesWhenAllTrebuchetsDone();
    },

    __move() {
        if (this.__canBePlacedAt(this.activeTrebuchet, this.mousePos)) {
            this.__moveTrebuchet(this.activeTrebuchet, this.mousePos);
            this.__handlePowerup();
            this.activeTrebuchet.state = TrebuchetState.FIRE;
            this.__attackWithVillagesWhenAllTrebuchetsDone();
        }
    },

    __fireAtVillage(t, v) {
        this.__attackVillage(t, v);
        t.state = TrebuchetState.DONE;
        this.__attackWithVillagesWhenAllTrebuchetsDone();
    },

    __fireAtTrebuchet(v, t) {
        this.__attackTrebuchet(v, t);
    },

    __attackWithVillagesWhenAllTrebuchetsDone() {
        for (const t of this.trebuchets) {
            if (t.state != TrebuchetState.DONE) {
                return;
            }
        }

        for (const v of this.villages) {
            v.attacksToPerform = 0;
            v.attacksPerformed = 0;
        }

        for (const v of this.villages) {
            for (const t of this.trebuchets) {
                if (v.health > 0) {
                    this.villageAttacks.push({v:v, t:t});
                    v.attacksToPerform += 1;
                }
            }
        }

        this.__shuffleArray(this.villageAttacks);
    },

    __allVillagesHaveAttacked() {
        var result = true;
        for (const v of this.villages) {
            if (!v.attacksToPerform || v.attacksToPerform == 0 || v.attacksPerformed < v.attacksToPerform) {
                result = false;
                break;
            }
        }
        return result;
    },

    __endTurn() {
        for (var t of this.trebuchets) {
            t.state = TrebuchetState.LOAD_OR_MOVE;
        }
        this.__startEarthquakeIfApplicable();
        for (var v of this.villages) {
            v.attacksToPerform = 0;
            v.attacksPerformed = 0;
        }
        this.noOfHits = 0;
    },

    reset() {
        var noOfVillages = this.level + 2 + this.__rnd(2);
        var noOfTrebuchets = this.level + 1 + this.__rnd(2);

        this.villages = new Set();
        this.trebuchets = new Set();
        this.powerups = new Set();
        
        this.activeTrebuchet = undefined;
        this.hoveredTrebuchet = undefined;
        this.hoveredVillage = undefined;
        this.animation = undefined;
        this.villageAttacks = [];
    
        this.highScore = parseInt(localStorage.getItem(HighScoreString)) || 0;

        while (this.villages.size < noOfVillages)
        {
            var v = this.__createVillage();
            if (this.__canBePlacedAt(v, v.pos)) {
                this.villages.add(v);
            }
        }
        while (this.trebuchets.size < noOfTrebuchets)
        {
            var t = this.__createTrebuchet();
            if (this.__canBePlacedAt(t, t.pos)) {
                this.trebuchets.add(t);
            }
        }


        this.level++;
    },

    update(ms, mousePos) {
        this.__removeKilledVillages();
        this.__removeKilledTrebuchets();

        if (this.animation) {
            switch(this.animation.state) {
                case AnimationState.HIGHLIGHT_ATTACKER:
                    var elapsedMs = this.animation.elapsedMs || 0;
                    if (elapsedMs < 200) {
                        this.animation.elapsedMs = elapsedMs + ms;
                    }
                    else {
                        this.animation.state = AnimationState.HIGHLIGHT_ATTACK;
                        this.animation.elapsedMs = 0;
                    }
                    break;
                case AnimationState.HIGHLIGHT_ATTACK:
                    var elapsedMs = this.animation.elapsedMs || 0;
                    var maxMS = this.animation.attackType == AttackType.TREBUCHET_MISSES_VILLAGE 
                        || this.animation.attackType == AttackType.VILLAGE_MISSES_TREBUCHET
                        ? 300 : 200;
                    if (elapsedMs < maxMS) {
                        this.animation.elapsedMs = elapsedMs + ms;
                    }
                    else {
                        switch(this.animation.attackType) {
                            case AttackType.TREBUCHET_MISSES_VILLAGE:
                                this.animation.from.state = TrebuchetState.DONE;
                                this.animation = undefined;
                                this.__attackWithVillagesWhenAllTrebuchetsDone();
                                break;
                            case AttackType.VILLAGE_MISSES_TREBUCHET:
                                this.animation.from.attacksPerformed += 1;
                                this.animation = undefined;
                                break;
                            default:
                                this.animation.state = AnimationState.HIGHLIGHT_ATTACKEE;
                                this.animation.elapsedMs = 0;
                                this.noOfHits += 1;
                                break;
                            }
                        }
                    break;
                case AnimationState.HIGHLIGHT_ATTACKEE:
                    var elapsedMs = this.animation.elapsedMs || 0;
                    if (elapsedMs < 400) {
                        this.animation.elapsedMs = elapsedMs + ms;
                    }
                    else {
                        if (this.animation.attackType == AttackType.VILLAGE_ATTACKS_TREBUCHET) {
                            this.__fireAtTrebuchet(this.animation.from, this.animation.to);
                            this.animation.from.attacksPerformed += 1;
                        }
                        else {
                            this.__fireAtVillage(this.animation.from, this.animation.to);
                        }
                        this.animation = undefined;
                    }
                    break;
                case AnimationState.EARTHQUAKE:
                    var elapsedMs = this.animation.elapsedMs || 0;
                    if (elapsedMs > 800) {
                        this.__moveTrebuchetsAfterEarthquake();
                        this.animation = undefined;
                    }
                    else {
                        if (this.animation.dx == 0 && this.animation.dy == 0) {
                            this.animation.dx = this.__rnd(10) - 5;
                            this.animation.dy = this.__rnd(10) - 5;
                        }
                        else {
                            this.animation.dx = 0;
                            this.animation.dy = 0;
                        }
                        this.animation.elapsedMs = elapsedMs + ms
                    }
                    break;
            }
        }
        else {
            if (this.villageAttacks.length > 0) {
                while(this.villageAttacks.length > 0) {
                    var { v, t } = this.villageAttacks.pop();
                    if (this.trebuchets.has(t)) {
                        var attackType = this.__rnd(100) < this.__chanceOfHit(v, t) 
                            ? AttackType.VILLAGE_ATTACKS_TREBUCHET 
                            : AttackType.VILLAGE_MISSES_TREBUCHET;
                        this.animation =
                        { 
                            from: v, 
                            to: t, 
                            attackType: attackType,
                            state: AnimationState.HIGHLIGHT_ATTACKER,
                            elapsedMs: 0
                        };
                        break;
                    }
                    else { 
                        v.attacksToPerform -= 1;
                    }
                }
            }
            else {
                this.hoveredTrebuchet = undefined;
                for (const t of this.trebuchets) {
                    if (this.__over(mousePos, t) && t.state != TrebuchetState.DONE) {
                        this.activeTrebuchet = t;
                        this.hoveredTrebuchet = t;
                    }
                }

                this.hoveredVillage = undefined;
                for (const v of this.villages) {
                    if (this.__over(mousePos, v)) {
                        this.hoveredVillage = v;
                        break;
                    }
                }
            }
        }

        if (this.__allVillagesHaveAttacked()) {
            this.__endTurn();
        }

        this.mousePos = mousePos;
    },

    click() {
        if (this.animation) {
            return;
        }

        if (this.activeTrebuchet) {
            if (this.activeTrebuchet.state == TrebuchetState.LOAD_OR_MOVE) {
                if (this.hoveredTrebuchet) { 
                    this.__load();
                }
                else if (this.__inRange(this.mousePos, this.activeTrebuchet)) { 
                    this.__move();
                }
            }
            else if (this.activeTrebuchet.state == TrebuchetState.FIRE) {
                if (this.hoveredVillage) {
                    var attackType = this.__rnd(100) < this.__chanceOfHit(this.activeTrebuchet, this.hoveredVillage)
                        ? AttackType.TREBUCHET_ATTACKS_VILLAGE
                        : AttackType.TREBUCHET_MISSES_VILLAGE;
                    this.animation =
                    { 
                        from: this.activeTrebuchet, 
                        to: this.hoveredVillage, 
                        attackType: attackType,
                        state: AnimationState.HIGHLIGHT_ATTACKER,
                        elapsedMs: 0
                    };
                }
            } 
        }
    },

    draw(drawSprite) {

        var doDrawSprite = (sprite, pos, radius, alpha) => {
            var p = this.animation && this.animation.state == AnimationState.EARTHQUAKE
                ? { x : pos.x + this.animation.dx, y : pos.y + this.animation.dy }
                : pos;
            drawSprite(sprite, p, radius, alpha);
        };

        var drawRadiusScaledSprite = (sprite, pos, radius, alpha) => {
            doDrawSprite(sprite, pos, 2 * radius / 200, alpha);
        };

        if (this.activeTrebuchet && this.activeTrebuchet.state == TrebuchetState.LOAD_OR_MOVE) {
            drawRadiusScaledSprite(sprites.createRange(), this.activeTrebuchet.pos, this.activeTrebuchet.radius, 0.5);
        }

        this.powerups.forEach(p => {
            var highlight = this.mousePos && this.activeTrebuchet 
                && this.activeTrebuchet.state == TrebuchetState.LOAD_OR_MOVE 
                && this.__trebuchetPlacedHereWillUsePowerup(this.mousePos);
            doDrawSprite(sprites.createHealthPowerup(highlight), p.pos, 0.5)
        });

        this.villages.forEach(v => {
            doDrawSprite(sprites.createVillage(v.health, false), v.pos, 0.5);
            if (v == this.hoveredVillage) {
                drawing.circle(v.pos.x, v.pos.y, 50, "gray", v.strength / 10);
            }
        });

        if (this.animation && this.animation.state == AnimationState.HIGHLIGHT_ATTACK) {
            var from = this.animation.from;
            var to = this.animation.to;
            var percent = (this.animation.elapsedMs || 0) / 200;
            var pos = {
                x: from.pos.x + (to.pos.x - from.pos.x) * percent,
                y: from.pos.y + (to.pos.y - from.pos.y) * percent
            }
            doDrawSprite(sprites.createAttack(), pos);
        }

        this.trebuchets.forEach(t => {
            doDrawSprite(sprites.createTrebuchet(t.health, t.state == TrebuchetState.DONE), t.pos, 0.5);
            if (t == this.activeTrebuchet) {
                drawing.circle(t.pos.x, t.pos.y, 50, "gray", t.strength / 10);
            }
        });

        if (this.animation && this.animation.state == AnimationState.HIGHLIGHT_ATTACKER) {
            var from = this.animation.from;
            var alpha = (this.animation.elapsedMs || 0)  / 200;
            if (alpha > 0) {
                doDrawSprite(sprites.createHighlight(), from.pos, 0.5, alpha);
            }
        }

        if (this.animation && this.animation.state == AnimationState.HIGHLIGHT_ATTACK) {
            var from = this.animation.from;
            var percent = (this.animation.elapsedMs || 0) / 200;
            var alpha = 1 - percent;
            if (alpha > 0) {
                doDrawSprite(sprites.createHighlight(), from.pos, 0.5, alpha);
            }
        }

        if (this.animation && this.animation.state == AnimationState.HIGHLIGHT_ATTACKEE) {
            var to = this.animation.to;
            var alpha = (this.animation.elapsedMs || 0) / 200;
            if (this.animation.elapsedMs > 200) {
                alpha = 1 - alpha;
            }
            if (alpha > 0) {
                doDrawSprite(sprites.createHighlight(), to.pos, 0.5, alpha);
            }
        }

        // Draw upper info bar
        drawing.fillRect(0, 0, 1200, 40, "#2d4f18");
        drawing.fillText(`Score: ${this.score}`, 20, 28);
        drawing.fillText(`High score: ${this.highScore}`, 600, 28, {textAlign: "center"});
        if (this.hoveredTrebuchet || this.hoveredVillage) {
            var s = this.hoveredTrebuchet ? this.hoveredTrebuchet.strength : this.hoveredVillage.strength;
            var h = this.hoveredTrebuchet ? this.hoveredTrebuchet.health : this.hoveredVillage.health;
            drawing.fillText(`Strength: ${s}`, 1040, 28, {textAlign: "right"});
            drawing.fillText(`Health: ${h}`, 1180, 28, {textAlign: "right"});
        }

        if (this.animation && this.animation.state == AnimationState.EARTHQUAKE) {
            drawing.fillText("EARTHQUAKE", 600 + this.animation.dx, 400 + this.animation.dy, { font: "48px Arial", textAlign: "center" });
        }

        // Draw lower info bar
        drawing.fillRect(0, 760, 1200, 40, "#2d4f18");

        if (this.activeTrebuchet) {
            if (this.activeTrebuchet.state == TrebuchetState.LOAD_OR_MOVE) {
                if (this.hoveredTrebuchet) {
                    drawing.fillText("Click here to load or hover outside the trebuchet to move.", 600, 788, {textAlign: "center"});
                }
                else if (this.__inRange(this.mousePos, this.activeTrebuchet) && this.__canBePlacedAt(this.activeTrebuchet, this.mousePos)) {
                    var text = this.__trebuchetPlacedHereWillUsePowerup(this.mousePos)
                        ? "Click to move here and eat this turnip to restore your health."
                        : "Click to move here.";
                    drawing.fillText(text, 600, 788, {textAlign: "center"});
                }
            }
            if (this.activeTrebuchet.state == TrebuchetState.FIRE) {
                if (this.hoveredVillage) {
                    var c = Math.round(this.__chanceOfHit(this.activeTrebuchet, this.hoveredVillage));
                    drawing.fillText(`Click to attack this village. Chance: ${c} %.`, 600, 788, {textAlign: "center"});
                }
                else {
                    drawing.fillText("Hover over a village to attack it.", 600, 788, {textAlign: "center"});
                }
            }
        }
    },

    levelWon() {
        return this.villages.size == 0 && this.trebuchets.size > 0;
    },

    levelLost() {
        return this.trebuchets.size == 0;
    },

    gameOver() {
        if (this.highScore < this.score) {
            this.highScore = this.score;
            localStorage.setItem(HighScoreString, this.highScore);
            this.newHighScore = true;
        }
        else {
            this.newHighScore = false;
        }
        this.level = 1;
        this.score = 0;
    }
};
