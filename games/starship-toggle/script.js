const BLACK = "rgb(0, 0, 0)";
const WHITE = "rgb(255, 255, 255)";
const RED = "rgb(255, 0, 0)";
const BLUE = "rgb(50, 100, 255)";
const GREEN = "rgb(0, 255, 0)";
const GOLD = "rgb(255, 204, 0)";
const KEYS = { UP: 38, LEFT: 37, DOWN: 40, RIGHT: 39, A: 65, S: 83, D: 68, SPACE: 32, ENTER: 13};

class Game {
  constructor(canvas, keyboarder) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: false });
    this.size = { x: canvas.width, y: canvas.height };
    this.keyboarder = new Keyboarder();
    this.synthesizer = new Synthesizer;
    for (let code of Object.values(KEYS)) {
      this.keyboarder.keyFlags[code] = false;
    }
    this.game_over = true
    this.setup();
    this.run();
    this.synthesizer.theme_melody.play();
    this.synthesizer.theme_bass.play();
    }
  
  game_over_screen() {
    this.ctx.fillStyle = BLACK;
    this.ctx.fillRect(0, 0, this.size.x, this.size.y);
    this.ctx.fillStyle = WHITE;
    this.multiline_text(this.ctx, 
                        ["starship codename: TOGGLE",
                         "tactical capabilities: [A]ttack, [S]hield, and [D]rive",
                         "systems performance depends on available energy",
                         "take unneccessary systems OFFLINE to boost remaining systems performance",
                         "loss of structural integrity will cause rapid unscheduled disassembly",
                         "",
                         "MISSION BRIEFING:",
                         "The war is already lost...",
                         "All we can hope to accomplish now is to STAY ALIVE AS LONG AS POSSIBLE ",
                         "and BLAST ALL THE BUGS WE CAN before we go.",
                         "",
                         "It has been an honor to serve with you,",
                         "  -Commander J.S. Shmomander"
                        ], {x:16, y:160})
    this.ctx.font = '36px sans-serif';
    this.ctx.textAlign = "center"
    this.ctx.fillText("SCORE: "+this.score, this.size.x/2, this.size.y-300);
    this.ctx.fillText("PRESS SPACE TO START", this.size.x/2, this.size.y-200);
  }
  
  reset() {
    this.score = 0;
    this.time = 0;
    this.enemy_scheduler = 10;
    this.enemy_frequency = 120;
    this.drive_energy = this.size.x-10;
    this.attack_energy = this.size.x-10;
    this.shield_energy = this.size.x-10;
    this.hp = this.size.x-10;
    this.player.center = {x:this.size.x/2, y:this.size.y-120}
    this.player.player_beam_attack = null
    this.player.attack = true;
    this.player.shield = true;
    this.player.drive = true;
    this.player.power_level = 1;
    this.player.moving = false;
    this.player.player_shield = new PlayerShield(this, this.player, this.player.center)
    this.shield_zaps = [];
    this.player_bullets = [];
    this.attack_bullets = [];
    this.enemies = [];
    this.bodies = [];
    this.ctx.fillStyle = BLACK;
    this.ctx.fillRect(0, 0, this.size.x, this.size.y);
    this.bodies.push(this.player)
    this.bodies.push(this.player.player_shield)
    this.starfield = new StarField(this);
    this.starfield.setup();
  }
  
  setup() {
    this.score = 0;
    this.time = 0;
    this.enemy_scheduler = 10;
    this.enemy_frequency = 120;
    this.drive_energy = this.size.x-10;
    this.attack_energy = this.size.x-10;
    this.shield_energy = this.size.x-10;
    this.duration = 10800
    this.attack_type = [': PULSE', ': PIERCING BEAM', ': BLAST WAVE']
    this.shield_type = [': QUANTUM SHELL', ': REGENERATIVE CHARGING', ': REACTIVE FIELD']
    this.drive_type = [': VECTORED THRUST', ': AFTER BURNER', ': CAUSTIC CONTRAIL']                   
    this.player = new Player(this, {x:this.size.x/2, y:this.size.y-120})
    this.player_bullets = [];
    this.attack_bullets = [];
    this.enemies = [];
    this.bodies = [];
    this.ctx.fillStyle = BLACK;
    this.ctx.fillRect(0, 0, this.size.x, this.size.y);
    this.bodies.push(this.player)
    this.bodies.push(this.player.player_shield)
    this.starfield = new StarField(this);
    this.starfield.setup();
    this.keyboarder.on(KEYS.SPACE, e => {
      if (this.game_over) {
        this.reset()
        this.game_over = false
      }
    })
  }
  
  run() {
    this.update();
    this.draw();
    requestAnimationFrame(this.run.bind(this));
  }
  
  update() {
    if (!this.game_over) {
      this.starfield.update()
      this.bodies.forEach(body => body.update());
      this.bodies = this.bodies.filter(body => !body.destroyed)
      this.player_bullets = this.player_bullets.filter(body => !body.destroyed)
      this.enemies = this.enemies.filter(body => !body.destroyed)
      this.attack_bullets = this.attack_bullets.filter(body => !body.destroyed)
      this.generate_enemies();
      this.time++
      this.score++
    }
  }
    
  generate_enemies() {
    if (this.time == this.enemy_scheduler) {
      let new_enemy = this.random_enemy({x:Math.random()*this.size.x, y:-30})
      this.bodies.push(new_enemy)
      this.enemies.push(new_enemy)
      this.enemy_scheduler = this.enemy_scheduler + this.enemy_frequency
    }
    if (this.time % 120 == 0) {
      if (this.enemy_frequency > 4) {
        this.enemy_frequency--
      }
    }
  }
  
  draw() {
    if (this.game_over) {
          this.game_over_screen()
    }
    else {
      this.ctx.textAlign = "left"
      this.ctx.fillStyle = BLACK;
      this.ctx.fillRect(0, 0, this.size.x, this.size.y);
      this.starfield.draw();
      this.bodies.forEach(body => body.draw());
      this.draw_ui()
    }
  }
  
  draw_ui() {
    this.ctx.fillStyle = WHITE;
    this.ctx.font = '16px sans-serif';
    this.ctx.fillText(this.score, 10, 26);
    this.ctx.fillStyle = RED;
    this.ctx.fillRect(5, this.size.y - 60, this.attack_energy, 16);
    this.ctx.fillStyle = BLUE;
    this.ctx.fillRect(5, this.size.y - 40, this.shield_energy, 16);
    this.ctx.fillStyle = GREEN;
    this.ctx.fillRect(5, this.size.y - 20, this.drive_energy, 16);
    this.ctx.fillStyle = GOLD;
    this.ctx.fillRect(5, this.size.y - 80, this.hp, 16);
    this.status_message('STRUCTURAL INTEGRITY', 20, this.size.y - 68);
    if (this.player.attack == false) {
      if (this.attack_energy == this.size.x-10) {
        this.status_message('ATTACK OFFLINE: FULLY CHARGED', 20, this.size.y-48);
      }
      else { 
        this.status_message('ATTACK OFFLINE: RECHARGING', 20, this.size.y-48);
      }
    }
    else {  
      this.status_message('ATTACK LEVEL '+this.player.power_level+this.attack_type[this.player.power_level-1], 20, this.size.y-48);  
    }
    if (this.player.shield == false) {
      if (this.shield_energy == this.size.x-10) {
        this.status_message('SHIELD OFFLINE: FULLY CHARGED', 20, this.size.y-28);
      }
      else { 
        this.status_message('SHIELD OFFLINE: RECHARGING', 20, this.size.y-28);
      }
    }
    else {
      this.status_message('SHIELD LEVEL '+this.player.power_level+this.shield_type[this.player.power_level-1], 20, this.size.y-28);
    }
    if (this.player.drive == false) {
      if (this.drive_energy == this.size.x-10) {
        this.status_message('DRIVE OFFLINE: FULLY CHARGED', 20, this.size.y-8);
      }
      else { 
        this.status_message('DRIVE OFFLINE: RECHARGING', 20, this.size.y-8);
      }
    }
    else {
      this.status_message('DRIVE LEVEL '+this.player.power_level+this.drive_type[this.player.power_level-1], 20, this.size.y-8);
    }
  }
  
  status_message(message, x, y) {
    this.ctx.lineWidth = 4;
    this.ctx.strokeStyle = BLACK;
    this.ctx.fillStyle = WHITE;
    this.ctx.font = '13px sans-serif';
    this.ctx.strokeText(message, x, y);
    this.ctx.fillText(message, x, y);
  }
  
  random_enemy(center) {
    switch(Math.floor(Math.random()* 3)) {
      case 0:
        return new AttackEnemy(this, center);
      case 1:
        return new ShieldEnemy(this, center);
      default:
        return new DriveEnemy(this, center);
    }
  }
  
  multiline_text(context, text_array, position) {
    this.ctx.textAlign = "left"
    this.ctx.fillStyle = WHITE;
    this.ctx.font = '16px sans-serif';
    var y = 0
    for (var i = 0; i < text_array.length; i++) {
      context.fillText(text_array[i], position.x, position.y+y)
      y+=18
    }
  }
}

