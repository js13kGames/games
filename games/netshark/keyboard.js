class Key {
  constructor(key_character, x, y) {
    this.container = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.button = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    this.character = document.createElementNS('http://www.w3.org/2000/svg', 'text');

    this.container.setAttributeNS(null, 'transform', 'translate(' + x + ',' + y + ') scale(0.9)');
    this.container.append(this.button);
    this.container.append(this.character);

    this.button.setAttributeNS(null, 'stroke', '#eb3b5a');
    this.button.setAttributeNS(null, 'stroke-width', 3);
    this.button.setAttributeNS(null, 'fill', 'none');
    this.button.setAttributeNS(null, 'height', 50);
    this.button.setAttributeNS(null, 'width', 50);
    this.button.setAttributeNS(null, 'x', 300);
    this.button.setAttributeNS(null, 'y', 300);
    this.button.setAttributeNS(null, 'rx', 6);
    this.button.setAttributeNS(null, 'ry', 6);

    this.character.setAttributeNS(null, 'font-size', '1.7em');
    this.character.setAttributeNS(null, 'fill', '#eb3b5a');
    this.character.setAttributeNS(null, 'x', 312);
    this.character.setAttributeNS(null, 'y', 335);
    this.character.textContent = key_character;

    document.querySelector('#keyboard').append(this.container);
  }
}

window.addEventListener('keydown', function(e) {
  if (started) {
    try {
      key_value[e.keyCode].button.setAttributeNS(null, 'fill', '#eb3b5a');
      var ch = key_value[e.keyCode].character.textContent;

      if (current_word == null) {
        switch (ch) {
          case (word1.first):
            current_word = (word1.word_container.name == 'f') ? null : word1;
            break;
          case (word2.first):
            current_word = (word2.word_container.name == 'f') ? null : word2;
            break;
          case (word3.first):
            current_word = (word3.word_container.name == 'f') ? null : word3;
            break;
          case (word4.first):
            current_word = (word4.word_container.name == 'f') ? null : word4;
            break;
          case (word5.first):
            current_word = (word5.word_container.name == 'f') ? null : word5;
            break;
          case (word6.first):
            current_word = (word6.word_container.name == 'f') ? null : word6;
            break;
          case (word7.first):
            current_word = (word7.word_container.name == 'f') ? null : word7;
            break;
          case (word8.first):
            current_word = (word8.word_container.name == 'f') ? null : word8;
            break;
          case (word9.first):
            current_word = (word9.word_container.name == 'f') ? null : word9;
            break;
        }
        current_upload.textContent = ('packet: ' + current_word.word);
        upload_message.style.opacity = '1';
        packet.style.opacity = '1';
      }

      if (current_word != null) {
        var next = current_word.letters[0];
        if (next.letter == ch.toLowerCase()) {
          next.element.className = 'popAnimation';
          next.element.style.color = '#fff200';
          current_word.letters.shift();
          if (current_word.letters.length == 0) {
            setTimeout(function() {
              try {
                current_word.word_container.style.visibility = 'hidden';
                current_word.word_container.className = '';
                current_word.word_container.name = 'f';

                var inc = ((current_word._letters.length / 2.2) * 2.05);
                var percent = (virus_amount += inc).toFixed(1);
                var width = (virus_amount * 2.05).toFixed(1);

                percent = (virus_amount >= 100) ? 100 : percent;
                width = (virus_amount >= 100) ? 205 : width;

                virus_percent.textContent = (percent + '%');
                virus.setAttribute('width', width);

                if (width == 205) {
                  clearInterval(loop);
                  stopAnim();
                  gameOver();
                }

                upload_message.style.opacity = '0';
                current_upload.textContent = '';
                packet.style.opacity = '0';
                current_word = null;
                f_count++;
              }
              catch (error) {
                console.log('did not catch it in time.');
              }
            }, 300);
          }
        }
        else {
          resetWord();
        }
      }
    } catch (error) {}
  }
  else {
    if (restart_prompt) {
      if (e.keyCode == 13) {
        start();
      }
    }
  }
});

window.addEventListener('keyup', function(e) {
  try {
    key_value[e.keyCode].button.setAttributeNS(null, 'fill', 'none');
  } catch (error) {}
});

function resetWord() {
  var nodes = current_word.word_container.children;
  for (var i = 0; i < nodes.length; i++) {
    nodes[i].style.color = '#dfe6e9';
    nodes[i].className = 'reset';
  }
  while (current_word.letters.length != 0) {
    current_word.letters.pop();
  }
  for (var i = 0; i < current_word._letters.length; i++) {
    current_word.letters.push(current_word._letters[i]);
  }
  setTimeout(function() {
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].className = '';
    }
  }, 600);

  var inc = (1.15 * 2.05);
  var percent = (detection_amount += inc).toFixed(1);
  var width = (detection_amount * 2.05).toFixed(1);

  percent = (detection_amount >= 100) ? 100 : percent;
  width = (detection_amount >= 100) ? 205 : width;

  detection_percent.textContent = (percent + '%');
  detection.setAttribute('width', width);

  if (width == 205) {
    clearInterval(loop);
    stopAnim();
    gameOver();
  }

  upload_message.style.opacity = '0';
  current_upload.textContent = '';
  packet.style.opacity = '0';
  current_word = null;
}

var key_value = {
  49: new Key('1', -126, 97),
  50: new Key('2', -71, 97),
  51: new Key('3', -16, 97),
  52: new Key('4', 39, 97),
  53: new Key('5', 94, 97),
  54: new Key('6', 149, 97),
  55: new Key('7', 204, 97),
  56: new Key('8', 259, 97),
  57: new Key('9', 314, 97),
  48: new Key('0', 369, 97),
  189: new Key('-', 424, 97),
  187: new Key('=', 479, 97),

  81: new Key('Q', -100, 150),
  87: new Key('W', -45, 150),
  69: new Key('E', 10, 150),
  82: new Key('R', 65, 150),
  84: new Key('T', 120, 150),
  89: new Key('Y', 175, 150),
  85: new Key('U', 230, 150),
  73: new Key('I', 285, 150),
  79: new Key('O', 340, 150),
  80: new Key('P', 395, 150),
  219: new Key('[', 450, 150),
  221: new Key(']', 505, 150),

  65: new Key('A', -80, 204),
  83: new Key('S', -25, 204),
  68: new Key('D', 30, 204),
  70: new Key('F', 85, 204),
  71: new Key('G', 140, 204),
  72: new Key('H', 195, 204),
  74: new Key('J', 250, 204),
  75: new Key('K', 305, 204),
  76: new Key('L', 360, 204),
  186: new Key(';', 415, 204),
  222: new Key('"', 470, 204),

  90: new Key('Z', -50, 258),
  88: new Key('X', 5, 258),
  67: new Key('C', 60, 258),
  86: new Key('V', 115, 258),
  66: new Key('B', 170, 258),
  78: new Key('N', 225, 258),
  77: new Key('M', 280, 258),
  188: new Key('<', 335, 258),
  190: new Key('>', 390, 258),
  191: new Key('?', 445, 258)
}
