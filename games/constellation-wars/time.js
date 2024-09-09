setInterval(function () {
    
    selectTarget();
    attack(bestTarget);

    enemyPoints = enemyPoints +1;
    myPoints = myPoints + 1;

    winner();

}, 1000);


function winner() {
	if (ursa_minorProPoints >= 10 && chameleonProPoints >= 10 && columbaProPoints >= 10 && ariesProPoints >= 10 && cassiopeiaProPoints >= 10) {
		document.getElementById('constellationName').setAttribute('value', "You have won!");
	}

	if (ursa_minorContraPoints >= 10 && chameleonContraPoints >= 10 && columbaContraPoints >= 10 && ariesContraPoints >= 10 && cassiopeiaContraPoints >= 10) {
		document.getElementById('constellationName').setAttribute('value', "You have won!");
	}
}
