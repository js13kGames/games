function elFromString(htmlString) {
    var div = document.createElement('div');

    if (htmlString) {
        div.innerHTML = htmlString;
    }

    return div.childNodes[0];
}

function move(el) {
  el.style.transform = 'translate3d(' + el.x + 'px, ' + el.y + 'px, 0) ' + el.transforms.join(' ');
}

function collectPoop(poop) {
  poop.active = false;
  poop.className = '';
  poopPool.push(poop);
}

function addFood(startPoint) {
  var food = (foodPool.length > 0) ? foodPool.pop() : document.createElement('div');

  food.active = true;
  food.className = 'food';
  food.x = startPoint.x;
  food.y = startPoint.y;
  food.gameType = 'food';
  food.transforms = [];
  food.width = 20;
  food.height = 15;

  if (!food.inDom) {
    foods.push(food);
    elLevel.appendChild(food);
    food.inDom = true;
  }
}

function addPoop(startPoint, type) {
  var poop = (poopPool.length > 0) ? poopPool.pop() : document.createElement('div');

  poop.x = startPoint.x;
  poop.y = startPoint.y;
  poop.active = true;
  poop.gameType = 'poop';
  poop.transforms = [];
  poop.width = 15;
  poop.height = 20;
  poop.type = type;

  setTimeout(function () {
    poop.className = 'poop';
    poop.classList.add(type);
  }, 30);


  if (!poop.inDom) {
    poops.push(poop);
    elLevel.appendChild(poop);
    poop.inDom = true;
  }
}

function boxesCollide(box1, box2) {
    if (box1 === box2) return false;

    return (
        box1.x < box2.x + box2.width &&
        box1.x + box1.width > box2.x &&
        box1.y < box2.y + box2.height &&
        box1.height + box1.y > box2.y
   );
}
