
// Utility
// -----------------------------------------------------------------
// *****************************************************************

// Mathematics and coordinate system
const FULL_ROTATION = 360;
fix_rotation = function(rotation){return (FULL_ROTATION+rotation)%FULL_ROTATION;};
frac_part = function(v){return v-Math.floor(v);};
sqr = function(m){return m*m};

// general utility
dom = function(id){return document.getElementById(id);};
do_times = function(func, times){for (var i=0; i<times; i++)func();};
parse_num = function(v){return Number.parseFloat(v).toPrecision(2);}

// Color constants
BLACK = 'rgb(0,0,0)';

const ENTITY_COLORS = {
	'white': ['rgb(255, 255, 255)', 'rgb(63, 63, 63)', 'rgb(31, 31, 31)', 'rgb(15, 15, 15)'],
	'red': ['rgb(255, 0, 0)', 'rgb(127, 0, 0)', 'rgb(63, 0, 0)', 'rgb(31, 0, 0)'],
	'green': ['rgb(0, 255, 0)', 'rgb(0, 127, 0)', 'rgb(0, 63, 0)', 'rgb(0, 31, 0)'],
	'blue':['rgb(0, 0, 255)', 'rgb(0, 0, 127)', 'rgb(0, 0, 63)', 'rgb(0, 0, 31)'],
	'yellow':['rgb(255, 255, 0)', 'rgb(63, 63, 0)', 'rgb(47, 47, 0)', 'rgb(31, 31, 0)']
};

const MESSAGE_COLORS = {
	'online': 'rgb(0, 255, 0)',
	'warning': 'rgb(255, 127, 0)',
	'offline': 'rgb(255, 0, 0)'
};

const MESSAGE_BACKGROUNDS = {
	'online': 'rgb(0,255,0, 0.2)',
	'warning': 'rgb(255, 127, 0, 0.2)',
	'offline': 'rgb(255, 0, 0, 0.2)'
};

// Torus geometry
torus = {
	delta_coor: function(x1, x2){
		var dx = frac_part(x1-x2);
		var dx = dx > 0.5? (dx-1):dx;
		return dx;
	},
	relative_coor: function(x0, y0, rotation, x, y){
		var dx = this.delta_coor(x, x0);
		var dy = this.delta_coor(y, y0);
		var angle = (2*Math.PI / FULL_ROTATION) * rotation;
		var new_x = dx * Math.cos(angle) - dy * Math.sin(angle);
		var new_y = dx * Math.sin(angle) + dy * Math.cos(angle);
		return [new_x, new_y];
	},
	
	sqr_dist: function(x1, y1, x2, y2){
		var dx = frac_part(x1-x2);
		var dy = frac_part(y1-y2);
		dx = Math.min(dx, 1-dx);
		dy = Math.min(dy, 1-dy);
		return sqr(dx)+sqr(dy);
	}
};

// Game Logic
// -----------------------------------------------------------------
// *****************************************************************

const COLLISION_GRID_SIZE = 100;
const ROBOT_RADIUS = 0.005;
const AVATAR_VELOCITY = 0.002;
const MAX_HP = 8;
const INIT_HP = 3;
const MAX_AMM = 16;
const INIT_AMM = 8;

const nice = [
	'Hello',
	'How are you?',
	'Everything is awesome!',
	'Nice day',
	"What's up?",
	'Great to see you',
	'Have a wonderful day!',
	'Nice weather',
	'You look great!',
	"How's the family?"
];

const hostile = [
	'Come and get it!',
	'You are so dead',
	'Die! you plastic waste!',
	'I hate you so much!',
	'KILL! KILL! KILL!',
	'Noob!',
	'Fuck you!',
	'Just stand still please',
	'>_<',
	'I spit on your sensors!'
];

