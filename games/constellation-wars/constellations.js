/*
Constellations generator
*/

//var constellations = document.getElementById('constellations');



////////////////////////////////////////////////////////////////

//initial points of constellations
var ursa_minorProPoints = 0;
var ursa_minorContraPoints = 0;
var chameleonProPoints = 0;
var chameleonContraPoints = 0;
var columbaProPoints = 0;
var columbaContraPoints = 0;
var ariesProPoints = 0;
var ariesContraPoints = 0;
var cassiopeiaProPoints = 0;
var cassiopeiaContraPoints = 0;

////////////////////////////////////////////////////////////////


var constel = document.querySelector('constellations');

/*
var andromeda = document.createElement('a-entity');


AFRAME.registerComponent('do-something-once-loaded', {
  init: function () {
    console.log('I am ready!');
  }
});

var andromeda = document.createElement('a-entity');
andromeda.setAttribute('do-something-once-loaded', '');

constellations.appendChild(andromeda);*/

/*************************/


/************ URSA MINOR ***************/
var ursa_minor = document.createElement('a-entity');
ursa_minor.setAttribute('id', 'Ursa Minor');

var ursa_minor1 = document.createElement('a-sphere');
ursa_minor1.setAttribute('radius', '0.15');
ursa_minor1.setAttribute('color','#ffffff');
ursa_minor1.setAttribute('position','1 5 -4');
ursa_minor1.setAttribute('id','Ursa Minor1');

var ursa_minor2 = document.createElement('a-sphere');
ursa_minor2.setAttribute('radius', '0.15');
ursa_minor2.setAttribute('color',ursa_minor1.getAttribute("color"));
ursa_minor2.setAttribute('position','1 6 -4');
ursa_minor2.setAttribute('id','Ursa Minor2');

var ursa_minor3 = document.createElement('a-sphere');
ursa_minor3.setAttribute('radius', '0.15');
ursa_minor3.setAttribute('color',ursa_minor1.getAttribute("color"));
ursa_minor3.setAttribute('position','0 6 -4');
ursa_minor3.setAttribute('id','Ursa Minor3');

var ursa_minor4 = document.createElement('a-sphere');
ursa_minor4.setAttribute('radius', '0.15');
ursa_minor4.setAttribute('color',ursa_minor1.getAttribute("color"));
ursa_minor4.setAttribute('position','0 5 -4');
ursa_minor4.setAttribute('id','Ursa Minor4');

var ursa_minor5 = document.createElement('a-sphere');
ursa_minor5.setAttribute('radius', '0.15');
ursa_minor5.setAttribute('color',ursa_minor1.getAttribute("color"));
ursa_minor5.setAttribute('position','2.5 7 -4');
ursa_minor5.setAttribute('id','Ursa Minor5');

var ursa_minor6 = document.createElement('a-sphere');
ursa_minor6.setAttribute('radius', '0.15');
ursa_minor6.setAttribute('color',ursa_minor1.getAttribute("color"));
ursa_minor6.setAttribute('position','3.1 8.8 -4.48');
ursa_minor6.setAttribute('id','Ursa Minor6');

var ursa_minor7 = document.createElement('a-sphere');
ursa_minor7.setAttribute('radius', '0.15');
ursa_minor7.setAttribute('color',ursa_minor1.getAttribute("color"));
ursa_minor7.setAttribute('position','4 10 -4');
ursa_minor7.setAttribute('id','Ursa Minor7');

ursa_minor.appendChild(ursa_minor1);
ursa_minor.appendChild(ursa_minor2);
ursa_minor.appendChild(ursa_minor3);
ursa_minor.appendChild(ursa_minor4);
ursa_minor.appendChild(ursa_minor5);
ursa_minor.appendChild(ursa_minor6);
ursa_minor.appendChild(ursa_minor7);

var ursa_minor_gl = document.createElement('a-entity');
var ursa_m_gl1 = document.createElement('a-sphere');
ursa_m_gl1.setAttribute('radius', '1');
ursa_m_gl1.setAttribute('color','#ffd700');
ursa_m_gl1.setAttribute('position','0.5 5.56 -3.8');
ursa_m_gl1.setAttribute('transparent','true');
ursa_m_gl1.setAttribute('opacity','0.35');

var ursa_m_gl2 = document.createElement('a-sphere');
ursa_m_gl2.setAttribute('radius', '0.6');
ursa_m_gl2.setAttribute('color',ursa_m_gl1.getAttribute("color"));
ursa_m_gl2.setAttribute('position','2.5 7.4 -4');
ursa_m_gl2.setAttribute('transparent','true');
ursa_m_gl2.setAttribute('opacity','0.35');

