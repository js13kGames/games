/**
 * The game
 * @constructor
 * @param {HTMLCanvasElement} canvas  - Canvas for displaying the game
 */
function Game(canvas, messageLogElement, replyButtonElement)
{
  // Properties: Canvas
  this.canvas = canvas;
  this.context = canvas.getContext("2d");

  // Properties: Canvas Dimensions
  this.canvasWidth = canvas.width;
  this.halfCanvasWidth = (canvas.width/2);
  this.canvasHeight = canvas.height;
  this.halfCanvasHeight = (canvas.height/2);

  // Properties: DOM Elements
  this.messageLogElement = messageLogElement;
  this.replyButtonElement = replyButtonElement;

  // Properties: User Events
  this.isMouseClicked = false;
  this.isMouseDown = false;
  this.mouseMovements = [];
  this.isReplyButtonPressed = false;

  // Properties: Game
  this.currentState = GameState.Starting;

  // Properties: Line
  this.linePoints = [];

  // Properties: Nodes
  this.nodes = [];
  this.activeNodes = [];
  this.startNode = null;
  this.endNode = null;
  this.nodeRadius = this.canvasWidth * GameSettings.NodeRadiusPercentage;

  // Properties: Blocks
  this.blocks = [];

  // Properties: Stages
  this.currentStage = 0;
  this.currentDay = 0;
  this.dayIntroTimer = 0;

  // Properties: Messages
  this.nextDisplayMessage = null;
  this.currentMessageIndex = 0;
  this.messageTimer = 0;
  this.hasStagedMessage = 0;

  // Properties: Message Replies
  this.replyTimer = 0;
  this.replyCount = 0;
  this.hasReplied = false;
  this.repliedToLastMessage = false;
  this.isReplyButtonEnabled = false;
  this.isReplyButtonActive = false;

  // Properties: Score
  this.currentScore = 0;
  this.totalScore = 0;

  // Properties: Scanlines
  this.scanLineImage = new Image();
  this.scanLineImage.src = "images/scanlines.png";

  // Properties: Stage Progression
  this.isScoreEnabled = false;
  this.isReflectedLineEnabled = false;
}

/**
 * Resets the game to a state before a stage begins
 */
Game.prototype.resetStage = function()
{
  // Reset lines
  this.resetLine();

  // Reset nodes
  this.nodes = [];
  this.activeNodes = [];
  this.startNode = null;
  this.endNode = null;

  // Reset blocks
  this.blocks = [];

  // Reset messages
  this.currentMessageIndex = 0;
  this.messageTimer = 0;
  this.replyTimer = 0;
  this.hasReplied = false;

  // Reset score
  if(this.isScoreEnabled)
  {
    this.currentScore = GameSettings.StageScoreStart;
  }
}

/**
 * Resets a line to a state before it was drawn
 */
Game.prototype.resetLine = function()
{
  this.linePoints = [];
  this.activeNodes = [];

  this.nodes.forEach(function(node, i) {
    node.isActive = false;
  });
}

/**
 * Advances the user to the next stage
 */
Game.prototype.advanceStage = function()
{
  // HACK: force forward message if stage is completed during a reply delay
  if(this.isReplyButtonEnabled)
  {
    this.messageTimer = 0;
    this.currentMessageIndex++;
    this.hasReplied = false;
    this.hasStagedMessage = false;
    this.disableReplyButton();
    this.resetReplyButtonText();
  }

  if(this.isScoreEnabled)
  {
    this.totalScore += this.currentScore;
  }

  this.currentStage++;

  var dayStages = stages[this.currentDay];

  if(this.currentStage > dayStages.length - 1)
  {
    this.currentState = GameState.StartingDay;
    this.dayIntroTimer = GameSettings.DayIntroTimerMax;

    this.currentDay++;
    this.currentStage = 0;

    if(this.currentDay > stages.length - 1)
    {
      this.currentState = GameState.Ended;
      return;
    }
  }
  else
  {
    this.currentState = GameState.FinishedStage;
  }

  if(this.currentDay > 0)
  {
    this.isReflectedLineEnabled = true;
  }

  if(this.currentDay > 1)
  {
    this.isScoreEnabled = true;
  }

  this.resetStage();
  this.loadStage(this.currentDay, this.currentStage);
}