class Keyboarder {
  constructor() {
    this.keyState = {};
    this.keyFlags ={};

    window.addEventListener("keydown", e => {
      this.keyState[e.keyCode] = true;
    });

    window.addEventListener("keyup", e => {
      this.keyState[e.keyCode] = false;
    });
  }

  isDown(keyCode) {
    return this.keyState[keyCode] === true;
  }
  
  on(keyCode, fn) {
    const wrappedFn = e => {
      if (e.keyCode === keyCode && this.keyFlags[keyCode] === false) {
        fn(e);
        this.keyFlags[keyCode] = true;
      }
    };
    const upFn = e => {
      if (e.keyCode === keyCode && this.keyFlags[keyCode] === true) {
        this.keyFlags[keyCode] = false;
      }
    };
    window.addEventListener("keydown", wrappedFn);
    window.addEventListener("keyup", upFn);
  }
}

class Synthesizer {
  constructor(game) {
    this.ac = new AudioContext();
    this.tempo = 120;
    
    this.player_hit_sequence = new TinyMusic.Sequence( this.ac, this.tempo, [
        'E3 0.2',
        'E2 0.2',
        '- 0.1'
      ]);
    this.player_hit_sequence.loop = false;
    this.player_hit_sequence.smoothing = 1;
    
    this.shield_hit_sequence = new TinyMusic.Sequence( this.ac, this.tempo, [
        'G3 0.2',
        'E3 0.2',
        'C3 0.4',
        '- 0.1'
      ]);
    this.shield_hit_sequence.loop = false;
    this.shield_hit_sequence.smoothing = 0.5;
    
    this.shield_absorb_sequence = new TinyMusic.Sequence( this.ac, this.tempo, [
        'C3 0.4',
        'E3 0.2',
        'G3 0.2',
        '- 0.1'
      ]);
    this.shield_absorb_sequence.loop = false;
    this.shield_absorb_sequence.smoothing = 0.5;
    
    this.explosion_sequence = new TinyMusic.Sequence( this.ac, this.tempo, [
        'E3 0.02',
        'F3 0.02',
        '- 0.1'
      ]);
    this.explosion_sequence.loop = false;
    this.explosion_sequence.smoothing = 1;
    this.explosion_sequence.gain.gain.value = 0.4;
    
    this.offline_sequence = new TinyMusic.Sequence( this.ac, this.tempo, [
        'G4 1',
        'G1 1',
        '- 0.1'
      ]);
    this.offline_sequence.loop = false;
    this.offline_sequence.smoothing = 1;
    this.offline_sequence.gain.gain.value = 0.2;
    
    this.online_sequence = new TinyMusic.Sequence( this.ac, this.tempo, [ 
        'G1 1',
        'G3 1',
        'G4 0.1',
        '- 0.1'
      ]);
    this.online_sequence.loop = false;
    this.online_sequence.smoothing = 1;
    this.online_sequence.gain.gain.value = 0.2;
    
    this.player_bullet_sequence = new TinyMusic.Sequence( this.ac, this.tempo, [
        'D3 0.3',
        'F2 0.3',
        'A4 0.3'
      ]);
    this.player_bullet_sequence.loop = false;
    this.player_bullet_sequence.staccato = 0.6;
    this.player_bullet_sequence.smoothing = 1;
    this.player_bullet_sequence.gain.gain.value = 0.2;
    
    this.player_laser_sequence = new TinyMusic.Sequence( this.ac, this.tempo, [
        'D3 0.1',
        'F3 0.1'
      ]);
    this.player_laser_sequence.loop = true;
    this.player_laser_sequence.smoothing = 1;
    this.player_laser_sequence.gain.gain.value = 0.2;
  
    this.big_bullet_sequence = new TinyMusic.Sequence( this.ac, this.tempo, [
        'D2 0.3',
        'F1 0.3',
        'A3 0.3'
      ]);
    this.big_bullet_sequence.loop = false;
    this.big_bullet_sequence.staccato = 0.6;
    this.big_bullet_sequence.smoothing = 1;
    this.big_bullet_sequence.gain.gain.value = 0.3;
    
    this.theme_melody = new TinyMusic.Sequence( this.ac, this.tempo, [
    'A3  q',
    'D4  q',
    'E4  .7',
    'G4  .3',
    'F4  q',
    'A4  q',
    'G4  q',
    'F4  .7',
    'E4  .3',
    'F4  q',
    'D4  .7',    
    'D4  .3',
    'G4  q',
    'A4  .7',
    'C5  .3',
    'Bb4  q',
    'D5  q',
    'C5  q',
    'Bb4 .7',
    'A4  .3',
    'Bb4 q',    
    'Bb4 .7',
    'Bb4 .3',
    'D5 q',
    'C5 .7',
    'Bb4 .3',
    'C5 q',
    'F4 .7',
    'F4 .3',
    'F5 q',
    'E5 .7',
    'D5 .3',
    'E5 q',    
    'A4 .7',
    'A4 .3',
    'A5 q',
    'G5 .7',
    'F5 .3',
    'Bb5 q',
    'A5 .7',
    'G5 .3',
    'F5 .5',
    'G5 .25',
    'F5 .25',
    'E5 .5',
    'Db5 .5',
    'D5 q'
  ])
    this.theme_melody.loop = false
    
  this.theme_bass = new TinyMusic.Sequence( this.ac, this.tempo, [
    '-  e',
    'A2  e',
    'Bb2  e',
    'A2  e',
    '-   e',
    'A2  e',
    '-   e',
    'A2 e',
    '-   e',
    'A2 e',
    'E3 e',
    'A2 e',
    '-   e',
    'A2 e',
    'D3 q',
    '- e',
    'D3 e',
    'Eb3 e',
    'D3 e',
    '- e',
    'D3 e',
    '- e',
    'D3 e',
    '- e',
    'D3 e',
    'Gb3 e',
    'D3 e',
    '- e',
    'D3 e',
    'G3 q',
    'Gb3 q',
    'F3 e',
    'A3 e',
    '- e',
    'F3 e',
    'E3 e',
    'G3 e',
    '- e',
    'E3 e',
    'D3 e',
    'F3 e',
    '- e',
    'D3 e',
    'Db3 e',
    'E3 e',
    '- e',
    'Db3 e',
    'D3 e',
    'Db3 .25',
    'D3 .25',
    'E3 e',
    'D3 .25',
    'E3 .25',
    'F3 e',
    'E3 .25',
    'F3 .25',
    'G3 e',
    'F3 .25',
    'G3 .25',
    'A3 e',
    'A2 e',
    '- e',
    'A2 e',
    'D3 q'
  ])  
    this.theme_bass.loop = false
    
  }
}