// Entities
entity_manager = {
	entity_list:[],
	
	add: function(entity){
		this.entity_list.push(entity);
		collision_manager.add(entity);
	},
	remove: function(entity){
		collision_manager.remove(entity);
		entity.kill = true;
	},
	teleport: function(entity, new_x, new_y){
		collision_manager.remove(entity);
		entity.x = new_x;
		entity.y = new_y;
		collision_manager.add(entity);
	},
	clean_up: function(func){
		this.entity_list = this.entity_list.filter(entity => !entity.kill);
	}
};

collision_manager = {
	collision_grid: {},
	
	add: function(entity){
		var grid_x = Math.floor(entity.x*COLLISION_GRID_SIZE);
		var grid_y = Math.floor(entity.y*COLLISION_GRID_SIZE);
		var key = ''+grid_x+';'+grid_y;
		if (!(key in collision_manager.collision_grid))
			collision_manager.collision_grid[key] = [];
		collision_manager.collision_grid[key].push(entity);
	},
	
	remove(entity){
		var grid_x = Math.floor(entity.x*COLLISION_GRID_SIZE);
		var grid_y = Math.floor(entity.y*COLLISION_GRID_SIZE);
		var key = ''+grid_x+';'+grid_y;
		if (key in collision_manager.collision_grid)
			to_keep = collision_manager.collision_grid[key].filter(en => en != entity);
			collision_manager.collision_grid[key] = to_keep;
	},
	
	detect_collision: function(entity, x, y, radius){
		var grid_x = Math.floor(x*COLLISION_GRID_SIZE);
		var grid_y = Math.floor(y*COLLISION_GRID_SIZE);
		for (var dx=-1; dx<2; dx++)
			for (var dy=-1; dy<2; dy++){
				var test_x=(COLLISION_GRID_SIZE+grid_x+dx)%COLLISION_GRID_SIZE;
				var test_y=(COLLISION_GRID_SIZE+grid_y+dy)%COLLISION_GRID_SIZE;
				var test_key = ''+test_x+';'+test_y;
				if (test_key in collision_manager.collision_grid)
					for (var test_entity of collision_manager.collision_grid[test_key]){
						if (test_entity.kill || !test_entity.active || (test_entity === entity))
							continue;
						sqr_dist = torus.sqr_dist(x, y, test_entity.x, test_entity.y);
						if (sqr_dist <= sqr(test_entity.radius+radius))
							return test_entity;
					}
			}
		return null;
	}
};

// Statistics
carnage = 0;
player_kills = 0;
hits = 0;

// Game State
game_state = {};

set_state = function(new_state, counter_sec){	
	[game_state.core_message, game_state.color] = {
		'online': ['SYSTEM ONLINE', 'online'],
		'error': ['ERROR DETECTED. DISCONNECT IN # SECONDS', 'warning'],
		'offline': ['SYSTEM OFFLINE', 'offline'],
		'reconnect': ['ERROR REPAIRED. RECONNECT IN # SECONDS', 'warning']
	}[new_state];
	game_state.state = new_state;
	game_state.counter_steps = counter_sec * 1024 / TIME_INTERVAL;
};

combat_state = function(){
	return (game_state.state == 'offline' || game_state.state == 'reconnect');
};

switch_state = function(){
	switch (game_state.state){
		case 'online':
			set_state('error', 5);
			break;
		case 'error':
			set_state('offline', 30);
			set_middle_message('Press space to shoot');
			break;
		case 'offline':
			set_state('reconnect', 5);
			break;
		case 'reconnect':
			set_state('online', 5);
			break;
	};
};

teleport_outside_view = function(entity){
	var rad = 1/VIEW_FACTOR;
	var range = 1 - 2*rad;
	var x = frac_part(avatar.x + rad + range * Math.random());
	var y = frac_part(avatar.y + rad + range * Math.random());
	entity_manager.teleport(entity, x, y);
};

add_corpse = function(original){
	corpse_list.push({
		type: original.type, 
		color: original.color,
		x: original.x, 
		y: original.y,
		rotation: original.rotation,
		radius: original.radius,
		counter: 0,
		span: 0
	});
};

