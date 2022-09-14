//Sound libraries ZZFX and ZZFXM

// zzfx() - the universal entry point -- returns a AudioBufferSourceNode
zzfx=(...t)=>zzfxP(zzfxG(...t))

// zzfxP() - the sound player -- returns a AudioBufferSourceNode
zzfxP=(...t)=>{let e=zzfxX.createBufferSource(),f=zzfxX.createBuffer(t.length,t[0].length,zzfxR);t.map((d,i)=>f.getChannelData(i).set(d)),e.buffer=f,e.connect(zzfxX.destination),e.start();return e}

// zzfxG() - the sound generator -- returns an array of sample data
zzfxG=(q=1,k=.05,c=220,e=0,t=0,u=.1,r=0,F=1,v=0,z=0,w=0,A=0,l=0,B=0,x=0,G=0,d=0,y=1,m=0,C=0)=>{let b=2*Math.PI,H=v*=500*b/zzfxR**2,I=(0<x?1:-1)*b/4,D=c*=(1+2*k*Math.random()-k)*b/zzfxR,Z=[],g=0,E=0,a=0,n=1,J=0,K=0,f=0,p,h;e=99+zzfxR*e;m*=zzfxR;t*=zzfxR;u*=zzfxR;d*=zzfxR;z*=500*b/zzfxR**3;x*=b/zzfxR;w*=b/zzfxR;A*=zzfxR;l=zzfxR*l|0;for(h=e+m+t+u+d|0;a<h;Z[a++]=f)++K%(100*G|0)||(f=r?1<r?2<r?3<r?Math.sin((g%b)**3):Math.max(Math.min(Math.tan(g),1),-1):1-(2*g/b%2+2)%2:1-4*Math.abs(Math.round(g/b)-g/b):Math.sin(g),f=(l?1-C+C*Math.sin(2*Math.PI*a/l):1)*(0<f?1:-1)*Math.abs(f)**F*q*zzfxV*(a<e?a/e:a<e+m?1-(a-e)/m*(1-y):a<e+m+t?y:a<h-d?(h-a-d)/u*y:0),f=d?f/2+(d>a?0:(a<h-d?1:(h-a)/d)*Z[a-d|0]/2):f),p=(c+=v+=z)*Math.sin(E*x-I),g+=p-p*B*(1-1E9*(Math.sin(a)+1)%2),E+=p-p*B*(1-1E9*(Math.sin(a)**2+1)%2),n&&++n>A&&(c+=w,D+=w,n=0),!l||++J%l||(c=D,v=H,n=n||1);return Z}

// zzfxV - global volume
zzfxV=.3

// zzfxR - global sample rate
zzfxR=44100

// zzfxX - the common audio context
zzfxX=new(window.AudioContext||webkitAudioContext);


//! ZzFXM (v2.0.3) | (C) Keith Clark | MIT | https://github.com/keithclark/ZzFXM
zzfxM=(n,f,t,e=125)=>{let l,o,z,r,g,h,x,a,u,c,d,i,m,p,G,M=0,R=[],b=[],j=[],k=0,q=0,s=1,v={},w=zzfxR/e*60>>2;for(;s;k++)R=[s=a=d=m=0],t.map((e,d)=>{for(x=f[e][k]||[0,0,0],s|=!!f[e][k],G=m+(f[e][0].length-2-!a)*w,p=d==t.length-1,o=2,r=m;o<x.length+p;a=++o){for(g=x[o],u=o==x.length+p-1&&p||c!=(x[0]||0)|g|0,z=0;z<w&&a;z++>w-99&&u?i+=(i<1)/99:0)h=(1-i)*R[M++]/2||0,b[r]=(b[r]||0)-h*q+h,j[r]=(j[r++]||0)+h*q+h;g&&(i=g%1,q=x[1]||0,(g|=0)&&(R=v[[c=x[M=0]||0,g]]=v[[c,g]]||(l=[...n[c]],l[2]*=2**((g-12)/12),g>0?zzfxG(...l):[])))}m=G});return[b,j]}