class Body {
  constructor(game, center) {
    this.game = game;
    this.center = center;
    this.destroyed = false;
  }
  
  draw() {
    this.game.ctx.beginPath();
    this.game.ctx.moveTo(this.center.x+this.coordinates[0][0]*this.scale, this.center.y+this.coordinates[0][1]*this.scale);
    for (var i=1; i<this.coordinates.length; i++) {
      this.game.ctx.lineTo(this.center.x+this.coordinates[i][0]*this.scale, this.center.y+this.coordinates[i][1]*this.scale)
    }
    this.game.ctx.closePath();
    this.game.ctx.fillStyle = this.color;
    this.game.ctx.fill();
    if (this.stroke) {
      this.game.ctx.strokeStyle = this.stroke;
      this.game.ctx.lineWidth = this.weight;
      this.game.ctx.stroke()
    }
  }
  
  colliding(other) {
    return !(
      this === other ||
      this.center.x + this.size.x / 2 <
        other.center.x - other.size.x / 2 ||
      this.center.y + this.size.y / 2 <
        other.center.y - other.size.y / 2 ||
      this.center.x - this.size.x / 2 >
        other.center.x + other.size.x / 2 ||
      this.center.y - this.size.y / 2 > other.center.y + other.size.y / 2
    );
  }
  
