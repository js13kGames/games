var current_upload = document.querySelector('#current_upload');
var upload_message = document.querySelector('#upl');
var packet = document.querySelector('#packet');
var virus_percent = document.querySelector('#percentage_1');
var virus = document.querySelector('#virus');

var detection_percent = document.querySelector('#percentage_2');
var detection = document.querySelector('#detection');
var detection_amount = 0;

var restart_prompt = false;
var virus_amount = 0;
var started = false;

var current_word = null;
var f_count = 0;
var wave = 1;

var word1;
var word2;
var word3;
var word4;
var word5;
var word6;
var word7;
var word8;
var word9;

class Word {
  constructor(word, start_x, start_y, anim) {
    this.word_container = document.createElement('div');
    this.word_container.style.left = start_x + '%';
    this.word_container.style.top = start_y + '%';
    this.first = word.charAt(0).toUpperCase();
    this.word_container.className = anim;
    this.word_container.id = 'word';
    this.y_position = start_y;
    this._letters = [];
    this.letters = [];
    this.word = word;

    for (var i = 0; i < word.length; i++) {
      var letter = document.createElement('p');
      letter.innerHTML = word.charAt(i);
      letter.style.color = '#dfe6e9';
      var el = { letter: letter.innerHTML, element: letter };
      this.letters.push(el);
      this._letters.push(el);
      this.word_container.append(letter);
    }
    this.animFinished(this.word_container, this._letters.length, this.word);
    document.querySelector('#container').append(this.word_container)
  }

  animFinished(container, length, word, removed) {
    container.addEventListener('animationend', function(e) {
      if (e.animationName == 'anim') {
        var inc = ((length / 5) * 2.05);
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

        if ((current_word != null) && (current_word.word == word)) {
          upload_message.style.opacity = '0';
          current_upload.textContent = '';
          packet.style.opacity = '0';
          current_word = null;
        }
        container.name = 'f';
        f_count++;
      }
    });
  }
}

function stopAnim() {
  word1.word_container.className = 'hide';
  word2.word_container.className = 'hide';
  word3.word_container.className = 'hide';
  word4.word_container.className = 'hide';
  word5.word_container.className = 'hide';
  word6.word_container.className = 'hide';
  word7.word_container.className = 'hide';
  word8.word_container.className = 'hide';
  word9.word_container.className = 'hide';
}
