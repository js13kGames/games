//@ts-check

// opening and closing books
(() => {
  const durationSlideOffShelf = 300;
  const durationMoveToTable = 2000;
  const durationOpen = 1000;

  const closeBook = (book) => {
    book.setAttribute('open', 'false');
    let bookFront = book.querySelector('.book-front');
    let bookSpine = book.querySelector('.book-spine');
    bookFront?.setAttribute('animation', `property: rotation; to: 0 -180 0; dur: ${durationOpen}`);
    bookFront?.setAttribute('animation__2', `property: position; to: 0 0 -0.075; dur: ${durationOpen}`);
    bookSpine?.setAttribute('animation', `property: scale; to: 0.5 1 1; duration: 900; easing: linear`);
    window.setTimeout(() => {
      book.setAttribute('animation', `property: position; from: 0 0.87 -0.85; to: ${book.getAttribute('og-pos-2')}; dur: ${durationMoveToTable}`);
      book.setAttribute('animation__2', `property: rotation; from: 90 0 0; to: ${book.getAttribute('og-rot')}; dur: ${durationMoveToTable}`);
      window.setTimeout(() => {
        book.setAttribute('animation', `property: position; from: ${book.getAttribute('og-pos-2')}; to: ${book.getAttribute('og-pos-1')}; dur: ${durationSlideOffShelf}`);
      }, durationMoveToTable);
    }, durationOpen);
  };
  
  document.querySelectorAll('.interactive-book').forEach((book) => {
    let bookFront = book.querySelector('.book-front');
    let bookSpine = book.querySelector('.book-spine');
    book?.querySelectorAll('.open').forEach((element) => {

      element.addEventListener('click', () => {
        // close any books that are already open
        document.querySelectorAll('.interactive-book[open="true"]').forEach((book) => {
          closeBook(book);
        });
        book.setAttribute('open', 'true');

        /** @type {{x: number, y: number, z: number}} */
        const bookOgPosObj = /** @type {any} */(book.getAttribute('position'));
        book.setAttribute('og-pos-1', `${bookOgPosObj.x} ${bookOgPosObj.y} ${bookOgPosObj.z}`);
        book.setAttribute('og-pos-2', `${bookOgPosObj.x} ${bookOgPosObj.y} ${bookOgPosObj.z - 0.25}`);
        /** @type {{x: number, y: number, z: number}} */
        const bookOgRotObj = /** @type any */(book.getAttribute('rotation'));
        book.setAttribute('og-rot', `${bookOgRotObj.x} ${bookOgRotObj.y} ${bookOgRotObj.z}`);

        book.setAttribute('animation', `property: position; from: ${book.getAttribute('og-pos-1')}; to: ${book.getAttribute('og-pos-2')}; dur: ${durationSlideOffShelf}; easing: linear;`);

        window.setTimeout(() => {
          book.setAttribute('animation', `property: position; from: ${book.getAttribute('og-pos-2')}; to: 0 0.87 -0.85; dur: ${durationMoveToTable}`);
          book.setAttribute('animation__2', `property: rotation; from: ${book.getAttribute('og-rot')}; to: 90 0 0; dur: ${durationMoveToTable}`);
          window.setTimeout(() => {
            bookFront?.setAttribute('animation', `property: rotation; to: 0 0 0; dur: ${durationOpen}`);
            bookFront?.setAttribute('animation__2', `property: position; to: 0 0 0; dur: ${durationOpen}`);
            bookSpine?.setAttribute('animation', 'property: scale; to: 0 1 0; duration: 100; easing: linear');
          }, durationMoveToTable);
        }, durationSlideOffShelf);
      });
    });
    book?.querySelectorAll('.close').forEach((element) => {
      element.addEventListener('click', () => {
        closeBook(book);
      });
    });
  });

})();

// letters on maze
(() => {
	let canvas = /** @type {HTMLCanvasElement} */(document.querySelector('#maze'));
	canvas.width = 98;
	canvas.height = 150;
	let ctx = /** @type CanvasRenderingContext2D */(canvas.getContext('2d'));
	let img = new Image();
	img.onload = function() {
		ctx.drawImage(img, 0, 0);
		ctx.font = 'regular 26px serif';
		ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.fillText(String.fromCharCode(65 + Math.floor(Math.random() * 26)), 20, 15);
    ctx.fillText(String.fromCharCode(65 + Math.floor(Math.random() * 26)), 40, 25);
    ctx.fillText(String.fromCharCode(65 + Math.floor(Math.random() * 26)), 88, 25);
    ctx.fillText(String.fromCharCode(65 + Math.floor(Math.random() * 26)), 75, 55);
    ctx.fillText(String.fromCharCode(65 + Math.floor(Math.random() * 26)), 18, 62);
    ctx.fillText(String.fromCharCode(65 + Math.floor(Math.random() * 26)), 18, 95);
    ctx.fillText(String.fromCharCode(65 + Math.floor(Math.random() * 26)), 88, 115);
    ctx.fillText(String.fromCharCode(65 + Math.floor(Math.random() * 26)), 10, 119);
    ctx.fillText(String.fromCharCode(65 + Math.floor(Math.random() * 26)), 52, 119);
    ctx.fillText(String.fromCharCode(65 + Math.floor(Math.random() * 26)), 75, 135);
		ctx.fillText(document.getElementById('maze-book')?.getAttribute('data-letter') || '', 53, 95);
	}
	img.src = "/assets/maze.svg";
})();

// maths generator
(() => {

  // page 1
  const generateMaths = (letter) => {
    const square = letter.charCodeAt(0) - 64;
    const circle = Math.floor(Math.random() * 5) + 2;
    const triangle = Math.floor(Math.random() * 5) + 1;
    return [
      `🔵 + 🔵 + 🔵 = ${circle * 3}`,
      `🔵 + 🔺 + ⬜ = ${circle + triangle + square}`,
      `🔵 + 🔺 + 🔺 = ${circle + triangle * 2}`,
    ];
  };
  let canvas1 = /** @type {HTMLCanvasElement} */(document.querySelector('#maths-1'));
  canvas1.width = 98;
	canvas1.height = 150;
  let ctx1 = /** @type CanvasRenderingContext2D */(canvas1.getContext('2d'));
  ctx1.font = 'regular 16px serif';
	ctx1.fillStyle = '#000';
  const maths = generateMaths(document.getElementById('maths-book')?.getAttribute('data-letter'));
  maths.forEach((line, index) => {
    ctx1.fillText(line, 10, (index * 20) + 20);
  });
  ctx1.fillText('Test', 20, 100);

  // page 2
  let canvas2 = /** @type {HTMLCanvasElement} */(document.querySelector('#maths-2'));
  canvas2.width = 98;
	canvas2.height = 150;
  let ctx2 = /** @type CanvasRenderingContext2D */(canvas2.getContext('2d'));
  ctx2.font = 'bold 28px serif';
  ctx2.textAlign = 'center';
	ctx2.fillStyle = '#222';
  ctx2.fillText('A = 1', 45, 30);
  ctx2.fillText('Z = 26', 45, 70);
  ctx2.font = 'regular 120px serif';
  ctx2.fillText('⬜', 45, 120);

})();
