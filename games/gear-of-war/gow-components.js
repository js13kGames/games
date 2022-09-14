AFRAME.registerComponent('checkpoint', {
	schema: {
		opacityEnter: {type: 'number', default: 1},
		opacityLeave: {type: 'number', default: 0.5},
		cameraRigTo: {type: 'vec3', default: {x: 0, y: 0, z: 0}},
		getCover_from_X: {type: 'number', default: 0},
		getCover_to_X: {type: 'number', default: 0},
		getCover_from_Y: {type: 'number', default: 0},
		getCover_to_Y: {type: 'number', default: 0},
		getCover_from_Z: {type: 'number', default: 0},
		getCover_to_Z: {type: 'number', default: 0},
		triggerEnemies: {type: 'string', default: ''},
		removeEntity: {type: 'selector', default: ''},
		makeInvisible: {type: 'selector', default: ''},
		prevCP_1: {type: 'selector', default: ''},
		prevCP_2: {type: 'selector', default: ''},
		nextCP_1: {type: 'selector', default: ''},
		nextCP_2: {type: 'selector', default: ''},
		powerOff: {type: 'boolean', default: false}
	},
	
	init: function () {
		var el = this.el;
		var data = this.data;
		var pointer = document.querySelector('#pointer');
		var cameraRig = document.querySelector('#camera-rig');
		var playerBody = document.querySelector('#player-body');
		var offline = document.querySelector('#offline');
		var hovering = false;
		
		el.addEventListener('mouseenter', function () {
			// Prevent shooting bullets at checkpoints on triggerdown
			pointer.emit('hovering');
			hovering = true;
			el.setAttribute('material', 'opacity', data.opacityEnter);
		});
		
		document.body.addEventListener('triggerdown', function () {
			// Interacting with checkpoints
			if (hovering) {
				cameraRig.setAttribute('position', data.cameraRigTo);
				playerBody.setAttribute('position', data.cameraRigTo);
				playerBody.object3D.position.y = 1.4;
				
				// Setting cover values at selected checkpoint
				pointer.setAttribute('get-cover', {
					from_X: data.getCover_from_X,
					to_X: data.getCover_to_X,
					from_Y: data.getCover_from_Y,
					to_Y: data.getCover_to_Y,
					from_Z: data.getCover_from_Z,
					to_Z: data.getCover_to_Z
				});
				
				// Activating enemy fire when moving to specific checkpoints
				if (data.triggerEnemies) {
					var enemyGroup = document.querySelectorAll(data.triggerEnemies);
					for (var i = 0; i < enemyGroup.length; i++) {
						enemyGroup[i].setAttribute('shooter', '');
					}
				}
				
				// Removing any specific entity
				if (data.removeEntity) {
					var entityToRemove = data.removeEntity;	
					entityToRemove.parentNode.removeChild(entityToRemove);
				}
				
				// Moving all checkpoints up to avoid possible intersections
				// (or the player might accidentally move through walls)
				var chechpoints = document.querySelectorAll('[checkpoint]');
				for (var i = 0; i < chechpoints.length; i++) {
					chechpoints[i].object3D.position.y = 1000;
				}
				// Making a checkpoint invisible after moving to its destination
				if (data.makeInvisible) {
					data.makeInvisible.object3D.position.y = 1000;
					// Custom event to disable trackpad down during info ar start
					playerBody.emit('started');
				} else {
					playerBody.emit('started');
				}
				
				// Making only the next and the previous checkpoints available
				if (data.prevCP_1) {
					data.prevCP_1.object3D.position.y = 1.6;
				}
				if (data.prevCP_2) {
					data.prevCP_2.object3D.position.y = 1.6;
				}
				if (data.nextCP_1) {
					if (data.nextCP_1 === offline) {
						data.nextCP_1.object3D.position.y = -0.06;
					} else {
						data.nextCP_1.object3D.position.y = 1.6;
					}
				}
				if (data.nextCP_2) {
					data.nextCP_2.object3D.position.y = 1.6;
				}
				
				// Triggering end of the game
				if (data.powerOff) {
					offline.emit('endgame');
				}
			}
			
		});
		
		// Re-enabling shooting on triggerdown
		el.addEventListener('mouseleave', function () {
			pointer.emit('leaving');
			hovering = false;
			el.setAttribute('material', 'opacity', data.opacityLeave);
		});
	}
});

