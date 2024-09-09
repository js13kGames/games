class Colour{constructor(r,g,b,a=1){this.r=r;this.g=g;this.b=b;this.a=a}
to_string(){return `rgba(${ this.r }, ${ this.g }, ${ this.b }, ${ this.a })`}
clone(r_shift=0,g_shift=0,b_shift=0,a_shift=0){return new Colour(this.r+r_shift,this.g+g_shift,this.b+b_shift,this.a+a_shift)}}
class Vector{constructor(x,y){this.x=x;this.y=y}
get length(){return Math.hypot(this.x,this.y)}
get angle(){var angle=Math.acos(this.x/this.length);return this.y>0?angle:-angle}
to_string(){return `(${ this.x }, ${ this.y })`}
add(other){return new Vector(this.x+other.x,this.y+other.y)}
subtract(other){return new Vector(this.x-other.x,this.y-other.y)}
multiply(factor){return new Vector(this.x*factor,this.y*factor)}
scale(new_length){var factor=new_length/this.length;return this.multiply(factor)}}
class Line{constructor(start,end){this.start=start;this.end=end}
get vector(){return this.end.subtract(this.start)}
get length(){return this.end.subtract(this.start).length}
get midpoint(){return new Vector((this.start.x+this.end.x)/2,(this.start.y+this.end.y)/2)}
static create_line(start_x,start_y,end_x,end_y){return new Line(new Vector(start_x,start_y),new Vector(end_x,end_y))}
translate(displacement){return new Line(this.start.add(displacement),this.end.add(displacement))}
rotate(center,angle){var x1=this.start.x;var y1=this.start.y;var x2=this.end.x;var y2=this.end.y;var p=center.x;var q=center.y;var new_x1=(x1-p)*Math.cos(angle)-(y1-q)*Math.sin(angle)+p;var new_y1=(x1-p)*Math.sin(angle)+(y1-q)*Math.cos(angle)+q;var new_x2=(x2-p)*Math.cos(angle)-(y2-q)*Math.sin(angle)+p;var new_y2=(x2-p)*Math.sin(angle)+(y2-q)*Math.cos(angle)+q;return new Line(new Vector(new_x1,new_y1),new Vector(new_x2,new_y2))}
collision(other){var x1=this.start.x;var y1=this.start.y;var x2=this.end.x;var y2=this.end.y;var x3=other.start.x;var y3=other.start.y;var x4=other.end.x;var y4=other.end.y;var denominator=(x4-x3)*(y2-y1)-(x2-x1)*(y4-y3);if(denominator==0){return!1}
var u1_numerator=(x4-x3)*(y3-y1)-(x3-x1)*(y4-y3);var u2_numerator=(x2-x1)*(y3-y1)-(x3-x1)*(y2-y1);var u1=u1_numerator/denominator;var u2=u2_numerator/denominator;if(u1>=0&&u1<=1&&u2>=0&&u2<=1){return this.start.add(this.vector.multiply(u1))}else{return null}}}
const LINE_PARTICLE_MOVE_SPEED=0.03;const LINE_PARTICLE_ROTATE_SPEED=Math.PI/6000;const LINE_PARTICLE_MAX_LIFETIME=750;class Line_particle extends Line{constructor(line,colour){super(line.start,line.end);this.colour=colour.clone();this.motion=new Vector(Math.random()*LINE_PARTICLE_MOVE_SPEED,Math.random()*LINE_PARTICLE_MOVE_SPEED);this.rotation=(Math.random()<0.5?-1:1)*Math.random()*LINE_PARTICLE_ROTATE_SPEED;this.motion.x*=Math.random()<0.5?-1:1;this.motion.y*=Math.random()<0.5?-1:1;this.lifetime=LINE_PARTICLE_MAX_LIFETIME}
update(lapse){var new_line=this.rotate(this.midpoint,this.rotation*lapse).translate(this.motion.multiply(lapse));this.start=new_line.start;this.end=new_line.end;this.lifetime-=lapse;this.colour.a=this.lifetime/LINE_PARTICLE_MAX_LIFETIME}}
class Entity{constructor(position,lines,angle){this.position=position;this.angle=isNaN(angle)?0:angle;this.lines=lines;this.health=1;this.active=!0;this.colour=new Colour(255,255,255)}
get_lines(){var center=this.position,angle=this.angle;return this.lines.map(line=>{return line.translate(center).rotate(center,angle)})}
get_position(){return this.position}
static create_entity(center,points,angle){angle=isNaN(angle)?0:angle;var lines=points.map((_,index,points)=>{return new Line(points[index],points[(index+1)%points.length]).translate(center.multiply(-1))});return new Entity(center,lines,angle)}
collision(other){var intersection_points=[];this.get_lines().forEach((this_line)=>{other.get_lines().forEach((other_line)=>{var collision_point=this_line.collision(other_line);if(collision_point){intersection_points.push(collision_point)}})});return intersection_points.length?intersection_points:null}
update(lapse,entities){}
shatter(){this.get_lines().forEach(line=>{particles.push(new Line_particle(line,this.colour))});this.active=!1}}
var entities=[];var particles=[];const ASTEROID_SIDE_LENGTH=20;var asteroid_move_speed=0.2;var asteroid_rotation_speed=0.001;class Asteroid extends Entity{constructor(x,size,colour){var position=new Vector(x,-100);var lines=[];var center_angle=Math.PI*2/size;var radius=ASTEROID_SIDE_LENGTH*0.5/Math.sin(center_angle/2);for(var c=0;c<size;c++){var angle=c*center_angle;var start=new Vector(Math.cos(angle)*radius,Math.sin(angle)*radius);var end=new Vector(Math.cos(angle+center_angle)*radius,Math.sin(angle+center_angle)*radius);lines.push(new Line(start,end))}
super(position,lines,0);this.colour=colour;this.speed=Math.random()*0.1+asteroid_move_speed;this.rotate_direction=Math.random()<0.5?-1:1}
update(lapse,entities){this.position.y+=lapse*this.speed;this.angle+=lapse*asteroid_rotation_speed*this.rotate_direction;this.active=this.active&&(this.position.y-100)<canvas_size}}
const ROCKET_LINES=[new Line(new Vector(0,-30),new Vector(15,30)),new Line(new Vector(15,30),new Vector(0,15)),new Line(new Vector(0,15),new Vector(-15,30)),new Line(new Vector(-15,30),new Vector(0,-30))];const ROCKET_MOVE_SPEED=0.3;const ROCKET_LEAN_ANGLE=Math.PI/6;const ROCKET_ACCELERATION=0.0005;const ROCKET_FRICTION=0.0015;var rocket_shield=0;var rocket_gun=0;var fire_gun=!1;var rocket_totem=!1;class Rocket extends Entity{constructor(){var position=new Vector(canvas_size/2,canvas_size-50);super(position,ROCKET_LINES,0);this.colour=new Colour(173,255,47);this.invincibility=3000;this.direction="left";this.x_speed=0;this.health=5}
receive_powerup(power_type){switch(power_type){case "shield":rocket_shield=6000;this.set_colour(new Colour(255,255,255));break;case "gun":rocket_gun=16;break;case "totem":rocket_totem=!0;break}}
get_colour(){return this.colour}
set_colour(new_colour){this.colour=new_colour}
update(lapse,entities){this.invincibility=this.invincibility<=0?0:(this.invincibility-lapse);rocket_shield=rocket_shield<=0?0:(rocket_shield-lapse);if(space_bar&KEY_PRESSED){zzfx(...[,,22,.08,.4,0,2,.29,-0.3,,,,.02,,,.2,,.4,.05]);switch(this.direction){case "right":this.direction="left";break;case "left":this.direction="right";break}
space_bar=KEY_SEEN}
if(space_bar){switch(this.direction){case "right":this.x_speed+=ROCKET_ACCELERATION*lapse;break;case "left":this.x_speed-=ROCKET_ACCELERATION*lapse;break}}
this.position.x+=this.x_speed*lapse;this.angle=ROCKET_LEAN_ANGLE*this.x_speed/ROCKET_MOVE_SPEED;this.x_speed-=this.x_speed*lapse*ROCKET_FRICTION;this.position.x=Math.max(30,Math.min(this.position.x,canvas_size-30));entities.forEach(entity=>{if(entity===this)return;if(entity.collision(this)){if(entity.constructor==Asteroid){entity.shatter();if(this.invincibility<=0&&rocket_shield<=0){this.shatter();this.health--;this.active=!0;this.invincibility=1000}
if(rocket_shield<=0){zzfx(...[1.99,,212,.13,.04,.09,3,2.36,,,,,,,-95,,.44,.35,.01])}else{zzfx(...[1.58,,65.40639,.21,.07,.13,,1.95,-0.2,4,,,,2,,.4,.1,.82,.05,.02])}}else if(entity.constructor==Powerup){entity.shatter();zzfx(...[1.1,,246.9417,.03,.36,.92,,1.25,.2,-0.5,-290,.1,.1,,,,,.88,.07]);this.receive_powerup(entity.get_power_type())}}});if(Math.round(rocket_shield)%100==0&&rocket_shield>0){this.set_colour(this.get_colour().clone(-5,-5,-5))}else if(rocket_shield<=0){this.set_colour(new Colour(173,255,47))}
if(frames%120==0&&rocket_gun>0){fire_gun=!0;zzfx(...[.5,,247,.02,.07,.03,1,.26,-7.9,-0.1,,,,.6,,.4,,.71,.02,.4]);rocket_gun--}
if(this.health<=0){if(rocket_totem){this.health=1;rocket_totem=!1;this.invincibility=2000;zzfx(...[2.5,0,261.6256,,.85,.14,2,1.57,,,,,.38,.3,,,.18,.76,.16,.25]);return}
this.active=!1;game_state="game over";if(score>high_score){high_score=score}}}}
class Powerup extends Entity{constructor(x,power_type,colour){var tri_sides=3;var position=new Vector(x,-100);var center_angle=Math.PI*2/tri_sides;var radius=20;var lines=[];for(var i=0;i<tri_sides;++i){var angle=i*center_angle;var start=new Vector(Math.cos(angle)*radius,Math.sin(angle)*radius);var end=new Vector(Math.cos(angle+center_angle)*radius,Math.sin(angle+center_angle)*radius);lines.push(new Line(start,end))}
super(position,lines,0);this.power_type=power_type;this.colour=colour;this.speed=(Math.random()*0.1+asteroid_move_speed)*1.6;this.rotate_direction=-1}
get_power_type(){return this.power_type}
update(lapse,entities){this.position.y+=lapse*this.speed;this.angle+=lapse*(asteroid_rotation_speed*25)*this.rotate_direction;this.active=this.active&&(this.position.y-100)<canvas_size}}
class Bullet extends Asteroid{constructor(){super(0,3,new Colour(27,181,89))
var rocket=entities.filter(entity=>entity.constructor==Rocket)[0];this.position=rocket.get_position().add(new Vector(0,-60))}
update(lapse,entities){this.position.y-=lapse*this.speed;this.angle+=lapse*asteroid_rotation_speed*this.rotate_direction;this.active=this.active&&this.position.y>0;entities.forEach(entity=>{if(entity.collision(this)){if(entity.constructor==Asteroid){entity.shatter();this.shatter()}}})}}