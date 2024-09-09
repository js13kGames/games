var scene, words, answers, response=[], default_color = "#7BC8A4", levelID=0, leveldata = {
    0: ["Where am I? * Why can I * see my thoughts? [NEXT]", [11], "next", "exo2semibold", [{"person_1":{'attrs':'position:0 0 0;', 'typeof': 'a-entity',class:'ocean', position:"2.9 1.64 -6", rotation: "0 0 0", scale:"0.2 0.2 0.2"}}, {"ocean":{'attrs':'position:0 0 0;','typeof': 'a-entity', class: 'ocean', position:"0 0 0", rotation: "-90 0 0", scale: "1 1 1"}},], "-4 2 -2", "0 45 0", "0 0 0", "0 0 0"],
    1: ["How do I even move?", [2,4], "next", "roboto", [{'cast-shadow': {'attrs':'color:green;position:0 0 0;','typeof': 'a-entity', position:"-3.5 0 0", width:"24", height:"24", depth:"24", rotation:"-90 0 0"}},{'tree':{'attrs': 'x:-6; y:0; z:-6;', 'typeof': 'a-entity', position:"-5 0 -14"}},{'tree':{'attrs': 'x:5; y:0; z:-4;', 'typeof': 'a-entity', position:"-5 0 -14"}}, {'tree':{'attrs': 'x:6; y:0; z:-3;', 'typeof': 'a-entity', position:"-5 0 -14"}},{'tree':{'attrs': 'x:15; y:0; z:-4;', 'typeof': 'a-entity', position:"-5 0 -14"}}], "0 1 -2", "0 0 0", "0 0 0", "0 0 0"],
    2: ["A house appears * in the distance. [NEXT]", [7], "next", "exo2semibold", [{'cast-shadow': {'attrs':'color:green;position:0 0 0;','typeof': 'a-entity', position:"0 -0.5 0", width:"24", height:"24", depth:"24", rotation:"-90 0 0"}},{'house': {'attrs':'position:0 0 0;', 'typeof': 'a-entity', position:"12 2 -12", rotation:"0 0 0"}}], "-3.5 3 -1", "0 0 0", "0 0 0", "0 0 0"],
    3: ["What is this place? * Why am I not in my house?", [7, 6, 9, 10, 11], "enterHouse", "roboto",[], "-3.5 3 -2", "0 0 0", "0 0 0", "0 0 0"],
    4: ["I see a candle * maybe I * could light it?", [9,3], "next", "roboto",[], "-1 3.2 -2", "0 0 0", "0 0 0", "0 0 0"],
    5: ["A key is closeby * the light * is glowing", [5,1,2,8], "next", "roboto",[], "-1 3.2 -2", "0 0 0", "0 0 0", "0 0 0"],
    6: ["Look at you * behind the mirror", [0,4,2], "next", "roboto",[], "-2.5 3.2 -1.5", "0 0 0", "-0.5 0 0", "0 0 0"],
    7: ["{figures}", [0,4,2], "carScene", "roboto",[{"person_1":{'attrs':'position:0 0 0;', 'typeof': 'a-entity',position:"2.9 1.64 -6", rotation: "0 0 0", scale:"0.2 0.2 0.2"}},{'car':{'typeof': 'a-entity', position:"0 -0.5 0", width:"24", height:"24", depth:"24", rotation:"-90 0 0", scale:"0.2 0.2 0.2"}}], "-2.5 3.2 -1.5", "0 0 0", "-0.5 0 0", "0 0 0"],
    8: ["car", [], "next", "roboto",[{'car':{'typeof': 'a-entity', position:"0 -0.5 0", width:"24", height:"24", depth:"24", rotation:"-90 0 0"}}]],
    9: ["He's lost in * an endless trip [NEXT]", [7], "next", "roboto",[{'car':{'typeof': 'a-entity', position:"0 -0.5 0", width:"24", height:"24", depth:"24", rotation:"-90 0 0"}}], "-2.5 3.2 -1.5", "0 0 0", "-0.5 0 0", "0 0 0"],
    10: ["The trees block the sunlight * Don't know the * way to stop!", [0, 1, 3, 4, 10], "next", "roboto",[{'car':{'typeof': 'a-entity', position:"0 -0.5 0", width:"24", height:"24", depth:"24", rotation:"-90 0 0"}}], "-2.5 3.2 -1.5", "0 0 0", "0 0 0", "0 0 0"],
    11: ["He's lost in an endless dream * he needs to wake up!", [10, 11], "next", "roboto",[{"ocean":{'typeof': 'a-entity', position:"0 0 0", rotation: "-90 0 0", scale: "1 1 1"}}], "-2.5 3.2 -1.5", "0 0 0", "0 0 0", "0 0 0"],
    11: ["You awaken * The end", [], "end", "roboto",[{"ocean":{'typeof': 'a-entity', position:"0 0 0", rotation: "-90 0 0", scale: "1 1 1"}}], "-2.5 3.2 -1.5", "0 0 0", "0 0 0", "0 0 0"]
}