var ursa_m_gl3 = document.createElement('a-sphere');
ursa_m_gl3.setAttribute('radius', '1');
ursa_m_gl3.setAttribute('color',ursa_m_gl1.getAttribute("color"));
ursa_m_gl3.setAttribute('position','3.6 9.48 -4');
ursa_m_gl3.setAttribute('transparent','true');
ursa_m_gl3.setAttribute('opacity','0.35');


ursa_minor_gl.appendChild(ursa_m_gl1);
ursa_minor_gl.appendChild(ursa_m_gl2);
ursa_minor_gl.appendChild(ursa_m_gl3);
ursa_minor.appendChild(ursa_minor_gl);

ursa_minor_gl.setAttribute('visible', false);

ursa_minor.addEventListener('mouseenter', function(e) {
  document.getElementById('constellationName').setAttribute('value', "Ursa \nMinor");
  ursa_minor_gl.setAttribute('visible', true);
  showConstellationPoints(ursa_minorProPoints,ursa_minorContraPoints);
})
ursa_minor.addEventListener('mouseleave', function(e) {
  document.getElementById('constellationName').setAttribute('value', "");
  ursa_minor_gl.setAttribute('visible', false);
  hideConstellationPoints();
})

constellations.appendChild(ursa_minor);

/********     CASSIOPEIA    ********/

var cassiopeia = document.createElement('a-entity');
cassiopeia.setAttribute('id', 'cassiopeia');

var cassiopeia1 = document.createElement('a-sphere');
cassiopeia1.setAttribute('radius', '0.15');
cassiopeia1.setAttribute('color','#ffffff');
cassiopeia1.setAttribute('position','11 13 -5');
cassiopeia1.setAttribute('id','cassiopeia1');

var cassiopeia2 = document.createElement('a-sphere');
cassiopeia2.setAttribute('radius', '0.15');
cassiopeia2.setAttribute('color',cassiopeia1.getAttribute("color"));
cassiopeia2.setAttribute('position','11 11 -5');
cassiopeia2.setAttribute('id','cassiopeia2');

var cassiopeia3 = document.createElement('a-sphere');
cassiopeia3.setAttribute('radius', '0.15');
cassiopeia3.setAttribute('color',cassiopeia1.getAttribute("color"));
cassiopeia3.setAttribute('position','11.88 10 -8');
cassiopeia3.setAttribute('id','cassiopeia3');

var cassiopeia4 = document.createElement('a-sphere');
cassiopeia4.setAttribute('radius', '0.15');
cassiopeia4.setAttribute('color',cassiopeia1.getAttribute("color"));
cassiopeia4.setAttribute('position','10.3 8 -8.3');
cassiopeia4.setAttribute('id','cassiopeia4');

var cassiopeia5 = document.createElement('a-sphere');
cassiopeia5.setAttribute('radius', '0.15');
cassiopeia5.setAttribute('color',cassiopeia1.getAttribute("color"));
cassiopeia5.setAttribute('position','10 8.27 -9.9');
cassiopeia5.setAttribute('id','cassiopeia5');

cassiopeia.appendChild(cassiopeia1);
cassiopeia.appendChild(cassiopeia2);
cassiopeia.appendChild(cassiopeia3);
cassiopeia.appendChild(cassiopeia4);
cassiopeia.appendChild(cassiopeia5);

var cassiopeia_gl = document.createElement('a-entity');
var cassiopeia_gl1 = document.createElement('a-sphere');
cassiopeia_gl1.setAttribute('radius', '1');
cassiopeia_gl1.setAttribute('color','#ffd700');
cassiopeia_gl1.setAttribute('position','11 13 -5');
cassiopeia_gl1.setAttribute('transparent','true');
cassiopeia_gl1.setAttribute('opacity','0.35');

var cassiopeia_gl2 = document.createElement('a-sphere');
cassiopeia_gl2.setAttribute('radius', '0.6');
cassiopeia_gl2.setAttribute('color',cassiopeia_gl1.getAttribute("color"));
cassiopeia_gl2.setAttribute('position','11 11 -5');
cassiopeia_gl2.setAttribute('transparent','true');
cassiopeia_gl2.setAttribute('opacity','0.35');

var cassiopeia_gl3 = document.createElement('a-sphere');
cassiopeia_gl3.setAttribute('radius', '1');
cassiopeia_gl3.setAttribute('color',cassiopeia_gl1.getAttribute("color"));
cassiopeia_gl3.setAttribute('position','11.88 10 -8');
cassiopeia_gl3.setAttribute('transparent','true');
cassiopeia_gl3.setAttribute('opacity','0.35');