avatar = {
	type: 'avatar',
	kill: false,
	active: true,
	blocker: true,
	moving: true,
	linear_velocity: 0.002,
	angular_velocity: 2,
	color: 'blue',
	direction: 0,
	angular_direction: 0,
	x:0.5, y:0.5,
	rotation: 0,
	radius: ROBOT_RADIUS,
	hp: INIT_HP,
	amm: INIT_AMM,
	on_collide: function(collided){
		var options = {
			'stain': function(){
				collided.active = false;
				set_state('online', 5);
				add_corpse(collided);
			},
			'clip':function(){
				teleport_outside_view(collided);
				avatar.amm += 5;
				avatar.amm = Math.min(MAX_AMM, avatar.amm);
			},
			'health':function(){
				teleport_outside_view(collided);
				if (avatar.hp < MAX_HP)
					avatar.hp += 1;
			}
		};
		if (collided.type in options)
			(options[collided.type])();
	},
	cooldown: 0,
	update: function(){
		if (this.cooldown > 0)
			this.cooldown-=1;
	}
};

robot_mind = function(){
	var me = this;
	var SQR_SIGHT_RADIUS = 0.0025;
	
	var speak = function(){
		var color = combat_state()?'red':'green';
		me.color = color;
		if (me.speak_cool_down > 0){
			me.speak_cool_down -=1;
			return;
		}
		var source = combat_state()?hostile:nice;
		var m_index = Math.floor(Math.random()*10);
		console.log('%c '+source[m_index], 'color:'+color);
		me.speak_cool_down = 200;
	};
	
	// reset and update
	me.color='white';
	if (me.cooldown > 0)
		me.cooldown-=1;
	
	// if I'm out of view, i don't need to pretend i'm doing anything
	if (out_of_view(me.x, me.y))
		return;
	
	var angle = (2*Math.PI / FULL_ROTATION) * (entity.rotation+FULL_ROTATION/4);
	dir_x = Math.sin(angle);
	dir_y = Math.cos(angle);
	
	// is there someyhing in front of me?
	seen_bullet = null;
	seen_robot = null;

	var grid_x = Math.floor(me.x*COLLISION_GRID_SIZE);
	var grid_y = Math.floor(me.y*COLLISION_GRID_SIZE);
	for (var dx=-4; dx<5; dx++)
		for (var dy=-4; dy<5; dy++){
			var test_x=(COLLISION_GRID_SIZE+grid_x+dx)%COLLISION_GRID_SIZE;
			var test_y=(COLLISION_GRID_SIZE+grid_y+dy)%COLLISION_GRID_SIZE;
			var test_key = ''+test_x+';'+test_y;
			if (test_key in collision_manager.collision_grid)
				for (var test_entity of collision_manager.collision_grid[test_key]){
					if (test_entity.kill || !test_entity.active || (test_entity === me))
						continue;
					if (!test_entity.type in ['avatar', 'robot', 'bullet'])
						continue;
					if (test_entity.type == 'bullet' && test_entity.origin === me)
						continue;
					var delta_x = torus.delta_coor(test_entity.x, me.x);
					var delta_y = torus.delta_coor(test_entity.y, me.y);
					var sqr_dist = sqr(delta_x) + sqr(delta_y);
					if (sqr_dist > SQR_SIGHT_RADIUS)
						continue;
					var cos_ang = (delta_x*dir_x + delta_y*dir_y)/ Math.sqrt(0.000001 + sqr_dist);
					if (cos_ang < 0.75)
						continue;
					
					// Spotted Something!
					if (test_entity.type == 'bullet'){
						seen_bullet = {'entity':test_entity, 'dx': delta_x, 'dy':delta_y, 'cos_ang':cos_ang};
					}	
					else if (test_entity.type == 'robot'){
						seen_robot = {'entity':test_entity, 'dx': delta_x, 'dy':delta_y, 'cos_ang':cos_ang};
					}
					else if (test_entity.type == 'avatar'){
						seen_robot = {'entity':test_entity, 'dx': delta_x, 'dy':delta_y, 'cos_ang':cos_ang};
						speak();
					}										
				}
		}
		
	// Resolve
	// ------------------------------------------
	if (combat_state()){
		
		// a bullet! run away!
		if (seen_bullet)
			me.direction = -1;
		
		// see an enemy
		else if (seen_robot){
			
			// have a clear shoot
			if (me.cooldown == 0 && seen_robot['cos_ang']>0.9){
				entity_manager.add(create_bullet(me, me.x, avatar.y, me.rotation, me.color));
				me.cooldown = 15;
			}
			
			// improve aiming angle
			else {
				
				angle_dir_sign = Math.sign(delta_x*dir_y-delta_y*dir_x);
				me.angular_direction = angle_dir_sign;
			}
			
			// if too close, keep a fair distance
			sqr_dist = sqr(seen_robot['dx']) + sqr(seen_robot['dy'])
			if (sqr_dist < 0.25 *SQR_SIGHT_RADIUS)
				me.direction = -1;
			
			// pursue enemy 
			else (sqr_dist > 0.25 *SQR_SIGHT_RADIUS)
				me.direction = 1;
		}
	}
	else {
		
		// if i'm doing something, keep doing it
		if (me.action_cooldown > 0){
			me.action_cooldown-=1;
			return;
		}
		
		// if too close to another robot, keep a fair distance		
		if (seen_robot && sqr_dist < 0.5 *SQR_SIGHT_RADIUS){
			sqr_dist = sqr(seen_robot['dx']) + sqr(seen_robot['dy'])
			if (sqr_dist < 0.25 *SQR_SIGHT_RADIUS){
				me.direction = -1;
				me.action_cooldown = 10;
				return;
			}
		}
		
		// wonder around
		else {
			p = Math.random();
			if (p<0.15)
				me.angular_direction = -1;
			else if (p<0.3)
				me.angular_direction = 1;
			me.direction = 1;
			me.action_cooldown = 10;
		}
	}
};

