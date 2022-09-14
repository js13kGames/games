function setup_canvas(){
    var canvas = document.createElement('canvas');
    canvas.id = "GameLayer";
    canvas.width = 1000
    canvas.height = 600
    console.log(canvas.width,canvas.height)
    canvas.style.zIndex = 8;
    canvas.style.position = "absolute";
    canvas.style.border = "1px solid";
    canvas.style = "position: absolute; top: 0px; left: 0px; right: 0px; bottom: 0px; margin: auto; border:2px solid blue";
    var body = document.getElementsByTagName("body")[0];
    body.appendChild(canvas);
    return canvas;
}




canvas = setup_canvas()

var aPress, sPress, dPress, fPress, gPress, hPress, jPress, kPress, lPress;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);


function keyDownHandler(e) {
    if (e.key == 'a'){
        aPress = true;
    }
    else if (e.key == 's'){
        sPress = true;
    }
    else if (e.key == 'd'){
        dPress = true;
    }
    else if (e.key == 'f'){
        fPress = true;
    }
    else if (e.key == 'g'){
        gPress = true;
    }
    else if (e.key == 'h'){
        hPress = true;
    }
    else if (e.key == 'j'){
        jPress = true;
    }
    else if (e.key == 'k'){
        kPress = true;
    }
    else if (e.key == 'l'){
        lPress = true;
    }
}

function keyUpHandler(e) {
    if (e.key == 'a'){
        aPress = false;
    }
    else if (e.key == 's'){
        sPress = false;
    }
    else if (e.key == 'd'){
        dPress = false;
    }
    else if (e.key == 'f'){
        fPress = false;
    }
    else if (e.key == 'g'){
        gPress = false;
    }
    else if (e.key == 'h'){
        hPress = false;
    }
    else if (e.key == 'j'){
        jPress = false;
    }
    else if (e.key == 'k'){
        kPress = false;
    }
    else if (e.key == 'l'){
        lPress = false;
    }
} 


var ctx = canvas.getContext("2d");
var letters = ['a','s','d','f','g','h','j','k','l'];
// function to draw the controller 
function draw_keys(){
    ctx.strokeStyle = "red";
    position = 100;
    ctx.font = "30px Arial";
    
    position_obj = {}
    for(i=0; i<letters.length; i++){
        ctx.beginPath();
        ctx.fillStyle = "rgba(100, 200, 100, 0.4)";
        ctx.lineWidth = "1";
        ctx.strokeStyle = "green";
        ctx.rect(position, canvas.height-150, 50, 25);
        ctx.stroke();
        ctx.fillRect(position,canvas.height-150,50,25);
        ctx.fillStyle = "red";
        ctx.fillText(letters[i], position+20, canvas.height-215);
        position_obj[letters[i]] = position 
        position += 75;
    }
    if (aPress != true){
        ctx.fillStyle = "rgba(200, 150, 150, 0.8)";
        ctx.fillRect(position_obj['a'],canvas.height-150,50,25);
        
    }

    if (sPress != true){
        ctx.fillStyle = "rgba(200, 150, 150, 0.8)";
        ctx.fillRect(position_obj['s'],canvas.height-150,50,25);
    }

    if (dPress != true){
        ctx.fillStyle = "rgba(200, 150, 150, 0.8)";
        ctx.fillRect(position_obj['d'],canvas.height-150,50,25);
    }

    if (fPress != true){
        ctx.fillStyle = "rgba(200, 150, 150, 0.8)";
        ctx.fillRect(position_obj['f'],canvas.height-150,50,25);
    }
    if (gPress != true){
        ctx.fillStyle = "rgba(200, 150, 150, 0.8)";
        ctx.fillRect(position_obj['g'],canvas.height-150,50,25);
    }
    if (hPress != true){
        ctx.fillStyle = "rgba(200,150, 150, 0.8)";
        ctx.fillRect(position_obj['h'],canvas.height-150,50,25);
    }
    if (jPress != true){
        ctx.fillStyle = "rgba(200, 150, 150, 0.8)";
        ctx.fillRect(position_obj['j'],canvas.height-150,50,25);
    }
    if (kPress != true){
        ctx.fillStyle = "rgba(200, 150, 150, 0.8)";
        ctx.fillRect(position_obj['k'],canvas.height-150,50,25);
    }
    if (lPress != true){
        ctx.fillStyle = "rgba(200, 150, 150, 0.8)";
        ctx.fillRect(position_obj['l'],canvas.height-150,50,25);
    }
    return position_obj;
}



