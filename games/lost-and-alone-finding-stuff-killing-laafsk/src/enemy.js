import { gameState } from './index.js'
import { Obj } from './object.js'
import { collision } from './helper-functions.js'

export class Enemy extends Obj {
  constructor (x, y, color, damageColor, width, height, speed, hp, target, id) {
    super(x, y, color, damageColor, width, height, speed, hp) 
    this.target = target
    this.id = id
    this.direction = ''
    this.originalSpeed = this.width
    this.limit = this.originalSpeed
    this.hp = this.width + this.height
  }

  die () {
    this.drop ()
    gameState.incBlood(this.x, this.y, 0, this.width + 2, this.height + 2)
    this.ttl = 0
  }

  drop () {
    // Pickup will increase playerLevel until 5, then kill all enemies
    // so decrease chance of drop
    if (gameState.getPlayer().level < 5) {
      const rand = Math.floor(Math.random() * 20)
      if (rand === 1) {
        console.log('DROP')
        gameState.incPickup(this.x, this.y)
      }
    } else {
      const rand = Math.floor(Math.random() * 200)
      if (rand === 1) {
        gameState.incPickup(this.x, this.y)
      }
    }
  }

  move() {
    let newX = this.x
    let newY = this.y
    
    if (this.limit < 0) {
      let direction = this.direction // up,down,right,left
      const targetX = Math.floor(this.target.x)
      const targetY = Math.floor(this.target.y)

      if (this.x <= targetX) {
        direction = 'right'
        newX += 1 
      }
      if (this.x >= targetX) {
        direction = 'left'
        newX -= 1 
      }
      if (this.y <= targetY) {
        direction = 'down'
        newY += 1
      }
      if (this.y >= targetY) {
        direction = 'up'
        newY -= 1
      }
      this.direction = direction

      // check collision with other enemies
      const enemies = gameState.getEnemies()
      for (let i = 0; i <= enemies.length - 1; i++) {
        const newValues = {
          height: this.height,
          width: this.width,
          x: newX,
          y: newY
        }

        if (enemies[i].id !== this.id && collision(newValues, enemies[i])) {
          const collidingEnemyX = enemies[i].x
          const collidingEnemyY = enemies[i].y
          // if dir === right OR left => go up or down
          if (direction === 'left' && direction === 'right') {
            if (newY < collidingEnemyY) {
              newY -= 1
            } else if (newY > collidingEnemyY) {
              newY += 1
            }
          } else {
            if (newX < collidingEnemyX) {
              newX -= 1
            } else  if (newX > collidingEnemyX) {
              newX += 1
            } 
          }
          
        } 
       
      }

      this.x = newX
      this.y = newY
      
      this.limit = this.originalSpeed + this.hp
    } 
    

    this.limit--
    
    
    
  }
}