  distance(other) {
    return Math.sqrt(Math.pow(this.center.x-other.center.x,2)+Math.pow(this.center.y-other.center.y,2))
  }
  
  findColliding(body_array) {
    return body_array.filter(body => body.colliding(this));
  }
  
  findClose(body_array, distance) {
    return body_array.filter(body => body.distance(this) < distance);
  }
  
  find_angle_coords(other, spread) {
    let error = spread*(Math.random()*2-1)
    let result = {
      x: error - Math.cos(Math.atan2(this.center.y-other.center.y,this.center.x-other.center.x)),
      y: error - Math.sin(Math.atan2(this.center.y-other.center.y,this.center.x-other.center.x))
    }
    return result;
  }
}

class Player extends Body {
  constructor(game, center) {
    super(game, center);
    this.coordinates = [[0,-5],[-1,-1],[-5,3],[-4,4],[-1,2],[-2,4],[2,4],[1,2],[4,4],[5,3],[1,-1]];
    this.color = GOLD;
    this.scale = 3.5;
    this.speed = 4;
    this.size = {x:2*this.scale, y:2*this.scale}
    this.bullet_scheduler = this.game.time + 1
    this.bullet_frequency_1 = 12
    this.bullet_frequency_2 = 6
    this.attack = true;
    this.shield = true;
    this.drive = true;
    this.power_level = 1;
    this.moving = false;
    this.player_shield = new PlayerShield(this.game, this, this.center)
    this.shield_zaps = []
    this.game.keyboarder.on(KEYS.D, e => {
      this.drive = !this.drive
      if (this.drive) {
        this.game.synthesizer.online_sequence.play();
      }
      else {
        this.game.synthesizer.offline_sequence.play();
      }
    });
    
    this.game.keyboarder.on(KEYS.S, e => {
      this.shield = !this.shield
      if (this.shield) {
        this.game.synthesizer.online_sequence.play();
      }
      else {
        this.game.synthesizer.offline_sequence.play();
      }
    });
    
    this.game.keyboarder.on(KEYS.A, e => {
      this.attack = !this.attack
      this.bullet_scheduler = this.game.time
      if (this.attack) {
        this.game.synthesizer.online_sequence.play();
      }
      else {
        this.game.synthesizer.offline_sequence.play();
      }
    });
    
  }
  
  update() {
    this.update_attack()
    this.update_shield()
    this.update_position()
    this.update_power_level()
  }
  
  update_attack(){
    if (this.attack) {
      switch(this.power_level){
        case 1:
          if (this.attack && this.game.time%this.bullet_frequency_1==0) {
            let new_bullet = new PlayerBullet(this.game,{x:this.center.x, y:this.center.y-20})
            this.game.bodies.push(new_bullet)
            this.game.player_bullets.push(new_bullet)
            this.game.attack_energy-=2
          }
          break
        case 3:
          if (this.attack && this.game.time%this.bullet_frequency_2==0) {
            let new_bullet = new BigPlayerBullet(this.game,{x:this.center.x, y:this.center.y-20})
            this.game.bodies.push(new_bullet)
            this.game.player_bullets.push(new_bullet)
            this.game.attack_energy-=4
          }
          break
        case 2:
          if (this.attack && !this.player_beam_attack) {
            this.player_beam_attack = new BeamAttack(this.game, this, {x:this.center.x, y:this.center.y - this.game.size.y/2-10});
            this.game.bodies.push(this.player_beam_attack);
          }
          break
     }}
    if (this.player_beam_attack) {
      this.game.attack_energy-=.45
    }
    
    if (this.attack == false && this.game.attack_energy < this.game.size.x-10) {
            this.game.attack_energy = Math.min(this.game.attack_energy + 0.5, this.game.size.x - 10);
          }
          if (this.game.attack_energy < 1) {
            if (this.attack) {
              this.game.synthesizer.offline_sequence.play();
            }
            this.attack = false;
          }
  }
  
  update_shield(){
    if (this.shield == false && this.game.shield_energy < this.game.size.x-10) {
      this.game.shield_energy = Math.min(this.game.shield_energy + 0.5, this.game.size.x - 10);
    }
    
    if (!this.shield && this.player_shield) {
      this.player_shield.destroyed = true;
      delete this.player_shield;
    }
    if (this.shield && !this.player_shield) {
      this.player_shield = new PlayerShield(this.game, this, this.center);
      this.game.bodies.push(this.player_shield);
    }
    if (this.game.shield_energy < 1) {
      if (this.shield) {
              this.game.synthesizer.offline_sequence.play();
            }
      this.shield = false
    }
  }
  