;
function draw_block(timer_lower,timer,init_height,counter,speed,position,key,height,lastPress,score_counter,score_delta,neg_score_counter){
    // check for collision
    if (init_height+counter+height > canvas.height-150 && init_height+counter < canvas.height-125){
        collision = true;
        if (key == 'a'){
            if (aPress == true){
                score_counter +=1;
            }
        }
        
            
        
        if (key == 's'){
            if (sPress == true){
                score_counter +=1;
                if (height > 25){
                    lastPress += 1;
                    if (init_height+counter > canvas.height-130 || lastPress > (height/speed)-1){
                        score_counter +=5;
                        score_delta=1;
                    }
                }
                
            }
        
        }
        if (key == 'd'){
            if (dPress == true){
                score_counter +=1;
               
            }
        }
        if (key == 'f'){
            if (fPress == true){
                score_counter += 1;
                
            }
        }
        if (key == 'g'){
            if (gPress == true){
                score_counter +=1 
            }
        }
        if (key == 'h'){
            if (hPress == true){
                score_counter +=1;
            }
        }
        if (key == 'j'){
            if (jPress == true){
                score_counter +=1; 
            }
        }
        if (key == 'k'){
            if (kPress == true){
                score_counter +=1;               
            }
        }
        if (key == 'l'){
            if (lPress == true){
                score_counter +=1;          
            }
        }

        
    }
    else{
        collision = false
            if (key == 'a'){
            if (aPress == true){
                neg_score_counter -= 1;
                score_delta=-1;
            }
            }
            
        
            if (key == 's'){
            if (sPress == true){
                neg_score_counter -= 1;
                score_delta=-1;
            }
            }
        
            if (key == 'd'){
            if (dPress == true){
                neg_score_counter -= 1;
                score_delta=-1;
            }
        }

            if (key == 'f'){
            if (fPress == true){
                neg_score_counter -= 1;
                score_delta=-1;
            }
            }
            if (key == 'g'){
            if (gPress == true){
                neg_score_counter -= 1;
                score_delta=-1;
            }
            }
            if (key == 'h'){
            if (hPress == true){
                neg_score_counter -= 1;
                score_delta=-1;
            }
            }
            
            if (key == 'j'){
            if (jPress == true){
                neg_score_counter -= 1;
                score_delta=-1;
            }
            }
            
            if (key == 'k'){
            if (kPress == true){
                neg_score_counter -= 1;
                score_delta=-1;
            }
        }
            if (key == 'l'){
            if (lPress == true){
                neg_score_counter -= 1;
                score_delta=-1;
            }
        }
        
    }

    if (timer > timer_lower && init_height+counter < canvas.height){
        if (init_height+counter < canvas.height/4+75){
        ctx.lineWidth = "1";
        ctx.fillStyle = "rgba(200, 150, 150, 0)";
        }
        else{
            ctx.lineWidth = "1";
        ctx.fillStyle = "rgba(200, 150, 150, 0.8)";
        }
         
        ctx.fillRect(position,init_height+counter,50,height);
        counter += speed;
    }   

    
    return [counter,lastPress,Math.round(score_counter),score_delta,neg_score_counter];
}


function draw_menu(position){    
    ctx.fillStyle = "rgba(227, 218, 201, 0.7)";
    ctx.fillRect(position['l']+75,0,canvas.width-position['l']+75,canvas.height)
    ctx.strokeStyle = "red";
    ctx.beginPath(); 
     ctx.moveTo(0, canvas.height/4+75);
    ctx.lineTo(canvas.width, canvas.height/4+75);
    ctx.stroke();

}
var drScoliosisSprite=new Image();

// function that shows score and streaks
function dispScore(score,posx,posy,color, label){
    ctx.font = "30px Arial";
    ctx.fillStyle = color;
    ctx.fillText(label, posx, posy);
    ctx.fillText(score.toString(),posx,posy+30)
}
// draw graphs on screen, show enemies, and update health
function graph(positions,counters,score,lastPresses,timer,init_height,letters,offsets,score_delta,heights,neg_score,speeds){
    

   for (i = 0; i < counters.length; i++){
    [counters[i],lastPresses[i],score,score_delta,neg_score] = draw_block(offsets[i],timer,init_height,counters[i],speeds[i],positions[letters[i]],letters[i],heights[i],lastPresses[i],score,score_delta,neg_score);
     let damage = update_health(score);
    dispScore(Math.round(damage/10)-1,canvas.width-200,60,"green", "Score: ");
    dispScore(Math.floor(neg_score/100),canvas.width-200,120,'red',"Penalty: ")
    
}
    return [Math.round(damage/10)-1,neg_score];
}

