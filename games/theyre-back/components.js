// ********************************************************************************
// Variables used across compenents.
// ********************************************************************************
var AFRAME = window.AFRAME;
var mouseDown = false; // used to determine if mouse is pressed to run
var moveSpeed = 7; // 7ms - what ave human runs...
var ghostSpeed = 0.5; // speed at what the ghost moves
var worldSize = 100; // 100m^2 playing field
var worldEdge = 5; // prevents one from running into the sides
var worldRandom = (worldSize/2)-worldEdge // to calculate ghost random positions
var score = 0;
var highscore = 0;
var lives = 3;
var wave = 0;
var ghosts = 4;
var explodedghosts = []; // tracks which ghost exploded or are exploding  
var gs_ghostpos = []; // ghost positions to use for colision detection and radar
var radscale =  0.1/ (worldSize/2);// reduce scale in radar
var degPerSec = 60; // how fast the ghost turns towards the player
var positionString = '';
var mainDuration = 1000;
var explodeDuration = 500;
var explodeWait = 500;
var rotationDuration = 2000
var paused = true;
var collision;
var closesGhost = 0;
var gameover = false;

// ********************************************************************************
// gameworld: draws the game grid
// ********************************************************************************
AFRAME.registerComponent('gameworld', {
  schema: {
    wSize: {default: worldSize}
  },
  
  init: function() {
    var sceneEl = document.querySelector('a-scene');
    var entityEl;
    
    entityEl = document.createElement('a-plane');
    entityEl.setAttribute('width',this.data.wSize);
    entityEl.setAttribute('height',this.data.wSize);
    entityEl.setAttribute('position','0 0 0');
    entityEl.setAttribute('rotation','-90 0 0');
    entityEl.setAttribute('material','color','black');
    sceneEl.appendChild(entityEl);
  }
});

// ********************************************************************************
// skyline: draw a skyline on the gamweworld horizon
// ********************************************************************************
var timeVar = 0.85;
var timeVarIncrement = 0.00;
var windowOnOff = 0;
var windowColor = "";

AFRAME.registerComponent('skyline', {
  schema: {
    planeWidth: {type: 'number', default: worldSize},
    buildingDefaultHeight: {type: 'number', default: 5},
    buildingVariableHeight: {type: 'number', default: 45},
    buildingWidth: {type: 'number', default: 10},
    numberOfHorizontalWindows: {type: 'number', default: 3},
    buildingZPosition: {type: 'number', default: -(worldSize/2)},
    horizonColor: {type: 'color', default: "green"}
  },
  
  init: function () {
    var sceneEl = this.el;
    var entityEl;
    var buildingEl;
    var buildingWindowEL;
    var buildingHeight;
    var numberOfWindowsY;
    var x = worldSize/2;
  
    var numBuildings = Math.floor(this.data.planeWidth / this.data.buildingWidth);
    var leftSkylineStart = -(this.data.planeWidth / 2) + (this.data.buildingWidth / 2);
    var buildingWindowWidth = (this.data.buildingWidth / (3 * this.data.numberOfHorizontalWindows + 1)) * 2
    
    // set timer to blick building lights - we don't need to use tick for this
    var myVar = setInterval(this.refreshBuildingWindows, 5000);
    
    // front horizon line
    entityEl = document.createElement('a-entity');
    entityEl.setAttribute('line','start: ' + (-x) + ' 0 ' + (-x+1) + '; end: ' + x + ' 0 ' + (-x+1) + '; color: ' + this.data.horizonColor);
    sceneEl.appendChild(entityEl);
    
    // draw the individual buildings as planes
    for (let step = 0; step < numBuildings; step++) {  

      buildingHeight = this.data.buildingDefaultHeight + Math.round(Math.random() * this.data.buildingVariableHeight)
      
      entityEl = document.createElement('a-plane');
      entityEl.setAttribute('id','building'+step);
      entityEl.setAttribute('class','building');
      entityEl.setAttribute('color', "black");
      entityEl.setAttribute('width',this.data.buildingWidth);
      entityEl.setAttribute('height',buildingHeight);
      entityEl.object3D.position.set(leftSkylineStart + (this.data.buildingWidth * step), 
                                     buildingHeight / 2, 
                                     this.data.buildingZPosition);
      sceneEl.appendChild(entityEl);
      
    
      // For each buidling, draw it's windows as panes
      for (let buildingX = 0; buildingX < this.data.numberOfHorizontalWindows; buildingX++) {
      
        numberOfWindowsY = Math.floor(buildingHeight / (buildingWindowWidth *1.5));
        
        for (let buildingY = 0; buildingY < numberOfWindowsY; buildingY++) {
        
          windowOnOff = Math.random();
          if (windowOnOff <= timeVar) { windowColor = "white" } else { windowColor = "black"}
          
          buildingWindowEL = document.createElement('a-plane')
          buildingWindowEL.setAttribute('class', 'window');
          buildingWindowEL.setAttribute('color', windowColor);
          buildingWindowEL.setAttribute('width', buildingWindowWidth);
          buildingWindowEL.setAttribute('height', buildingWindowWidth);
          buildingWindowEL.object3D.position.set(-this.data.buildingWidth/2 + buildingWindowWidth + (buildingWindowWidth *1.5 * buildingX), 
                                                +buildingHeight/2 - buildingWindowWidth - (buildingWindowWidth *1.5 * buildingY),
                                                0.7);
          entityEl.appendChild(buildingWindowEL);
          
        }
      }  
    }
  },
  
  refreshBuildingWindows: function () {
   
    var sceneEl = document.querySelector('a-scene');
    var els = sceneEl.querySelectorAll('.window');

    if ((timeVarIncrement < 0) && (timeVar < 0.05) ) {
      timeVar = 0;
      timeVarIncrement *= -1;
    }

    if ((timeVarIncrement > 0) && (timeVar > 0.95) ) {
      timeVar = 1;
      timeVarIncrement *= -1;
    } 

    timeVar += timeVarIncrement;

    for (var i = 0; i < els.length; i++) {

      windowOnOff = Math.random();
      if (windowOnOff <= timeVar) { windowColor = "white" } else { windowColor = "black"}
      els[i].setAttribute('color', windowColor);
    }
  }  
});