  update_position(){
    this.moving = false;
    
    if (this.drive && this.game.keyboarder.isDown(KEYS.LEFT)) {
      this.center.x = Math.max(this.size.x / 2, this.center.x - this.speed);
      this.moving = true;
    }

    if (this.drive && this.game.keyboarder.isDown(KEYS.RIGHT)) {
      this.center.x = Math.min(this.game.size.x - (this.size.x / 2), this.center.x + this.speed);
      this.moving = true;
    }
    
    if (this.drive && this.game.keyboarder.isDown(KEYS.UP)) {
      this.center.y = Math.max(this.size.y / 2, this.center.y - this.speed);
      this.moving = true;
    }
    
    if (this.drive && this.game.keyboarder.isDown(KEYS.DOWN)) {
      this.center.y = Math.min(this.game.size.y - 80 - (this.size.y / 2), this.center.y + this.speed);
      this.moving = true;
    }
    if (this.moving) {
      this.game.drive_energy-=.25
    }
    if (!this.drive && this.game.drive_energy < this.game.size.x-10) {
      this.game.drive_energy+=.5
    }
    else if (!this.drive) {
      this.game.drive_energy = Math.min(this.game.size.x-10, this.game.drive_energy + 1)
    }
    if (this.game.drive_energy < 1) {
      if (this.drive) {
              this.game.synthesizer.offline_sequence.play();
            }
      this.drive = false
    }
    
    if (this.drive) {
      switch(this.power_level){
        case 1:
          let new_engine_trail_1 = new EngineTrail(this.game, this, {x:this.center.x, y:this.center.y+20},50,3)
          this.game.bodies.push(new_engine_trail_1)
          this.speed = 4
          break
        case 2:
          let new_engine_trail_2 = new EngineTrail(this.game, this, {x:this.center.x, y:this.center.y+20}, 9,10)
          this.game.bodies.push(new_engine_trail_2)
          this.speed = 5
          break
        case 3:
          let new_engine_trail_3 = new EngineTrail(this.game, this, {x:this.center.x, y:this.center.y+20}, 3,0)
          this.game.bodies.push(new_engine_trail_3)
          this.speed = 6.5
          break
      }
    }
  }
  
  update_power_level(){
    this.power_level = 1
    if (!this.attack) {this.power_level += 1}
    if (!this.shield) {this.power_level += 1}
    if (!this.drive) {this.power_level += 1}
  }
  
  take_hit(hit_type){
    this.game.synthesizer.player_hit_sequence.play();
    this.game.hp = Math.max(this.game.hp -= 50, 0)
    if(hit_type instanceof AttackBullet){
      this.game.attack_energy = Math.max(this.game.attack_energy -= 50, 0)
    }
    if(hit_type instanceof ShieldBullet){
      this.game.shield_energy = 0
    }
    if(hit_type instanceof DriveBullet){
      this.game.drive_energy = Math.max(this.game.drive_energy -= 50, 0)
    }
    if(hit_type instanceof AttackEnemy){
      this.game.attack_energy = Math.max(this.game.attack_energy -= 200, 0)
    }
    if(hit_type instanceof ShieldEnemy){
      this.game.shield_energy = 0
    }
    if(hit_type instanceof DriveEnemy){
      this.game.drive_energy = Math.max(this.game.drive_energy -= 200, 0)
    }
    let new_debris = new Debris(this.game, {x:this.center.x, y:this.center.y})
    this.game.bodies.push(new_debris)
    if(this.game.hp <= 0) {
      this.game.game_over = true
      this.game.synthesizer.theme_melody.play();
      this.game.synthesizer.theme_bass.play();
    }
  }
}

class PlayerShield extends Body {
  constructor(game, player, center) {
    super(game, center)
    this.player = player;
    this.size = {x:44,y:44}
    this.weight = 4
  }
  
  update(){
    this.center = this.player.center;
    if (this.player.power_level == 3  && this.game.time%10 == 0) {
      let target_enemies = this.findClose(this.game.enemies, 200)
      if (target_enemies.length > 0) {
        target_enemies.forEach(enemy => {
          enemy.health-=2.5;
          let new_zap = new ShieldZap(this.game, this, this.center, enemy)
          this.game.player.shield_zaps.push( new_zap );
          this.game.bodies.push( new_zap );
          let new_debris = new Debris(this.game, {x:enemy.center.x, y:enemy.center.y});
          this.game.bodies.push(new_debris);
          this.game.shield_energy-=15
        })
      }
    }
  }
  
  draw(){
    this.game.ctx.strokeStyle = BLUE;
    this.game.ctx.lineWidth=this.weight;
    this.game.ctx.strokeRect(this.center.x-this.size.x/2,
                            this.center.y-this.size.y/2,
                            this.size.x,
                            this.size.y
                           );
     switch(this.player.power_level){
        case 2:
          this.game.ctx.strokeStyle = BLUE;
          this.game.ctx.lineWidth=this.weight*2;
          this.game.ctx.strokeRect(this.center.x-this.size.x/2-this.weight*2,
                                  this.center.y-this.size.y/2-this.weight*2,
                                  this.size.x+this.weight*4,
                                  this.size.y+this.weight*4
                                 );
          break
        case 3:
          this.game.ctx.save()
          this.game.ctx.translate(this.center.x, this.center.y)
          this.game.ctx.rotate(this.game.time/10)
          this.game.ctx.strokeStyle = BLUE;
          this.game.ctx.lineWidth=this.weight*2;
          this.game.ctx.strokeRect(-this.size.x/2-this.weight*2,
                                  -this.size.y/2-this.weight*2,
                                  this.size.x+this.weight*4,
                                  this.size.y+this.weight*4
                                 );
         this.game.ctx.restore();
          break
       }
    this.game.ctx.strokeStyle = WHITE
  }
  