// function to update health of user and enemy based on score metric collected from graph
// fullHealth defines how much a a character should have 
function update_health(score){
    damage = (score*10)+10;
    return Math.round(damage)

}

function randomBetween(min, max) {
    return {
      val: Math.floor(Math.random() * (max - min + 1) + min)
    }
}
  
function getRandom(min, max, buffer, maxcount) {
    let randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)
  
    function addLeaves(f, min, max, arr = []) {
      if (arr.length < maxcount) {
        arr.push(f);
          if(min + buffer < f - buffer) addLeaves(randomBetween(min + buffer, f - buffer), min, f, arr);
          if(f + buffer < max - buffer) addLeaves(randomBetween(f + buffer, max - buffer), f, max, arr);
      }
      return arr
    }
    return addLeaves(randomBetween(min, max), min - buffer, max + buffer)
  }

// function that generates graph data
function generateGraph(difficulty,timer){

    if (difficulty == 'easy'){
        let heightProbs = [25,25,25,25,25,25,75];
        graphLength = randomBetween(10,15).val
        offsetSpacing = 500; // variable to define how spaced out the offsets should be
        offsets = getRandom(timer,timer+3000,offsetSpacing,graphLength)
        heights = []
        counter_array = [];
       keys = [];
         speed = [];
         lastPresses = [];
        for (i = 0; i < graphLength; i++){
            counter_array[i] =0;
            lastPresses[i] = 0;
            heights[i] = heightProbs[randomBetween(0,heightProbs.length-1).val];
            letterIndex = randomBetween(0,letters.length);
            keys[i] = letters[letterIndex.val];
            speed_val = randomBetween(1,2);
            speed[i] = speed_val.val;
        }
        
    }
    if (difficulty == 'medium'){
        let heightProbs = [25,25,25,25,25,75,75];
         graphLength = randomBetween(15,20).val
        offsetSpacing = 350; // variable to define how spaced out the offsets should be
        offsets = getRandom(timer,timer+4000,offsetSpacing,graphLength)
        heights = [];
        counter_array = [];
       keys = [];
         speed = [];
         lastPresses = [];
        for (i = 0; i < graphLength; i++){
            counter_array[i] =0;
            lastPresses[i] = 0;
            heights[i] = heightProbs[randomBetween(0,heightProbs.length-1).val];
            letterIndex = randomBetween(0,letters.length);
            keys[i] = letters[letterIndex.val];
            speed_val = randomBetween(1,2);
            speed[i] = speed_val.val;
        }

    }
    if (difficulty == 'hard'){
        let heightProbs = [25,25,25,25,75,75,75];
        graphLength = randomBetween(15,20).val
       offsetSpacing = 100; // variable to define how spaced out the offsets should be
       
       offsets = getRandom(timer,timer+5000,offsetSpacing,graphLength);
       heights = [];
       counter_array = [];
      keys = [];
        speed = [];
        lastPresses = [];
       for (i = 0; i < graphLength; i++){
           counter_array[i] =0;
           lastPresses[i] = 0;
           heights[i] = heightProbs[randomBetween(0,heightProbs.length-1).val];
           letterIndex = randomBetween(0,letters.length);
           keys[i] = letters[letterIndex.val];
           speed_val = randomBetween(1,3);
           speed[i] = speed_val.val;
       }

   }
    
    // construct object
    graph_data = {
        offsets:offsets,
        counters:counter_array,
        keys: keys,
        speed: speed,
        lastPresses: lastPresses,
        heights: heights
    }
    return graph_data;
}



var deductor = true;
var deltaSpritex = 5;
var deltaSpritey = 3;
var villainHealthBarLength = 200;
var VillainHealthBar = {
    x: 450,
    y: 20,
    length: villainHealthBarLength,
    height:15
}
userHealthBarLength = 100;
var UserHealthBar = {
    x: canvas.width-100,
    y:canvas.height/4+55,
    length: userHealthBarLength,
    height:20
}
var damage = 0;
var userDamage = 0;
var gameOver = false;