// ********************************************************************************
// ghost: these are the ground based enemies 
// ********************************************************************************
AFRAME.registerComponent('ghost', {
  schema: {
    width: {default: 1},
    height: {default: 2},
    position: {type: 'vec3', default: {x:0, y: 0, z:-5}},
    id: {default: 'ghost_container'},
    color: {default: '#c0c0c0'},
    speed: {type: 'number', default: 1}
  },
  
  init: function () {
    var animationString = '';
    this.data.position.y -= this.data.height + 0.01;       // take the container element below the game world
    this.cameraRotEl = document.querySelector('a-camera'); // to use in tick
    this.rigPosEl = document.querySelector('#rig');        // to use in tick
    
    // Entity to contain the ghost's components
    var entityContainerEl = document.createElement('a-entity');
    // Attributes
    entityContainerEl.setAttribute('id',this.data.id);
    entityContainerEl.setAttribute('click-listener','');
    entityContainerEl.setAttribute('class','ghostmain ghost explode');
    entityContainerEl.setAttribute('position',this.data.position);
    // Animations - spawn
    positionString = this.data.position.x + ' ' + (this.data.position.y + this.data.height + 0.1) + ' ' + this.data.position.z 
    animationString = 'property: position; to: ' + positionString + '; dur: ' + mainDuration + '; '; //startEvents: spawn';
    entityContainerEl.setAttribute('animation__up',animationString);
    animationString = 'property: rotation; to: 0 1080 0; dur: ' + rotationDuration + '; easing: linear; '; //startEvents: spawn';
    entityContainerEl.setAttribute('animation__rotate',animationString);
    // Animations - explode
    entityContainerEl.setAttribute('animation__explodedown',animationString);
    animationString = 'property: rotation; to: 0 180 0; delay: ' + explodeWait + '; dur: ' + explodeDuration + '; easing: linear; startEvents: explode';
    entityContainerEl.setAttribute('animation__exploderotate',animationString);
    // Add container to root element
    this.el.appendChild(entityContainerEl);
  
    // Shield 
    var entityShieldEl = document.createElement('a-cylinder');
    // Attributes
    entityShieldEl.setAttribute('id','ghostshield');
    entityShieldEl.setAttribute('class','ghost');
    entityShieldEl.setAttribute('material','color: white');
    entityShieldEl.setAttribute('opacity','0');
    entityShieldEl.setAttribute('radius',this.data.width);
    entityShieldEl.setAttribute('height',this.data.height);
    entityShieldEl.setAttribute('position','0 ' + this.data.height/2 + ' 0');
    // Animations - spawn
    animationString = 'property: opacity; to: 0.5; dur: ' + mainDuration + '; easing: linear; '; //startEvents: spawn';
    entityShieldEl.setAttribute('animation__fadein',animationString);
    animationString = 'property: position; to: 0 ' + this.data.height + ' 0; ' + 'delay: ' + 
                      (rotationDuration - mainDuration) + '; dur: ' + mainDuration + '; '; //startEvents: spawn';
    entityShieldEl.setAttribute('animation__moveup',animationString);
    animationString = 'property: height; from: ' + this.data.height + '; to: 0; ' + 'delay: ' + 
                      (rotationDuration - mainDuration) + '; dur: ' + mainDuration + '; '; //startEvents: spawn';
    entityShieldEl.setAttribute('animation__shorten',animationString);
    animationString = 'property: opacity; from: 0.5; to: 0; ' + 'delay: ' + (rotationDuration - mainDuration) + 
                      '; dur: ' + mainDuration + '; '; //startEvents: spawn';
    entityShieldEl.setAttribute('animation__fadeout',animationString);
    // Add shield to container
    entityContainerEl.appendChild(entityShieldEl);
    
    // Base-becomes-top for the ghost
    var baseEl = document.createElement('a-plane');
    // Attributes
    baseEl.setAttribute('id','ghosttop');
    baseEl.setAttribute('class','ghost');
    baseEl.setAttribute('width',this.data.width);
    baseEl.setAttribute('height',this.data.width);
    baseEl.setAttribute('rotation','-90 0 0');
    baseEl.setAttribute('material','color: ' + this.data.color);
    baseEl.setAttribute('material','side: double');
    // Animations - spawn
    animationString = 'property: position; to: 0 ' + this.data.height+ ' 0; ' + 'delay: ' + (rotationDuration - mainDuration) + '; dur: ' + mainDuration 
                      + '; easing: linear; '; //startEvents: spawn';
    baseEl.setAttribute('animation__up',animationString);
    // Add base/top to container
    entityContainerEl.appendChild(baseEl);
    
    // Ghost back
    var ghostBackElentityEl = document.createElement('a-triangle');
    // Attributes
    ghostBackElentityEl.setAttribute('id','ghostback');
    ghostBackElentityEl.setAttribute('class','ghost collidable');
    ghostBackElentityEl.setAttribute('metalness','0.8');
    ghostBackElentityEl.setAttribute('material','color: ' + this.data.color);
    ghostBackElentityEl.setAttribute('material','side: double');
    ghostBackElentityEl.setAttribute('vertex-a','0 ' + this.data.height + ' 0');
    ghostBackElentityEl.setAttribute('vertex-b',-this.data.width/2 + ' 0 ' + this.data.width/2);
    ghostBackElentityEl.setAttribute('vertex-c',this.data.width/2 + ' 0 ' + this.data.width/2);
    // Animations - spawn
    animationString = 'property: vertex-a; to: 0 0 0; delay: ' + (rotationDuration - mainDuration) + '; dur: ' + mainDuration + '; easing: linear; '; //startEvents: spawn';
    ghostBackElentityEl.setAttribute('animation__vertexa',animationString);
    animationString = 'property: vertex-b; to: ' + (-this.data.width/2) + ' ' + this.data.height + ' ' + (this.data.width/2) + 
                      '; delay: ' + (rotationDuration - mainDuration) + '; dur: ' + mainDuration + '; easing: linear; '; //startEvents: spawn';
    ghostBackElentityEl.setAttribute('animation__vertexb',animationString);
    animationString = 'property: vertex-c; to: ' + (this.data.width/2) + ' ' + this.data.height + ' ' + (this.data.width/2) + 
                      '; delay: ' + (rotationDuration - mainDuration) + '; dur: ' + mainDuration + '; easing: linear; '; //startEvents: spawn';
    ghostBackElentityEl.setAttribute('animation__vertexc',animationString);
    // Add back to container
    entityContainerEl.appendChild(ghostBackElentityEl);
    
     // Ghost left
    var ghostLeftElentityEl = document.createElement('a-triangle');
    // Attributes
    ghostLeftElentityEl.setAttribute('id','ghostleft');
    ghostLeftElentityEl.setAttribute('class','ghost collidable');
    ghostLeftElentityEl.setAttribute('metalness','0.8');
    ghostLeftElentityEl.setAttribute('material','color: ' + this.data.color);
    ghostLeftElentityEl.setAttribute('material','side: double');
    ghostLeftElentityEl.setAttribute('vertex-a','0 ' + this.data.height + ' 0');
    ghostLeftElentityEl.setAttribute('vertex-b',-this.data.width/2 + ' 0 ' + this.data.width/2);
    ghostLeftElentityEl.setAttribute('vertex-c',-this.data.width/2 + ' 0 ' + (-this.data.width/2));
    // Animations - spawn
    animationString = 'property: vertex-a; to: 0 0 0; delay: ' + (rotationDuration - mainDuration) + '; dur: ' + mainDuration + '; easing: linear; '; //startEvents: spawn';
    ghostLeftElentityEl.setAttribute('animation__vertexa',animationString);
    animationString = 'property: vertex-b; to: ' + (-this.data.width/2) + ' ' + this.data.height + ' ' + (this.data.width/2) + 
                      '; delay: ' + (rotationDuration - mainDuration) + '; dur: ' + mainDuration + '; easing: linear; '; //startEvents: spawn';
    ghostLeftElentityEl.setAttribute('animation__vertexb',animationString);
    animationString = 'property: vertex-c; to: ' + (-this.data.width/2) + ' ' + this.data.height + ' ' + (-this.data.width/2) + 
                      '; delay: ' + (rotationDuration - mainDuration) + '; dur: ' + mainDuration + '; easing: linear; '; //startEvents: spawn';
    ghostLeftElentityEl.setAttribute('animation__vertexc',animationString);
     // Add lefy to container
    entityContainerEl.appendChild(ghostLeftElentityEl);
    
    // Ghost front
    var ghostFrontElentityEl = document.createElement('a-triangle');
    // Attributes
    ghostFrontElentityEl.setAttribute('id','ghostfront');
    ghostFrontElentityEl.setAttribute('class','ghost collidable');
    ghostFrontElentityEl.setAttribute('metalness','0.8');
    ghostFrontElentityEl.setAttribute('material','color: ' + this.data.color);
    ghostFrontElentityEl.setAttribute('material','side: double');
    ghostFrontElentityEl.setAttribute('vertex-a','0 ' + this.data.height + ' 0');
    ghostFrontElentityEl.setAttribute('vertex-b',-this.data.width/2 + ' 0 ' + (-this.data.width/2));
    ghostFrontElentityEl.setAttribute('vertex-c',this.data.width/2 + ' 0 ' + (-this.data.width/2));
    // Animations - spawn
    animationString = 'property: vertex-a; to: 0 0 0; delay: ' + (rotationDuration - mainDuration) + '; dur: ' + mainDuration + '; easing: linear; '; //startEvents: spawn';
    ghostFrontElentityEl.setAttribute('animation__vertexa',animationString);
    animationString = 'property: vertex-b; to: ' + (-this.data.width/2) + ' ' + this.data.height + ' ' + (-this.data.width/2) + 
                      '; delay: ' + (rotationDuration - mainDuration) + '; dur: ' + mainDuration + '; easing: linear; '; //startEvents: spawn';
    ghostFrontElentityEl.setAttribute('animation__vertexb',animationString);
    animationString = 'property: vertex-c; to: ' + (this.data.width/2) + ' ' + this.data.height + ' ' + (-this.data.width/2) + 
                      '; delay: ' + (rotationDuration - mainDuration) + '; dur: ' + mainDuration + '; easing: linear; '; //startEvents: spawn';
    ghostFrontElentityEl.setAttribute('animation__vertexc',animationString);
     // Add front to container
    entityContainerEl.appendChild(ghostFrontElentityEl);
    
    // Ghost eye - back
    var ghostEyeBackEl = document.createElement('a-plane');
    // Attributes
    ghostEyeBackEl.setAttribute('id','eyes_back');
    ghostEyeBackEl.setAttribute('class','ghost collidable');
    ghostEyeBackEl.setAttribute('width',this.data.width * 0.6);
    ghostEyeBackEl.setAttribute('height',this.data.height * 0.1);
    ghostEyeBackEl.setAttribute('material','color: black');
    ghostEyeBackEl.setAttribute('position','0 ' + (this.data.height*0.8) + ' ' + (-this.data.width/2));
    ghostEyeBackEl.setAttribute('rotation', (90-Math.atan(this.data.height/(this.data.width/2))*180/Math.PI) + ' 180 0');
    ghostEyeBackEl.setAttribute('opacity','0');
    /// Animations - spawn
    animationString = 'property: opacity; from: 0; to: 1; ' + 'delay: ' + (rotationDuration - mainDuration) + '; dur: ' + mainDuration + '; '; //startEvents: spawn';
    ghostEyeBackEl.setAttribute('animation__fadein',animationString);
    entityContainerEl.appendChild(ghostEyeBackEl);

    // Ghost eyes - front
    var eyewidth = ghostEyeBackEl.getAttribute('width') / 2;
    var eyeradius = ghostEyeBackEl.getAttribute('height') * 0.5 * 0.9
    
    var ghostEyeFrontEl = document.createElement('a-circle');
    ghostEyeFrontEl.setAttribute('id','eyes_front');
    ghostEyeFrontEl.setAttribute('class','ghost collidable explode');
    ghostEyeFrontEl.setAttribute('radius',eyeradius);
    ghostEyeFrontEl.setAttribute('position',(eyeradius - eyewidth) + ' 0 0.01');
    ghostEyeFrontEl.setAttribute('material','color: red');
    ghostEyeFrontEl.setAttribute('opacity','0');
    // Animations - spawn
    animationString = 'property: opacity; from: 0; to: 1; ' + 'delay: ' + (rotationDuration - mainDuration) + '; dur: ' + mainDuration;
    ghostEyeFrontEl.setAttribute('animation__fadein',animationString);
    animationString = 'property: position; from: ' + (eyeradius - eyewidth) + ' 0 0.01;' + ' to:' + (eyewidth - eyeradius) + ' 0 0.01; ' + 
                      'delay: ' + (rotationDuration - mainDuration) + '; dur: 750; easing: linear; loop: true; dir: alternate; '; //startEvents: spawn';
    ghostEyeFrontEl.setAttribute('animation__eyemove',animationString);
    // Animations - explode
    animationString = 'property: scale; to: 0 0 0; dur: ' + explodeDuration + '; easing: linear; startEvents: explode';
    ghostEyeFrontEl.setAttribute('animation__explodefade',animationString);
    // Add eyefront to container
    ghostEyeBackEl.appendChild(ghostEyeFrontEl);  
    
    // Ghost right
    var ghostRightEl = document.createElement('a-triangle');
    ghostRightEl.setAttribute('id','ghostright');
    ghostRightEl.setAttribute('class','ghost collidable');
    ghostRightEl.setAttribute('metalness','0.8');
    ghostRightEl.setAttribute('material','color: ' + this.data.color);
    ghostRightEl.setAttribute('material','side: double');
    ghostRightEl.setAttribute('vertex-a','0 ' + this.data.height + ' 0');
    ghostRightEl.setAttribute('vertex-b',this.data.width/2 + ' 0 ' + (-this.data.width/2));
    ghostRightEl.setAttribute('vertex-c',this.data.width/2 + ' 0 ' + this.data.width/2);
    // Animations - spawn
    animationString = 'property: vertex-a; to: 0 0 0; delay: ' + (rotationDuration - mainDuration) + '; dur: ' + mainDuration + '; easing: linear; '; //startEvents: spawn';
    ghostRightEl.setAttribute('animation__vertexa',animationString);
    animationString = 'property: vertex-b; to: ' + (this.data.width/2) + ' ' + this.data.height + ' ' + (-this.data.width/2) + 
                      '; delay: ' + (rotationDuration - mainDuration) + '; dur: ' + mainDuration + '; easing: linear; '; //startEvents: spawn';
    ghostRightEl.setAttribute('animation__vertexb',animationString);
    animationString = 'property: vertex-c; to: ' + (this.data.width/2) + ' ' + this.data.height + ' ' + (this.data.width/2) + 
                      '; delay: ' + (rotationDuration - mainDuration) + '; dur: ' + mainDuration + '; easing: linear; '; //startEvents: spawn';
    ghostRightEl.setAttribute('animation__vertexc',animationString);
     // Add fromy to container
    entityContainerEl.appendChild(ghostRightEl);
    
    this.entityContainerEl = entityContainerEl;
    
  },
  
  tick: function (time, timeDelta) {
    var ghostRot = GameUtils.standard_direction(this.entityContainerEl.object3D.rotation.y) * 180 / Math.PI;
    var cx = this.rigPosEl.object3D.position.x;
    var cz = this.rigPosEl.object3D.position.z;
    var ax = this.entityContainerEl.object3D.position.x;
    var az = this.entityContainerEl.object3D.position.z;
    var angleToCamera = Math.atan((cz - az) / (cx - ax)) * 180 / Math.PI;
    var toBeAngle;
    var angleInc = 0;
    var angleDiff1;
    var angleDiff2;
    var rot = (timeDelta/1000) * degPerSec;
    var ghostUpdatedRot;
    var x = 0;
    var z = 0;
    var read_gs_ghostpos = true;
    var i = 0;
    var updatePos = true;
    
    
    // Turn alien in direction of the player    
    if ((cx <= ax) && (cz <= az)) { 
      // Left and above
      toBeAngle = 90 - angleToCamera;
    } 
    if ((cx <= ax) && (cz > az)) { 
      // Left and below
      toBeAngle = 90 + Math.abs(angleToCamera);
    } 
    if (cx > ax) {
      toBeAngle = 360 - (90 + angleToCamera);
    }

    if (ghostRot >= toBeAngle) {
      angleDiff1 = ghostRot - toBeAngle;
      angleDiff2 = 360 - angleDiff1;
      if (angleDiff1 <= 180) { 
        angleInc = -rot;
      } 
      else {
          angleInc = rot;
      }
    } else {
      angleDiff1 = toBeAngle - ghostRot;
      angleDiff2 = 360 - angleDiff1;
      if (angleDiff1 <= 180) { 
        angleInc = rot;
      } 
      else {
        angleInc = -rot;
      } 
    }
    if ((angleDiff1 <= 5) || (angleDiff2 <= 5)) {angleInc = 0}

    this.entityContainerEl.object3D.rotation.y += angleInc * Math.PI/180;

    // only move if not paused
    if (!paused) {
      // move ghost foward - only if not exploding...
      // i.e. it is not in the following matrix
      if (explodedghosts.indexOf(this.entityContainerEl.id) != -1) {
        updatePos = false;
      }

      if (updatePos) { 
        ghostUpdatedRot = (GameUtils.standard_direction(this.el.childNodes[0].object3D.rotation.y)) + Math.PI/2;
        x = (timeDelta/1000 * ghostSpeed) * Math.cos(ghostUpdatedRot);
        z = -1 * (timeDelta/1000 * ghostSpeed) * Math.sin(ghostUpdatedRot);
        this.entityContainerEl.object3D.position.x += x;
        this.entityContainerEl.object3D.position.z += z;
        x = this.entityContainerEl.object3D.position.x;
        z = this.entityContainerEl.object3D.position.z

        i = 0;
        // update position matrix
         while (read_gs_ghostpos && (i < gs_ghostpos.length)) {
           if (gs_ghostpos[i].id == this.entityContainerEl.id) {
                 gs_ghostpos[i].pos.x = x;
                 gs_ghostpos[i].pos.y = z;
                 read_gs_ghostpos = false;
               }
           i++;
         }
      }
    }
  }
});

