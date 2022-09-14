"use strict"

class cube 
{
    constructor( x , y , size , color , isEnemy = true )
    {
        this.x       = x
        this.y       = y 
        this.dx      = 0
        this.dy      = 0
        this.dx2     = 0 | 0
        this.d2y     = 0 | 0

        this.color   = color
        this.size    = 0
        this.fsize   = size
        this.isdead  = false
        this.isEnemy = isEnemy
        this.isDone  = false
        this.theta   = 0
        this.radius  = size+1
        this.health  = 100
        this.ip      = ""

        if (this.isEnemy)
        {
            for (let i = 0; i < 4; i++)
            {
                this.ip += randomInt(2,254) + "."
            }
            this.ip = this.ip.slice(0,-1)
        }
        else
        {
            this.ip = "127.0.0.1"
        }
    }
    setAcc( dx2 , d2y )
    {
        this.dx2 = dx2
        this.d2y = d2y
        if (this.isEnemy)
        {
            if (this.x+dx2 > width || this.x+dx2 < 0) this.dx2 *= -1
            if (this.y+d2y > width || this.y+d2y < 0) this.d2y *= -1
        }
    }
    update()
    {
        if (this.health < 100) this.health += 0.2
        this.dy  += this.d2y
        this.dx  += this.dx2
        this.d2y  = 0
        this.dx2  = 0
        this.dy  *= 0.9
        this.dx  *= 0.9
        if (this.x < width && this.x > 0 && this.dx+this.x > 0 && this.x+this.dx < width)
        {
            this.x += this.dx
        }
        else if (this.x >= width)
        {
            this.dx = 0
            this.x = width - 2
        }
        else if (this.x <= 0)
        {
            this.dx = 0 
            this.x = 2
        }
        if (this.y < height && this.y > 0 && this.dy+this.y > 0 && this.y+this.dy < height)
        {
            this.y += this.dy
        }
        else if (this.y >= height)
        {
            this.dy = 0
            this.y = height - 2
        }
        else if (this.y <= 0)
        {
            this.dy = 0
            this.y = 2
        }
        this.color.a = this.health/100

        if (this.size < this.fsize) this.size += this.fsize/10
    }
    display( mx = mouseX , my = mouseY )
    {
        let x            = this.x 
        let y            = this.y
        let the_lighting = {
            left:  2/3,
            right: 1/3,
            top:   1
        }
        // let deltaY = (my-y)
        // let deltaX = (mx-x)

        // the_lighting.top   -= Math.exp(-deltaY/400)
        // the_lighting.left  -= Math.exp(-deltaX/400)
        // the_lighting.right -= Math.exp(-deltaX/400)

        if (this.isEnemy && this.theta > 0 && !this.isDone)
        {
            ctx.fillStyle   = rgba( 0 , 255 , 0 , 0.5 ) // this.theta / ( Math.PI * 2) )
            ctx.strokeStyle = rgba( 0 , 255 , 0 , 0.5 ) // this.theta / ( Math.PI * 2) )
            ctx.lineWidth   = 0

            ctx.beginPath()
            ctx.moveTo( x , y )
            ctx.arc( x , y , this.radius , 0 , this.theta )
            ctx.lineTo( x , y )
            ctx.stroke()
            ctx.fill()
            ctx.fillStyle   = ctx.strokeStyle = ctx.lineWidth   = ""
        }
        ctx.lineWidth   = 1
        ctx.strokeStyle = "black"
    
        // The derivative/slope of the lines prependicular to the bottom of the screen
        let dy = Math.sin(Math.PI/6),
            dx = Math.cos(Math.PI/6);
    
    
        // the left side of the cube
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + this.size);
        ctx.lineTo(x - this.size * dx, (y + this.size) - this.size * dy);
        ctx.lineTo(x - this.size * dx, y - this.size * dy);
        ctx.closePath();
        ctx.stroke();