  take_hit(hit_type){
    if(hit_type instanceof AttackBullet){
      this.game.shield_energy = Math.max(this.game.shield_energy -= 20, 0)
      if (this.game.player.power_level != 1) {
        this.game.attack_energy = Math.max(this.game.attack_energy += 20, 0);
        this.game.synthesizer.shield_absorb_sequence.play();
      }
      else {
        this.game.synthesizer.shield_hit_sequence.play();
      }
    }
    if(hit_type instanceof ShieldBullet){
      this.game.shield_energy = 0
      this.game.synthesizer.shield_hit_sequence.play();
    }
    if(hit_type instanceof DriveBullet){
      this.game.shield_energy = Math.max(this.game.shield_energy -= 20, 0)
      if (this.game.player.power_level != 1) {
        this.game.drive_energy = Math.max(this.game.drive_energy += 20, 0);
        this.game.synthesizer.shield_absorb_sequence.play();
      }
      else {
        this.game.synthesizer.shield_hit_sequence.play();
      }
    }
    if(hit_type instanceof AttackEnemy){
      this.game.shield_energy = Math.max(this.game.shield_energy -= 100, 0)
      this.game.synthesizer.shield_hit_sequence.play();
    }
    if(hit_type instanceof ShieldEnemy){
      this.game.shield_energy = 0
      this.game.synthesizer.shield_hit_sequence.play();
    }
    if(hit_type instanceof DriveEnemy){
      this.game.shield_energy = Math.max(this.game.shield_energy -= 100, 0)
      this.game.synthesizer.shield_hit_sequence.play();
    }
  }
}

class BeamAttack extends Body {
  constructor(game, player, center) {
    super(game, center)
    this.player = player;
    this.size = {x:10,y:this.game.size.y}
    this.game.synthesizer.player_laser_sequence.play();
  }
  
  update(){
    this.center = {x:this.player.center.x, y:this.player.center.y - this.size.y/2-10};
    let hit_enemies = this.findColliding(this.game.enemies)
    if (hit_enemies.length > 0) {
      hit_enemies.forEach(enemy => {
        enemy.health-=.3
        let new_debris = new Debris(this.game, {x:enemy.center.x, y:enemy.center.y})
        this.game.bodies.push(new_debris)
      })
    }
    if(this.player.power_level != 2 || !this.player.attack) {
      this.destroyed = true
      this.player.player_beam_attack = null
      this.game.synthesizer.player_laser_sequence.stop();
    }
  }
  
  draw(){
    this.game.ctx.fillStyle = RED;
    this.game.ctx.fillRect(this.center.x-this.size.x/2,
                            this.center.y-this.size.y/2,
                            this.size.x,
                            this.size.y
                           );
  }
}

class EngineTrail extends Body {
  constructor(game, player, center, decay, speed) {
    super(game, center)
    this.player = player;
    this.scale = 1;
    this.size = {x:10,y:14}
    this.g=255;
    this.decay=decay;
    this.speed=speed;
  }
  
  update(){
    this.center.y+=this.speed
    this.g-=this.decay
    let hit_enemies = this.findColliding(this.game.enemies)
    if (hit_enemies.length > 0) {
      hit_enemies.forEach(enemy => {
        enemy.health-=0.07
        let new_debris = new Debris(this.game, {x:enemy.center.x, y:enemy.center.y})
        this.game.bodies.push(new_debris)
      })
    }
    if (this.g <20) {
      this.destroyed = true
    }
  }
  
  draw(){
    this.game.ctx.fillStyle = "rgb(0, "+this.g+", 0)";
    this.game.ctx.fillRect(this.center.x-this.size.x/2,
                            this.center.y-this.size.y/2,
                            this.size.x,
                            this.size.y
                           );
  }
}

class Debris extends Body {
  constructor(game, center) {
    super(game, center)
    this.scale = Math.random()*10+5;
    this.size = {x:this.scale,y:this.scale}
    this.r=255;
    this.g=255;
    this.b=255;
    this.rdecay=20;
    this.gdecay=30;
    this.bdecay=40;
    this.vector={x:Math.random()*4-2,y:Math.random()*4-2}
    this.game.synthesizer.explosion_sequence.play();
  }
  
  update(){
    this.center.x+=this.vector.x
    this.center.y+=this.vector.y
    this.r-=this.rdecay
    this.g-=this.gdecay
    this.b-=this.bdecay
    let hit_enemies = this.findColliding(this.game.enemies)
    if (this.r <20) {
      this.destroyed = true
    }
  }
  
  draw(){
    this.game.ctx.fillStyle = "rgb("+this.r+", "+this.g+", "+this.b+")";
    this.game.ctx.fillRect(this.center.x-this.size.x/2,
                            this.center.y-this.size.y/2,
                            this.size.x,
                            this.size.y
                           );
  }
  
}