var cassiopeia_gl4 = document.createElement('a-sphere');
cassiopeia_gl4.setAttribute('radius', '1');
cassiopeia_gl4.setAttribute('color',cassiopeia_gl1.getAttribute("color"));
cassiopeia_gl4.setAttribute('position','10.3 8 -8.3');
cassiopeia_gl4.setAttribute('transparent','true');
cassiopeia_gl4.setAttribute('opacity','0.35');

var cassiopeia_gl5 = document.createElement('a-sphere');
cassiopeia_gl5.setAttribute('radius', '1');
cassiopeia_gl5.setAttribute('color',cassiopeia_gl1.getAttribute("color"));
cassiopeia_gl5.setAttribute('position','10 8.27 -9.9');
cassiopeia_gl5.setAttribute('transparent','true');
cassiopeia_gl5.setAttribute('opacity','0.35');


cassiopeia_gl.appendChild(cassiopeia_gl1);
cassiopeia_gl.appendChild(cassiopeia_gl2);
cassiopeia_gl.appendChild(cassiopeia_gl3);
cassiopeia_gl.appendChild(cassiopeia_gl4);
cassiopeia_gl.appendChild(cassiopeia_gl5);
cassiopeia.appendChild(cassiopeia_gl);

cassiopeia_gl.setAttribute('visible', false);

cassiopeia.addEventListener('mouseenter', function(e) {
  document.getElementById('constellationName').setAttribute('value', "Cassiopeia");
  cassiopeia_gl.setAttribute('visible', true);
  showConstellationPoints(cassiopeiaProPoints,cassiopeiaContraPoints);
})
cassiopeia.addEventListener('mouseleave', function(e) {
  document.getElementById('constellationName').setAttribute('value', "");
  cassiopeia_gl.setAttribute('visible', false);
  hideConstellationPoints();
})

constellations.appendChild(cassiopeia);

/* here I've tried to connect the dots with lines

  //var casiopeiaLine = document.createElement('a-entity');
  //casiopeiaLine.setAttribute("id","casiopeiaLine");
  //casiopeiaLine.setAttribute('line', {'start': "'" cassiopeia1.getAttribute('position').x cassiopeia1.getAttribute('position').y cassiopeia1.getAttribute('position').z  "'" ,'end': "'"cassiopeia2.getAttribute('position').x cassiopeia2.getAttribute('position').y cassiopeia2.getAttribute('position').z "'"});

  // casiopeiaLine.setAttribute('casLine1', {'start': '11 13 -5',
  //                                         'end': '11 11 -5', 
  //                                         'color': cassiopeia2.getAttribute("color")});

  //casiopeiaLine.setAttribute('casLine2', {'start': '11 11 -5',
  //                                         'end': '11.88 10 -8', 
  //                                         'color': cassiopeia2.getAttribute("color")});
  //casiopeiaLine.setAttribute('casLine3', {'start': '11.88 10 -8',
  //                                         'end': '10.3 8 -8.3', 
  //                                         'color': cassiopeia2.getAttribute("color")});
  //casiopeiaLine.setAttribute('casLine4', {'start': '10.3 8 -8.3',
  //                                         'end': '0 8.27 -9.9', 
  //                                         'color': cassiopeia2.getAttribute("color")});

  //casiopeiaLine.setAttribute('start', '11 13 -5');
  //casiopeiaLine.setAttribute('end', '11 11 -5'); 
  //casiopeiaLine.setAttribute('scale', '1'); 
  //casiopeiaLine.setAttribute('color', cassiopeia2.getAttribute("color"));
  //
  //cassiopeia.appendChild(casiopeiaLine);

  //<a-entity line="start: 0 1 0; end: 2 0 -5; color: red"
  //          line__2="start: -2 4 5; end: 0 4 -3; color: green"></a-entity>

*/

/********     ARIES    ********/

var aries = document.createElement('a-entity');
aries.setAttribute('id', 'aries');

var aries1 = document.createElement('a-sphere');
aries1.setAttribute('radius', '0.15');
aries1.setAttribute('color','#ffffff');
aries1.setAttribute('position','11 11 4');
aries1.setAttribute('id','aries1');

var aries2 = document.createElement('a-sphere');
aries2.setAttribute('radius', '0.15');
aries2.setAttribute('color',cassiopeia1.getAttribute("color"));
aries2.setAttribute('position','11 8 4');
aries2.setAttribute('id','aries2');

aries.appendChild(aries1);
aries.appendChild(aries2);

