//User interface setup
isProc = false; //is processed?
inc = 0; //incrementor

preTm = 2; //preload timer

//graphics
sm = 2;
md = 4;
lg = 8;
//letter arrays
smLT = [];
mdLT = [];
lgLT = [];
//sprite array
spRT = [];

//Setup all generated letters and images
function InitPreLoad() {
  for(var i=0; i< tl.length; i++) {
    //decompile
    DecomSpr(tl[i], 5, cCVS, i);
    CvstoImData(cCVS, i);
  }
}

//Process Letters and Numbers
function ProcessLetters(){
  if(isProc) {
    if(preTm>0) { preTm-=0.1;
    } else {
      if(lgLT.length==0) {
        try {GenImAr(lg);
        }catch(err) {
          lgLT.length=0;
          lgLT=[];
          return;
        }
      } else if(lgLT.length==tl.length) {
        if(mdLT.length==0) {
          try {GenImAr(md);
          }catch(err) {
            mdLT.length = 0;
            mdLt = [];
            return;
          }
        } else if (mdLT.length == tl.length) {
          if(smLT.length == 0) {
            try {GenImAr(sm);
            }catch(err) {
              smLT.length = 0;
              smLT = [];
              return;
            }
          } else if (smLT.length == tl.length) {
            initProcessing = true;
          }
        }
      }
    }
  }
}

//make arrays for various letter images
function GenImAr(sz) {
  for(var i=0; i< blobArr.length; i++) {
    const Im = new Image();
    //kicking up issues
    Im.src = URL.createObjectURL(blobArr[i]);
    //split data array again //use a dict here perhaps (in future)
    var sD = tl[i].split(",");

    //handle dimensional values
    Im.width = parseInt(sD[0]) * sz;
    Im.height = parseInt(sD[1]) * sz;

    sz==sm ? smLT.push(Im) :
      sz==md ? mdLT.push(Im) :
        sz==lg ? lgLT.push(Im) :
          null
  }
}

//generate string or graphic
function GenStr(str, x, y, obj, sz, rnd, rnd2) {
  var s = 0; //spacing
  var ar;
  sz==sm ? ar = smLT : sz==md ? ar = mdLT : sz==lg ? ar = lgLT : null

  if(Number.isInteger(str)) { //graphic?
    CreateLetter(ar[str], obj, s + x, y)
  } else { //else string

    //get string
    for(var i=0; i<str.length;i++) {
      var n = str.charCodeAt(i) - 97;
      if(ar[n]) { s += ar[n].width + sz;
        (i == rnd || i == rnd2) ?
          CreateLetter(ar[Math.floor(Rand(0, 35))], obj, s + x, y):
          CreateLetter(ar[n], obj, s + x, y)

      } else {
        var t = parseInt(str[i]);
        if(Number.isInteger(t)) {
          CreateLetter(ar[t+26], obj, s + x, y);
          s += ar[t+26].width + sz;
        } else {
          s += sz*4;//blank or unknown
        }
      }
    }
  }
}
function CreateLetter(lt, obj, xIn, yIn) {
  const ASpt = Sprite({
    x: xIn,
    y: yIn,
    width: 32,
    height: 32,
    image: lt,
  });
  obj.addChild(ASpt);
}

//Build anything that has to wait for pixel objects to generate
//rnd is a random position for a glitch, -1 for none
function InitTitle(rnd, rnd2) {
  //test string hosting object
  titleObj = GameObject({
    x: 90,
    y: 90,
  });
  //img2.src = URL.createObjectURL(blobArr[28]);
  GenStr("subspace zero", 0, 0, titleObj, lg, rnd, rnd2);
  //GenerateString("abcdefghijklmnopqrstuvwxyz", mdLT, md);

}

function SetMessageConnect(text) {
  if(gameState == 2) {
    cntObj=null;
    cntObj=GameObject({
      x: 200,
      y: 10,
    });
    if(text == isNaN) {
      GenStr(text.toString(), 0, 0, cntObj, sm, -1, -1);
    } else if (text == 1) {
      GenStr(text.toString() + "player online", 0, 0, cntObj, sm, -1, -1);
    } else if (text > 1) {
      GenStr(text.toString() + "players online", 0, 0, cntObj, sm, -1, -1);
    } else {
      GenStr("na", 0, 0, cntObj, sm, -1, -1);
    }
  }
}

function SetMessage(text) {
  conObj=null;
  //test string hosting object
  conObj=GameObject({
    x: 4,
    y: 10,
  });
  if(text==null) {
    GenStr("session not connected", 0, 0, conObj, sm, -1, -1);
  } else {
    GenStr(text, 0, 0, conObj, sm, -1, -1);
  }
}

function InitStart() {
  //test string hosting object
  startObj = Button({
    type: '1',
    x: 270, //250
    y: 180,
    width: 95,
    height: 32,
    color: '#555',
    onDown() {
      this.color = '#38C';
      ButPress(this.type);
    },
    onUp() {
      this.color = '#555';
    },
    onOver() {
      this.color = '#CCC'
    },
    onOut: function() {
      this.color = '#555'
    }
  });
  //GenerateString("abcdefghijklmnopqrstuvwxyz", -12, 5, startObj, md, -1, -1);
  GenStr("start", -6, 5, startObj, md, -1, -1);

}

//MAKE text object
function MKTxt(str, x, y, fs) {
  obj = GameObject({
    x: x,
    y: y,
  });
  //img2.src = URL.createObjectURL(blobArr[28]);
  GenStr(str, 0, 0, obj, fs);
  addRQUI(obj);
}
//MAKE text object
function MKGr(str, x, y, fs) {
  obj = GameObject({
    x: x,
    y: y,
  });
  //img2.src = URL.createObjectURL(blobArr[28]);
  GenStr(str, 0, 0, obj, fs);
  addRQUI(obj);
}

//MAKE UI square
function MKSqr(x, y, w, h, c) {
  const sq = Sprite({
    x: x,y: y,
    color: c,
    width: w,height: h,});
  addRQUI(sq);
}

//MAKE Button
function MKBt(x, y, w, h, c, i, str) {
  const bu = Button({
    type: i,
    x: x,y: y,
    color: c,
    width: w,height: h,
    onDown() {
      this.color = '#38C';
      ButPress(this.type);
    },
    onUp() { this.color = c; },
    onOver() { this.color = '#CCC'},
    onOut: function() { this.color = c
    }});
  addRQUI(bu);
  if(str) {
    GenStr(str, -6, 5, bu, md, -1, -1);
  }
}

//all modular button functions
function ButPress(i) {
  i == 1 ? ( timer = 0.25, sceneChange = 1)
    : i == 2 ? ( timer = 0.25, sceneChange = 2)
      : i == 69 ? ( timer = 0.25, sceneChange = 0)
        : null
}