//Song
var sillySong = zzfxM(...[[[.2,0,400,,.14,.8,,1.2,,,,,,,.1,,.01,,,1],[.7,0,3982,,,.03,2,1.25,,,,,.02,6.8,-.3,,.5],[.5,0,196,,.08,.5,1],[.5,0,655,,,.09,3,1.65,,,,,.02,3.8,-.1,,.2]],[[[2,1,25,13,29,27,29,30,29,10,29,,25,25,,25,25,,25,26,,28,26,24,25,,24,,25,,,,,,,,29,,29,32,,29,27,25,,28,25,23,22,23,22,25,,,,25,29,32,35,32,29,27,,25,,25,,,25,,,30,,,,,27,,32,,25,,21,,23,,25,,25,,,,,,,,,,,,,,,,,,,],[1,-1,,,13,27,25,,25,25,,,,,25,24,,,27,27,,27,,25,,,,,,25,25,,20,18,25,,,,17,,17,15,,,15,15,,,6,,,,25,24,,,,18,18,,13,,13,,,13,25,,24,25,,17,,15,,15,,,,,20,20,,,,,,,13,25,,,13,,13,13,12,,13,,13,,15,12,15,,13],[,-1,,,25,,,,,,,,,,,,,,,33,,,,,,,,,32,,,,,,,,,,,,,,,,,,,,,,,32,,,,,,,,,,34,,32,,25,,,25,,,30,,,,,30,,29,,25,,26,,28,,25,,32,,,,,,,,,,,,,,,,,,,],[3,1,,25,,,,,,26,,,,,,,,,,,,,29,,,,,,,,,25,,,,25,,25,,,,,,,,,25,,,,,29,,,,,,,,,,25,,,25,,,,25,,,,,25,,,25,,25,,,,,,,,,,,,25,,15,,,,,,,,,25,,22,,,22]]],[0],60,{"title":"Sillies","instruments":["Marimba","Hihat","Piano","Snare"],"patterns":["Pattern 0"]}]);


//Required variables
var color, eyes, mouth, isTitleScreen = true, isCoilSubscriber = false,
 score = 0, gameOver = false, startingClearScore = 50, clearScore = startingClearScore,
 animTitleScreen, animIdle, timer = 1500, isGameOver = false, isPlayerTurn = false,
 current_guess, timer_silly_moves, myAudioNode, songPlaying, highScore;

//Arrays
//We will randomly select eyes, mouth and color for our Silly from arrays
colors = [ ["aqua", "darkcyan", "paleturquoise"], ["mediumorchid", "darkorchid", "orchid"],
   ["mediumspringgreen", "seagreen", "palegreen"], ["fuchsia", "mediumvioletred", "violet"],
   ["gold", "darkorange", "khaki"]];
eye_sets = ["👀","👁️", "👓", "🕶️"];
mouths = ["👅", "👄", "💓", "⚫"];

//We will keep the Silly's movements in an array, and have an array for the player's
//guesses, also
silly_moves = [];
player_guesses = [];

//Random int function from the Ga game framework
randomInt = function(min, max) {
   return Math.floor(Math.random() * (max - min + 1)) + min;
 };

function selectFeatures(){
  color = randomInt(0, 4);
  if (isCoilSubscriber){
    eyes = randomInt(0, 3);
  }
  else {
  eyes = randomInt(0, 1);
}
  mouth = randomInt(0, 3);
}

//The silly will have random movements for the player to memorize and copy
function selectInitialMoves(){
  for (i = 0; i < 2; i++){
    silly_moves.push(randomInt(0, 3));
  }
}

function toggleButtons(bool){
  document.getElementById("btnLeft").disabled = bool;
  document.getElementById("btnRight").disabled = bool;
  document.getElementById("btnEyes").disabled = bool;
  document.getElementById("btnMouth").disabled = bool;

}

function playSong(){
  myAudioNode = zzfxP(...sillySong);
  songPlaying = setInterval(function(){myAudioNode = zzfxP(...sillySong);}, 28000);
}