var aries_gl = document.createElement('a-entity');
var aries_gl1 = document.createElement('a-sphere');
aries_gl1.setAttribute('radius', '1');
aries_gl1.setAttribute('color','#ffd700');
aries_gl1.setAttribute('position','11 11 4');
aries_gl1.setAttribute('transparent','true');
aries_gl1.setAttribute('opacity','0.35');

var aries_gl2 = document.createElement('a-sphere');
aries_gl2.setAttribute('radius', '1');
aries_gl2.setAttribute('color',aries_gl1.getAttribute("color"));
aries_gl2.setAttribute('position','11 8 4');
aries_gl2.setAttribute('transparent','true');
aries_gl2.setAttribute('opacity','0.35');

aries_gl.appendChild(aries_gl1);
aries_gl.appendChild(aries_gl2);

aries_gl.setAttribute('visible', false);

aries.addEventListener('mouseenter', function(e) {
  document.getElementById('constellationName').setAttribute('value', "Aries");
  aries_gl.setAttribute('visible', true);
  showConstellationPoints(ariesProPoints,ariesContraPoints);
})
aries.addEventListener('mouseleave', function(e) {
  document.getElementById('constellationName').setAttribute('value', "");
  aries_gl.setAttribute('visible', false);
  hideConstellationPoints();
})

aries.appendChild(aries_gl);
constellations.appendChild(aries);

/********     COLUMBA    ********/

var columba = document.createElement('a-entity');
columba.setAttribute('id', 'columba');

var columba1 = document.createElement('a-sphere');
columba1.setAttribute('radius', '0.15');
columba1.setAttribute('color','#ffffff');
columba1.setAttribute('position','-7.2 2.3 3.1');
columba1.setAttribute('id','columba1');

var columba2 = document.createElement('a-sphere');
columba2.setAttribute('radius', '0.15');
columba2.setAttribute('color',cassiopeia1.getAttribute("color"));
columba2.setAttribute('position','-7.2 3.3 0.8');
columba2.setAttribute('id','columba2');

var columba3 = document.createElement('a-sphere');
columba3.setAttribute('radius', '0.15');
columba3.setAttribute('color',cassiopeia1.getAttribute("color"));
columba3.setAttribute('position','-7.2 3.3 -1.5');
columba3.setAttribute('id','columba3');

var columba4 = document.createElement('a-sphere');
columba4.setAttribute('radius', '0.15');
columba4.setAttribute('color',cassiopeia1.getAttribute("color"));
columba4.setAttribute('position','-7.2 5.2 -4');
columba4.setAttribute('id','columba4');

columba.appendChild(columba1);
columba.appendChild(columba2);
columba.appendChild(columba3);
columba.appendChild(columba4);

var columba_gl = document.createElement('a-entity');
var columba_gl1 = document.createElement('a-sphere');
columba_gl1.setAttribute('radius', '1');
columba_gl1.setAttribute('color','#ffd700');
columba_gl1.setAttribute('position','-7.2 2.3 3.1');
columba_gl1.setAttribute('transparent','true');
columba_gl1.setAttribute('opacity','0.35');

var columba_gl2 = document.createElement('a-sphere');
columba_gl2.setAttribute('radius', '1');
columba_gl2.setAttribute('color',columba_gl1.getAttribute("color"));
columba_gl2.setAttribute('position','-7.2 3.3 0.8');
columba_gl2.setAttribute('transparent','true');
columba_gl2.setAttribute('opacity','0.35');

var columba_gl3 = document.createElement('a-sphere');
columba_gl3.setAttribute('radius', '1');
columba_gl3.setAttribute('color',columba_gl1.getAttribute("color"));
columba_gl3.setAttribute('position','-7.2 3.3 -1.5');
columba_gl3.setAttribute('transparent','true');
columba_gl3.setAttribute('opacity','0.35');

var columba_gl4 = document.createElement('a-sphere');
columba_gl4.setAttribute('radius', '1');
columba_gl4.setAttribute('color',columba_gl1.getAttribute("color"));
columba_gl4.setAttribute('position','-7.2 5.2 -4');
columba_gl4.setAttribute('transparent','true');
columba_gl4.setAttribute('opacity','0.35');

columba_gl.appendChild(columba_gl1);
columba_gl.appendChild(columba_gl2);
columba_gl.appendChild(columba_gl3);
columba_gl.appendChild(columba_gl4);

columba_gl.setAttribute('visible', false);

columba.addEventListener('mouseenter', function(e) {
  document.getElementById('constellationName').setAttribute('value', "Columba");
  columba_gl.setAttribute('visible', true);
  showConstellationPoints(columbaProPoints,columbaContraPoints);
})
columba.addEventListener('mouseleave', function(e) {
  document.getElementById('constellationName').setAttribute('value', "");
  columba_gl.setAttribute('visible', false);
  hideConstellationPoints();
})

