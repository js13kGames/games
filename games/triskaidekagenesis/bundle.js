(() => {
  // src/prog.ts
  var soundOn = true;
  function noOuter(s) {
    return s[0] == "(" ? s.substring(1, s.length - 1) : s;
  }
  var ops = {
    "+": (a, b) => Number(a) + Number(b),
    "*": (a, b) => a * b,
    "-": (a, b) => a - b,
    "/": (a, b) => {
      let res = a / b;
      return res % 1 ? null : res;
    }
  };
  var solutions = {};
  function solve(a, solutions2) {
    let s = a.join(",");
    if (a.length == 1) {
      return { [a[0]]: `${a[0]}` };
    }
    if (solutions2[s] != null)
      return solutions2[s];
    let results = {};
    function addResult(r, f) {
      if (isFinite(r) && !isNaN(r) && r != null && results[r] == null && r >= 0 && r <= 100) {
        results[r] = f;
      }
    }
    addResult(a.reduce((x, y) => x + y, 0), `(${a.join("+")})`);
    addResult(a.reduce((x, y) => x * y, 1), `(${a.join("*")})`);
    for (let n = 1; n < 2 ** a.length - 1; n++) {
      let left = [], right = [];
      for (let i = 0; i < a.length; i++) {
        if (n & 2 ** i)
          right.push(a[i]);
        else
          left.push(a[i]);
      }
      let sl = solve(left, solutions2), sr = solve(right, solutions2);
      for (let lk in sl)
        addResult(Number(lk), sl[lk]);
      for (let rk in sr)
        addResult(Number(rk), sr[rk]);
      for (let lk in sl) {
        for (let rk in sr) {
          for (let op in ops) {
            addResult(ops[op](lk, rk), `(${sl[lk]}${op}${sr[rk]})`);
          }
        }
      }
      solutions2[s] = results;
    }
    return results;
  }
  function bestNo13(solutions2) {
    let best2 = [];
    for (let k in solutions2) {
      let f = solutions2[k];
      if (f[13])
        continue;
      let cards2 = k.split(",");
      if (cards2.length > best2.length) {
        best2 = cards2;
      }
    }
    return best2;
  }
  function variants(sol) {
    let s = "";
    for (let k in sol) {
      let q = `<span class="${k == 13 ? "IB" : "safe"}">${k} = ${noOuter(sol[k])}</span><br/>`;
      s += q;
    }
    return s;
  }
  var selected = {};
  cc = (c) => {
    if (selected[c])
      delete selected[c];
    else
      selected[c] = true;
    let l = last;
    let r = render();
    if (r && !l) {
      time += 2 * (lastround - round);
    }
  };
  nr = (r, snd) => {
    if (snd != void 0)
      soundOn = snd;
    if (r == 0) {
      start();
    } else {
      nextRound();
    }
  };
  var chat = (t) => t.split("\n").map((s) => `<p>${s}</p>`).join("");
  var story = chat(
    `
Author: Nina is a very bright girl.
\u{1F467}Nina: Yay! \u{1F60A}
Author: And she can count to 100 already.
\u{1F467}Nina: Yes, I can ! \u{1F9EE}
Author: She does not know fractions and negative numbers yet, though...
\u{1F467}Nina: But I will! \u{1F522}
Author: Of course. She loves to play with number cards, applying four arithmetic operations to them to see which results she can get.
\u{1F467}Nina: It's fun! \u{1F973} 
Author: But there is one problem...
\u{1F467}Nina: \u{1F97A}
Author: Nina hates the number...
\u{1F467}Nina: Do not say it!
Author: Number that goes after 12. And when she gets this number in her calculations, she gets very upset.
\u{1F467}Nina: \u{1F62D}
Author: And it takes some time for her to calm down and go back to playing. So, your task is to give Nina a certain amount of number cards from your hand, but it should be impossible to make 13 out of them, using operations +, -, *, / and () and each number card at most once.<br/>`
  ) + `<div><button onClick=nr(null,true)>Let's play</button></div>
   <div><button class=sml onClick=nr(null,false)>Play without sound</button></div>
<br/>`;
  var note = `
<i>Author's note: this game can be played without computer too. Just use cards or dice to "draw" some numbers. Then pick as 
much of them as possible by the same rules as above, i.e. it should not be possible to make 13 of them using arithmetic operations.
<br/><br/>
Alternatively, you can play by other rules. Give each player a random set of numbers (in form of dice and/or cards).
And/or give them a "shared pot" of numbers.
Then players take turns, placing one number per turn from the hand or from the pot to the table.
The player that makes a move resulting in a combination that can be calculated to 13, loses.
</i>
`;
  var happy_text = `\u{1F467}Nina: That's how many numbers I can make out of these cards!`;
  var sad_text = `<span style=color:red>\u{1F467}Nina: Ah, can't you see, it's possible to make THAT number out of them! \u{1F97A}</span>`;
  var win_text = chat(
    `\u{1F467}Nina: Oh, you are right! \u{1F60A} I have not even noticed that this puny number no longer upsets me. Take that, 13! Nina is not to be bullied by the numbers!
Author: That's the spirit!
\u{1F467}Nina: Now numbers will bow to Nina! I will command them all. \u{1F608}
Author: And thus, the tyranny of Nina the Math Queen has begun.
\u{1F467}Nina: Hey! I will be a benevolent ruler. \u{1F478} Maybe... \u{1F60F}
Author: I completely believe you. By the way, did you know that the fear of number 13 is called "triskaidekaphobia"?
\u{1F467}Nina: Eeep! It's one scary word. \u{1F635}
Author: And there is a word for the fear of the long words too - "hippopotomonstrosesquipedaliophobia"!
\u{1F467}Nina: Stop it! \u{1F92F}

Author: PLAYER, thanks for helping Nina the Math Queen quell the number's rebellion!
`
  ) + `<div><button onClick=nr(0)>Play Again</button></div>`;
  var time = 0;
  var round = 0;
  var lastround = 7;
  var best;
  var cards;
  var pad = (val) => ("0" + val).slice(-2);
  function formatTime(t) {
    return `${pad(~~(t / 60))} : ${pad(t % 60)}`;
  }
  setInterval(
    () => {
      if (round > 0 && round <= lastround)
        time += 1;
      T.innerHTML = time ? `Time</br> ${formatTime(time)}` : "";
    },
    1e3
  );
  var last;
  function render() {
    let page, ff;
    if (round == 0) {
      page = `<div class="story">${story}</div><div class=note>${note}</div>`;
    } else if (round > lastround) {
      page = `<div class="story"><div>Play time (including the time to console Nina)</div> <div><span class=ft>${formatTime(time)}</span></div>${win_text}</div>`;
    } else {
      let selectedCards = Object.keys(selected).map((i) => cards[i]);
      ff = solutions[selectedCards.join(",")] || {};
      let vff = variants(ff);
      let afraid = ff[13] && round != lastround;
      if (afraid) {
        ow();
        if (round < 5)
          document.body.classList.add("afraid");
      } else {
        document.body.classList.remove("afraid");
      }
      let needCards = Math.min(cards.length, best.length + (round == lastround ? 1 : 0));
      page = `  
  <div class=round>Round ${round}/${lastround}</div>
  <div class="bottom ${round >= lastround - 2 ? "final" : ""} ${afraid ? "scary" : ""}">
  ${vff ? `<h4>${afraid ? sad_text : happy_text}${afraid ? "" : selectedCards.length < needCards ? ` But I need ${needCards} cards. \u{1F0CF}` : " Let's try another set. \u{1F389}"}</h4>
  ${!afraid && selectedCards.length >= needCards ? `<button onClick=nr()>${round == lastround ? "I see you have made 13 too..." : "Next round"}</button>` : ""}  
  <div class="variants">${vff}</div>` : `<h4>\u{1F467}Nina: Give me ${needCards} cards, and I will do math to them. \u{1F9EE}</h4>`}  
  <div class=cards>
  ${cards.map((c, i) => `<div onmousedown="cc(${i})" class="card ${selected[i] ? "sel" : ""}">${c}</div>`).join("")}
  </div>
  <div class=tip>Give her ${needCards} cards, such that it's impossible, using only +, -, *, / and () on them, to get 13 from them<br/>
  <div style="font-size:0.4rem;">See console for the correct answer</div>
  </div>
  </div>`;
    }
    M.innerHTML = page;
    last = ff && ff[13];
    return last;
  }
  function generateTask() {
    let cardsn = Math.min(round + 4, 8);
    let bestn = cardsn <= 6 ? 3 : 4;
    while (true) {
      cards = [...new Array(cardsn)].map((i) => ~~(Math.random() * 9) + 1).sort((a, b) => a - b);
      solutions = {};
      solve(cards, solutions);
      best = bestNo13(solutions);
      if (best.length >= bestn) {
        console.log(best.join(" "));
        return;
      }
    }
  }
  function start() {
    round = 0;
    time = 0;
    render();
  }
  function nextRound() {
    round++;
    selected = {};
    M.innerHTML = "Thinking...";
    setTimeout(() => {
      generateTask();
      render();
    }, 100);
  }
  start();
  function ow() {
    if (!soundOn)
      return;
    let a = "01234".split("");
    for (let i = 0; i < 7 - round; i++) {
      setTimeout(() => window.tone(Math.random()).f(0, ...a.map((_) => Math.random() * 250)).v(0, 1, 1, 0), i * 100);
    }
  }
})();
