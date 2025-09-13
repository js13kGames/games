// @ts-check


// move cat head
const moveCatHead = (pos) => {
  document.querySelector('#cat-head')?.setAttribute('animation', `property: rotation; to: 0 ${pos * 20} 0; dur: 1000;`);
	window.setTimeout(() => {
		moveCatHead(Math.floor(Math.random() * 3) - 1);
	}, Math.random() * 3000);
};
moveCatHead(1);


// change "life" when cat petted
let level = 1;
const LIGHT_COLOURS = ['white', 'yellow', 'green', 'orange', 'red', 'pink', 'purple', 'blue', 'cyan'];
document.querySelector('#cat')?.addEventListener('click', () => {
	level = level === 9 ? 1 : level + 1;
	const evt = new CustomEvent('levelChange', {
  		detail: {
    		level: level,
  		},
	});
	document.body.dispatchEvent(evt);
});


// update lighting on level change
document.body.addEventListener('levelChange', (evt) => {
	document.querySelector('#light')?.setAttribute('color', LIGHT_COLOURS[evt.detail.level - 1]);
});


// update clock on level change
document.body.addEventListener('levelChange', (evt) => {
	const CLOCK_ANIMATION_DURATION = 500;
	const rotation = (evt.detail.level - 1) * (360 / 9) * -1;
	document.querySelector('#clock-hand')?.setAttribute('animation', `property: rotation; to: 0 90 ${rotation}; dur: ${CLOCK_ANIMATION_DURATION};`);
	// reset once it's gone all the way round
	if (evt.detail.level === 9) {
		window.setTimeout(() => {
			document.querySelector('#clock-hand')?.setAttribute('animation', 'property: rotation; to: 0 90 40; dur: 0');
		}, CLOCK_ANIMATION_DURATION);
	}
});


// poem on the wall
(() => {
  let canvas = /** @type {HTMLCanvasElement} */(document.querySelector('#poem'));
  canvas.width = 512;
  canvas.height = 256;
  let ctx = /** @type CanvasRenderingContext2D */(canvas.getContext('2d'));
  /*
  ctx.fillStyle = '#000'; // black border around outside
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#222';
  ctx.fillRect(2, 2, canvas.width - 4, canvas.height - 4);
  */
  ctx.font = 'italic 26px serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ccc';
  ctx.fillText('Nine lives within these walls reside,', 256, 60);
  ctx.fillText('Nine clues entwined you must unhide.', 256, 110);
  ctx.fillText('With gentle touch, the worlds will weave,', 256, 160);
  ctx.fillText('Each life a gift before you leave.', 256, 210);
})();


// clock face
(() => {
    let canvas = /** @type {HTMLCanvasElement} */(document.querySelector('#clockface'));
    canvas.width = 512;
    canvas.height = 512;
    let ctx = /** @type CanvasRenderingContext2D */(canvas.getContext('2d'));
    ctx.font = '26px serif';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';

    const radius = 220;
    const numerals = ["I","II","III","IV","V","VI","VII","VIII","IX"];
    numerals.forEach((num, index) => {
      const angle = (-90 + index * 40) * Math.PI/180;
      const x = (canvas.width / 2) + radius * Math.cos(angle);
      const y = (canvas.height / 2) + radius * Math.sin(angle);
      ctx.fillText(num, x, y);
    });
})();


// end game message
(() => {
    let canvas = /** @type {HTMLCanvasElement} */(document.querySelector('#end-message-canvas'));
    canvas.width = 512;
    canvas.height = 128;
    let ctx = /** @type CanvasRenderingContext2D */(canvas.getContext('2d'));
    ctx.textAlign = 'center';
    ctx.fillStyle = '#EED';
    ctx.font = '32px serif';
    ctx.fillText('Well done!', 256, 60)
    ctx.font = '24px serif';
    ctx.fillText('You have escaped', 256, 90);
})();


