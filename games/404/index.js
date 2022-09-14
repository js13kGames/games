import {
  playTone,
  play200sound,
  play404sound,
  playWonTune,
  playLooseTune,
  speak,
} from './sound.js';

const counter404El = document.querySelector('.counter404');
const timerEl = document.querySelector('.timer');
const remainingEl = document.querySelector('.remaining-counter');
const counter200El = document.querySelector('.counter200');
const btn1El = document.querySelector('.btn-1');
const btn2El = document.querySelector('.btn-2');
const btn3El = document.querySelector('.btn-3');
const backdropGoEl = document.querySelector('.backdrop-go');
const goEl = document.querySelector('.btn-go');
const backdropGameOverEl = document.querySelector('.backdrop-game-over');
const resultEl = document.querySelector('.result');
const playAgainEl = document.querySelector('.play-again');
const buttonsEl = [btn1El, btn2El, btn3El];

const INITIAL_TIMER = 3;
const MAX_QUESTIONS = 10;
const TIMER_INTERVAL = 1000;

const initialState = {
  links: [
    'en.wikipedia.org/wiki/Linux',
    'en.wikipedia.org/wiki/Wayland_(display_server_protocol)',
    'developer.mozilla.org/en-US/docs/Web/HTML/Element/button',
    'developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset',
    'freeonlinecasinoq.co/css3-slot-machine.php',
    'www.playcasinoz.co/css3-slot-machine-effect',
    'certbot.eff.org/instructions',
    'keepass.info/help/v1/version.html',
    'letsencrypt.org/docs',
    'keepassxc.org/download',
    'docs.traefik.io/providers/file/',
    'gitlab.touch.abssrv.it/users/sign_in',
    'www.pcmag.com/picks/the-best-free-password-managers',
    'vim.fandom.com/wiki/Undo_and_Redo',
    'babeljs.io/docs/en/babel-cli',
    'docs.mongodb.com/manual/reference/operator/query/all',
    'docs.mongodb.com/manual/reference/operator/aggregation/count',
    'css-tricks.com/snippets/css/complete-guide-grid',
    'create-react-app.dev/docs/adding-typescript',
    'www.elastic.co/guide/en/logstash/current/plugins-filters-aggregate.html',
    'www.motoguzzi.com/en_EN/moto-guzzi-world',
    'github.com/azure/aci-deploy',
    'www.benelli.com/country-selector',
    'www.pcmag.com/reviews/bitwarden',
    'apps.azureiotcentral.com/build',
    'www.youtube.com/c/CafeRacerGarage/videos',
    'material-ui-pickers.dev/api/Calendar',
    'material-ui.com/components/cards',
    'socket.io/docs/client-api',
    'www.w3schools.com/CSS/css_list.asp',
    'www.tutorialspoint.com/gitlab/gitlab_ci_cd_variables.htm',
    'www.npmjs.com/package/history',
    'reactjs.org/docs/hooks-reference.html',
    'dev.to/miangame/how-to-automate-a-deploy-in-a-vps-with-github-actions-via-ssh-101e',
    'www.commitstrip.com/en/2016/08/25/a-very-comprehensive-and-precise-spec',
    'www.11ty.dev/docs/advanced',
    'learning.postman.com/docs/sending-requests/authorization',
    'developers.google.com/maps/documentation/javascript/places-autocomplete',
    'css-tricks.com/bem-101',
    'www.brembo.com/en/bike/replacement/brake-pads',
    'www.brixton-motorcycles.com/models/crossfire-500',
    'www.filamentgroup.com/lab/build-a-blog',
    'todoist.com/productivity-methods/eat-the-frog',
    'www.wildguzzi.com/Picspage/Picsmain.htm',
    'hasura.io/learn/graphql/react-rxdb-offline-first/frontend-setup',
    'blog.panoply.io/couchdb-vs-mongodb',
    'www.mongodb.com/collateral/the-offline-first-approach-to-mobile-app-development',
    'dexie.org/docs/Syncable/Dexie.Syncable.ISyncProtocol',
    'hasura.io/learn/graphql/hasura/authentication/5-test-with-headers',
    ' maps.google.it/maps',
    ' www.skaip.org/headbang-emoticon',
    ' maeda.pm/?s=Books',
    ' github.com/Microsoft/vscode/issues/66486',
    ' www.espruino.com/ide/',
    ' fbedussi.github.io/BangleApps/',
    ' www.espruino.com/Image+Converter',
    ' www.espruino.com/Bangle.js#tutorials',
    ' www.apple.com/ipad/',
  ],
  usedLinks: [],
  interval: undefined,
  btn200: undefined,
  status: 'ready',
  tot200: 0,
  tot404: 0,
  timer: INITIAL_TIMER,
  link200: '',
  link404: '',
  link404bis: '',
  clickedBtn: undefined,
};
let state = {
  ...initialState,
  remaining: Math.min(MAX_QUESTIONS, initialState.links.length),
};
// STATUS
//                 -> 200
// ready -> play /        \ -> play -> over
//               \        /
//                 -> 404
let subscribers = [];

function setState(update) {
  const nextState = {
    ...state,
    ...update,
  };
  // console.log(nextState);
  const oldState = { ...state };
  state = nextState;
  subscribers.forEach(
    ({ key, cb }) =>
      (!key || nextState[key] !== oldState[key]) && cb(nextState, oldState),
  );
}

function subscribe(key, cb) {
  subscribers.push({ key, cb });
}