        ctx.fillStyle = rgba(this.color.r * the_lighting.left , this.color.g * the_lighting.left, this.color.b* the_lighting.left, this.color.a)
        ctx.fill();
    
    
        // the right side of the cube
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + this.size);
        ctx.lineTo(x + this.size * dx, (y + this.size) - this.size * dy);
        ctx.lineTo(x + this.size * dx, y - this.size * dy);
        ctx.closePath();
        ctx.stroke();
    
        ctx.fillStyle = rgba(this.color.r * the_lighting.right , this.color.g* the_lighting.right, this.color.b* the_lighting.right, this.color.a)
        ctx.fill();
    
        // The top side of the cube
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + this.size*dx, y - this.size * dy);
        ctx.lineTo(x, y - this.size);
        ctx.lineTo(x - this.size * dx, y - this.size/2);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();
    
        ctx.fillStyle = rgba(this.color.r * the_lighting.top, this.color.g * the_lighting.top, this.color.b * the_lighting.top, this.color.a);
        ctx.fill();

    }
    shootAt( x , y )
    {
        evil_packets.push( new packet( this.x , this.y , x , y , this.size / 10 ) )
    }
    fadeAway()
    {
        if (this.color.a <= 0) 
            this.isdead   = true
        else
            this.color.a -= 0.05
            this.y       -= 0.1
    }
}



class packet
{
    constructor( x0 , y0 , x1 , y1 , strength = 2 )
    {
        this.x0       = x0
        this.y0       = y0
        this.x1       = x1
        this.y1       = y1
        this.dy       = ( y1 - y0 ) / 20
        this.dx       = ( x1 - x0 ) / 20
        this.x        = this.x0 + this.dx
        this.y        = this.y0 + this.dy
        this.reached  = false
        this.strength = strength

         
    }
    update()
    {
        // Collision detection
        if (this.x == this.x1 && this.y == this.y1) this.reached = true
        if (this.x > width  || this.x < 0) this.reached = true
        if (this.y > height || this.y < 0) this.reached = true

        this.x  += this.dx 
        this.y  += this.dy
        this.x0 += this.dx
        this.y0 += this.dy
    }
    display()
    {
        ctx.strokeStyle = "red"
        ctx.lineWidth = this.strength/2
        ctx.beginPath()
        ctx.moveTo(this.x0,this.y0)
        ctx.lineTo(this.x, this.y)
        ctx.stroke()
    }
    collision(obj)
    {
        if (
            this.x < obj.x+obj.size && 
            this.x > obj.x-obj.size &&
            this.y < obj.y+obj.size && 
            this.y > obj.y-obj.size
        ) 
        {
            this.isreached = true
            return true 
        }
    }
}



class log
{
    constructor( message, font = ctx.font )
    {
        this.msg      = message
        this.fontSize = ~~font.split('px')[0]
        this.font     = font.split('px ')[1]
        this.alpha    = 0.6
        this.isdead   = false

        let tempfont = ctx.font
        ctx.font     = font
        this.h       = ctx.measureText('W').width
        ctx.font     = tempfont

    }
    display( x , y )
    {
        if (this.alpha > 0)
        {
            this.alpha -= 0.01
        }
        else
        {
            this.isdead = true
        }
        ctx.textAlign = 'center'
        ctx.font = this.fontSize + 'px ' + this.font
        ctx.fillStyle = rgba( 0 , 255 , 0 , this.alpha)
        ctx.fillText(this.msg, x, y)
        ctx.font = ctx.fillStyle = ctx.textAlign = ""
    }
    
}

let logs = [new log("started server...", "16px monospace")]

function displayLogs()
{
    let pos = player.y
    let gap = 10
    pos += gap
    for (let i = 0; i < logs.length; i++)
    {
        pos += logs[i].h + gap
        logs[i].display(player.x, pos)
        if (logs[i].isdead) logs[i] = null
    }
    let temp = []
    for (let i of logs)
        i && temp.push(i)
    logs = temp
    temp = null
}


