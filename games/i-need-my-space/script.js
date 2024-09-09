//simplify frequent calls
var byId = function (id) {
  return document.getElementById(id);
};

function getRand(max) {
  return Math.floor(Math.random() * max);
}

//Set it Up

const table = byId("theTable");

let grandtotal = 0;
let heatinterval = 90000;
let fillnumax = 14;
let hotspotlist = [];
let hotspotsmax = 1;
let pickedsq = "";
let round = 0;
let sums = 0;
let timeloss = 0;
let bonuses = 0;
let highscore = [0,0];
let deathscore = -50;
let roundtarget = 85;
let intervalpoint = setInterval(losepoint, heatinterval/5);
let intervalheat = setInterval(addheat, heatinterval);
let death = false;

//Start it up
newround();

function newround() {
  round++;
  heatinterval -= 2000;
  hotspotsmax += 1;
  fillnumax -= 1;
  hotspotlist = [];
  pickedsq = "";
  bonuses = 0;
  timeloss = 0;
  roundtarget -= 8;
  byId("roundscore").classList.replace("warning", "is-black");
  byId("round").innerHTML = round;
  byId("bonuses").innerHTML = 0;
  byId("target").innerHTML = roundtarget;

    //get rid of previous table 
  if (round > 1) {
    for (let k = 0; k < 6; k++) {
      table.deleteRow(0);
    }
  }

  makeRows();
  getSums();
  deathscore = sums - 10; 
  byId("deathscore").innerHTML = deathscore;
  makeheat(hotspotsmax-1);
  intervalheat = setInterval(addheat, heatinterval);
}

function makeRows() {
  byId("changer").innerHTML = getRand(5);
  for (let i = 0; i < 5; i++) {
    const row = table.insertRow(i);
    row.id = "row" + i;
    for (let j = 0; j < 5; j++) {
      const cell = row.insertCell(j);
      const cellid = "r" + i + "c" + j;
      cell.id = cellid;
      cell.onclick = pickit;
      cellnum = getRand(fillnumax)-2;
      if (!((cellnum + i) % 3) && cellnum != 0) {
        cell.innerHTML = cellnum;
      } else {
        cell.innerHTML = 0;
        cell.classList.add("zerobox");
      }
    }
  }
}

function makeheat(nums) {
  for (let i = hotspotlist.length; i <= nums; i++) {
    const row = getRand(5);
    const col = getRand(5);
    const cell = byId("r" + row + "c" + col);
    let heat = 1;  
    if (round > 1) {
      heat = getRand(3);
    }
    hotspotlist.push([cell.id, heat]); 
    cell.classList.add("heatlev" + heat);
    cell.classList.remove("heatlev" + heat-1);
    cell.classList.remove("zerobox");
    }
  }

//METHODS

function getSums() {  
  //destroy pre-existing sumboxes & total
  document.querySelectorAll(".sumbox").forEach((e) => e.remove());
  sums = 0;

  //get row sums
  for (let i = 0; i < 5; i++) {
    let rowtotal = 0;
    const row = byId("row" + i);
    const sumcell = row.insertCell(5);
    sumcell.id = "row" + i + "sum";
    for (let j = 0; j < 5; j++) {
      const num = byId("r" + i + "c" + j).innerHTML;
      if (parseInt(num)) {
        rowtotal += parseInt(num);
      }
    }
    sumcell.innerHTML = rowtotal;
    sumcell.className = "sumbox";
    sums += rowtotal;
  }

  //get column sums
  let sumcol = table.insertRow(5);
  for (let i = 0; i < 5; i++) {
    const cell = sumcol.insertCell(i);
    cell.id = "col" + i + "sum";
     coltotal = 0;
    for (let j = 0; j < 5; j++) {
      num = byId("r" + j + "c" + i).innerHTML;
      if (parseInt(num)) {
        coltotal += parseInt(num);
      }
    }
    cell.innerHTML = coltotal;
    cell.className = "sumbox";
  }

      //report score
      byId("roundscore").innerHTML = sums - timeloss;

  }

function pickit() {
  byId('bonusmsg').innerHTML = "";
  zzfx(...[,,0,.04,.08,0,1,.19,,.2,795,.05,,,,,,.08,.03,.46]); 
  pickedsq = this.id;

  //check for summing & 13 bonus - part 1
  const cellstr = pickedsq.toString();
  var cellbits = cellstr.split("");
  let row = cellbits[1];
  let col = cellbits[3];
  let rowsum = byId('row'+row+'sum').innerHTML;
  let colsum = byId('col'+row+'sum').innerHTML;
  prematch = rowsum == colsum ? true : false;
  pre13row = rowsum == 13 ? true : false;
  pre13col = colsum == 13 ? true : false;
  
  byId(pickedsq).innerHTML = parseInt(byId("changer").innerHTML);
  byId(pickedsq).classList.remove("pickednum", "zerobox", "erasedbox");
  getSums();

  //delete old column sum row
  table.deleteRow(6);
  
   //check for summing & 13 bonus - part 2
  rowsum = byId('row'+row+'sum').innerHTML;
  colsum = byId('col'+row+'sum').innerHTML;
  if (rowsum == colsum && !prematch) {
    bonuses += 13;
    zzfx(...[1.06,,61,.08,.34,.17,,.4,,,257,.05,.04,.1,,.1,,.73,.04,.31]);
    byId('bonuses').innerHTML= bonuses;
    byId('bonusmsg').innerHTML = 'Match Bonus!';
  }

  if ((rowsum == 13 && !pre13row) && (colsum == 13 && !pre13col)) {
    bonuses += 26;
    zzfx(...[,,358,.02,.09,.68,1,.02,,,-103,.06,.08,,,,,.73,.08]);
    byId('bonuses').innerHTML= bonuses;
    byId('bonusmsg').innerHTML = 'Double 13 Bonus!';
  }

  else if ((rowsum == 13 && !pre13row) || (colsum == 13 && !pre13col)) {
    bonuses += 13;
    zzfx(...[,,358,.02,.09,.68,1,.02,,,-103,.06,.08,,,,,.73,.08]);
    byId('bonuses').innerHTML= bonuses;
    byId('bonusmsg').innerHTML = '13 Bonus!';
  }
   
  byId("changer").innerHTML = getRand(fillnumax) -2;
  addheat();
}