AFRAME.registerComponent('get-cover', {
	schema: {
		from_X: {type: 'number', default: 0},
		to_X: {type: 'number', default: 0},
		from_Y: {type: 'number', default: 0},
		to_Y: {type: 'number', default: 0},
		from_Z: {type: 'number', default: 0},
		to_Z: {type: 'number', default: 0}
	},
	
	update: function () {
		var el = this.el;
		var data = this.data;
		var cameraRig = document.querySelector('#camera-rig');
		var playerBody = document.querySelector('#player-body');
		var gameStarted = false;
		
		
		// Allowing or preventing cover depending on player's health
		playerBody.addEventListener('started', function () {
			gameStarted = true;
		});
		playerBody.addEventListener('gameover', function () {
			gameStarted = false;
		});
		el.addEventListener('trackpaddown', function () {
			if (gameStarted) {
				cameraRig.object3D.position.x = data.to_X;
				cameraRig.object3D.position.y = data.to_Y;
				cameraRig.object3D.position.z = data.to_Z;
				playerBody.object3D.position.x = data.to_X;
				playerBody.object3D.position.y = data.to_Y + 1.4;
				playerBody.object3D.position.z = data.to_Z;
			}
		});
		el.addEventListener('trackpadup', function () {
			if (gameStarted) {
				cameraRig.object3D.position.x = data.from_X;
				cameraRig.object3D.position.y = data.from_Y;
				cameraRig.object3D.position.z = data.from_Z;
				playerBody.object3D.position.x = data.from_X;
				playerBody.object3D.position.y = data.from_Y + 1.4;
				playerBody.object3D.position.z = data.from_Z;
			}
		});
	}
});

AFRAME.registerComponent('click-to-shoot', {
	init: function () {
		var el = this.el;
		var data = this.data;
		var hovering = false;
		
		// Checking if player is selecting a checkpoint
		el.addEventListener('hovering', function () {
			hovering = true;
		});
		el.addEventListener('leaving', function () {
			hovering = false;
		});
		
		// Shooting only if player is not selecting a checkpoint
		document.body.addEventListener('triggerdown', function () {
			if (hovering === false) {
				el.emit('shoot');
			}
		});
	}
});

AFRAME.registerComponent('firing-enemy', {
	schema: {
		enemyID: {type: 'selector', default: ''},
		firing: {type: 'boolean', default: true}
	},
	
	update: function () {
		var el = this.el;
		var data = this.data;
		var firingEnemyAlive = data.firing;
		
		// Programmatically creating firing enemies
		function enemyFire() {
			if (firingEnemyAlive) {
				el.emit('shoot');
			}
		}
		(function loop() {
			var enemyFireRate = Math.round(Math.random() * 2000) + 100;
			// console.log(rand);
			setTimeout(function() {
				enemyFire();
				loop();  
			}, enemyFireRate);
		}());
		
		// Making enemies stop shooting after dying
		data.enemyID.addEventListener('die', function () {
			firingEnemyAlive = false;
		});
	}
});

AFRAME.registerComponent('hit-handler', {
	dependencies: ['material'],
	
	schema: {
		colorAlive: {type: 'color', default: '#999999'},
		colorDead: {type: 'color', default: '#FF0000'},
		colorAddScalar: {type: 'number', default: 0.04},
		isCover: {type: 'boolean', default: false},
		isHealth: {type: 'boolean', default: false}
	},

	init: function () {
		var color;
		var el = this.el;
		var data = this.data;
		var firingEnemyAlive = true;
		var elID = '#' + el.getAttribute('id');
		var gun = document.querySelector(elID + '-gun-wrapper');
		var playerBody = document.querySelector('#player-body')
		
		// Customizing the aframe-super-shooter-kit created by @feiss
		color = new THREE.Color();
		color.set(data.colorAlive);
		el.components.material.material.color.copy(color);
		el.addEventListener('hit', function () {
			color.addScalar(data.colorAddScalar);
			el.components.material.material.color.copy(color);
		});
		el.addEventListener('die', function () {
			color.set(data.colorDead);
			el.components.material.material.color.copy(color);
			// Customizing dying enemies
			if (firingEnemyAlive) {
				setTimeout(function () {
					el.object3D.visible = false;
					if (data.isCover === false && data.isHealth === false) {
						gun.object3D.visible = false;
					}
				}, 1500);
			}
			// Setting the enemy state to stop firing
			firingEnemyAlive = false;
			
			// Using health kits
			if (data.isHealth) {
				playerBody.emit('healing');
				el.object3D.visible = false;
			}
		});
	}
});