//Function to change background of each shaded side of a cube
function changeCubeBackground(cube_name, bg, bg1, bg2){
  var currentSide;
  for (var i = 1; i < 7; i++){
    currentSide = cube_name + i.toString();

    if (i == 2 || i == 4){
        C.changeBackground({n:currentSide, b:bg1});
    }
    else if (i == 3 || i == 5){
      C.changeBackground({n:currentSide, b:bg2});
    }
    else {
      C.changeBackground({n:currentSide, b:bg})
    }
  }
}

//Draw the Silly using CSS3D framework
function drawSilly(){
  C.sprite({n:"points",w:50,h:30, x:0,y:0,z:0,html:"+50"})
  selectFeatures()
  C.plane({n:"s_jetstream",g:"silly",w:35,h:65,x:0,y:0,z:-20,b:"linear-gradient(red, yellow)",rx:-90,css:"triangle-bottom"});
  document.getElementById("s_jetstream").style.visibility = "hidden";
  C.sprite({n:"s_body",g:"silly",w:40,h:50,x:0,y:0,z:20,b:colors[color][0],css:"circle"});
  if (eyes > 1) {
    C.plane({n:"s_eyes",g:"silly",w:30,h:16,y:20,z:32,html:eye_sets[eyes],rx:-70,o:"bottom",css:"glasses"});
  }
  else
  {
    C.plane({n:"s_eyes",g:"silly",w:30,h:16,y:20,z:27,html:eye_sets[eyes],rx:-70,o:"bottom",css:"face"});
  }
  C.plane({n:"s_mouth",g:"silly",w:30,h:16,y:20,z:10,html:mouths[mouth],rx:-95,o:"bottom",css:"face"});
  C.cube({n:"s_firstleg",g:"silly",w:10,h:22,x:20,y:0,z:-10,b:colors[color][0],b1:colors[color][2],b2:colors[color][1]});
  C.cube({n:"s_secondleg",g:"silly",w:10,h:22,x:-20,y:0,z:-10,b:colors[color][0],b1:colors[color][2],b2:colors[color][1]});
}

//Animations
function turnLeft(){

  //Change button color
  document.getElementById("btnLeft").style.background = colors[color][0];
  setTimeout(function(){
    C.move({n:"silly",rz:25});
    zzfx(...[1.01,,59,,.06,.17,1,1.97,5.2,,,,,,,,,.76,.08]);
    document.getElementById("btnLeft").style.background = "blanchedalmond";


  }, 500);

  setTimeout(function(){
    C.move({n:"silly",rz:0});
  }, 1200);

}

function turnRight(){
  document.getElementById("btnRight").style.background = colors[color][0];
  setTimeout(function(){
    C.move({n:"silly",rz:-35});
    zzfx(...[1.43,,342,.02,.05,.26,1,.04,6.1,,,,,,,,.02,.72,.03]);
    document.getElementById("btnRight").style.background = "blanchedalmond";


  }, 500);

  setTimeout(function(){
    C.move({n:"silly",rz:0});
  }, 1200);

}

function moveEyes(){
  document.getElementById("btnEyes").style.background = colors[color][0];
  setTimeout(function(){
    C.move({n:"s_eyes",x:2});
    zzfx(...[1.99,,965,,.08,.22,,.75,,,-669,.06,,,,,.09,.56,.04,.17]); // Pickup 709
    document.getElementById("btnEyes").style.background = "blanchedalmond";

  }, 500);

  setTimeout(function(){
    C.move({n:"s_eyes",x:0});
  }, 1200);
}

function moveMouth(){
  document.getElementById("btnMouth").style.background = colors[color][0];

  setTimeout(function(){
    C.move({n:"s_mouth",z:12});
    zzfx(...[1.78,,246,,.05,.28,1,1.05,,,327,.06,,,49,.1,.04,.71,.05]);
    document.getElementById("btnMouth").style.background = "blanchedalmond";

  }, 500);

  setTimeout(function(){
    C.move({n:"s_mouth",z:10});
  }, 1200);
}

function idleAnimation(){
  animIdle = setInterval(function(){
    setTimeout(function(){
      C.move({n:"silly",z:2});
    }, 300);
    setTimeout(function(){
      C.move({n:"silly",z:0});
    }, 1000);
  }, 1000);
}

