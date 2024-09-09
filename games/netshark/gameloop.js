var title_name_top = document.querySelector('#title_name_top');
var title_name_btm = document.querySelector('#title_name_btm');
var title_screen = document.querySelector('#title_screen');
var game_over = document.querySelector('#game_over');
var thanks = document.querySelector('#thank_you');
var prompt = document.querySelector('#prompt');
var alias = document.querySelector('#alias');
var user = document.querySelector('#user');

var today = new Date();
var date = today.getDate();
var month = today.getMonth() + 1;
var year = today.getFullYear();
var hour = today.getHours();
var min = today.getMinutes();
var sec = today.getSeconds();

var current_time = 'login: ' + date + '/' + month + '/' + year + ' @ ' + hour + ':' + min + ':' + sec;
document.querySelector('#login').textContent = current_time;
var loop;

function beginLoop() {
  f_count = 0;
  loop = setInterval(function() {
    if (f_count == 9) {
      if (wave == 1) {
        word1 = new Word('cyberpunk', 31, 3, 'anim4', );
        word2 = new Word('software', 58, 3, 'anim4');
        word3 = new Word('netshark', 45, 3, 'anim4');
        word4 = new Word('offline', 45, 8, 'anim3');
        word5 = new Word('internet', 58, 8, 'anim3');
        word6 = new Word('javascript', 31, 8, 'anim3');
        word7 = new Word('password', 31, 13, 'anim2');
        word8 = new Word('testing', 45, 13, 'anim2');
        word9 = new Word('mountains', 58, 13, 'anim2');
      }
      if (wave == 2) {
        word1 = new Word('scientists', 31, 3, 'anim4');
        word2 = new Word('js13k[games]', 44, 3, 'anim4');
        word3 = new Word('atmosphere', 58, 3, 'anim4');
        word4 = new Word('mathematics', 31, 8, 'anim3');
        word5 = new Word('electricity', 44, 8, 'anim3');
        word6 = new Word('probability', 58, 8, 'anim3');
        word7 = new Word('temperature', 31, 13, 'anim2');
        word8 = new Word('intelligence', 44, 13, 'anim2');
        word9 = new Word('questions', 58, 13, 'anim2');
      }
      else if (wave == 3) {
        word1 = new Word('facetiously', 31, 3, 'anim4');
        word2 = new Word('quintessential', 44, 3, 'anim4');
        word3 = new Word('lateritious', 58, 3, 'anim4');
        word4 = new Word('circumlocution', 31, 8, 'anim3');
        word5 = new Word('discombobulate', 44, 8, 'anim3');
        word6 = new Word('machiavellian', 58, 8, 'anim3');
        word7 = new Word('avant-garde', 31, 13, 'anim2');
        word8 = new Word('infinitesimal', 44, 13, 'anim2');
        word9 = new Word('ubiquitous', 58, 13, 'anim2');
      }
      f_count = 0;
      wave++;
    }
  }, 800);
}

function start() {
  var user_name = alias.value;

  title_name_top.setAttribute('visibility', 'hidden');
  title_name_btm.setAttribute('visibility', 'hidden');
  title_screen.setAttribute('visibility', 'hidden');
  game_over.setAttribute('visibility', 'hidden');
  thank_you.setAttribute('visibility', 'hidden');
  prompt.setAttribute('visibility', 'hidden');
  alias.style.visibility = 'hidden';

  user.textContent = 'alias: ' + user_name;
  restart_prompt = false;
  started = true;

  word1 = new Word('house', 31, 3, 'anim4', );
  word2 = new Word('today', 58, 3, 'anim4');
  word3 = new Word('games', 43, 3, 'anim4');
  word4 = new Word('computer', 43, 8, 'anim3');
  word5 = new Word('water', 58, 8, 'anim3');
  word6 = new Word('films', 31, 8, 'anim3');
  word7 = new Word('artist', 31, 13, 'anim2');
  word8 = new Word('music', 43, 13, 'anim2');
  word9 = new Word('light', 58, 13, 'anim2');

  detection_percent.textContent = '0%';
  detection.setAttribute('width', 0);
  beginLoop();
}

function gameOver() {
  (virus_percent.textContent == '100%') ? thank_you.setAttribute('visibility', 'visible') : game_over.setAttribute('visibility', 'visible');
  title_screen.setAttribute('visibility', 'visible');
  prompt.setAttribute('visibility', 'visible');

  detection_percent.textContent = '0%';
  detection.setAttribute('width', 0);
  detection_amount = 0;

  virus_percent.textContent = '0%';
  virus.setAttribute('width', 0);
  virus_amount = 0;

  restart_prompt = true;
  started = false;
  wave = 1;
}
