'use strict';

/**
  jQuery Replacement
*/
var $;

(function() {
  var S = function(elementList) {
    [].constructor.apply(this, arguments);
    for (var i = 0, length = elementList.length; i < length; i++) this.push(elementList[i]);
  };
  S.prototype = [];
  S.constructor = S;
  S.prototype.toString = function() {
    var str = '[';
    for (var i = 0, length = this.length; i < length; i++) str += this[i] + ((i < length - 1) ? ', ' : '');
    return str + ']';
  };
  S.prototype.each = function(iterator) {
    if (!iterator || typeof iterator !== 'function') return this;
    for (var i = 0, length = this.length, item; i < length; i++) iterator.apply((item = this[i]), [i, item]);
    return this;
  };
  S.prototype.append = function(element) {
    if (this.length === 0) return this;
    this[0].appendChild(element);
    return this;
  };
  S.prototype.remove = function() {
    return this.each(function(index, element) {
      element.parentNode.removeChild(element);
    });
  };
  S.prototype.bind = function(eventNames, eventHandler) {
    return this.each(function(index, element) {
      var eventNameList = eventNames.split(' '), i, length;
      for (i = 0, length = eventNameList.length; i < length; i++) element.addEventListener(eventNameList[i], eventHandler);
    });
  };
  S.prototype.addClass = function(className) {
    return this.each(function(index, element) {
      var classList = element.className.split(' ');
      for (var i = 0, length = classList.length; i < length; i++) if (classList[i] === className) return;
      element.className += ' ' + className;
    });
  };
  S.prototype.removeClass = function(className) {
    return this.each(function(index, element) {
      var classList = element.className.split(' '), newClassList = [];
      for (var i = 0, length = classList.length; i < length; i++) if (classList[i] !== className) newClassList.push(classList[i]);
      element.className = newClassList.join(' ');
    });
  };
  S.prototype.html = function(html) {
    if (!html && html !== 0 && html !== '') {
      html = '';
      this.each(function(index, element) { html += element.innerHTML; });
      return html;
    }
    return this.each(function(index, element) { element.innerHTML = '' + html; });
  };
  $ = function $(selector) { return new S((typeof selector === 'string') ? document.querySelectorAll(selector) : (selector.length) ? selector : [selector]); };
})();