function animateTitleScreen(){
  rotation = 0;
  animTitleScreen = setInterval(function(){
    rotation += 15;
    C.camera({rz:rotation});
  }, 500);
}

function switchSillies(){

  //We will store the current eyes to make changes if the eyes are switch
  var currentEyes = eyes;
  selectFeatures();
  //Will wiggle to left and right a little before taking off
  setTimeout(function(){
    C.move({n:"silly",rz:10});
  }, 100);

  setTimeout(function(){
    C.move({n:"silly",rz:0});
  }, 200);

  setTimeout(function(){
    C.move({n:"silly",rz:-10});
  }, 300);

  setTimeout(function(){
    C.move({n:"silly",rz:0});
    document.getElementById("s_jetstream").style.visibility = "visible";
    zzfx(...[1.01,,59,,.06,.17,1,1.97,5.2,,,,,,,.3,,.76,.08]); // Jump 724
    document.getElementById("points").style.visibility = "visible";
    document.getElementById("points").innerHTML = "+" + clearScore.toString();
    clearScore *= 2;
  }, 500);


  setTimeout(function(){
    C.move({n:"silly",z:75});
    C.camera({ry:20, z:-20, y:50})
  }, 1700);
 //Move off screen
  setTimeout(function(){
    C.move({n:"silly",z:110});
    zzfx(...[1.1,,295,.08,.31,.26,1,.5,,-1,-132,.01,.03,,,.1,,.87,.03,.36]); // Powerup 682
    document.getElementById("points").style.visibility = "hidden";


  }, 2200);


  //Change silly's appearance and move it back on screen
  setTimeout(function(){
    zzfx(...[1.01,,560,.09,.46,.7,1,.36,,-5.1,757,,.19,,,.2,,.64,.01]); // Powerup 689
    C.changeBackground({n:"s_body",b:colors[color][0]});
    changeCubeBackground("s_firstleg", colors[color][0], colors[color][2], colors[color][1]);
    changeCubeBackground("s_secondleg", colors[color][0], colors[color][2], colors[color][1]);

    document.getElementById("s_eyes").innerHTML = eye_sets[eyes];

    //Change styles and positions if we are switching between eyes and glasses
    if (eyes > 1 && currentEyes < 2 ){
      document.getElementById("s_eyes").className = "glasses";
      C.move({n:"s_eyes",z:32});
    }

    else if (eyes < 2 && currentEyes > 1 ){
      document.getElementById("s_eyes").className = "face";
      C.move({n:"s_eyes",z:27});
    }

    document.getElementById("s_mouth").innerHTML = mouths[mouth];
    C.move({n:"silly",z:120});

    C.move({n:"silly",z:0});
    C.camera({ry:0, z:40, y:0});


    document.getElementById("s_jetstream").style.visibility = "hidden";
}, 3000);

}

function sillyMovementPattern(){

  setTimeout(function(){
      document.getElementById("instructions").innerHTML= "Memorize this!";
  },1500);
  clearInterval(animIdle);
    timer = 1500;
    for (i = 0; i < silly_moves.length; i++){
        if(silly_moves[i] == 0){
           setTimeout(function(){
             turnLeft();
           }, timer);
          }

          else if(silly_moves[i] == 1){
            setTimeout(function(){
              turnRight();
            }, timer);
          }

          else if(silly_moves[i] == 2){
            setTimeout(function(){
              moveEyes();
            }, timer);
          }

          else if(silly_moves[i] == 3){
            setTimeout(function(){
              moveMouth();
            }, timer);
          }
          timer += 1500;
    }

}