// ********************************************************************************
// hud: a number of game actions will take place in the this component.
// ********************************************************************************
AFRAME.registerComponent('hud', {
  schema: {
    size: {default: 0.3}
  },
  
  init: function () {
    var sceneEl = document.querySelector('a-scene');
    this.cameraPos = document.querySelector('a-camera');
    this.rigPos = document.querySelector('#rig');
    var entityEl;
    var animationString;
    
    entityEl = document.createElement('a-entity');
    entityEl.setAttribute('id','hud');
    entityEl.setAttribute('geometry','primitive: plane; height: 0.4; width: 0.4');
    entityEl.setAttribute('material','color: white; opacity: 0.3');
    entityEl.setAttribute('position','0 0 -1.01');
    this.cameraPos.appendChild(entityEl);
    
    this.radar = document.querySelector('#hud');
    entityEl = document.createElement('a-entity');
    entityEl.setAttribute('id','radar');
    entityEl.setAttribute('geometry','primitive: plane; height: 0.2; width: 0.2');
    entityEl.setAttribute('material','color: white; opacity: 0.0');
    entityEl.setAttribute('position','0 0 -0.99');
    this.cameraPos.appendChild(entityEl);
    this.radarplane = document.querySelector('#radar');
    
    this.hudPos = document.querySelector('#hud');
    entityEl = document.createElement('a-entity');
    entityEl.setAttribute('id','hudTop');
    entityEl.setAttribute('geometry','primitive: plane; height: 0.075; width: 0.4');
    entityEl.setAttribute('material','color: white; opacity: 0.3');
    entityEl.setAttribute('position','0 0.1525 0.005');
    entityEl.setAttribute('text','align: left; width: 0.39; anchor: center; wrapCount: 30; color: #00ff00');
    this.hudPos.appendChild(entityEl);

    entityEl = document.createElement('a-entity');
    entityEl.setAttribute('id','hudBottom');
    entityEl.setAttribute('geometry','primitive: plane; height: 0.075; width: 0.4');
    entityEl.setAttribute('material','color: white; opacity: 0.3');
    entityEl.setAttribute('position','0 -0.15 0.005');
    entityEl.setAttribute('text','align: left; width: 0.39; anchor: center; wrapCount: 30; color: #00ff00');
    this.hudPos.appendChild(entityEl);
    
    this.entityElTopText = document.querySelector('#hudTop');
    this.entityElBottomText = document.querySelector('#hudBottom');
    
    sceneEl.addEventListener('mousedown', function() {
      mouseDown = true;
    });
     
    sceneEl.addEventListener('mouseup', function() {
      mouseDown = false;
    });  
  },
   
  // Your game character movement is done by the hud
  tick: function (time, timeDelta) {
    var cameraRot = this.cameraPos.object3D.rotation;
    var rigPos = this.rigPos.object3D.position;
    var rot = (cameraRot.y + Math.PI/2);
    var x = 0;
    var z = 0;
    var i;
    var element;
    
    if (!paused) {
      // Check for collision - distance between player root and alive ghosts < 2 and ghost not exploding
      i = 0;
      collision = false;
      while (!collision && (i < gs_ghostpos.length)) {
        if (i==0) {closesGhost = gs_ghostpos[i].dist}
        if (gs_ghostpos[i].dist < closesGhost) { closesGhost = gs_ghostpos[i].dist }
        i++;
      }
      
      'Ghost cathes you'
      if ((closesGhost <= 1.5) && (wave > 0 )) {
        paused = true;
        lives--;
        if (lives <= 0) { gameover = true} 
        this.rigPos.object3D.position.x = 0;
        this.rigPos.object3D.position.z = 0;
      }

      // Move player
      if (mouseDown) {
        x = (timeDelta/1000 * moveSpeed) * Math.cos(rot);
        z = -1 * (timeDelta/1000 * moveSpeed) * Math.sin(rot);

        if (((rigPos.x + x) >= (-worldSize/2 + worldEdge)) && ((rigPos.x + x) <= (worldSize/2 - worldEdge))) {
          this.rigPos.object3D.position.x += x;
        } 

        if (((rigPos.z + z) >= (-worldSize/2 + worldEdge)) && ((rigPos.z + z) <= (worldSize/2 - worldEdge))) {
          this.rigPos.object3D.position.z += z;
        } 
      }
    }
    
    if (wave == 0) { ghosts = 4}
    
    // Show hud info
    this.entityElTopText.setAttribute('text',"value: Wave: " + wave +
                                      '\nScore: ' + score + 
                                      '\nHigh Score: ' + highscore);  
    
    this.entityElBottomText.setAttribute('text',"value: Ghosts: " + ghosts +
                                        "\nClosest Ghost: " + Math.round(closesGhost*10)/10 + 
                                        "\nLives: " + lives); 
    
    
    // Update radar rotation to match rig rotation
    this.radarplane.object3D.rotation.z = -GameUtils.standard_direction(cameraRot.y);
    
  }
});