restart_game_logic = function(){
	entity_manager.add(avatar);
	
	// other robots
	do_times(function(){
		px = Math.random();
		py = Math.random();
		entity_manager.add({
			type: 'robot',
			active: true,
			kill: false,
			blocker: true,
			moving: true,
			linear_velocity: 0.002,
			angular_velocity: 1,
			color: 'white',
			direction: 1,
			angular_direction: 1,
			x: px, y: py,
			rotation:0,
			radius: ROBOT_RADIUS,
			hp: INIT_HP,
			cooldown: 0,
			action_cooldown: 0,
			speak_cool_down: 0,
			update: robot_mind
		});
	}, 50);
	
	do_times(function(){
		px = Math.random();
		py = Math.random();
		entity_manager.add({
			type: 'clip',
			active: true,
			kill: false,
			blocker: false,
			moving: false,
			x: px, y: py,
			rotation:0,
			radius: ROBOT_RADIUS,
		});
	}, 40);
	
	do_times(function(){
		px = Math.random();
		py = Math.random();
		entity_manager.add({
			type: 'health',
			active: true,
			kill: false,
			blocker: false,
			moving: false,
			x: px, y: py,
			rotation:0,
			radius: ROBOT_RADIUS,
		});
	}, 30);
};

resolve_movement=function(entity){
	entity.rotation += entity.angular_direction * entity.angular_velocity;
	var angle = (2*Math.PI / FULL_ROTATION) * (entity.rotation+FULL_ROTATION/4);
	var new_x = frac_part(entity.x + entity.linear_velocity * entity.direction * Math.sin(angle));
	var new_y = frac_part(entity.y + entity.linear_velocity * entity.direction * Math.cos(angle));
	var collided_entity = collision_manager.detect_collision(entity, new_x, new_y, entity.radius);
	if (collided_entity != null){
		if (entity.on_collide)
			entity.on_collide(collided_entity);
		if (collided_entity.blocker && entity.blocker)
			return;
	}
	entity_manager.teleport(entity, new_x, new_y);
};

