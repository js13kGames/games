class Player {
    constructor (
        x=0,y=0,height=85,width=40,speed=8
    ) {
        this.x = x
        this.y = y
        this.width = Number(width)
        this.height = Number(height)
        this.screenResized = false
        this.charAlpha = 1; //alpha opacity for player
        this.fillColor = `rgb(225, 237, 232,${this.charAlpha})`
        this.speed = speed
        this.rCollision = [false]
        this.lCollision = [false]
        this.uCollision = [false]
        this.dCollision = [false]
        this.gravityAvailabe = true
        this.jumpHeight = 30
        this.jumpSpeed = 14
        this.inAir = true
        this.jumpPressed = false
        this.charAnimCycle = 0;
        this.deathAnimCycle = 0;
        this.startX = x
        this.startY = y
        this.characterDraw()
        this.isAlive = true
    }
    start() {
        this.addGravity()
        this.borderCollision()
        this.characterDraw()
        this.attachControls()
        this.deathCounter()
    }
    newPos(val,speed=1){
        //1,2,3,4 as URDL
        if(this.isAlive){
            if(val==1 && !this.collisionU){
                this.y -=speed
            }
            if(val==2 && !this.collisionR){
                this.x +=speed
            }
            if(val==3 && !this.collisionD){
                this.y +=speed
            }
            if(val==4 && !this.collisionL){
                this.x -=speed
            }
        }
    }

    borderCollision() {
        if (this.collisionD){
            this.inAir = false
        }
        else {
            this.inAir = true
        }
        if((this.y+this.height) >=newGameArea.height){
            this.isDead()
        }
        if((this.x) <=5){
            this.lCollision[objid+1] = true
        }
        else {
            this.lCollision[objid+1] = false
        }
        if((this.x+this.width) >newGameArea.width-5){
            this.rCollision[objid+1] = true
        }
        else {
            this.rCollision[objid+1] = false
        }
    }
    get collisionL(){
        var len = this.lCollision.length
        var collision = false
        for(var i=0;i<len;i++){
            if(this.lCollision[i]){
                collision = this.lCollision[i]
                break
            }
        }
        return collision
    }
    get collisionR(){
        var len = this.rCollision.length
        var collision = false
        for(var i=0;i<len;i++){
            if(this.rCollision[i]){
                collision = this.rCollision[i]
                break
            }
        }
        return collision
    }
    get collisionU(){
        var len = this.uCollision.length
        var collision = false
        for(var i=0;i<len;i++){
            if(this.uCollision[i]){
                collision = this.uCollision[i]
                break
            }
        }
        return collision
    }
    get collisionD(){
        var len = this.dCollision.length
        var collision = false
        for(var i=0;i<len;i++){
            if(this.dCollision[i]){
                collision = this.dCollision[i]
                break
            }
        }
        return collision
    }
    addGravity() {
        //playerControl.DOWN = this.gravityAvailabe
        if(this.gravityAvailabe){
            this.newPos(3,this.speed*1.75)
        }
    }
    onRight = function(){
        if(playerControl.RIGHT){
            this.newPos(2,this.speed)
        }
    }
    onLeft = function(){
        if(playerControl.LEFT){
            this.newPos(4,this.speed)
        }
    }
    onUp = function(){
        if(!this.gravityAvailabe){
            if(playerControl.UP){
                this.newPos(1,this.speed)
            }
        }
    }
    onDown = function(){
        if(!this.gravityAvailabe){
            if(playerControl.DOWN){
                this.newPos(3,this.speed)
            }
        }
    }
    onJump= async function(){
        if(playerControl.JUMP && this.gravityAvailabe){
            var move = 1;
            if(!this.inAir && !this.jumpPressed && this.collisionD) {
                this.inAir = true
                this.jumpPressed = true
                while(move<this.jumpHeight) {
                    this.newPos(1,this.jumpSpeed)
                    move +=1;
                    await sleep(1)
                }
            }
        }
    }
    attachControls(){
        if(this.isAlive){
            this.onJump()
            this.onRight()
            this.onLeft()
            this.onUp()
            this.onDown()
        }
    }
    isDead(){
        if (this.isAlive){
            deaths++
            this.isAlive = false
            playString()
        }
    }
    deathCounter(){
        ctx.beginPath()
        ctx.lineWidth = "4";
        ctx.strokeStyle = "rgb(225, 237, 232,0.5)";
        ctx.fillStyle = "rgb(225, 237, 232,0.5)"
        ctx.font = 'bold 18px Monospace'
        ctx.fillText('x', 50, 65)
        ctx.fillText('x', 70, 65)
        ctx.font = 'bold 25px "Comic Sans MS", cursive, sans-serif'
        ctx.fillText('x', 100, 70)
        ctx.textAlign = "left"
        ctx.fillText(`${deaths}`, 110, 70)
        ctx.strokeRect(40, 50, 40, 25)
        ctx.stroke()
    }
    characterDraw() {
        var eyePos = this.x
        var eyeSize = [5,2]
        var eyeCycle = 200;
        if(this.charAnimCycle >eyeCycle && this.charAnimCycle <eyeCycle+10){
            eyeSize = [1,0]
            
        }
        else if(this.charAnimCycle > eyeCycle+50){
            this.charAnimCycle = 0
        }
        if(playerControl.LEFT && this.isAlive){
            eyePos = this.x-4
        }
        if(playerControl.RIGHT && this.isAlive){
            eyePos = this.x+4
        }
        if(!this.isAlive){
            this.deathAnimCycle +=1;
            eyeSize = [1,0]
            if(this.deathAnimCycle>0 &&this.deathAnimCycle<50){
                ctx.beginPath()
                ctx.font = 'bold 18px Monospace'
                this.fillColor = `rgb(225, 237, 232,${this.charAlpha})`
                ctx.fillStyle = this.fillColor
                ctx.fillText('x', eyePos+10, this.y+15)
                ctx.fillText('x', eyePos+30, this.y+15)
                this.charAlpha -= 0.01;
                ctx.stroke()
            }
            else if(this.deathAnimCycle >50){
                /*this.x = this.startX
                this.y = this.startY*/
                level.start()
                this.deathAnimCycle = 0
                this.isAlive = true
                this.charAlpha = 1
                this.fillColor = `rgb(225, 237, 232,${this.charAlpha})`
            }
        }
        this.charAnimCycle += 1;
        ctx.lineWidth = 4
        ctx.strokeStyle = this.fillColor
        //head
        ctx.strokeRect(this.x, this.y, 40, 25)
        ctx.fillStyle = this.fillColor;
        //body
        ctx.fillRect(this.x, this.y+25, 40, 35);
        //legs
        ctx.fillRect(this.x+5, this.y+60, 10, 20);
        ctx.fillRect(this.x+25, this.y+60, 10, 20);
        //eye
        ctx.beginPath()
        ctx.ellipse(eyePos+10, this.y+10, eyeSize[0], eyeSize[1], Math.PI / 2, 0, 2 * Math.PI);
        ctx.fill()
        ctx.stroke()
        ctx.beginPath()
        ctx.ellipse(eyePos+30, this.y+10,eyeSize[0], eyeSize[1], Math.PI / 2, 0, 2 * Math.PI);
        ctx.fill()
        ctx.stroke()

    }
}