subscribe('tot404', ({ tot404 }) => {
  counter404El.innerText = tot404;
});
subscribe('tot200', ({ tot200 }) => {
  counter200El.innerText = tot200;
});
subscribe('remaining', ({ remaining }) => {
  remainingEl.innerText = remaining;
});
subscribe('timer', ({ timer }) => {
  if (timer >= 0) {
    timerEl.innerText = timer;
  } else {
    setState({ tot404: state.tot404 + 1 });
    setNextQuestion();
  }
});
subscribe('status', ({ status, btn200, tot200, tot404, links, usedLinks }) => {
  backdropGameOverEl.hidden = status !== 'over';
  backdropGoEl.hidden = status !== 'ready';
  switch (status) {
    case 'ready':
      playTone(600, 100);
      break;
    case 'play':
      setNextQuestion();
      buttonsEl.forEach(btn => {
        btn.classList.remove('r200');
        btn.classList.remove('r404');
      });
      break;
    case '200':
      play200sound();
      clearInterval(state.interval);
      buttonsEl[state.clickedBtn].classList.add('r200');
      setTimeout(() => setState({ status: 'play' }), 1000);
      break;
    case '404':
      play404sound();
      clearInterval(state.interval);
      buttonsEl[state.clickedBtn].classList.add('r404');
      setTimeout(() => setState({ status: 'play' }), 1000);
      break;
    case 'over':
      const won = tot200 > tot404;

      clearInterval(state.interval);
      setState({ timer: INITIAL_TIMER });
      const result = won ? 'You won!' : 'You loose!';
      resultEl.innerText = result;
      speak(result).then(() => {
        if (won) {
          playWonTune();
        } else {
          playLooseTune();
        }
      });

      break;
  }
});

function splitPath(path) {
  return path.replace(/\//g, '/\n');
}

subscribe('link200', ({ link200, link404, link404bis, btn200 }) => {
  buttonsEl.forEach((buttonEl, index) => {
    const text =
      btn200 === index + 1 ? link200 : index < 2 ? link404 : link404bis;
    buttonEl.innerText = splitPath(text);
  });
});

function startTimer() {
  clearInterval(state.interval);
  playTone(440, 100);
  speak(INITIAL_TIMER);

  setState({
    timer: INITIAL_TIMER,
    interval: setInterval(() => {
      const timer = state.timer - 1;
      timer >= 0 && speak(timer);
      setState({ timer });
    }, TIMER_INTERVAL),
  });
}

function getIndex() {
  const index = Math.floor(Math.random() * state.links.length);
  return index;
}

function getRandomChar() {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substr(0, 1);
}

function getPathIndex(path) {
  return Math.round(Math.random() * (path.length - 1));
}

function insertRandomLetter(path) {
  let index = getPathIndex(path);
  let char = path[index];
  while (char === '/') {
    index = getPathIndex(path);
    char = path[index];
  }
  let newChar = getRandomChar();
  while (newChar === char) {
    newChar = getRandomChar();
  }
  return path
    .split('')
    .map((c, i) => (i === index ? newChar : c))
    .join('');
}

function scrambleLetters(path) {
  let index = getPathIndex(path);
  while (path[index] === '/' || !path[index + 1] || path[index + 1] === '/') {
    index = getPathIndex(path);
  }
  return path
    .split('')
    .map((c, i) =>
      i === index ? path[index + 1] : i === index + 1 ? path[index] : c,
    )
    .join('');
}

function deleteLetter(path) {
  let index = getPathIndex(path);
  while (path[index] === '/') {
    index = getPathIndex(path);
  }
  return path
    .split('')
    .map((c, i) => (i === index ? '' : c))
    .join('');
}

function addLetter(path) {
  let index = getPathIndex(path);
  while (path[index] === '/') {
    index = getPathIndex(path);
  }
  return path
    .split('')
    .map((c, i) => (i === index ? c + getRandomChar() : c))
    .join('');
}

function wrongify(link) {
  const [_, domain, path] = link.match(/([^/]+)(.*)/);
  const wrongifyFns = [
    insertRandomLetter,
    scrambleLetters,
    deleteLetter,
    addLetter,
  ];
  const wrongifySelected = Math.round(Math.random() * (wrongifyFns.length - 1));
  const link404 = domain + wrongifyFns[wrongifySelected](path);
  return link404;
}

function setNextQuestion() {
  if (
    state.usedLinks.length === MAX_QUESTIONS ||
    state.usedLinks.length === state.links.length
  ) {
    setState({ status: 'over' });
    return;
  }
  startTimer();

  let nextQuestionIndex = getIndex();
  while (state.usedLinks.includes(nextQuestionIndex)) {
    nextQuestionIndex = getIndex();
  }
  const link200 = state.links[nextQuestionIndex];
  const link404 = wrongify(link200);
  const link404bis = wrongify(link200);
  const usedLinks = state.usedLinks.concat(nextQuestionIndex);
  setState({
    usedLinks,
    btn200: Math.round(Math.random() * buttonsEl.length),
    link200,
    link404,
    link404bis,
    remaining:
      Math.min(MAX_QUESTIONS, initialState.links.length) - usedLinks.length,
  });
}

goEl.addEventListener('click', () => {
  setState({ status: 'play' });
});

buttonsEl.forEach((btn, index) => {
  btn.addEventListener('click', function() {
    if (state.status !== 'play') {
      return;
    }
    const correct = state.btn200 === index + 1;
    setState(
      correct
        ? {
            status: '200',
            tot200: state.tot200 + 1,
            clickedBtn: index,
          }
        : {
            status: '404',
            tot404: state.tot404 + 1,
            clickedBtn: index,
          },
    );
  });
});

playAgainEl.addEventListener('click', () => {
  setState(initialState);
});

timerEl.innerText = INITIAL_TIMER;
