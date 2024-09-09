function openStageOne(){
  var rStageOne = document.getElementById("routerStageOne");
  rStageOne.style.display = "block";
}
function openPcStage(){
  var pcStage = document.getElementById("pcStage");
  pcStage.style.display = "block";
}
function openEvidenceStage(){
  var evidenceStage = document.getElementById("evidenceStage");
  evidenceStage.style.display = "block";
}
function closeStageOne(){
  var rStageOne = document.getElementById("routerStageOne");
  rStageOne.style.display = "none";

  var pcStage = document.getElementById("pcStage");
  pcStage.style.display = "none";

  var evidenceStage = document.getElementById("evidenceStage");
  evidenceStage.style.display = "none";
}
function move(){
  var elem = document.getElementById("progressBar");
  var width = 0;
  var checkBox1 = document.getElementById("checked1");
  var checkBox2 = document.getElementById("checked2");
  var checkBox3 = document.getElementById("checked3");
  var timeAdded = 50;
  if(checkBox1.checked == true || checkBox2.checked == true || checkBox3.checked == true){
    timeAdded = timeAdded + 100;
  }else if(checkBox1.checked == true && checkBox2.checked == true || checkBox1.checked == true && checkBox3.checked == true || checkBox2.checked == true && checkBox3.checked == true){
    timeAdded = timeAdded + 150;
  }else if(checkBox1.checked == true && checkBox2.checked == true && checkBox3.checked == true){
    timeAdded = timeAdded + 250;
  }else {
    timeAdded = 50;
  }
  var id = setInterval(frame, timeAdded);
  function frame() {
    if (width >= 100) {
      clearInterval(id);
    } else {
      width++;
      elem.style.width = width + '%';
      elem.innerHTML = width * 1  + '%';
    }
  }
}
function removeButton(){
  document.getElementById("removeButton").style.display = "none";
}
function boxChecked1(){
  var checkBox1 = document.getElementById("checked1");
  var afterCheck = document.getElementById("afterCheck1");
  if(checkBox1.checked == true){
    afterCheck.style.display = "block";
  }else{
    afterCheck.style.display = "none";
  }
}
function boxChecked2(){
  var checkBox2 = document.getElementById("checked2");
  var afterCheck = document.getElementById("afterCheck2");
  if(checkBox2.checked == true){
    afterCheck.style.display = "block";
  }else{
    afterCheck.style.display = "none";
  }
}
function boxChecked3(){
  var checkBox3 = document.getElementById("checked3");
  var afterCheck = document.getElementById("afterCheck3");
  if(checkBox3.checked == true){
    afterCheck.style.display = "block";
  }else{
    afterCheck.style.display = "none";
  }
}
//pc progress bars
function firstBar(){
  var elem1 = document.getElementById("progressBar1");
  var width = 0;
  var id = setInterval(frame, 350);
  function frame() {
    if (width >= 100) {
      clearInterval(id);
    } else {
      width++;
      elem1.style.width = width + '%';
      elem1.innerHTML = width * 1  + '%';
    }
  }
}
function secondBar(){
  var elem2 = document.getElementById("progressBar2");
  var width = 0;
  var id = setInterval(frame, 575);
  function frame() {
    if (width >= 100) {
      clearInterval(id);
    } else {
      width++;
      elem2.style.width = width + '%';
      elem2.innerHTML = width * 1  + '%';
    }
  }
}
function thirdBar(){
  var elem3 = document.getElementById("progressBar3");
  var width = 0;
  var id = setInterval(frame, 832);
  function frame() {
    if (width >= 100) {
      clearInterval(id);
    } else {
      width++;
      elem3.style.width = width + '%';
      elem3.innerHTML = width * 1  + '%';
    }
  }
}
function fourthBar(){
  var elem4 = document.getElementById("progressBar4");
  var width = 0;
  var id = setInterval(frame, 250);
  function frame() {
    if (width >= 100) {
      clearInterval(id);
    } else {
      width++;
      elem4.style.width = width + '%';
      elem4.innerHTML = width * 1  + '%';
    }
  }
}
//end of pc pogress bars
//start of deleting pc folders
function removeOne(){
  var removeOne = document.getElementById("removeOne");
  removeOne.style.display = "none";

  var removeOneOnes = document.getElementById("removeOneOnes");
  removeOneOnes.style.display = "none";
}
function removeTwo(){
  var removeTwo = document.getElementById("removeTwo");
  removeTwo.style.display = "none";

  var removeTwoTwos = document.getElementById("removeTwoTwos");
  removeTwoTwos.style.display = "none";
}
function removeThree(){
  var removeThree = document.getElementById("removeThree");
  removeThree.style.display = "none";

  var removeThreeThrees = document.getElementById("removeThreeThrees");
  removeThreeThrees.style.display = "none";
}
function removeFour(){
  var removeFour = document.getElementById("removeFour");
  removeFour.style.display = "none";

  var removeFourFours = document.getElementById("removeFourFours");
  removeFourFours.style.display = "none";
}
//end of deleting pc folders
//start of loading
function eBar1(){
  var evid1 = document.getElementById("eBar1");
  var width = 0;
  var id = setInterval(frame, 525);
  function frame() {
    if (width >= 100) {
      clearInterval(id);
    } else {
      width++;
      evid1.style.width = width + '%';
      evid1.innerHTML = width * 1  + '%';
    }
  }
}
function eBar2(){
  var evid2 = document.getElementById("eBar2");
  var width = 0;
  var id = setInterval(frame, 350);
  function frame() {
    if (width >= 100) {
      clearInterval(id);
    } else {
      width++;
      evid2.style.width = width + '%';
      evid2.innerHTML = width * 1  + '%';
    }
  }
}
function eBar3(){
  var evid3 = document.getElementById("eBar3");
  var width = 0;
  var id = setInterval(frame, 832);
  function frame() {
    if (width >= 100) {
      clearInterval(id);
    } else {
      width++;
      evid3.style.width = width + '%';
      evid3.innerHTML = width * 1  + '%';
    }
  }
}
//remove evidence
function evidOne(){
  var removeE1 = document.getElementById("evidOne");
  removeE1.style.display = "none";
}
function evidTwo(){
  var removeE2 = document.getElementById("evidTwo");
  removeE2.style.display = "none";
}
function evidThree(){
  var removeE3 = document.getElementById("evidThree");
  removeE3.style.display = "none";
}
//remove evidence
//format Pc
function formatPc(){
  var formatPc = document.getElementById("formatPc");
  var confirmation = confirm("Are you sure? Is the PC empty?")
  var selfFormat = document.getElementById("selfFormat");
  if(confirmation == true){
    formatPc.style.display = "none";
    selfFormat.checked = true;
  }else{
    formatPc.style.display = "inline-block";
  }
}
function formatRouter(){
  var formatRouter = document.getElementById("formatRouter");
  var confirmation = confirm("Have you completed Stage 1? Are you sure it's safe?")
  var selfRouter = document.getElementById("selfRouter");
  if(confirmation == true){
    formatRouter.style.display = "none";
    selfRouter.checked = true;
  }else{
    formatRouter.style.display = "inline-block";
  }
}
function formatEvidence(){
  var formatEvidence = document.getElementById("formatEvidence");
  var confirmation = confirm("Have you deleted the folders inside? Are you sure?")
  var selfEvid = document.getElementById("selfEvid");
  if(confirmation == true){
    formatEvidence.style.display = "none";
    selfEvid.checked = true;
  }else{
    formatEvidence.style.display = "inline-block";
  }
}
function selfDistruction(){
  var selfDelete = document.getElementById("selfDelete");
  var selfDistruct = document.getElementById("selfDistruct")
  if(selfDelete.checked == true){
    selfDistruct.style.display = "none";
  }else{
    selfDistruct.style.display = "block"
  }
}