create_bullet = function(origin, x, y, rotation, color){
	bullet = {
		type: 'bullet',
		active: true,
		blocker: false,
		moving: true,
		linear_velocity: 0.01,
		angular_velocity: 0,
		color: color,
		direction: 1,
		angular_direction: 0,
		x:x, y:y,
		rotation: rotation,
		radius: ROBOT_RADIUS,
		origin: origin,
		on_collide: function(collided){
			if (collided === this.origin || !collided.hp)
				return;
			collided.hp -=1;
			entity_manager.remove(this);
			if ((this.origin == avatar)){
				hits += 1;
				dom('hits-count').innerHTML = hits;
			}
			if (collided.hp == 0){
				carnage += 1;
				dom('total-carnage-count').innerHTML = carnage;
				if (this.origin == avatar)
					player_kills += 1;
					dom('your-carnage-count').innerHTML = player_kills;
				if (collided.type === 'robot' ){
					add_corpse(collided);
					teleport_outside_view(collided);
					collided.hp = INIT_HP;
					return;
				}
				if (collided.type == 'avatar'){
					add_corpse(collided);
					setTimeout(function(e){
						clearInterval(platform.interval);
						dom('combat-death-message').style.display = 'block';
					}, 1500);
					window.onkeydown=null;
					window.onkeyup=null;
				};
			}
		},
		lifespan: 30,
		update(){
			this.lifespan -=1;
			if (this.lifespan==0)
				entity_manager.remove(this);
		}
	};
	return bullet;
};


// Graphics
// -----------------------------------------------------------------
// *****************************************************************
const CANVAS_SIZE=480;
const VIEW_FACTOR = 10;
const RATIO = 0.5*VIEW_FACTOR*CANVAS_SIZE;

relative_coor = function(x, y){
	return torus.relative_coor(avatar.x, avatar.y, avatar.rotation, x, y);
};

out_of_view = function(x, y){
	sqr_dist = torus.sqr_dist(x, y, avatar.x, avatar.y);
	return (sqr_dist * sqr(VIEW_FACTOR) > 2);
};

transform = function(x, y, rotation){
	platform.canvas_context.save();
	var [new_x, new_y] = relative_coor(x, y);
	var canvas_center_x = RATIO*new_x;
	var canvas_center_y = RATIO*new_y;
	relative_rotation = fix_rotation(rotation-avatar.rotation);
	angle = (2*Math.PI / FULL_ROTATION) * relative_rotation;
	platform.canvas_context.translate(canvas_center_x, canvas_center_y);
	platform.canvas_context.rotate(-angle);
};

draw_robot = function(entity, stage=0){
	if (out_of_view(entity.x, entity.y))
		return;
	transform(entity.x, entity.y, entity.rotation);
	
	// draw circle
	platform.canvas_context.fillStyle = ENTITY_COLORS[entity.color][stage];
	platform.canvas_context.beginPath();
	platform.canvas_context.arc(0, 0, 0.5*ROBOT_RADIUS*CANVAS_SIZE*VIEW_FACTOR, 0, 2*Math.PI);
	platform.canvas_context.fill();
	
	// draw triangle
	platform.canvas_context.fillStyle = BLACK;
	platform.canvas_context.beginPath();
    platform.canvas_context.moveTo(0, -8);
    platform.canvas_context.lineTo(0, 8);
    platform.canvas_context.lineTo(8, 0);
    platform.canvas_context.fill();
	platform.canvas_context.restore();
	
	if (entity.hp)
		draw_hp_bar(entity);
	if (entity.amm)
		draw_amm_bar(entity);
};

draw_hp_bar=function(entity){
	fade = (!combat_state());
	if (fade && entity.type == 'robot')
		return;
	
	transform(entity.x, entity.y, avatar.rotation);
	
	// draw frame box
	platform.canvas_context.fillStyle = {true:'rgba(63,0,0,0.3)', false:'rgb(63, 0, 0)'}[fade];
	platform.canvas_context.fillRect (16, 16, 8, 8 * MAX_HP);
	
	// draw hp
	platform.canvas_context.fillStyle = {true:'rgba(255,0,0,0.3)', false:'rgb(255, 0, 0)'}[fade];
	for (var i=0; i<entity.hp; i++)
		platform.canvas_context.fillRect (17, 17+i*8, 6, 6);
	
	platform.canvas_context.restore();
};