// ********************************************************************************
// blip: indicates enemies on the radar
// ********************************************************************************
AFRAME.registerComponent('blip', {
  schema: {
    id: {default:'blip'},
    position: {type: 'vec2', default: {x:0, y: 0}},
    color: {default: '#c0c0c0'},
  },
  init: function() {
    var animationString;
    this.rigPos = document.querySelector('#rig').object3D.position;
    
    // draw blip on hud radar
    var blipEl = document.createElement('a-entity');
    blipEl.setAttribute('id',this.data.id);
    blipEl.setAttribute('class','blip');
    blipEl.setAttribute('geometry','primitive: circle; radius: 0.0045');
    blipEl.setAttribute('position',this.data.position.x + ' ' + this.data.position.y + ' 0.01');
    blipEl.setAttribute('material','color: ' + this.data.color);
    // Animations - explode
    animationString = 'property: scale; to: 0 0 0; dur: 500; easing: linear; startEvents: explode';
    blipEl.setAttribute('animation__implode',animationString);
    this.el.appendChild(blipEl);
  },
  
   tick: function (time, timeDelta) {
     // recalc relative pos to player - ghost pos updated by ghost ticker
     var read_gs_ghostpos = true
     var i = 0;
     
     while (read_gs_ghostpos && (i < gs_ghostpos.length)) {
       if (gs_ghostpos[i].blipid == this.el.childNodes[0].id) {
             this.el.childNodes[0].object3D.position.x = (gs_ghostpos[i].pos.x - this.rigPos.x) * radscale;
             this.el.childNodes[0].object3D.position.y = -(gs_ghostpos[i].pos.y - this.rigPos.z) * radscale;
             gs_ghostpos[i].dist = Math.sqrt((Math.pow(gs_ghostpos[i].pos.x - this.rigPos.x,2) +  Math.pow(gs_ghostpos[i].pos.y - this.rigPos.z,2)))             
             read_gs_ghostpos = false;
           }
       i++;
     }
   }
});