// function that allows user to select difficulty, play through graph, and applies damage to enemy
function level(combat_status,timer,init_height,positions,graph_data,difficulty,damage,villainHealth,userHealth){
   fullVillainHealth = 800;
   fullHeroHealth = 500;
    ctx.drawImage(drScoliosisSprite,positions['g'],75,158,147);
    drScoliosisSprite.src="./drscoliosis.png";
    textOptions = ["Press A for Easy Attack","Press S for Medium Attack","Press D for Hard Attack"]
    tauntOptions = ["Is that all you got?","My great grandma is better at rhythm games than you!","I can't believe I went to med school for this.","If you want to make an appointment, talk to my assistant.","Ow."]
    DoubleDamage = false;
    SlowMotion = false;
    HealthPack = false;
    powerUp = false;
    ctx.fillStyle = "red"
    ctx.fillRect(VillainHealthBar.x,VillainHealthBar.y,VillainHealthBar.length,VillainHealthBar.height)
    ctx.fillStyle = "green"
    ctx.fillRect(UserHealthBar.x,UserHealthBar.y,UserHealthBar.length,UserHealthBar.height)
    powerUps = ['Double Damage','Slow Time','Health Pack']
    // if player is not in combat, allow them to select difficulty
    if (combat_status == false){

        ctx.font = "15px Arial";
        ctx.fillStyle = "red";
        ctx.fillText("Defeat Dr. Scoliosis, M.D. before you become his next victim and he gives you scoliosis",positions['a']-100,260)
        ctx.fillText("Select an attack on the right by clicking A, S, or D. Complete the rhythm pattern to inflict damage on Dr. Scoliosis.",positions['a']-100,280)
        ctx.fillText("Complete the pattern with the middle row of letters on the keyboard.",positions['a']-100,300) 
        ctx.fillText("The harder the pattern the more damage you inflict. The little green bar is your health. Make sure it doesn't disappear",positions['a']-100,320)
        ctx.fillText("Remember, you can attack Dr. Scoliosis, M.D., but he can also attack you",0,360);
        ctx.fillText(textOptions[0], canvas.width-200, canvas.height-300);
        ctx.fillText(textOptions[1],canvas.width-200,canvas.height-200);
        ctx.fillText(textOptions[2],canvas.width-200,canvas.height-100);
        ctx.fillText("You inflicted " +damage.toString() + " damage",positions['l']+75,(canvas.height/4)-75)
        ctx.fillText("You received " + userDamage.toString() + " damage",positions['l']+75,(canvas.height/4)-55)
        if (deductor == true){
            // deduct health from dr scoliosis
            if (difficulty == 'easy'){
                damage = Math.floor(score*0.5)-Math.floor(neg_score/100);
            villainHealth -= Math.floor(score*0.5);
           
            }
            if (difficulty == 'medium'){
                damage = Math.floor(score*1.5)-Math.floor(neg_score/100);
                villainHealth -= Math.floor(score*1.5);
                // ctx.fillText("You inflicted" +score*1.5 + "")
            }
            if (difficulty == 'hard'){
                damage = Math.floor(score*2)-Math.floor(neg_score/100)
                villainHealth -= Math.floor(score*2);
                // ctx.fillText("You inflicted" +score*1.5 + "")
            }
            damageRatio = score/fullVillainHealth;
            VillainHealthBar.length = VillainHealthBar.length-(villainHealthBarLength*damageRatio)
            // determine how much damage is to be inflicted on the user
            if (score != 0){
            userDamage = randomBetween(10,20).val
            damageRatio = userDamage/userHealth
            UserHealthBar.length -= UserHealthBar.length*damageRatio;
            // userHealth -= randomBetween(10,100).val;
            
            // console.log(userHealth)
           
           
        }
            deductor = false;
        }
       
        
        damageRatio = score/fullVillainHealth;
        
        
        if (aPress){
            difficulty = "easy";
            ctx.font = "17px Arial";
            combat_status = true;
            graph_data = generateGraph('easy',timer);
            taunt = tauntOptions[randomBetween(0,tauntOptions.length-1).val];
            score = 0;
            neg_score = 0;
            
        }

        if (sPress){
            difficulty = "medium";
            ctx.font = "17px Arial";
            combat_status = true;
            graph_data = generateGraph('medium',timer);
            taunt = tauntOptions[randomBetween(0,tauntOptions.length-1).val];
            score = 0;
            neg_score = 0;
        }
      

        if (dPress){
            difficulty = "hard";
            ctx.font = "17px Arial";
            combat_status = true;
            graph_data = generateGraph('hard',timer);
            taunt = tauntOptions[randomBetween(0,tauntOptions.length-1).val];
            score = 0;
            neg_score = 0;
        }
        if (userHealthBarLength <= 0){
            ctx.fillText("Game Over, refresh to play again",100,100)
            combat_status = false;
        }
        if (VillainHealthBar <= 0){
            ctx.fillText("Congratulations, you beat the evil Dr. Scoliosis, M.D. Refresh to play again",100,100)
            combat_status = false;
        }
      
    }

    if (combat_status == true){
         // display text  boxes for dr. scoliosis taunts
        //  drScoliosisSprite.src="./drscoliosis.png";
        ctx.font = "13px Arial"
        ctx.fillStyle = "red"
        ctx.rect(20, 20, 400, 100);
        ctx.stroke();
        ctx.fillText(taunt,25,35);
        
       
        if (difficulty == 'easy'){
            ctx.fillStyle = "red";
            ctx.font = "15px Arial";
            ctx.fillText(textOptions[0], canvas.width-200, canvas.height-300);
            ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
            ctx.font = "13px Arial";
            ctx.fillText(textOptions[1],canvas.width-200,canvas.height-200);
            ctx.fillText(textOptions[2],canvas.width-200,canvas.height-100);
            [score,neg_score]=graph(positions,graph_data.counters,score,graph_data.lastPresses,timer,init_height,graph_data.keys,graph_data.offsets,score_delta,graph_data.heights, neg_score, graph_data.speed);
        }
        if (difficulty == 'medium'){
            ctx.fillStyle = "red";
            ctx.font = "15px Arial";
            ctx.fillText(textOptions[1],canvas.width-200,canvas.height-200);
            ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
            ctx.fillText(textOptions[0], canvas.width-200, canvas.height-300);
            ctx.font = "13px Arial";
            ctx.fillText(textOptions[2],canvas.width-200,canvas.height-100);
            [score,neg_score]=graph(positions,graph_data.counters,score,graph_data.lastPresses,timer,init_height,graph_data.keys,graph_data.offsets,score_delta,graph_data.heights, neg_score, graph_data.speed);
        }
        if (difficulty == 'hard'){
            ctx.fillStyle = "red";
            ctx.font = "15px Arial";
            ctx.fillText(textOptions[2],canvas.width-200,canvas.height-100);
            ctx.font = "13px Arial";
            ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
            ctx.fillText(textOptions[0], canvas.width-200, canvas.height-300);
            ctx.fillText(textOptions[1],canvas.width-200,canvas.height-200);
            [score,neg_score]=graph(positions,graph_data.counters,score,graph_data.lastPresses,timer,init_height,graph_data.keys,graph_data.offsets,score_delta,graph_data.heights, neg_score, graph_data.speed);
            // if (timer > Math.max(...graph_data.offsets)+2000){
            //     combat_status = false;
            // }
        }
        let lastBlock = Math.max(...graph_data.offsets);
        let lastBlockSpeed = graph_data.speed.indexOf(lastBlock);
        if (lastBlockSpeed == 1){
            if (timer > lastBlock+10000){
                combat_status = false;
                console.log("hi")
            }
        }
        else{
            if (timer > lastBlock+6000){
                combat_status = false;
                console.log("bye")
            }
        }
        damage = 0;
        deductor = true;
    }

    
    return [combat_status,difficulty,graph_data,damage,villainHealth,userHealth]

}

var villainHealth = 1000
var userHealth = 500
var penalty = 0;
var combat = false;
var score_delta=0;
var activation = false;
var counter = 0;
var counter1 = 0;
var counter2 = 0;
var timer = 0;
var init_height = canvas.height/4+75;
var boxWidth = 50;
var boxHeight = 50;
var position_keys;
var counters = [0,0,0,0,0]
var lp = [0,0,0,0,0]
var keys = ['a','s','d','h','k']
var offsets = [10,500,1000,500,150]
var score = 0;
var difficulty;
var graph_data = {};
var damage;



function draw(){

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, canvas.height/4+75, canvas.width, canvas.height-(canvas.height/4)-75);


    // render controller on screen
   position_keys = draw_keys();
   draw_menu(position_keys);
   // update timer variable
    timer = timer + 10;
    

    
    [combat,difficulty,graph_data,damage,villainHealth,userHealth] = level(combat,timer,init_height,position_keys,graph_data,difficulty,damage,villainHealth,userHealth);

}

var draw = setInterval(draw,10);