columba.appendChild(columba_gl);
constellations.appendChild(columba);


/////////////////////////////////////////
////////// SOUTH PART ///////////////////
/////////////////////////////////////////

/********     CHAMELEON    ********/

var chameleon = document.createElement('a-entity');
chameleon.setAttribute('id', 'chameleon');

var chameleon1 = document.createElement('a-sphere');
chameleon1.setAttribute('radius', '0.15');
chameleon1.setAttribute('color','#ffffff');
chameleon1.setAttribute('position','-7.36 -10.26 -4.5');
chameleon1.setAttribute('id','chameleon1');

var chameleon2 = document.createElement('a-sphere');
chameleon2.setAttribute('radius', '0.15');
chameleon2.setAttribute('color',cassiopeia1.getAttribute("color"));
chameleon2.setAttribute('position','-7.36 -10.26 0');
chameleon2.setAttribute('id','chameleon2');

var chameleon3 = document.createElement('a-sphere');
chameleon3.setAttribute('radius', '0.15');
chameleon3.setAttribute('color',cassiopeia1.getAttribute("color"));
chameleon3.setAttribute('position','-9 -10 -2.8');
chameleon3.setAttribute('id','chameleon3');

var chameleon4 = document.createElement('a-sphere');
chameleon4.setAttribute('radius', '0.15');
chameleon4.setAttribute('color',cassiopeia1.getAttribute("color"));
chameleon4.setAttribute('position','-4 -10 -2.8');
chameleon4.setAttribute('id','chameleon4');

chameleon.appendChild(chameleon1);
chameleon.appendChild(chameleon2);
chameleon.appendChild(chameleon3);
chameleon.appendChild(chameleon4);

var chameleon_gl = document.createElement('a-entity');
var chameleon_gl1 = document.createElement('a-sphere');
chameleon_gl1.setAttribute('radius', '1');
chameleon_gl1.setAttribute('color','#ffd700');
chameleon_gl1.setAttribute('position','-7.36 -10.26 -4.5');
chameleon_gl1.setAttribute('transparent','true');
chameleon_gl1.setAttribute('opacity','0.35');

var chameleon_gl2 = document.createElement('a-sphere');
chameleon_gl2.setAttribute('radius', '1');
chameleon_gl2.setAttribute('color',chameleon_gl1.getAttribute("color"));
chameleon_gl2.setAttribute('position','-7.36 -10.26 0');
chameleon_gl2.setAttribute('transparent','true');
chameleon_gl2.setAttribute('opacity','0.35');

var chameleon_gl3 = document.createElement('a-sphere');
chameleon_gl3.setAttribute('radius', '1');
chameleon_gl3.setAttribute('color',chameleon_gl1.getAttribute("color"));
chameleon_gl3.setAttribute('position','-9 -10 -2.8');
chameleon_gl3.setAttribute('transparent','true');
chameleon_gl3.setAttribute('opacity','0.35');

var chameleon_gl4 = document.createElement('a-sphere');
chameleon_gl4.setAttribute('radius', '1');
chameleon_gl4.setAttribute('color',chameleon_gl1.getAttribute("color"));
chameleon_gl4.setAttribute('position','-4 -10 -2.8');
chameleon_gl4.setAttribute('transparent','true');
chameleon_gl4.setAttribute('opacity','0.35');

chameleon_gl.appendChild(chameleon_gl1);
chameleon_gl.appendChild(chameleon_gl2);
chameleon_gl.appendChild(chameleon_gl3);
chameleon_gl.appendChild(chameleon_gl4);

chameleon_gl.setAttribute('visible', false);

chameleon.addEventListener('mouseenter', function(e) {
  document.getElementById('constellationName').setAttribute('value', "Chameleon");
  chameleon_gl.setAttribute('visible', true);
  showConstellationPoints(chameleonProPoints,chameleonContraPoints);
})
chameleon.addEventListener('mouseleave', function(e) {
  document.getElementById('constellationName').setAttribute('value', "");
  chameleon_gl.setAttribute('visible', false);
  hideConstellationPoints();
})

chameleon.appendChild(chameleon_gl);
constellations.appendChild(chameleon);

// show the current situation on the given constellation

function showConstellationPoints(pro,contra) {
  document.getElementById('proPoints').setAttribute('value', pro);
  document.getElementById('contraPoints').setAttribute('value', contra);
  document.getElementById('constellationPoints').setAttribute('visible',true);
}

function hideConstellationPoints() {
  document.getElementById('constellationPoints').setAttribute('visible',false);
}