/**
 * Loads the stage corresponding to the specified index
 * @param {integer} index  - Index of the stage to load
 */
Game.prototype.loadStage = function(dayIndex, stageIndex)
{
  function calcRelativeValue(percentage, context) {
    return (parseInt(percentage, 10)/100) * context;
  }

  var self = this;
  var stageData = stages[dayIndex][stageIndex];
  var stageElements = stageData.split(';');

  stageElements.forEach(function(elem, i) {

    var elemData = elem.split(/[,\(\)]/);

    var key = elemData[0];
    var x = calcRelativeValue(elemData[1], self.canvasWidth);
    var y = calcRelativeValue(elemData[2], self.canvasHeight);

    switch(key)
    {
      // Start Node
      case 'S':
        self.startNode = new Node(NodeType.Start, x, y, self.nodeRadius);
        self.nodes.push(self.startNode);
        break;

      // End Node
      case 'E':
        self.endNode = new Node(NodeType.End, x, y, self.nodeRadius);
        self.nodes.push(self.endNode);
        break;

      // Connecting Node
      case 'C':
        self.nodes.push(new Node(NodeType.Connect, x, y, self.nodeRadius));
        break;

      // Block
      case 'B':
        var width = calcRelativeValue(elemData[3], self.canvasWidth);
        var height = calcRelativeValue(elemData[4], self.canvasHeight);

        self.blocks.push(new Block(x, y, width, height));
        break;
    }

  });
}

/**
 * Updates the game's state
 */
Game.prototype.update = function()
{
  if(this.currentState === GameState.Ended)
  {
    return;
  }

  this.handleMouseUp();

  // STATE: Finished stage
  if(this.currentState === GameState.FinishedStage)
  {
    return;
  }

  // Respond to user events
  this.handleMouseClick();
  this.handleMouseMove();

  // STATE: Starting day
  if(this.currentState === GameState.StartingDay)
  {
    if(this.dayIntroTimer <= 0)
    {
      this.currentState = GameState.Playing;
      return;
    }

    this.dayIntroTimer--;
    return;
  }

  if(this.currentState != GameState.Playing)
  {
    return;
  }

  if(this.isScoreEnabled)
  {
    // Update score
    if(this.currentScore > 0)
    {
      this.currentScore--;
    }
    else
    {
      this.currentScore = 0;
    }
  }

  this.updateMessages();

}

/**
 * Updates the state of messages within the game
 */
Game.prototype.updateMessages = function()
{
  if(!this.isReplyButtonPressed)
  {
    this.replyTimer = 0;
    this.disableReplyButton();
    this.resetReplyButtonText();
  }

  // Display chat messages
  var levelMessages = messages[this.currentDay][this.currentStage];

  if(!levelMessages)
  {
    return;
  }

  if(this.currentMessageIndex >= levelMessages.length)
  {
    // All of the messages for this stage have been displayed
    return;
  }

  var currMessage = levelMessages[this.currentMessageIndex];

  // CHECK: Current message display condition
  if(currMessage.condition && !currMessage.condition(game))
  {
    // Condition to display message hasn't been met, skip the message
    this.currentMessageIndex++;
    return;
  }

  if(this.hasReplied)
  {
      this.messageTimer = 0;
      this.currentMessageIndex++;
      this.hasReplied = false;
      this.hasStagedMessage = false;
      return;
  }

  if(!this.hasStagedMessage && (!currMessage.delay || this.messageTimer >= currMessage.delay))
  {
    // Prepare the message for display
    this.nextDisplayMessage = currMessage;
    this.hasStagedMessage = true;

    if(!currMessage.awaitReply)
    {
      this.messageTimer = 0;
      this.currentMessageIndex++;
      this.hasReplied = false;
      this.hasStagedMessage = false;
    }

    return;
  }

  if(this.hasStagedMessage && currMessage.awaitReply && !this.hasReplied)
  {
    if(!this.isReplyButtonEnabled)
    {
      this.enableReplyButton();
    }

    if(this.isReplyButtonPressed)
    {
      this.replyTimer++;

      var remainingReplyTimer = (GameSettings.ReplyTimerMax - this.replyTimer);

      if(remainingReplyTimer < 0)
      {
        remainingReplyTimer = 0;
      }

      this.updateReplyButtonText('HOLD FOR ' + remainingReplyTimer);
    }

    if(this.messageTimer >= currMessage.replyDelay)
    {
      this.messageTimer = 0;
      this.currentMessageIndex++;
      this.hasReplied = false;
      this.hasStagedMessage = false;
      this.disableReplyButton();
      this.resetReplyButtonText();
      return;
    }

    if(this.replyTimer > GameSettings.ReplyTimerMax)
    {
      // User has replied, register the reply
      this.replyCount++;
      this.hasReplied = true;
      this.disableReplyButton();
      this.resetReplyButtonText();
      this.nextDisplayMessage = currMessage.replyMessage;
      this.repliedToLastMessage = true;
    }
    else
    {
      this.repliedToLastMessage = false;
    }
  }
  else
  {
    if(this.isReplyButtonEnabled)
    {
      this.disableReplyButton();
    }
  }

  this.messageTimer++;
}

