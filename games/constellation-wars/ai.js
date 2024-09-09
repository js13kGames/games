var enemyPoints = 0;

var targets = [ursa_minorProPoints/ursa_minorContraPoints, chameleonProPoints/chameleonContraPoints, columbaProPoints/columbaContraPoints, ariesProPoints/ariesContraPoints, cassiopeiaProPoints/cassiopeiaContraPoints];
var bestTarget = targets.length - 1;


function selectTarget(argument) {
	for (var i = targets.length - 2; i >= 0; i--) {
		if (targets[i] < targets[bestTarget])
			bestTarget = i;
	}
}

function attack(target) {
	enemyPoints = enemyPoints -1;
	switch(target){
		case 0:
			ursa_minorContraPoints = ursa_minorContraPoints + 1;
			break;
		case 1:
			chameleonContraPoints = chameleonContraPoints + 1
			break;
		case 2: 
			columbaContraPoints = columbaContraPoints +1;
			break;
		case 3:
			ariesContraPoints = ariesContraPoints + 1;
			break;
		case 4:
			cassiopeiaContraPoints = cassiopeiaContraPoints +1;
	}
}