var classes = ['word', 'ocean', 'slot', 'entity', 'person'], current_slot = 0, slot_data={};
function onClick (e) {
            var el = e.target,
                text = leveldata[levelID][0].split(' '),
                word = el.getAttribute('text').value,
                callback = leveldata[levelID][2],
                wordelem = el.getAttribute('id'),
                wordid = wordelem.split('-')[1]
                animEl = document.querySelector('#select-w-'+wordid),
                slotEl = document.querySelector('#slot-w-'+current_slot.toString());
            answers = leveldata[levelID][1];
            el.setAttribute('text', 'color', 'red');
            el.removeEventListener('click', onClick);
          //  console.log("click", word, wordid,response, answers, current_slot, slotEl);
            if (response.length >= answers.length){
                checkResponse(el, answers, callback);
            } else {
                response.push(parseInt(wordid)); 
            }
            if (slotEl != null){    
                var pos = slotEl.getAttribute('position');
                el.object3D.position.set(pos.x,pos.y+0.5,pos.z);
                var rot = slotEl.getAttribute('rotation');
                //el.object3D.rotation.set(rot.x,rot.y,rot.z);
                slot_data[current_slot] = wordelem;
                current_slot += 1;
//                el.emit('select');
            } 
          };

function clearAll(classes){
    for (var cls in classes){
        var els = document.querySelectorAll('.'+classes[cls]);
        for (var i = 0; i < els.length; i++) {
//            els[i].emit('fade', function(){
            els[i].parentNode.removeChild(els[i]);
        }
    }
};
var states = {
    next: function next(el){
              levelID += 1;
              clearAll(['word', 'slot', 'ocean', 'person']);
              reset();
              run();
          },
    enterHouse: function(el){
              document.querySelector('[house]').setAttribute('position', "0 2 0");
              states['next'](el);
          },
    carScene: function(el){
              console.log("car scene");
              states['next'](el);
          },
    end: function (el){
              console.log("the end");
              clearAll(classes);
          },
};

function checkResponse(el, answers, callback){
    nextlevel = false;
    if(response.length >= answers.length){
        for(var a=0; a < answers.length; a++){
            if (response[a] && response[a] == answers[a]){
                nextlevel = true;
                //console.log("next level", levelID, response[a], answers[a], nextlevel, current_slot)   
            } else {
                nextlevel = false;
                //console.log("next level", levelID, response[a], answers[a], nextlevel, current_slot) 
                reset();
                run();
                break; 
            }
        }
        //console.log("response full", levelID, response, answers, nextlevel, current_slot) 
        if (nextlevel==true){     
            states[callback](el);                      
        }
    }
};

function reset(){
    clearAll(['word', 'slot', 'ocean', 'person']);
    current_slot = 0;
    slot_data={};
    response = [];
};

AFRAME.registerComponent('change-color-on-hover', {
        schema: {
          color: {default: 'green'}
        },
        init: function () {
          var el = this.el;
          el.addEventListener('mouseenter', function () {
            el.setAttribute('text', 'color', 'yellow');//data.color);
          });
          el.addEventListener('mouseleave', function () {
            el.setAttribute('text', 'color', 'white');
            answers = leveldata[levelID][1], callback = leveldata[levelID][2];
            checkResponse(el, answers, callback);
          });
          el.addEventListener('click', onClick);
        },
});  

AFRAME.registerComponent('cast-shadow', {
        schema: {
          color: {default: '#666'},
          width: {default: 256},
          height: {default: 256},
        },
        init: function () {
          var data = this.data;
          var el = this.el;
          var canvas = generateTexture(data.width,data.height, data.color);
          var texture = new THREE.CanvasTexture(canvas);
          texture.wrapS = THREE.ClampToEdgeWrapping;
	  texture.wrapT = THREE.ClampToEdgeWrapping;
          var geometry = new THREE.PlaneBufferGeometry(data.width,data.height, 1, 1);
          var mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({map: texture, transparent: true}));
          this.el.setObject3D('meshshadow_'+Math.random(), mesh); 
        }
}); 

window.onload = function(){
    scene = document.querySelector('a-scene');
    if (scene.hasLoaded) {
      run();
    } else {
      scene.addEventListener('loaded', run);
    }
};