let score          = 0
let player         = new cube( 
    width  / 2, // X-position
    height / 2, // Y-position
    20,         // Player size
    { 
        r: 255, // Red
        g: 255, // Green
        b: 255, // Blue
        a: 1    // Alpha
    },
    false)      // Not an enemy object


// Arrays
let   zombies        = [],
      evil_packets   = []
let   TIME           = 0 | 0
const CLOSE_DISTANCE = 100
const ZOOM = 1.3
const zoomed_height = height*ZOOM,
      zoomed_width  = width *ZOOM

const FPS = 60


// Initialize The enemy objects
for (let i = 0; i < 2; i++)
{
    zombies.push(new cube(
        randomInt( 0  , width  ),
        randomInt( 0  , height ),
        randomInt( 10 , 40     ),
        {
            r: 0,
            g: 0,
            b: 255,
            a: 1
        }
        ))
}
function game()
{
    document.getElementById("wholedamnthing").style.display = "none"
    document.body.appendChild(canvas)
    let t = setInterval(() => {
        TIME++

        // Background
        ctx.fillStyle = "black"
        ctx.fillRect(0,0,width,height)

        //score
        ctx.fillStyle = "white"
        ctx.shadowColor = "blue"
        ctx.shadowBlur = 20
        ctx.textAlign = "left"
        ctx.font = "30px monospace"
        ctx.fillText(`score: ${score}`, width/2, height/2)
        ctx.fillText(`score: ${score}`, width/2, height/2)
        ctx.textAlign = ctx.font = ctx.fillStyle = ctx.shadowColor = ctx.shadowBlur = ""
        
        
        player.update()
        ctx.setTransform(ZOOM
                        ,0,0,
                        ZOOM,
                        player.x - ( player.x * ZOOM ),
                        player.y - ( player.y * ZOOM ) 
                        )




        if (Math.random() < 0.009)
        {
            zombies[ randomInt( 0 , zombies.length ) ]
            .setAcc(
                randomInt( 0 , 30 ) - 15,
                randomInt( 0 , 30 ) - 15
            )
        }
        // Attacker
        for (let i = 0; i < zombies.length; i++)
        {
            if (zombies[i].isDone)
            {
                zombies[i].fadeAway()
                zombies[i].display()
            }
            else
            {
                zombies[i].update()
                zombies[i].display()

                // Distance from the player (Using pyth)
                let a = player.x - zombies[i].x,
                    b = player.y - zombies[i].y
                let c = Math.sqrt( Math.pow( a , 2 ) + Math.pow( b , 2 ) )
                if (c < CLOSE_DISTANCE)
                {
                    if (Math.random() < 0.001 * zombies.length)
                    {
                        zombies[i].setAcc(
                            randomInt( 0 , 30 ) - 15,
                            randomInt( 0 , 30 ) - 15
                        )
                    } //Randomly move when close


                    //Draw a line when close
                    ctx.lineWidth   = 5
                    ctx.strokeStyle = rgba( 0 , 255 , 0 , Math.exp( -c / 100 ) ) //Using e^x
                    ctx.beginPath()
                    ctx.moveTo( player.x     , player.y     )
                    ctx.lineTo( zombies[i].x , zombies[i].y )
                    ctx.stroke()
                    zombies[i].theta  += Math.PI / Math.pow( 2 , 6 )
                    zombies[i].radius += 0.09
                    if (zombies[i].theta >= Math.PI * 2)
                    {
                        zombies[i].isDone = true
                        let numberOfClients = randomInt(1,5)
                        for (let i = 0; i < numberOfClients; i++)
                        {
                            zombies.push(new cube(
                                randomInt( 0  , width  ),
                                randomInt( 0  , height ),
                                randomInt( 10 , 40     ),
                                {
                                    r: 0,
                                    g: 0,
                                    b: 255,
                                    a: 1
                                }
                                ))
                            
                        }
                        logs.push(new log(zombies[i].ip + ' has been eliminated', '16px monospace'))
                        if (numberOfClients == 1)
                            logs.push(new log('A new attacker has appeared...', '16px monospace'))
                        else
                            logs.push(new log(numberOfClients + ' attackers have appeared...', '16px monospace'))
                        score += zombies[i].fsize
                    }
                    ctx.textAlign = "center"
                    ctx.font      = "20px monospace"
                    ctx.fillStyle = rgba( 255 , 255 , 255 , zombies[i].theta / (2 * Math.PI) )
                    ctx.fillText( zombies[i].ip , zombies[i].x , zombies[i].y )
                    ctx.font = ctx.fillStyle = ctx.textAlign = ""
                }
                else
                {
                    zombies[i].theta  = zombies[i].theta  > 0 ? zombies[i].theta  - Math.PI / Math.pow(2, 6) : zombies[i].theta 
                    zombies[i].radius = zombies[i].radius > zombies[i].size+1 ? zombies[i].radius - 0.09 : zombies[i].radius
                }
            }
            if (Math.random() < 0.1)
            {
                zombies[i].shootAt(player.x,player.y)
            } 
            if (zombies[i].isdead)   zombies[i] = null
        }

        // Dangerous traffic
        for (let i = 0|0; i < evil_packets.length; i++)
        {
            evil_packets[i].update()
            evil_packets[i].display()
            if (evil_packets[i].collision(player))
            {
                player.health = player.health > 0 ? player.health- evil_packets[i].strength / 2 : player.isdead = true
                evil_packets[i].reached = true

                new Audio('sound/pew.mp3').play()
            }

            if (evil_packets[i].reached) evil_packets[i] = null

        }
        let temp = []
        for (let i of evil_packets)
            i && temp.push(i)
        evil_packets = temp
        temp = []

        for (let i of zombies)
            i && temp.push(i)
        zombies = temp
        temp = null


        player.display()
        
        displayLogs()



        if (player.isdead)
        {
            // canvas.className = "ded"
            clearInterval(t)
            let alpha = 0
            let disappear = setInterval(() => {
                if (alpha >= 1) clearInterval(disappear)
                ctx.fillStyle = rgba(0,0,0,alpha)
                ctx.fillRect(0,0,width, height)
                alpha += 0.01
            }, 1000/60)
            setTimeout(()=> {
                ctx.fillStyle = "red"
                ctx.shadowColor = "red"
                ctx.shadowBlur = 20
                ctx.textAlign = "center"
                ctx.font = "5em monospace"
                ctx.setTransform(1,0,0,1,1,0,0)
                ctx.fillText(`Offline`, width/2, height/3)
                ctx.fillText(`Offline`, width/2, height/3)
                ctx.textAlign = ctx.font = ctx.fillStyle = ctx.shadowColor = ctx.shadowBlur = ""
            }, 2000)
            setTimeout(()=> {
                ctx.fillStyle = "white"
                ctx.textAlign = "center"
                ctx.font = "24px monospace"
                ctx.fillText(`You protected the server for ${(TIME*6)/200} seconds`, width/2, height * (2/3))
                ctx.textAlign = ctx.font = ctx.fillStyle = ctx.shadowColor = ctx.shadowBlur = ""
            }, 3000)
            setTimeout(()=> {
                ctx.fillStyle = "white"
                ctx.textAlign = "center"
                ctx.font = "24px monospace"
                ctx.fillText(`Score: ${score}`, width/2, height * (5/6))
                ctx.textAlign = ctx.font = ctx.fillStyle = ctx.shadowColor = ctx.shadowBlur = ""
            }, 4000)
            setTimeout(() => window.location.reload(), 7000)
            canvas.onclick = () => window.location.reload()
            return -1
        }
    },~~(1000/60))

}


document.onkeydown = (e) => {
    let dy=0|0, dx=0|0
    switch (e.keyCode)
    {
        case 37: //left
        case 65: //left
            dx = -10
        break
        case 38: //up
        case 87: //up
            dy = -10
        break
        case 39: // right
        case 68: // right
            dx = 10
        break
        case 40: //down
        case 83: //down
            dy = 10
        break
    }
    player.setAcc(dx, dy)
}