// symbols
const symbols = ["☇","☁","☂","☉","★","☽","⚖","⚕","⚙","⚗","⚑","☋","☌","«","Ω","♠","♣","♥","♦","♪","✿","✦","☗","△","❄","☍"];
(() => {
  let canvas1 = /** @type {HTMLCanvasElement} */(document.querySelector('#page-1'));
  canvas1.width = 128;
  canvas1.height = 196;
  let ctx1 = /** @type CanvasRenderingContext2D */(canvas1.getContext('2d'));
  ctx1.font = '16px serif';
  ctx1.fillStyle = '#222';
  for (let i = 0; i < 7; i ++) {
    const yPos = (i * 24) + 30;
    ctx1.fillText(`${String.fromCharCode(65 + i)} = ${symbols[i]}`, 8, yPos);
    ctx1.fillText(`${String.fromCharCode(65 + i + 7)} = ${symbols[i + 7]}`, 75, yPos);
  }
  let canvas2 = /** @type {HTMLCanvasElement} */(document.querySelector('#page-2'));
  canvas2.width = 128;
  canvas2.height = 196;
  let ctx2 = /** @type CanvasRenderingContext2D */(canvas2.getContext('2d'));
  ctx2.font = '16px serif';
  ctx2.fillStyle = '#222';
  for (let i = 0; i < 6; i ++) {
    const yPos = (i * 24) + 30;
    ctx2.fillText(`${String.fromCharCode(65 + i + 14)} = ${symbols[i + 14]}`, 0, yPos);
    ctx2.fillText(`${String.fromCharCode(65 + i + 14 + 6)} = ${symbols[i + 14 + 6]}`, 67, yPos);
  }
})();


// words/solutions
const words = ['CURIOSITY', 'WHISKERED', 'BEWITCHED', 'ENCHANTED', 'SCRATCHES', 'MOONLIGHT', 'SPELLBOOK', 'PURRINGLY'];
const chosenWordIndex = Math.floor(Math.random() * words.length);
const chosenWord = words[chosenWordIndex];
[...chosenWord].forEach((letter, index) => {

  // create the canvas for each letter clue
  let canvas = /** @type {HTMLCanvasElement} */(document.querySelector(`#letter-clue-${index + 1}`));
  canvas.width = 128;
  canvas.height = 128;
  let ctx = /** @type CanvasRenderingContext2D */(canvas.getContext('2d'));
  ctx.font = '120px serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fff';

  // Show actual letter, or just the symbol?
  let char = letter;
  if (index > 0 && Math.floor(Math.random() * 3) > 0) {
    char = symbols[letter.charCodeAt(0) - 65];
  }
  ctx.fillText(char, 65, 105);

  // asign letters to random locations
  let availableLocations = document.querySelectorAll('.clue:not([data-level])');
  let selectedIndex = Math.floor(Math.random() * availableLocations.length);
  let clue = availableLocations[selectedIndex];
  if (clue.classList.contains('letter-clue')) {
    clue.setAttribute('material', `src: #letter-clue-${index + 1}; shader: flat;`);
  }
  clue.setAttribute('data-level', (index + 1).toString());
  clue.setAttribute('data-letter', letter);
  if (index > 0) {
    clue.setAttribute('visible', 'false');
  }
});

const checkWord = () => {
  let guessedWord = '';
  document.querySelectorAll('.letter-orb').forEach((letterOrb) => {
    guessedWord += String.fromCharCode(parseInt(letterOrb.getAttribute('letter') || '0'));
  });
  if (guessedWord === chosenWord) {
    endGame();
  }
};


const endGame = () => {
  document.querySelector('#door')?.setAttribute('animation', 'property: rotation; from: 0 0 0; to: 0 -45 0; dur: 1000');
  document.querySelector('#end-message')?.setAttribute('visible', 'true');
}


// change visible letter on level change
document.body.addEventListener('levelChange', (evt) => {
  document.querySelectorAll('.clue').forEach((item) => {
    item.setAttribute('visible', 'false');
  });
	document.querySelector(`.clue[data-level="${evt.detail.level}"]`)?.setAttribute('visible', 'true');
});


