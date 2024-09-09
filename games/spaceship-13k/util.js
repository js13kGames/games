class Obj{

  frame = 0;
  timer = 0;
  set_visible = true;

  constructor(x,y,width,height, image){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = image;
  }

  draw(){
    if (this.set_visible) {
      var img = new Image();
      img.src = this.image;
      canvas.drawImage(img, this.x, this.y, this.width, this.height);
    }
  }

  animation(vel, limit, nome){
    this.timer += 1;
    if (this.timer >= vel) {
      this.timer = 0;
      this.frame += 1;
    }
    if (this.frame >= limit) {
      this.frame = 0;
    }

    this.image = "assets/images/" + nome + this.frame + ".png";
  }

  collide(obj){
    if (this.x < obj.x + obj.width &&
        this.x + this.width > obj.x &&
        this.y < obj.y + obj.height &&
        this.y + this.height > obj.y)
        {
          return true;
        }else {
          return false;
        }
  }
}

class Shape{
  draw_circle(color,x,y,radius){
    canvas.beginPath();
    canvas.arc(x, y, radius, 0, 2 * Math.PI, false);
    canvas.fillStyle = color;
    canvas.fill();
  }
}

class Text{
  text = "";

  constructor(text){
    this.text = text;
  }

  draw_text(size, font, x, y, color){
    canvas.font = size + "px" + " " + font;
    canvas.fillStyle = color;
    canvas.fillText(this.text, x, y);
  }

  update(text){
    this.text = text
  }
}

class Shoot extends Obj{
  move(){
    this.y -= 10;
  }
}

class Meteors extends Obj{
  speed = Math.random() * (10 - 1) + 1;
  move(){
    this.y += this.speed;
  }
}