class ShieldZap extends Body {
  constructor(game, player, center, enemy) {
    super(game, center)
    this.player = player;
    this.r=100;
    this.g=100;
    this.b=255;
    this.origin = {x: player.center.x + (enemy.center.x - player.center.x)/6,
                   y: player.center.y + (enemy.center.y - player.center.y)/6}
    this.target = {x: enemy.center.x, y: enemy.center.y}
  }
  
  update(){
    this.r-=5;
    this.g-=5;
    this.b-=10;
    if (this.b <20) {
      this.destroyed = true
    }
  }
  
  draw(){
    this.game.ctx.strokeStyle = "rgb("+this.r+","+this.g+","+this.b+")";
    this.game.ctx.lineWidth = 6
    this.game.ctx.beginPath();
    this.game.ctx.moveTo(this.origin.x, this.origin.y);
    this.game.ctx.lineTo(this.target.x, this.target.y);
    this.game.ctx.closePath();
    this.game.ctx.stroke();
  }
}

class Enemy extends Body {
  constructor(game, center, size) {
    super(game, center, size);
    this.bullet_scheduler = this.game.time + 1
  }
  
  update(){
    this.update_attack()
    this.update_position()
    if (this.health < 1) {
      this.destroyed = true;
      this.game.score += 100;
      for (var i = 0; i < 8; i++) {
        let new_debris = new Debris(this.game, {x:this.center.x, y:this.center.y})
        this.game.bodies.push(new_debris)
      }
    }
    let hit_players = this.findColliding([this.game.player])
    if (hit_players.length > 0) {
      this.destroyed = true;
      this.game.score += 100;
      this.game.player.take_hit(this);
    }
    if (this.game.player.shield) {
      if (this.colliding(this.game.player.player_shield)) {
        this.destroyed = true;
        this.game.score += 100;
        this.game.player.player_shield.take_hit(this)
      }
    }
  }
  
  update_attack() {
    if (this.game.time == this.bullet_scheduler) {
      let new_bullet = this.new_bullet()
      this.game.bodies.push(new_bullet)
      this.game.player_bullets.push(new_bullet)
      this.bullet_scheduler += this.bullet_frequency
    }
  }
  
  update_position() {
    this.center.y = this.center.y + this.speed
    if (this.center.y >= this.game.size.y + (this.size.y / 2)) {
      this.destroyed = true;
    }
  }
}

class AttackEnemy extends Enemy {
  constructor(game, center) {
    super(game, center);
    this.coordinates = [[-2,-5],[-4,0],[-2,5],[0,1],[2,5],[4,0],[2,-5],[1,-3],[0,-4],[-1,-3]];
    this.color = RED;
    this.scale = 3.5;
    this.size = {x:6*this.scale, y:8*this.scale};
    this.speed = 3+Math.random();
    this.health = 4;
    this.bullet_frequency = 30+Math.floor(Math.random()*30)
  }
  new_bullet(){
    return new AttackBullet(this.game,{x:this.center.x, y:this.center.y})
  }
}

class ShieldEnemy extends Enemy {
  constructor(game, center) {
    super(game, center);
    this.coordinates = [[0,-5],[-3,-3],[-4,3],[-1,0],[0,5],[1,0],[4,3],[3,-3]];
    this.color = BLUE;
    this.scale = 3.5;
    this.size = {x:6*this.scale, y:8*this.scale}
    this.speed = 1+Math.random();
    this.health = 6;
    this.bullet_frequency = 60+Math.floor(Math.random()*60)
  }
  new_bullet(){
    return new ShieldBullet(this.game,{x:this.center.x, y:this.center.y})
  }
}

class DriveEnemy extends Enemy {
  constructor(game, center) {
    super(game, center);
    this.coordinates = [[0, -4],[-3,-5],[-1,0],[-4,-2,],[-2,4],[-2,1],[0,5],[2,1],[2,4],[4,-2],[1,0],[3,-5]];
    this.color = GREEN;
    this.scale = 3.5;
    this.size = {x:6*this.scale, y:8*this.scale}
    this.speed = 4+Math.random();
    this.health = 5;
    this.bullet_frequency = 60+Math.floor(Math.random()*60)
  }
  new_bullet(){
    return new DriveBullet(this.game,{x:this.center.x, y:this.center.y})
  }
}

class PlayerBullet extends Body {
  constructor(game, center) {
    super(game, center)
    this.coordinates = [[0,-1],[1,0],[0,1],[-1,0]]
    this.color = RED
    this.speed = 6
    this.scale = 6
    this.size = {x:2*this.scale, y:2*this.scale}
    this.game.synthesizer.player_bullet_sequence.play();
  }
  update() {
    this.center.y = this.center.y - this.speed
    if (this.center.y + this.size.y < 0) {
      this.destroyed = true;
    }
    let hit_enemies = this.findColliding(this.game.enemies)
    if (hit_enemies.length > 0) {
      this.destroyed = true;
      hit_enemies.forEach(enemy => {
        enemy.health--;
        let new_debris = new Debris(this.game, {x:enemy.center.x, y:enemy.center.y})
        this.game.bodies.push(new_debris)
      })
    }
  }
}