/**
 * Checks if the user has clicked their mouse and updates game's state
 * if applicable
 */
Game.prototype.handleMouseClick = function()
{
  if(!this.isMouseClicked)
  {
    return;
  }

  this.isMouseClicked = false;

  if(this.currentState === GameState.Starting)
  {
    this.dayIntroTimer = GameSettings.DayIntroTimerMax;
    this.currentState = GameState.StartingDay;
    this.loadStage(0, 0);
    return;
  }
}

/**
 * Checks if the user has unpressed their mouse button and updates game's state
 * if applicable
 */
Game.prototype.handleMouseUp = function()
{
  if(this.isMouseDown)
  {
    return;
  }

  if(this.currentState === GameState.FinishedStage)
  {
    this.advanceStage();

    if(this.currentState === GameState.FinishedStage)
    {
      this.currentState = GameState.Playing;
    }
  }

  this.resetLine();
}

/**
 * Checks if the user has moved their mouse and updates the game's state
 * if applicable
 */
Game.prototype.handleMouseMove = function()
{
  var self = this;

  if(!self.isMouseDown)
  {
    self.mouseMovements = [];
    return;
  }

  self.mouseMovements.forEach(function(movement, i) {
    self.handleExtendLine(movement.x, movement.y);
  });

  self.mouseMovements = [];
}

/**
 * Handles the extension of the user's line, triggering appropriate actions
 * based on where the line has moved
 * @param {integer} x       - X-coordinate of where to extend the line
 * @param {integer} y       - Y-cooridnate of where to extend the line
 */
Game.prototype.handleExtendLine = function(x, y) {

  var self = this;

  var reflectX = self.canvasWidth - x;
  var reflectY = self.canvasHeight - y;

  // Detect if user has moved outside the drawing bounds
  if(y > (self.canvasHeight/2))
  {
    self.resetLine();
  }

  if(self.isMouseDown)
  {
    // Detect if user has touched any blocks
    self.blocks.forEach(function(block, i) {

      if(block.contains(x, y) || block.contains(reflectX, reflectY)) {
        self.resetLine();
      }

    });

    // Activate all nodes that the user is touching
    self.nodes.forEach(function(node, i) {

      if(self.activeNodes[i]) {
        return;
      }

      if(node.contains(x, y) || node.contains(reflectX, reflectY)) {
        self.activeNodes[i] = true;
        node.isActive = true;
      }

    });

    // Draw the line
    var hasLineStarted = self.linePoints.length > 0;
    if(hasLineStarted || self.activeNodes[0])
    {
      self.linePoints.push({ x: x, y: y });
    }

    // Get a count of active nodes
    var activeNodesCount = 0;
    self.activeNodes.forEach(function(node, i) {
      activeNodesCount++;
    });

    if(self.activeNodes[1])
    {
      if(activeNodesCount === self.nodes.length)
      {
        self.currentState = GameState.FinishedStage;
      }
      else
      {
        self.resetLine();
      }
    }
  }

}

/**
 * Draws the game
 */