// ********************************************************************************
// click-listener: trigger explosions when collidable items are clicked
// ********************************************************************************
AFRAME.registerComponent('click-listener', {
  init: function () {
    var entityEl = this.el.querySelectorAll('.collidable');
    for (var i = 0; i < entityEl.length; i++) {
      var el = entityEl[i];
        entityEl[i].addEventListener('click',this.explode);
      }
  },
      
  explode: function(evt) {
    var entityEl = evt.srcElement.parentNode.querySelectorAll('.explode');
    var blipEl;
    var blipID;
    var ghostid = evt.srcElement.parentNode.id;
    var i;
    var arrloop = true;
    var spliceEl;
    var entityGhost;
    var animationString;
    
    if (!paused) {
      if (explodedghosts.indexOf(ghostid) == -1) {

        // keep track of ghosts that are exploding
        explodedghosts.push(ghostid);
        score++;
        if (score > highscore) {
          highscore = score
          var highscoreEl = document.querySelector('#highscore');
          highscoreEl.setAttribute('text','value','Highscore: ' + highscore);
        }

        // remove pos from exploding item
        i = 0;
        while (arrloop && (i < gs_ghostpos.length)) {
         if (gs_ghostpos[i].id == ghostid) {
             spliceEl = gs_ghostpos.splice(i,1);
             entityGhost = document.querySelector('#' + spliceEl[0].id);      
             animationString = 'property: position; to: ' + spliceEl[0].pos.x + ' ' + (-2.01) + ' ' + spliceEl[0].pos.y + '; delay: ' + explodeWait + '; dur: ' + explodeDuration + '; startEvents: explode';
             entityGhost.setAttribute('animation__explodedown',animationString);
             arrloop = false;
             ghosts -= 1;
          }
          i++;
        }

        // trigger explode events on ghosts
        evt.srcElement.parentNode.dispatchEvent(new Event('explode'));
        for (i = 0; i < entityEl.length; i++) {
          entityEl[i].dispatchEvent(new Event('explode'));
        }

        // trigger explode event on blip
        blipID = ghostid + '_blip';
        blipEl = document.querySelector("#" + blipID);
        blipEl.dispatchEvent(new Event('explode'));
      } 

      // next wave if all ghosts are eliminated
      if (ghosts == 0) {
        explodedghosts.length = 0;
      }
    }
  }  
});