AFRAME.registerComponent('gore-fx', {
	init: function () {
		var el = this.el;
		var gore = document.querySelector('#gore');
		var scene = document.querySelector('a-scene');
		var pointer = document.querySelector('#pointer');
		var cameraRig = document.querySelector('#camera-rig');
		var playerBody = document.querySelector('#player-body');
		var damage = 0;

		el.addEventListener('hit', function () {
			var currentGoreFX = gore.getAttribute('material').opacity;
			// Displaying gore visual FX and increasing damage
			if (damage < 10) {
				gore.setAttribute('material', 'opacity', currentGoreFX + 0.05);
				damage += 1;
			} else if (damage >= 10) {
				playerBody.emit('gameover');
				pointer.emit('hovering');
				pointer.setAttribute('get-cover', {
					from_X: 0,
					to_X: 0,
					from_Y: 5000,
					to_Y: 5000
				});
				// Moving camera to game over area
				cameraRig.object3D.position.set(0, 5000, 0);
				// Remove blood
				gore.setAttribute('material', 'opacity', 0);
				// Exiting VR mode automatically to reload the scene
				setTimeout(function () {
					scene.exitVR();
				}, 13000);
			}
		});
		
		// Resetting player's health
		el.addEventListener('healing', function () {
			gore.setAttribute('material', 'opacity', 0);
			damage = 0;
		});
	}
});

AFRAME.registerComponent('reload', {
	init: function () {
		var scene = document.querySelector('a-scene');
		// Reloading the scene to reset all the entities
		scene.addEventListener('exit-vr', function () {
			location.reload();
		});
	}
});

AFRAME.registerComponent('server-details', {
	schema: {
		zOffset: {type: 'number', default: 0.51},
		yOffset: {type: 'number', default: -0.6},
		num: {type: 'number', default: 8},
		width: {type: 'number', default: 0.6},
		height: {type: 'number', default: 0.125},
		gap: {type: 'number', default: 0.2},
		rackColor: {type: 'color', default: '#999999'}
	},
	
	init: function () {
		var el = this.el;
		var data = this.data;
		
		// Programmatically creating details for lowpoly servers 
		for (var i = 0; i < data.num; i++) {
			var rack = document.createElement('a-entity');
			rack.setAttribute('geometry', {
				primitive: 'plane',
				width: data.width,
				height: data.height
			});
			rack.setAttribute('position', {
				x: 0,
				y: data.yOffset + i * data.gap,
				z: data.zOffset
			});
			rack.setAttribute('material', 'color', data.rackColor);
			el.appendChild(rack);
		}
	}
});

AFRAME.registerComponent('end-game', {
	schema: {
		zOffset: {type: 'number', default: 0.51},
		title: {type: 'string', default: ''},
		message: {type: 'string', default: ''}
	},
	
	init: function () {
		var el = this.el;
		var data = this.data;
		var screenTitle = document.querySelector('#screen-title');
		var screenMessage = document.querySelector('#screen-message');
		
		// Displaying congratulations, credits, and special thanks
		el.addEventListener('endgame', function () {
			screenTitle.setAttribute('material', 'color', '#AA0000');
			screenTitle.setAttribute('text', 'color', '#FFFFFF');
			screenTitle.setAttribute('text', 'value', data.title);
			screenMessage.setAttribute('text', 'color', '#FFFFFF');
			screenMessage.setAttribute('text', 'value', data.message);
		});
	}
});