function addheat() {
  if (!death) {
    checkdeath();
    let spot = getRand(hotspotlist.length);
    let heat = hotspotlist[spot][1];
    const cell = byId(hotspotlist[spot][0]);
    cell.classList.remove("zerobox", "erasedbox");
    if (heat == 3) {
      erupt(cell.id, spot);
    } else {
      hotspotlist[spot][1]++;
      cell.classList.add("heatlev" + hotspotlist[spot][1]);
      cell.classList.remove("heatlev" + (hotspotlist[spot][1]-1));
    }
  }  
}

function erupt(cellId, spot) {
  zzfx(...[1.2,.1,797,,.31,.93,4,3.4,.1,,,,.17,.3,,.8,,.6,.03,.14]);
  const cellstr = cellId.toString();
  var cellbits = cellstr.split("");
  let er = cellbits[1] - 1;
  let ec = cellbits[3] - 1;
  for (let i = 0; i < 3; i++) {
    ec = cellbits[3] - 1;
    for (let j = 0; j < 3; j++) {
      if (er > -1 && ec > -1 && er < 5 && ec < 5) {
        let cellname = "r" + er + "c" + ec;
        let cell = byId(cellname);
        cell.innerHTML = 0;
        if (! (cell.classList.contains("heatlev1") || cell.classList.contains("heatlev2") || cell.classList.contains("heatlev3"))) {
            cell.classList.add("erasedbox");
            cell.classList.remove("zerobox");
        }
      }
      ec++;
    }
    er++;
  }
  cell = byId("r" + cellbits[1] + "c" + cellbits[3]);
  cell.classList.replace("heatlev3","erupted");
  cell.innerHTML = "Need My Space!";

  //get new sums
  getSums();
  checkdeath();

  //remove current hot spot, add a new one  
  hotspotlist.splice(spot, 1);
  makeheat(1);
  
  //to prevent the 'need my space' message from lingering
  setTimeout(() => {
      changeback(cell);
  }, 1500);
}

function changeback(cell) {
  cell.classList.remove("erupted");
  cell.classList.add("erasedbox");
    cell.innerHTML = '';
}

function losepoint() {
  timeloss += 1;
  checkdeath();
}

function checkdeath() {
    let roundtotal = sums - timeloss;
    byId("roundscore").innerHTML = sums - timeloss;
    if (roundtotal <= deathscore) {
        endgame();
    }
    else if (roundtotal <= deathscore+9) {
        byId("roundscore").classList.replace("is-black", "warning");
    }
    else {
        byId("roundscore").classList.replace("warning", "is-black");
    }  
}

function endgame() {
  death = true;
  zzfx(...[,,520,.04,.43,.71,2,1.64,,,-12,.07,.15,,,,,.96,.06]);
    document.querySelector('#newgame').classList.remove('hideme');    
    document.querySelector('.headerbuttons').classList.add('hideme');
    document.querySelector('.changerarea').classList.add('hideme');   
    while (table.rows.length) {
          table.deleteRow(0);
      }
     clearInterval(intervalpoint);
     clearInterval(intervalheat);
     clearInterval(intervalheat);
}

function submitround() {
zzfx(...[,,442,.06,.38,.4,,1.75,-0.7,9.3,187,.04,.2,,,,,.95,.04,.11]);
  bonuses += round*10;
  byId('bonuses').innerHTML= bonuses;
  byId('bonusmsg').innerHTML= 'Round bonus!';

if (sums - timeloss == roundtarget) {
  bonuses += 25;
  byId('bonusmsg').innerHTML = "Round Target hit!";
}
  grandtotal += sums + bonuses - timeloss;
  byId("score").innerHTML = grandtotal;
  if (grandtotal > highscore[0]) {
    highscore[0] = grandtotal;
    highscore[1] = round;
    byId('highscore').innerHTML = highscore[0];
    byId('highrounds').innerHTML = highscore[1];
}
  deathscore = -50;
  newround();
}

function restart() {
    grandtotal = 0;
    heatinterval = 90000;
    fillnumax = 13;
    hotspotlist = [];
    hotspotsmax = 1;
    pickedsq = "";
    round = 0;
    roundscore = 0;
    deathscore = -50;
    death = false;
    document.querySelector('#newgame').classList.add('hideme');    
    document.querySelector('.headerbuttons').classList.remove('hideme');    
    document.querySelector('.changerarea').classList.remove('hideme');    
    byId("score").innerHTML = '0';
    byId("round").innerHTML = '0';
    newround();
}


function showinstructions() {
  document.querySelector('#instructions').classList.remove('hideme');    
  document.querySelector('#instructbutton').classList.add('hideme'); 
  roundscore +=1; 
}

function hideinstructions() {
  document.querySelector('#instructions').classList.add('hideme');    
  document.querySelector('#instructbutton').classList.remove('hideme');
}