// ********************************************************************************
// start-listener: trigger explosions when collidable items are clicked
// ********************************************************************************
AFRAME.registerComponent('start-listener', {
  init: function () {
    
    this.el.addEventListener('click',this.startgame);
  },
  
  startgame: function(evt) {
    
    evt.srcElement.parentNode.setAttribute('visible','false');
    gs_ghostpos.length = 0;
    paused = false;
     
  }
});

// ********************************************************************************
// helper functions 
// ********************************************************************************
var GameUtils = {
  
  rint: function(start,end) {
    var rnd = Math.round(Math.random()*(end-start))+start;  
    return rnd
  },
  
  standard_direction: function (dir) {
    var t = dir % (Math.PI*2);
    var r = t;

    if (dir < 0) {
      r = Math.PI*2 + t;  
    }
      return r
    }
}

// ********************************************************************************
// game-engine
// ********************************************************************************
AFRAME.registerComponent('game-engine', {
  init: function() {
    var sceneEl = this.el;
    this.rigPos = document.querySelector('#rig');
    this.cameraRot = document.querySelector('a-camera');
    this.radarEl = document.querySelector('#radar');
    this.startEl = document.querySelector('#intro');
    this.spawnghosts(wave,this.el);
  },
  
  tick: function (time, timeDelta) {
    
    if (gameover) {
      this.startEl.setAttribute('visible','true');
      wave = 0;
      paused = true;
      lives = 3;
      score = 0;
      ghosts = 0;   
    }
    
   
    if (paused && !gameover && (wave > 0)) {
     paused = false;
     explodedghosts.length = 0;
     gs_ghostpos.length = 0;
     ghosts = 0;
     wave--;
    }
     
    // when click start - to get rid of existing bots
     if ((wave == 0) && !paused) {
      ghosts = 0;
    }
  
    if ((ghosts == 0) && !gameover) {
      wave += 1;
      this.clearGhosts();
      this.spawnghosts(wave,this.el);
    } else {
      gameover = false;
    }
  },
 
  spawnghosts: function(wave, sceneEl) {
    var pos_ghost = {x:0, y:0, z:0};
    var pos_rel = {x:0, y:0};
    var id;
    var clrs = ['#ff0000','#ff0fff','#00ffff','#ffb852'];
    var rigPos = this.rigPos.object3D.position; 
    var radarEl = this.radarEl;
    var col;
    var ghostEntityEl;
    var blipentityEl;
    var ghostSpeed = (0.5 * Math.pow(1.1,wave));
    var valid;
    var d;
    
    var intro = [{x:-2.4, y:0, z: -2.5}, {x:-1.8, y:0, z: -3.5}, {x:1.8, y:0, z: -3.5}, {x:2.4, y:0, z: -2.5}]
    
    ghosts = Math.round(4 * Math.pow(1.1,wave));
    
    // create ghosts
    for (var i=0; i < ghosts; i++) {
      console.log('In create ghosts - wave = ' + wave + ' gameover = ' + gameover);
      valid = false;
      if (wave == 0) {
        pos_ghost.x  = intro[i].x; 
        pos_ghost.y = 0;
        pos_ghost.z = intro[i].z;
        col = clrs[i];
      } else {
        // don't spawn closer than 5m from the player
        while (!valid) {
          pos_ghost.x  = GameUtils.rint(-worldRandom,worldRandom);
          pos_ghost.z = GameUtils.rint(-worldRandom,worldRandom);            
          d = Math.sqrt((Math.pow(pos_ghost.x  + rigPos.x,2)) + (Math.pow(pos_ghost.z + rigPos.z,2)));
          if (d > 5) { valid = true } 
        }
        pos_ghost.y = 0;
        col = clrs[GameUtils.rint(0,3)];
      }
      ghostEntityEl = document.createElement('a-entity');
      pos_rel.x = pos_ghost.x-rigPos.x;
      pos_rel.y = pos_ghost.z-rigPos.z
      id = 'ghost' + i;
      
      // create ghost
      ghostEntityEl.setAttribute('ghost','id: ' + id + 
                                 '; position: '+ pos_ghost.x + ' ' + pos_ghost.y + ' ' + pos_ghost.z + 
                                 '; color: ' + col +
                                 '; speed: ' + ghostSpeed );
      sceneEl.appendChild(ghostEntityEl);
      
      // ignore for intro screen
      if (wave > 0) {
        // this matrix enables the radar blips to get the ghost positions and update their relative positions
        gs_ghostpos.push({id: id, 
                          pos: {x: pos_ghost.x , y: pos_ghost.z},
                          blipid: id + '_blip'});

        blipentityEl = document.createElement('a-entity');
        blipentityEl.setAttribute('blip','id: ' + id + '_blip' + 
                                  '; position: ' + pos_rel.x * radscale + ' ' + (-pos_rel.y * radscale) +
                                  '; color: ' + col);
        this.radarEl.appendChild(blipentityEl);
      }
     }
  },
  
  clearGhosts: function() {
    var ghostEl = document.querySelectorAll('[ghost]');
    for (var i = 0; i < ghostEl.length; i++) {
        ghostEl[i].parentNode.removeChild(ghostEl[i]);
    }  
    
    // ignore for intro
    if (wave >= 0) {
      ghostEl = document.querySelectorAll('[blip]');
      for (var i = 0; i < ghostEl.length; i++) {
          ghostEl[i].parentNode.removeChild(ghostEl[i]);
      }
    }  
  }
});