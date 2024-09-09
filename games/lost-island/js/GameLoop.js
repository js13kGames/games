function GameLoop (options) {
  this.isRunning = false;
  this.lastFrame = 0;
  this.eleapsedTime = 0;
  this.updatePipeline = options.updatePipeline;
  this.renderPipeline = options.renderPipeline;
  this.updateFixedRate = 30;
}

GameLoop.prototype.tick = function (timestamp) {
  if (this.lastFrame === 0) this.lastFrame = timestamp;
  var dt = timestamp - this.lastFrame;
  this.eleapsedTime += dt;
  if (this.eleapsedTime >= this.updateFixedRate) {
    this.eleapsedTime -= this.updateFixedRate;
    this.updatePipeline.forEach(function (updater) {
      updater.update(this.updateFixedRate);
    }, this);
  }
  this.renderPipeline.forEach(function (renderer) {
    renderer.render();
  });
  this.lastFrame = timestamp;
  if (this.isRunning) {
    window.requestAnimationFrame(this.tick.bind(this));
  }
};

GameLoop.prototype.start = function () {
  this.isRunning = true;
  this.tick(0);
};

GameLoop.prototype.stop = function () {
  this.isRunning = false;
};