draw_amm_bar=function(entity){
	fade = (!combat_state());
	if (fade && entity.type == 'robot')
		return;
	
	transform(entity.x, entity.y, avatar.rotation);
	
	// draw frame box
	platform.canvas_context.fillStyle = {true:'rgba(47,47,47,0.3)', false:'rgb(47, 47, 47)'}[fade];
	platform.canvas_context.fillRect (-16, 16, 8, 4 * MAX_AMM);
	
	// draw ammunition clip
	platform.canvas_context.fillStyle = {true:'rgba(127,127,127,0.3)', false:'rgb(127, 127, 127)'}[fade];
	for (var i=0; i<entity.amm; i++)
		platform.canvas_context.fillRect (-15, 17+i*4, 6, 2);
	
	platform.canvas_context.restore();
};

draw_health = function(entity){
	transform(entity.x, entity.y, avatar.rotation);
	
		// draw circle
	platform.canvas_context.fillStyle = 'white';
	platform.canvas_context.beginPath();
	platform.canvas_context.arc(0, 0, 0.5*ROBOT_RADIUS*CANVAS_SIZE*VIEW_FACTOR, 0, 2*Math.PI);
	platform.canvas_context.fill();
	
		// draw cross
	platform.canvas_context.fillStyle = 'red';
	platform.canvas_context.fillRect (-8, -2, 16, 4);
	platform.canvas_context.fillRect (-2, -8, 4, 16);
	
	platform.canvas_context.restore();
}

draw_clip = function(entity){
	transform(entity.x, entity.y, avatar.rotation);
	
		// draw circle
	platform.canvas_context.fillStyle = 'rgb(127, 127, 127)';
	platform.canvas_context.beginPath();
	platform.canvas_context.arc(0, 0, 0.5*ROBOT_RADIUS*CANVAS_SIZE*VIEW_FACTOR, 0, 2*Math.PI);
	platform.canvas_context.fill();
	
		// draw cross
	platform.canvas_context.fillStyle = 'rgb(63, 63, 63)';
	for (var off=0; off<5; off++)
		platform.canvas_context.fillRect (-6, -9+4*off, 12, 2);

	
	platform.canvas_context.restore();
}

draw_bullet = function(entity, stage=0){
	if (out_of_view(entity.x, entity.y))
		return;
	transform(entity.x, entity.y, entity.rotation);
		
	// draw triangle
	platform.canvas_context.fillStyle = ENTITY_COLORS[entity.color][stage];
	platform.canvas_context.beginPath();
    platform.canvas_context.moveTo(0, -8);
    platform.canvas_context.lineTo(0, 8);
    platform.canvas_context.lineTo(16, 0);
    platform.canvas_context.fill();
	platform.canvas_context.restore();
};

set_message = function(){
	sec_remain = Math.floor(game_state.counter_steps * TIME_INTERVAL / 1024);
	msg = game_state.core_message.replace ('#', sec_remain);
	platform.message_div.innerHTML = msg;
	platform.message_div.style.setProperty('color', MESSAGE_COLORS[game_state.color]);
	//color = MESSAGE_COLORS[game_state.color];
	platform.message_div.style.setProperty('background-color', MESSAGE_BACKGROUNDS[game_state.color]);
};

corpse_list = [];


