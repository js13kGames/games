var myPoints = 10;
var displayPoints = "your current points: " + myPoints;

document.getElementById('chameleon').addEventListener("click", function(e) {
  myPoints = myPoints - 1;
  chameleonProPoints = chameleonProPoints + 1;

  showConstellationPoints(chameleonProPoints,chameleonContraPoints);
  document.getElementById('mypoints').setAttribute('value', "your current points: " + myPoints);
})

document.getElementById('Ursa Minor').addEventListener("click", function(e) {
  myPoints = myPoints - 1;
  ursa_minorProPoints = ursa_minorProPoints + 1;

  showConstellationPoints(ursa_minorProPoints,ursa_minorContraPoints);
  document.getElementById('mypoints').setAttribute('value', "your current points: " + myPoints);
})

document.getElementById('aries').addEventListener("click", function(e) {
  myPoints = myPoints - 1;
  ariesProPoints = ariesProPoints + 1;

  showConstellationPoints(ariesProPoints,ariesContraPoints);
  document.getElementById('mypoints').setAttribute('value', "your current points: " + myPoints);
})

document.getElementById('cassiopeia').addEventListener("click", function(e) {
  myPoints = myPoints - 1;
  cassiopeiaProPoints = cassiopeiaProPoints + 1;

  showConstellationPoints(cassiopeiaProPoints,cassiopeiaContraPoints);
  document.getElementById('mypoints').setAttribute('value', "your current points: " + myPoints);
})

document.getElementById('columba').addEventListener("click", function(e) {
  myPoints = myPoints - 1;
  columbaProPoints = columbaProPoints + 1;

  showConstellationPoints(columbaProPoints,columbaContraPoints);
  document.getElementById('mypoints').setAttribute('value', "your current points: " + myPoints);
})