Game.prototype.draw = function()
{
  var self = this;
  var context = this.context;

  // Clear the canvas
  context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

  // STATE: Game Ended
  if(this.currentState === GameState.Ended)
  {
    this.drawEndScreen();
  }

  // STATE: Start Screen
  else if(this.currentState === GameState.Starting)
  {
    this.drawTitleScreen(
      GameSettings.Title.toUpperCase(),
      "Click screen to log onto system"
    );
  }

  // STATE: Level Interstitial
  else if(this.currentState === GameState.StartingDay)
  {
    this.clearDrawnMessages();
    this.drawTitleScreen(
      "Loading Daily Assignments",
      new Date(1988, 3, 11 + this.currentDay).toDateString()
    );
  }

  else {

    // Draw field
    context.fillStyle = GameSettings.DrawFieldBackgroundFillStyle;
    context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    // Messages
    if(this.nextDisplayMessage)
    {
      this.drawMessage(this.nextDisplayMessage.speaker, this.nextDisplayMessage.content);
      this.nextDisplayMessage = null;
    }

    // Nodes
    this.nodes.forEach(function(node, i) {
      node.draw(context);
    });

    // Blocks
    this.blocks.forEach(function(block, i) {
      block.draw(context);
    });

    // Draw the user's line
    this.drawUserLine(false);

    if(this.isReflectedLineEnabled)
    {
      // Draw the reverse of the user's line
      this.drawUserLine(true);
    }

    // Reflect field
    context.strokeStyle = GameSettings.ReflectFieldBorderStrokeStyle;
    context.lineWidth = GameSettings.ReflectFieldBorderLineWidth;

    context.beginPath();
    context.moveTo(0, this.halfCanvasHeight);
    context.lineTo(this.canvasWidth, this.halfCanvasHeight);

    context.stroke();

    if(this.isScoreEnabled)
    {
      // Score
      context.fillStyle = GameSettings.DrawFieldTextFillStyle;
      context.font = 'bold 1em monospace';

      context.textAlign = 'right';
      context.textBaseline = 'top';
      context.fillText("TOTAL: " + this.totalScore, this.canvasWidth - 10, 10);

      context.textAlign = 'left';
      context.fillText("ASSIGNMENT: " + this.currentScore, 10, 10);
    }

    // STATE: Level Interstitial
    if(this.currentState === GameState.FinishedStage)
    {
      var widthOffset = this.canvasWidth * GameSettings.StageCompleteBannerWidthOffsetPercentage;
      var height = this.canvasHeight * GameSettings.StageCompleteBannerHeightPercentage;

      // Stage Complete Banner
      context.fillStyle = GameSettings.StageCompleteBannerBackgroundFillStyle;
      context.fillRect(0 + widthOffset, this.halfCanvasHeight - (height/2), this.canvasWidth - (widthOffset * 2), height);

      // Stage Complete Text
      context.textBaseline = 'middle';
      context.textAlign = 'center';
      context.font = GameSettings.StageCompleteBannerFontStyle;
      context.fillStyle = GameSettings.StageCompleteBannerTextFillStyle;
      context.fillText("ASSIGNMENT COMPLETE", this.halfCanvasWidth, this.halfCanvasHeight);
    }

  }

  // Scanlines
  context.fillStyle = context.createPattern(self.scanLineImage, "repeat");
  context.fillRect(0, 0, self.canvasWidth, self.canvasHeight);

}

/**
 * Draws a message to the screen
 * @param {string} text  - Message to display onscreen
 */
Game.prototype.drawMessage = function(speaker, message)
{
  var message = '<li><span class="speaker">' + speaker + '</span> ' + message + '</li>';
  var currHtml = this.messageLogElement.innerHTML;

  this.messageLogElement.innerHTML = message + currHtml;
}

/**
 * Clears all of the messages onscreen
 */
Game.prototype.clearDrawnMessages = function()
{
  this.messageLogElement.innerHTML = '';
}

/**
 * Draws a screen with just a message
 * @param {string} text  - Text to display onscreen
 */
Game.prototype.drawTitleScreen = function(title, subtitle)
{
  var context = this.context;

  // Background
  context.fillStyle = GameSettings.BackgroundFillStyle;
  context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

  context.textAlign = 'center';
  context.fillStyle = GameSettings.TextFillStyle;

  // Title
  var titleText = title.toUpperCase();
  context.textBaseline = 'middle';
  context.font = GameSettings.TitleScreenFontStyle;
  context.fillText(titleText, this.halfCanvasWidth, this.halfCanvasHeight);

  // Subtitle
  if(subtitle)
  {
    var subtitleText = subtitle.toUpperCase();
    context.textBaseline = 'bottom';
    context.font = GameSettings.TitleScreenSubtitleFontStyle;
    context.fillText(subtitleText, this.halfCanvasWidth, this.canvasHeight - 20);
  }
}

