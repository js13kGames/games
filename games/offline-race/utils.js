function loadScripts(fExt,fMod,start) {
  let cont = 0;
  const fLoaded = (f) => { cont++; if(cont == fExt.length + fMod.length) start();}
  fExt.forEach(function (f) {
    let p = new Promise((resolve, reject) => {
      loadScript(f,resolve);
    }).then((success) => fLoaded(f));

  });
  fMod.forEach(function (f) {
    let p = new Promise((resolve, reject) => {
      loadScript(`/model/${f}.js`,resolve);
    }).then((success) => fLoaded(f));
  });
}

function loadScript(f,resolve){
  let h = document.getElementsByTagName('head')[0];
  let s = document.createElement('script');
  s.type = 'text/javascript';
  s.onload = () => resolve(f);
  s.src = f;
  h.appendChild(s);
}

function createSVG (el) { return document.createElementNS('http://www.w3.org/2000/svg',el)}

function addStyle (stl) { document.styleSheets[0].insertRule(stl); }

Element.prototype.set = function(props){props.forEach((p) => this.setAttribute(p[0],p[1]));}


