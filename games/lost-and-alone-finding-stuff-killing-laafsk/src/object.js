import { Sprite } from './mini-kontra.bundle.js'

export class Obj extends Sprite.class {
  constructor (x, y, color, damageColor, width, height, speed, hp) {
    super();
    this.x = x
    this.y = y
    this.color = color
    this.damageColor = damageColor
    this.originalColor = color
    this.width = width
    this.height = height
    this.anchor = {x: 0.5, y: 0.5}
    this.speed = speed;
    this.hp = hp;
  }
  stayInsideMap () {
    if (this.x <= 0) this.x = 1;
    if (this.x + this.width >= this.context.canvas.width) {
      this.x = this.context.canvas.width - this.width
    }
    if (this.y <= 0) this.y = 1;
    if (this.y + (this.height / 2) >= this.context.canvas.height) {
      this.y = this.context.canvas.height - this.height
    }
  }
  hit (dmg) {
    this.hp -= dmg
    this.color = this.damageColor
    setTimeout(() => {
      this.color = this.originalColor
    }, 100)
    if (this.hp <= 0) {
      this.die()
    }
  }
  update () {
    this.move()
    this.stayInsideMap()
  }
} 