function getWords(){
    words = leveldata[levelID][0].split(' ');
    var pos = leveldata[levelID][5].split(' ');
    var rot = leveldata[levelID][6].split(' ');
    var worldOffsetX = parseInt(pos[0]);
    var x = parseInt(pos[0]), y = parseInt(pos[1]), z=parseInt(pos[2]), width = 1, w;
    for(w in words){
        var width = getTextWidth(words[w], 1)//100;
        if (words[w] == '*'){
             x = worldOffsetX;
             y -= 0.8;
             continue;
        };
        x += 0.9;
        var fontname = leveldata[levelID][3],
            wordID = "w-" + w,
            word = factory('a-entity', {
            id: wordID,
            class: "clickable word",
            geometry: "primitive: box; height: 0.2; width: 0.2; depth:0.2",
            "change-color-on-hover": "color: red",
            position: x+" "+ y+" "+z,
            material: "color: black; opacity:1;", 
            scale: "4 4 4",
            text: "font:"+fontname+"; color:white; align:center; height: 1; width: 1; zOffset:0.1; value:" + words[w] + ";",
        })
        word.setAttribute('origin', x+" 10 "+z);
        animshow = factory('a-animation', {id: 'show-'+wordID, begin:'show', easing: 'ease-in', attribute:'position', fill: 'normal', from:x+" 10 "+z, to:x+" "+y+" "+" "+z,repeat:"0"}),
        animselect = factory('a-animation', {id: 'select-'+wordID, begin:'select', easing: 'ease-in', attribute:'position', fill: 'normal', from:x+" "+y+" "+z, to:x+" "+(y)+" 0",repeat:"0"}),
        animfade = factory('a-animation', {id: 'fade-'+wordID, begin:'fade', easing: 'ease-in', dur: 2000, attribute:'opacity', fill: 'normal', from:1, to:0,repeat:0});

        if(leveldata[levelID][1][0] != null){
            word.appendChild(animselect);
        }
        word.appendChild(animshow);
        //word.appendChild(animfade);
        document.querySelector('a-scene').appendChild(word); 
//        document.querySelector('#wordlist').appendChild(word); 
//        document.querySelector('#wordlist').setAttribute('position', leveldata[levelID][5]);
//        document.querySelector('#wordlist').setAttribute('rotation', leveldata[levelID][6]);
        document.querySelector('#show-'+wordID).emit('show');
        animshow.addEventListener('animationend', function () {
        });
        animfade.addEventListener('animationend', function () {
//            console.log("end animation fade", this)//sphere.setAttribute('color', '#88ff99');
            //this.el.parentNode.removeChild(this.el);
        });

    };
};

function getSlots(){
    current_slot = 0;
    var pos = leveldata[levelID][7].split(' ');
    var rot = leveldata[levelID][8].split(' ');
    if (answers[0] != null){
        var xOffsetS = 0;
       for (var i=0; i < answers.length; i++){
                var x = (document.querySelector('[camera]').getAttribute('position').x + (i-(answers.length*0.5)+0.5)),
                y = pos[1],
                z = pos[2],

                obj = factory('a-entity', {
                   id: 'slot-w-'+current_slot,
                   class: "clickable slot entity",
                   geometry: "primitive: box; height: 0.1; width: 1;depth:1;",
                   position: (x + xOffsetS) +" "+(y)+" "+(z),
                   rotation: rot[0] + " " + rot[1] + " " + rot[2],
                   material: "color: grey;",
             });
             xOffsetS += 0.1;
             current_slot += 1;
             document.querySelector('#word-slots').appendChild(obj);
        }
        var x = ((i-(answers.length*0.5)+0.5));
        var del = factory('a-entity', {
                   id: 'slot-delete',
                   class: "clickable slot entity",
                   geometry: "primitive: box; height: 0.5; width: 0.5; depth:0.5;",
                   position: (current_slot +1+ xOffsetS) +" "+y+" "+z,
                   rotation: rot[0] + " " + rot[1] + " " + rot[2],
                   material: "color: red;",
        });
        del.addEventListener('click', function(){
            var el = document.querySelector("#"+slot_data[current_slot-1]);
            if (el == null){current_slot = 0; return};
            var origin = el.getAttribute('origin').split(' ');
            current_slot -= 1; 
            response.pop(current_slot);
            delete slot_data[current_slot];
            el.setAttribute('position', {x:parseFloat(origin[0]), y:parseFloat(origin[1]), z:parseFloat(origin[2])}); 
            el.addEventListener('click', onClick);
            el.emit('show')
         //   console.log("remove answer", response, el, el.getAttribute('origin'), origin)
            
        });
        var anim = factory('a-animation', {id: 'delete', attribute:'rotation', dur:3000, fill: 'backwards', from:"0 0 0", to:"0 0 "+(Math.PI/2)*180,repeat:"indefinite"});
        del.appendChild(anim);
        //console.log(leveldata[levelID][7])
        document.querySelector('#word-slots').appendChild(del);
    };
    document.querySelector('#word-slots').setAttribute('position', leveldata[levelID][7]);
    document.querySelector('#word-slots').setAttribute('rotation', leveldata[levelID][8]);

    current_slot = 0;
};

function getEntities(){
    var items = leveldata[levelID][4];
    for(var i in items){
        var entities = items[i];
        if (entities==null){return};
        for (var d in entities){
            var entity = entities[d],
            //console.log(i, d, entity) 
            components = [d.split('_')[0]],
            entityObj = factory(entity['typeof'], {
                id: "entityid_"+d.toString(),
                class: "entity "+entity['class'],
                position: entity['position'],
                rotation: entity['rotation'],
                scale: entity['scale'],
            }, components, entity['attrs']);
            document.querySelector('a-scene').appendChild(entityObj); 
        }
    };
};
function run () {
    answers = leveldata[levelID][1];
    clearAll(['word', 'slot', 'ocean', 'person']);
    getSlots();
    getWords();
    getEntities();
};

