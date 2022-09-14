function TypeWriter() {
    TypeWriter.prototype = this;    
}

TypeWriter.prototype._text = "";

TypeWriter.prototype.TextColor = "white";
TypeWriter.prototype.Settings = null;
TypeWriter.prototype.Context = null;
TypeWriter.prototype.Initialise = function () {
    TypeWriter.prototype.Settings = new TypeWriterSettings();
    setInterval(TypeWriter.prototype.Tick, 50);
};

TypeWriter.prototype.TypeText = function (settings, context) {
    TypeWriter.prototype.Context = context;
    TypeWriter.prototype.Settings = settings;
};

TypeWriter.prototype._charCount =0;
TypeWriter.prototype._ticksForRender =0;
TypeWriter.prototype._renderUp = true;
TypeWriter.prototype.Tick = function() {
    var allText = TypeWriter.prototype.Settings.Text;
    if (TypeWriter.prototype._charCount < allText.length) {
        TypeWriter.prototype._text += allText[TypeWriter.prototype._charCount];
        TypeWriter.prototype._charCount += 1;
    }
};

TypeWriter.prototype.Render = function (context, width) {   
    context.fillStyle = TypeWriter.prototype.TextColor;
    context.font = "bold 18px Courier New";
    
     var lines = TypeWriter.prototype._convertToLines(context,                          
          TypeWriter.prototype._text,
          width);
        
     for(var i=0; i < lines.length; i++){
        context.fillText(lines[i], 250, (20 * (i+1))+ 50);
     }
};

TypeWriter.prototype.Clear = function() {
    TypeWriter.prototype._charCount = 0;
    TypeWriter.prototype._ticksForRender = 0;
    TypeWriter.prototype._text = "";
};

TypeWriter.prototype._convertToLines = function(context, text, maxWidth){
    var words = text.split(" ");
    var lines = [""];
    for(var n = 0; n < words.length; n++) {
              
      var testLine = lines[lines.length-1] + words[n] + " ";
      var metrics = context.measureText(testLine);
      var testWidth = metrics.width;        
      if(testWidth > maxWidth) {
        lines[lines.length] = words[n] + " ";             
      }
      else {
        lines[lines.length-1] = testLine;
      }
    }
    return lines;        
};

function TypeWriterSettings() {
    TypeWriterSettings.prototype= this;
    return this;
}

TypeWriterSettings.prototype= {
    Text: "",
    Speed: 100
}