class BigPlayerBullet extends Body {
  constructor(game, center) {
    super(game, center)
    this.coordinates = [[-1,-2],[1,-2],[2,-1],[2,2],[1,1],[-1,1],[-2,2],[-2,-1]]
    this.color = RED
    this.stroke = BLACK
    this.weight = 12
    this.speed = 12
    this.scale = 6
    this.size = {x:4*this.scale, y:4*this.scale}
    this.game.synthesizer.big_bullet_sequence.play();
  }
  update() {
    this.center.y = this.center.y - this.speed
    this.size.x += 4
    this.size.y += 2
    this.scale += 1
    if (this.center.y + this.size.y < 0) {
      this.destroyed = true;
    }
    let hit_enemies = this.findColliding(this.game.enemies)
    if (hit_enemies.length > 0) {
      this.destroyed = true;
      hit_enemies.forEach(enemy => {
        enemy.health--
        let new_debris = new Debris(this.game, {x:enemy.center.x, y:enemy.center.y})
        this.game.bodies.push(new_debris)
      })
    }
  }
}


class EnemyBullet extends Body {
  constructor(game, center) {
    super(game, center)
  }

  update() {
    this.center.y = this.center.y + this.speed*this.vector.y
    this.center.x = this.center.x + this.speed*this.vector.x
    if (this.center.y + this.size.y < 0 ||
         this.center.y - this.size.y > this.game.size.y ||
         this.center.x + this.size.x < 0 ||
         this.center.x - this.size.x > this.game.size.x) {
      this.destroyed = true;
    }
    let hit_players = this.findColliding([this.game.player])
    if (hit_players.length > 0) {
      this.destroyed = true;
      this.game.player.take_hit(this);
    }
    if (this.game.player.shield) {
      if (this.colliding(this.game.player.player_shield)) {
        this.destroyed = true;
        this.game.player.player_shield.take_hit(this)
      }
    }
  }
}

class AttackBullet extends EnemyBullet {
  constructor(game, center) {
    super(game, center)
    this.coordinates = [[-1,-1],[1,-1],[1,1],[-1,1]]
    this.color = RED
    this.speed = 5
    this.scale = 5
    this.size = {x:2*this.scale, y:2*this.scale}
    this.spread = 0.2
    this.vector = this.find_angle_coords(this.game.player, this.spread)
  } 
}

class ShieldBullet extends EnemyBullet {
  constructor(game, center) {
    super(game, center)
    this.coordinates = [[-1,-1],[1,-1],[1,1],[-1,1]]
    this.color = BLUE
    this.speed = 4
    this.scale = 7
    this.size = {x:2*this.scale, y:2*this.scale}
    this.spread = 0.3
    this.vector = this.find_angle_coords(this.game.player, this.spread)
  } 
}

class DriveBullet extends EnemyBullet {
  constructor(game, center) {
    super(game, center)
    this.coordinates = [[-1,-1],[1,-1],[1,1],[-1,1]]
    this.color = GREEN
    this.speed = 6
    this.scale = 4
    this.size = {x:2*this.scale, y:2*this.scale}
    this.spread = 0.4
    this.vector = this.find_angle_coords(this.game.player, this.spread)
  } 
}

class StarField {
  constructor(game) {
    this.game = game;
    this.star_number = 500;
    this.z = 3;
    this.max_z = 6;
    this.speed = 0.1;
    this.max_speed = 5;
    this.color_variation = 10;
    this.max_color_variation = 20;
    this.base_color = {
      r:20,
      g:30,
      b:30,
    };
    this.max_base_color = {
      r:80,
      g:30,
      b:30
    };
    this.stars = []
  }
  
  setup() {
    for (var i = 0; i < this.star_number; i++) {
      let rand = Math.random()
      this.stars.push({
        x: Math.random()*(this.game.size.x+2*this.z)-this.z,
        y: Math.random()*(this.game.size.y+2*this.z)-this.z,
        z: rand*this.z+.5,
        r: (this.base_color.r + Math.random()*this.color_variation)*rand,
        g: (this.base_color.g + Math.random()*this.color_variation)*rand,
        b: (this.base_color.b + Math.random()*this.color_variation)*rand,
        destroyed: false
      })
    }
  }
  
  update() {
    this.speed = Math.min(this.speed + 0.0005, this.max_speed);
    this.z = Math.min(this.z + 0.0003, this.max_z);
    this.base_color = {
      r: Math.min(this.base_color.r+0.005, this.max_base_color.r),
      g: this.base_color.g,
      b: this.base_color.b
    }
    this.color_variation = Math.min(this.color_variation + 0.001, this.max_color_variation);
    for (let star of this.stars) {
      star.y+=star.z*this.speed
      if (star.y > this.game.size.y + this.z) {
        star.destroyed = true
        let rand = Math.random()
        this.stars.push({
          x: Math.random()*this.game.size.x,
          y: 0-this.z,
          z: rand*this.z+.5,
          r: (this.base_color.r + Math.random()*this.color_variation)*rand,
          g: (this.base_color.g + Math.random()*this.color_variation)*rand,
          b: (this.base_color.b + Math.random()*this.color_variation)*rand,
          destroyed: false
        })
      }
    }
    this.stars = this.stars.filter(star => !star.destroyed)
  }
  
  draw() {
    for (let star of this.stars.sort(function(a,b){return a.z-b.z})) {
      this.game.ctx.fillStyle = "rgb("+star.r+", "+star.g+", "+star.b+")";
      this.game.ctx.fillRect(star.x-star.z,star.y-star.z,star.z*2,star.z*2)
    }
  }
}

document.addEventListener("DOMContentLoaded", function() {
  const game = new Game(
    document.getElementById("game-canvas"),
    new Keyboarder()
  );
});