// Controls
// -----------------------------------------------------------------
// *****************************************************************
const TIME_INTERVAL = 32;
key_down = function(e){
	switch (e.key) {
		case 'w': case 'ArrowUp':
			avatar.direction = 1;
			break;
		case 'a': case 'ArrowLeft':
			avatar.angular_direction = 1;
			break;
		case 's': case 'ArrowDown':
			avatar.direction = -1;
			break;
		case 'd': case 'ArrowRight':
			avatar.angular_direction = -1;
			break;
		case 'Esc': case 'Escape':
			pause();
			break;
		case ' ': 
			if (!combat_state()){
				set_middle_message ("You can't shoot when the system is watching!");
				break;
			}
			if (avatar.amm == 0){
				set_middle_message ("No ammunition");
				break;
			}
			if (avatar.cooldown == 0){
				avatar.amm -= 1;
				entity_manager.add(create_bullet(avatar, avatar.x, avatar.y, avatar.rotation, avatar.color));
				avatar.cooldown = 10;	
			};		
			break;
	};	
};

key_up = function(e){
	switch (e.key) {
		case 'w': case 'ArrowUp':
		case 's': case 'ArrowDown':
			avatar.direction = 0;
			break;
		case 'a': case 'ArrowLeft':
		case 'd': case 'ArrowRight':
			avatar.angular_direction = 0;
			break;
	};
};


// Engine
// -----------------------------------------------------------------
// *****************************************************************
platform = {
	active: false,
	canvas_context: null,
	message_div: null,
	interval: null
};

game_loop = function(e){
	
	// clear graphics
	platform.canvas_context.clearRect(-CANVAS_SIZE/2, -CANVAS_SIZE/2, CANVAS_SIZE, CANVAS_SIZE);
	
	// draw corpses
	for (var corpse_id=0; corpse_id < corpse_list.length; corpse_id++){
		var to_reserve = [];
		var corpse = corpse_list[corpse_id];
		if (corpse.counter % 5 == 0)
			corpse.span +=1;
		corpse.counter +=1;
		if (corpse.span < 4){
			drawing_function = {
				'avatar': draw_robot,
				'robot': draw_robot,
			}[corpse.type]; 
			drawing_function(corpse, corpse.span);
			to_reserve.push(corpse);
		};
		corpse_list = to_reserve;
	};
	
	// handle entities
	for (var entity_index=0; entity_index<entity_manager.entity_list.length; entity_index++){
		entity = entity_manager.entity_list[entity_index];
		if (!entity || !entity.active || entity.kill)
			continue;
		if (entity.moving)
			resolve_movement(entity);
		if (entity.update)
			entity.update();
		drawing_function = {
			'avatar': draw_robot,
			'robot': draw_robot,
			'bullet': draw_bullet,
			'health': draw_health,
			'clip': draw_clip
		}[entity.type];
		drawing_function(entity);
	};
	
	// clean entities
	entity_manager.clean_up();
	
	dom('coor').innerHTML = parse_num(avatar.x) +', ' +parse_num(avatar.y);
	
	// game status
	game_state.counter_steps -=1;
	if (game_state.counter_steps% (1024 / TIME_INTERVAL) == 0)
		set_message();
	if (game_state.counter_steps == 0)
		switch_state();
};

init = function(){

	// Graphics
	// -------------------------------------------------------------------------------
	platform.canvas_context = dom('game-canvas').getContext('2d');
	platform.canvas_context.translate(CANVAS_SIZE/2, CANVAS_SIZE/2);
	platform.canvas_context.rotate(-Math.PI/2);
	
	// Message-system
	// --------------------------------------------------------------------------------
	platform.message_div = dom('ingame-message');
};

restart = function(){
	set_state('online',5);
	set_message();
	restart_game_logic();
	resume();
};

set_middle_message = function(message){
	dom('middle-message').innerHTML = message;
	dom('middle-message').style.display = 'block';
	setTimeout(function(e){dom('middle-message').style.display = 'none';}, 1000);
};

pause = function(){
	dom('pause-message').style.display = 'block';
	clearInterval(platform.interval);
	window.onkeydown = function(e){
		if (e.key)
			resume();
	};
	window.onkeyup = null;
};

resume = function(){
	dom('pause-message').style.display = 'none';
	window.onkeydown = key_down;
	window.onkeyup = key_up;
	platform.interval = setInterval(game_loop, TIME_INTERVAL);
};

window.onload = function(e){
	init();
	restart();
};