/**
 * Draws the game's end screen
 */
Game.prototype.drawEndScreen = function()
{
  var context = this.context;

  // Background
  context.fillStyle = GameSettings.BackgroundFillStyle;
  context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

  context.textAlign = 'center';
  context.fillStyle = GameSettings.TextFillStyle;

  // "The End"
  context.textBaseline = 'middle';
  context.font = GameSettings.TitleScreenFontStyle;
  context.fillText("END OF FIRST WEEK", this.halfCanvasWidth, this.halfCanvasHeight);

  // Results
  var resultText = "FINAL SCORE: " + this.totalScore;

  if(this.replyCount > 2)
  {
    resultText += " (OTTO SAYS HI)";
  }

  context.textBaseline = 'middle';
  context.font = GameSettings.TitleScreenFontStyle;
  context.fillText(resultText, this.halfCanvasWidth, this.halfCanvasHeight + 80);
}

/**
 * Draws a user's line to screen
 * @param {boolean} isReflected  -  Whether or not the line is being drawn on
 *                                  the reflected field
 */
Game.prototype.drawUserLine = function(isReflected)
{
  var self = this;
  var context = this.context;

  context.strokeStyle = GameSettings.UserLineFillStyle;
  context.beginPath();
  context.lineWidth = GameSettings.UserLineWidth;

  this.linePoints.forEach(function(point, i) {

    var x = point.x;
    var y = point.y;

    if(isReflected)
    {
      x = self.canvasWidth - point.x;
      y = self.canvasHeight - point.y;
    }

    if(i === 0)
    {
      context.moveTo(x, y);
    }
    else
    {
      context.lineTo(x, y);
    }

  });

  context.lineJoin = 'round';

  context.stroke();
}

/**
 * Enables the reply button, so that the user CAN use it
 */
Game.prototype.enableReplyButton = function()
{
  this.replyButtonElement.className = 'button';
  this.isReplyButtonEnabled = true;
}

/**
 * Disables the reply button, so that the user CAN NOT use it
 */
Game.prototype.disableReplyButton = function()
{
  this.replyButtonElement.className = 'button disabled';
  this.isReplyButtonEnabled = false;
}

/**
 * Marks the reply button as active
 */
Game.prototype.activateReplyButton = function()
{
  this.replyButtonElement.className = 'button active';
  this.isReplyButtonActive = true;
}

/**
 * Removes the "active" state from the reply button
 */
Game.prototype.deactivateReplyButton = function()
{
  this.replyButtonElement.className = 'button';
  this.isReplyButtonActive = false;
}

/**
 * Updates the text of the reply button
 * @param {string} text  -  Text to display on the reply button
 */
Game.prototype.updateReplyButtonText = function(text)
{
  this.replyButtonElement.innerHTML = text;
}

/**
 * Resets the text of the reply button to its original value
 */
Game.prototype.resetReplyButtonText = function()
{
  this.replyButtonElement.innerHTML = 'Reply';
}

/**
 * Starts the game
 */
Game.prototype.start = function()
{
  var self = this;

  self.canvas.addEventListener('mousedown', function() { self.isMouseDown = true; }, false);
  self.canvas.addEventListener('mouseup', function() { self.isMouseDown = false; }, false);
  self.canvas.addEventListener('mousemove', function(mouseEvent) { self.mouseMovements.push({ x: mouseEvent.clientX, y: mouseEvent.clientY }); }, false);
  self.canvas.addEventListener('click', function() { self.isMouseClicked = true; }, false);

  self.replyButtonElement.addEventListener('mousedown', function() { self.isReplyButtonPressed = true; }, false);
  self.replyButtonElement.addEventListener('mouseup', function() { self.isReplyButtonPressed = false; }, false);

  function loop()
  {
    self.update();
    self.draw();
  }

  window.setInterval(loop, 50);
  loop();
}