// Letter orbs
document.querySelectorAll('.letter-orb').forEach((letterOrb, index) => {

  let canvas = /** @type {HTMLCanvasElement} */(document.querySelector(`#letter-orb-${index + 1}`));
  canvas.width = 128;
  canvas.height = 128;
  let ctx = /** @type CanvasRenderingContext2D */(canvas.getContext('2d'));
  ctx.textAlign = 'center';
  
  const renderLetter = (letter) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '26px serif';
    ctx.fillStyle = (letterOrb.getAttribute('direction') === 'up' ? '#fff' : '#999');
    ctx.fillText('▲', 64, 15);
    ctx.fillStyle = (letterOrb.getAttribute('direction') === 'down' ? '#fff' : '#999');
    ctx.fillText('▼', 64, 132);
    ctx.font = '96px serif';
    ctx.fillStyle = '#fff';
    ctx.fillText(letter || 'A', 65, 95);
    if (letter) {
      letterOrb.querySelector('a-plane').getObject3D('mesh').material.map.needsUpdate = true;
    }
  };

  letterOrb.setAttribute('letter', '65');
  renderLetter();

  letterOrb.querySelector('.top')?.addEventListener('click', (evt) => {
    let newCharCode = parseInt(letterOrb.getAttribute('letter') || '64') + 1;
    if (newCharCode === 91) {
      newCharCode = 65;
    }
    letterOrb.setAttribute('letter', newCharCode.toString());
    renderLetter(String.fromCharCode(newCharCode));
    checkWord();
  });
  letterOrb.querySelector('.top')?.addEventListener('mouseenter', (evt) => {
    letterOrb.setAttribute('direction', 'up');
    renderLetter(String.fromCharCode(parseInt(letterOrb.getAttribute('letter') || '64')));
  });
  letterOrb.querySelector('.top')?.addEventListener('mouseleave', (evt) => {
    letterOrb.removeAttribute('direction');
    renderLetter(String.fromCharCode(parseInt(letterOrb.getAttribute('letter') || '64')));
  });
  letterOrb.querySelector('.bottom')?.addEventListener('click', (evt) => {
    let newCharCode = parseInt(letterOrb.getAttribute('letter') || '64') - 1;
    if (newCharCode === 64) {
      newCharCode = 90;
    }
    letterOrb.setAttribute('letter', newCharCode.toString());
    renderLetter(String.fromCharCode(newCharCode));
    checkWord();
  });
  letterOrb.querySelector('.bottom')?.addEventListener('mouseenter', (evt) => {
    letterOrb.setAttribute('direction', 'down');
    renderLetter(String.fromCharCode(parseInt(letterOrb.getAttribute('letter') || '64')));
  });
  letterOrb.querySelector('.bottom')?.addEventListener('mouseleave', (evt) => {
    letterOrb.removeAttribute('direction');
    renderLetter(String.fromCharCode(parseInt(letterOrb.getAttribute('letter') || '64')));
  });


  // animate orbs
  const SPEED = 5000;
  const DISTANCE = 0.2;
  const posZ = (0 - (4 * 0.2)) + (index * DISTANCE);
  const animateOrb = () => {
     letterOrb.setAttribute('animation', `property: position; to: 0 -0.1 ${posZ}; dur: ${SPEED}; easing: linear;`);
      window.setTimeout(() => {
        letterOrb.setAttribute('animation', `property: position; to: 0 0 ${posZ}; dur: ${SPEED}; easing: linear;`);
        window.setTimeout(animateOrb, SPEED);
      }, SPEED);
  };
  window.setTimeout(animateOrb, (SPEED / 9) * index);

});


// drawers
(() => {
  const drawers = document.querySelectorAll('.drawer');
  const closeDrawer = (drawer) => {
    drawer.setAttribute('data-open', 'false');
    drawer.setAttribute('animation', 'property: position; to: 0 0 0; dur: 300;');
  };
  drawers.forEach((drawer, index)=> {
    drawer.querySelectorAll('.clickable').forEach((element) => {
      element.addEventListener('click', () => {
        if (drawer.getAttribute('data-open') === 'true') {
          drawer.setAttribute('data-open', 'false');
          drawer.setAttribute('animation', 'property: position; to: 0 0 0; dur: 700;');
        } else {
          drawer.setAttribute('data-open', 'true');
          drawer.setAttribute('animation', 'property: position; to: 0 0 0.4; dur: 700;');
          // close other drawer
          closeDrawer(drawers[index === 0 ? 1 : 0]);
        }
      });
    });
  });
  // close each time a life is changed
  document.body.addEventListener('levelChange', () => {
    drawers.forEach((drawer) => {
      closeDrawer(drawer);
    });
  });

})();