var Sum13 = {
  init: function() {
    var self = this, blocks = this.blocks, row, col, newRow;

    var $blocksContainer = this.$blocksContainer = $('#blocks');
    $blocksContainer.bind(!!('ontouchstart' in window) ? 'touchstart' : 'mousedown', function(evt) {
      var block = evt.target.block;
      if (block) self.selectBlock(block);
    }).bind('webkitTransitionEnd transitionend MSTransitionEnd oTransitionEnd transitionEnd', function(evt) {
      var block = evt.target.block;
      if (block && evt.propertyName === 'opacity') block.$element.remove();
    });

    for (row = this.rowCount - 1, newRow; row >= 0; row--) {
      blocks.push(newRow = []);
      for (col = this.colCount - 1; col >= 0; col--) newRow.push(null);
    }

    var $gameOverPanel = this.$gameOverPanel = $('#game-over-panel');
    var $startButton = this.$startButton = $('#start-button');
    $startButton.bind('click', function(evt) {
      $gameOverPanel[0].style.display = 'none';
      self.gameOver = false;
      self.setScore(0);
      evt.preventDefault();
    });

    var $logoButton = this.$logoButton = $('#logo-button');
    $logoButton.bind('click', function(evt) {
      var blocksContainer = $blocksContainer[0];
      blocksContainer.style.display = 'none';

      window.setTimeout(function() {
        window.alert('How To Play Sum 13:\n- Tap the numbers after they fall to add up sums of "13"\n- The numbers in the sum must all be of the same color\n- You get 50 points for each block that you clear\n- The game is over once the blocks reach the top of the board');

        blocksContainer.style.display = 'block';
      }, 10);
    });

    var $score = this.$score = $('#score');

    this.destroySound = $('#destroy-sound')[0];

    window.setInterval(function() { self.step(); }, this.speed);
  },

  $blocksContainer: null,
  $gameOverPanel: null,
  $startButton: null,
  $logoButton: null,
  $score: null,
  destroySound: null,

  rowCount: 10,
  colCount: 8,

  blocks: [],
  selectedBlocks: [],

  gameOver: true,
  speed: 200,
  score: 0,

  setScore: function(score) { this.$score.html(this.score = score); },

  stepInterval: null,

  step: function() {
    if (this.gameOver) return;

    var self = this, hasFallingBlocks = false, blocksInCol, block, col, row, colCount, rowCount;
    for (col = 0, colCount = this.colCount; col < colCount; col++) {
      blocksInCol = this.getBlocksInCol(col);

      for (row = 0, rowCount = this.rowCount; row < rowCount; row++) {
        if (!(block = blocksInCol[row]) || !block.falling) continue;
        if (block.row > this.getLandingRowForBlock(block)) {
          block.setRow(block.row - 1);
        } else {
          block.falling = false;
        }

        hasFallingBlocks = true;
      }
    }

    if (!hasFallingBlocks) {
      block = new Block();

      if (block.row === this.getLandingRowForBlock(block)) {
        this.gameOver = true;

        window.setTimeout(function() {
          var blocks = self.blocks, col, row, colCount, rowCount, block;
          var destroyBlock = function(block) { window.setTimeout(function() { block.destroy(); }, 100); };

          for (col = 0, colCount = self.colCount; col < colCount; col++) {
            for (row = 0, rowCount = self.rowCount; row < rowCount; row++) {
              if ((block = blocks[row][col])) {
                destroyBlock(block);
                blocks[row][col] = null;
              }
            }
          }

          window.setTimeout(function() { self.$gameOverPanel[0].style.display = 'block'; }, 500);
        }, this.speed);
      }
    }
  },

  getLandingRowForBlock: function(block) {
    var blocksInCol = this.getBlocksInCol(block.col), landingRow = 0, row;
    for (row = block.row - 1; row >= 0; row--) if (blocksInCol[row] && blocksInCol[row] !== block) landingRow++;
    return landingRow;
  },

  getBlocksInCol: function(col) {
    var blocks = this.blocks, blocksInCol = [], row, rowCount;
    for (row = 0, rowCount = this.rowCount; row < rowCount; row++) blocksInCol.push(blocks[row][col]);
    return blocksInCol;
  },

  dropBlocksInCol: function(col) {
    var hasFallingBlocks = false, blocksInCol = this.getBlocksInCol(col), row, rowCount, block;
    for (row = 0, rowCount = this.rowCount, block; row < rowCount; row++) if ((block = blocksInCol[row]) && !block.falling) block.falling = true;
  },

  clearSelection: function() {
    var selectedBlocks = this.selectedBlocks, i;
    for (i = selectedBlocks.length - 1; i >=0; i--) selectedBlocks[i].toggleSelected();
    selectedBlocks.length = 0;
  },

  getSelectionSum: function() {
    var selectedBlocks = this.selectedBlocks, sum = 0, i;
    for (i = selectedBlocks.length - 1; i >=0; i--) sum += selectedBlocks[i].value;
    return sum;
  },

  selectBlock: function(block) {
    if (block.falling) return;

    var selectedBlocks = this.selectedBlocks, sum, i;
    if (!block.selected) {
      if (selectedBlocks.length > 0 && selectedBlocks[0].color !== block.color) this.clearSelection();
      selectedBlocks.push(block);
      
      if ((sum = this.getSelectionSum()) > 13) {
        this.clearSelection();
      } else if (sum === 13) {
        this.destroySelectedBlocks();
      }
    } else {
      for (i = selectedBlocks.length - 1; i >=0; i--) if (selectedBlocks[i] === block) {
        selectedBlocks.splice(i, 1);
        break;
      }
    }

    block.toggleSelected();
  },

  destroySelectedBlocks: function() {
    var selectedBlocks = this.selectedBlocks, i;
    for (i = selectedBlocks.length - 1; i >=0; i--) selectedBlocks[i].destroy();
    this.setScore(this.score + (selectedBlocks.length * 50));
    selectedBlocks.length = 0;
  }
};

Sum13.Colors = { 0: 'r', 1: 'g', 2: 'b' };

var Block = function Block() {
  var value = this.value = Math.round(Math.random() * 8) + 1;
  var color = this.color = Sum13.Colors[Math.round(Math.random() * 2)];
  var row = this.row = 9, col = this.col = Math.round(Math.random() * 7);
  var element = this.element = document.createElement('DIV');
  var $element = this.$element = $(element);
  element.innerHTML = value;
  element.className = 'block ' + color;
  element.block = this;

  Sum13.$blocksContainer.append(element);
  Sum13.blocks[row][col] = this;

  this.setRow(row);
};

Block.prototype = {
  constructor: Block,

  $element: null,
  element: null,

  width: 38,
  height: 40,

  value: -1,
  color: '',

  row: -1,
  col: -1,

  setRow: function(row) {
    var col = this.col, element = this.element;

    Sum13.blocks[this.row][col] = null;
    Sum13.blocks[row][col] = this;

    this.row = row;

    var x = col * this.width, y = (Sum13.rowCount - row - 1) * this.height, transform = 'translate(' + x + 'px, ' + y + 'px)';
    element.style.webkitTransform = transform;
    element.style.MozTransform = transform;
    element.style.msTransform = transform;
    element.style.OTransform = transform;
    element.style.transform = transform;
  },

  falling: true,

  selected: false,

  toggleSelected: function() {
    if (this.selected) {
      this.$element.removeClass('selected');
      this.selected = false;
    } else {
      this.$element.addClass('selected');
      this.selected = true;
    }
  },

  destroy: function() {
    var element = this.element, row = this.row, col = this.col, x = col * this.width, y = (Sum13.rowCount - row - 1) * this.height, transform = 'translate(' + x + 'px, ' + y + 'px) scale(3)';
    element.style.webkitTransform = transform;
    element.style.MozTransform = transform;
    element.style.msTransform = transform;
    element.style.OTransform = transform;
    element.style.transform = transform;
    element.style.opacity = 0;

    Sum13.blocks[row][col] = null;
    Sum13.dropBlocksInCol(col);
    Sum13.destroySound.play();
  }
};

$(window).bind('load', function(evt) { Sum13.init(); });