function checkGuess(player_guess, silly_move) {
  if (player_guess == silly_move){
       toggleButtons(true);
       clearInterval(animIdle);
       if (player_guess == 0){
          turnLeft();
       }
       else if (player_guess == 1){
         turnRight()
       }
       else if (player_guess == 2){
         moveEyes();
       }
       else {
         moveMouth();
       }
       current_guess += 1;


       setTimeout(function(){

         idleAnimation();
         toggleButtons(false);

         //End game if all moves are correct
         if (silly_moves.length == player_guesses.length){
           currentGuessesLength = player_guesses.length;
           score += clearScore;


           //Empty guess array for next turn
            for (i = 0; i < currentGuessesLength; i++){
              player_guesses.shift();
            }
            //Add new item to silly's moves
            silly_moves.push(randomInt(0,3));

            setTimeout(function(){
              switchSillies();
              toggleButtons(true);
            }, 1505)


            setTimeout(function(){
              gameLoop();
            }, 4500)

         }
       }, 1500)

  }
  else {
    gameOver = true;
    clearInterval(songPlaying);
    myAudioNode.stop();
    zzfx(...[1.49,,143,,.39,.19,,1.43,,,-8,.09,.11,,,,.12,.73,.07,.24]); // Powerup 691
    document.getElementById("gameoverscreen").style.visibility = "visible";
    document.getElementById("score").innerHTML = "Score: " + score.toString();
    highScore = localStorage.getItem("silliesfromspace_highscore");
    if ((highScore == null) || (score > highScore)) {
      localStorage.setItem("silliesfromspace_highscore", score);
      document.getElementById("highscore").innerHTML = "New High Score";
    }
    else {
      document.getElementById("highscore").innerHTML = "High Score: " + highScore.toString();

    }
    if (isCoilSubscriber){
      document.getElementById("subscribermessage").innerHTML = "Welcome Coil Subscriber! Thanks for your support!";
    }

  }
}

function playAgain(){
  currentGuessesLength = player_guesses.length;
  currentMovesLength = silly_moves.length;
  score = 0;
  clearScore = startingClearScore;
  playSong();

  for (i = 0; i < currentGuessesLength; i++){
    player_guesses.shift();
  }

  for (i = 0; i < currentMovesLength; i++){
    silly_moves.shift();
  }
  selectInitialMoves();
  document.getElementById("gameoverscreen").style.visibility = "hidden";
  gameOver = false;
  gameLoop();

}

function gameLoop(){
      timer_silly_moves = (1500 * silly_moves.length);
      toggleButtons(true);
      sillyMovementPattern();

      setTimeout(function(){
        document.getElementById("instructions").innerHTML="Repeat the pattern.";
        idleAnimation();
        current_guess = 0;
        toggleButtons(false);

      }, timer_silly_moves + 1500);

}

function listenButton(num) {
  player_guesses.push(num);
  checkGuess(player_guesses[current_guess], silly_moves[current_guess]);
};

function startGame(){
  isTitleScreen = false;
  clearInterval(animTitleScreen);
  idleAnimation();
  selectInitialMoves();
  playSong();


  //Hide screen titles
  var titles = document.getElementsByClassName("titlescreen");
  for(i = 0; i < titles.length; i++){
    titles[i].style.visibility = "hidden";
  }

  //Make control buttons and instructions visible
  var buttons = document.getElementsByClassName("btn");
 //Add listeners to buttons to check user input
  for(i = 0; i < buttons.length; i++){
    buttons[i].style.visibility = "visible";
      }

    document.getElementById("btnLeft").addEventListener("click", function btnLeftHandler(){
         listenButton(0);

      });
    document.getElementById("btnRight").addEventListener("click", function btnRightHandler(){
         listenButton(1);
      });
    document.getElementById("btnEyes").addEventListener("click", function btnEyesHandler(){
         listenButton(2);
      });
    document.getElementById("btnMouth").addEventListener("click", function btnMouthHandler(){
            listenButton(3);
      });

  setTimeout(function(){
    C.camera({y:0, z:40, rx:55, rz:10});
    gameLoop();
  }, 1000);

}

//Coil monetization
if (document.monetization) {
document.monetization.addEventListener('monetizationstart', () => {
  isCoilSubscriber = true;
  })
}
//Set units, camera from CSS3D framework
C.set_unit("vmin");
C.camera({y:0, z:40, rx:55, rz:10});

//Draw planet
C.sprite({w:30,h:16,x:-50,y:0,z:55,html:"🪐",css:"planet"});

C.group({n:"silly"});
drawSilly();

animateTitleScreen();
