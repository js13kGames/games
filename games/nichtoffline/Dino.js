class Dino {
    constructor(id, name, x) {
        this.name = name;
        this.id = id;
        this.x = x;
        this.y = 0;
        this.speed = 0;
        this.doublejump = true;
        this.bounce = 0;
        this.distance = 1;
        this.width = 43;
        this.height = 46;
        this.north = true;
        this.mode = 0;
        this.message = this.randMessage();
        this.messageTime = Date.now();
        this.color = "#2b2b2b";
    }

    walk(dir) {
        if (dir === 0) {
            this.speed = 0;
            this.mode = 0;
        }
        else {
            this.speed = dir * 5;
            this.north = dir > 0;
            if (this.mode === 0) {
                this.mode = 1;
            }
        }
    }

    move() {
        let width = 1100;
        this.x += this.speed;
        if (this.x <= -width) {
            this.x = -width;
            this.walk(0);
        }
        else if (this.x >= width) {
            this.x = width;
            this.walk(0);
        }
        if (this.speed !== 0) {
            this.distance += 2 / (this.distance / 6);
            if (lastanimation === null || Date.now() - lastanimation > 100) {
                this.mode++;
                lastanimation = Date.now();
                if (this.mode > 2) {
                    this.mode = 1;
                }
            }
        }
    }

    jump() {
        if (this.y === 0) {
            this.doublejump = true;
            this.bounce = 20;
        }
        else if (this.doublejump) {
            this.doublejump = false;
            this.bounce = 20;
        }
    }

    fall() {
        this.y += this.bounce;
        this.bounce -= 1;
        if (this.y <= 0) {
            this.doublejump = true;
            this.y = 0;
            this.bounce = 0;
        }
    }

    randMessage() {
        let messages = [
            "Hello there, my internet doesnt work!",
            "Do you know why I cant play Fortnite?",
            "LOL Minecraft is Offline",
            "I was busy watching some 'educational' videos..",
            "Merhabar, Bir döner lütfen"
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    }
}