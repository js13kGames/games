import { Sprite } from './mini-kontra.bundle.js'
import { gameState } from './index.js'
export const collision = (objA, objB) => {
  // remember anchor x and y on enemy is 0.5
  const objAtop = objA.y - objA.height / 2
  const objAbot = objA.y + objA.height / 2
  const objAleft = objA.x - objA.width / 2
  const objAright = objA.x + objA.width / 2

  const objBtop = objB.y - objB.height / 2
  const objBbot = objB.y + objB.height / 2
  const objBleft = objB.x - objB.width / 2
  const objBright = objB.x + objB.width / 2


  const collisionY = objAtop <= objBbot
    && objAbot >= objBtop
  const collisionX = objAleft <= objBright
    && objAright >= objBleft

  return collisionY && collisionX
}


export function createProjectile (x, y, angle) {
  const projectile = Sprite({
    id: x + y + angle, 
    x: x,
    y: y,
    width: 3,
    height: 1,
    rotation: angle,
    dx: Math.cos(angle) * 2.5,
    dy: Math.sin(angle) * 2.5,
    color: 'green',
    ttl: 100,
    anchor: { x: 0.5, y: 0.5},
    update () {
      
      for (const enemy of gameState.getEnemies()) {
        if (collision(this, enemy)) {
            // collision detected!
            gameState.incBlood(this.x, this.y, angle)
            this.height = 5
            this.width = 8
            enemy.hit(20);
            this.ttl = 0;
            break
        }
      }

      this.advance()    
    }
  })
  return projectile
}

export function createFireEffect (x, y, angle) {
  const projectile = Sprite({
    id: x + y + angle, 
    x: x,
    y: y,
    width: 2,
    height: 3,
    rotation: angle,
    color: 'yellow',
    ttl: 5,
    anchor: { x: -0.3, y: 0.5 }
  })
  return projectile
}

export function createBlood (x, y, angle, width = 2, height = 2) {
  const blood = Sprite({
    id: x + y + angle, 
    x,
    y,
    width,
    height,
    rotation: angle,
    color: 'red',
    ttl: 300, 
    render () {
      this.context.fillStyle = this.color
      this.context.beginPath()
      this.context.arc(0, 0, width / 2, 0, 2 * Math.PI)
      this.context.fill()
    }
  })
  return blood
}

export function createPickup (x, y, angle, width = 10, height = 10) {
  const pickup = Sprite({
    id: x + y + angle, 
    x,
    y,
    width,
    height,
    rotation: angle,
    color: 'purple',
    ttl: 300,
    anchor: { x: 0.5, y: 0.5 }
  })
  return pickup
}

