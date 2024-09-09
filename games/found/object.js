class ObjectMaterial {
    constructor (
        x=0,y=0,width=50,height=50,name,material=0,id=0,movingX=false,movingY=false,startX=null,startY=null,endX=null,endY=null,mSpeed=0,reverse=false,fillColor="rgb(225, 237, 232)"
    ){
        this.id = id
        this.x = x
        this.name = name
        this.y = y
        this.isMovingX = movingX
        this.isMovingY = movingY
        this.startX = startX
        this.startY = startY
        this.endX = endX
        this.endY = endY
        this.mSpeed = mSpeed
        this.reverse = reverse
        this.width = width
        this.height = height
        this.material = material
        this.fillColor = fillColor
        this.collision = [false,false,false,false] //URDL
        this.playerKeyHistory = [false,false,false,false] //LURD
        this.objectAnimeCycle = [startX - 1,startY - 1]
        this.objectAnimeCycleStart = [false,false]
        this.key = Math.floor(Math.random() * 10)
        this.flagTouched = false
        this.flagYpos = this.y
        this.enteredKey = [] //for key entered in winning point
        this.winningPointText = "Waiting"
        this.requestNextLevel = false
        this.requestNextLevelFailed = false
    }
    objectInit(){
        this.objectDraw()
            switch(this.material){
                case -1:
                    this.nearObjectEffectDeath()
                    break
                case 0:
                    this.checkCollision()
                    break
                case 1:
                    this.nearObjectEffectKey()
                    break
                case 2:
                    this.nearObjectEffectFinishPoint()
                    break
            }
    }
    nonPlatformObjectInit(){
        
    }
    nearObjectEffectKey(){
        if(this.actualCollision()){
            ctx.beginPath()
            ctx.font = 'bold 15px "Comic Sans MS", cursive, sans-serif'
            this.fillColor = `#42f5a1`
            ctx.fillStyle = this.fillColor
            if(!playerControl.ENTER){
                ctx.textAlign = "center"
                ctx.fillText('Press Enter!', this.x, this.y-50)
                ctx.fill()
            }
            else {
                if(!this.flagTouched){
                    playString("flag")
                    level.nextLevelKey.push(this.key)
                    this.flagTouched = true
                }
                ctx.fillText(this.key, this.x, this.y-50)
                ctx.fill()
            }
        }
    }
    nearObjectEffectFinishPoint(){
        ctx.beginPath()
        if(this.actualCollision(30) && !this.requestNextLevel){
            document.addEventListener("keydown",this.winningPointKeyInput, false);
            document.Object = this
            ctx.beginPath()
            ctx.font = 'bold 15px "Comic Sans MS", cursive, sans-serif'
            //this.fillColor = `#42f5a1`
            ctx.fillStyle = this.fillColor
            ctx.beginPath();
            ctx.lineWidth = 3
            ctx.moveTo(this.x+20, this.y+45);
            ctx.lineTo(this.x+80, this.y+45);
            ctx.fillText('***', this.x+50, this.y+25)
            ctx.fillText(this.enteredKeyVal, this.x+50, this.y+40)
            ctx.stroke();
            ctx.fillText('Enter the codes', this.x+this.width/2, this.y-50)
            if(playerControl.ENTER){
                if (this.enteredKey.length !=0 && level.nextLevelKey.length!=0 && !this.requestNextLevel){
                    this.requestNextLevel = true
                    this.winningPointText = "Fetching"
                    if(JSON.stringify(this.enteredKey)==JSON.stringify(level.nextLevelKey) && this.enteredKey.length == level.totalFlags){
                        setTimeout(()=>{
                            this.winningPointText = "Loading"
                            setTimeout(()=>{
                                level = LevelGenerator(level.nextLevel)
                            },1000)
                        },1000)
                    }
                    else{
                        setTimeout(()=>{
                            this.requestNextLevelFailed = true
                            setTimeout(()=>{
                                level = LevelGenerator(level.name)
                            },1000)
                        },1000)
                    }
                }
            }
            ctx.fill()
            ctx.stroke()
        }
        else {
            document.removeEventListener("keydown",this.winningPointKeyInput, false);
            ctx.fillStyle = "rgb(225, 237, 232)"
            ctx.font = 'bold 12px "Lucida Console", Monaco, monospace'
            if(!this.requestNextLevelFailed){
                ++this.objectAnimeCycle[0]
                ctx.fillText(`${level.name}`, this.x+50, this.y+30)
                if(this.objectAnimeCycle[0]>50 && this.objectAnimeCycle[0]<100){
                    ctx.fillText(`${this.winningPointText}..`, this.x+50, this.y+45)
                }
                else if(this.objectAnimeCycle[0]>=100 && this.objectAnimeCycle[0]<150) {
                    ctx.fillText(`${this.winningPointText}...`, this.x+50, this.y+45)
                }
                else {
                    ctx.fillText(`${this.winningPointText}....`, this.x+50, this.y+45)
                }
                if (this.objectAnimeCycle[0]>150){
                    this.objectAnimeCycle[0]=0
                }
            }
            else{
                ctx.fillText(`Not Found!`, this.x+50, this.y+30)
            }
            ctx.fill()
            ctx.stroke()
        }
    }
    winningPointKeyInput(event){
        const key = event.key
        const keyPas = parseInt(key)
        const object = event.currentTarget.Object
        if (Number.isInteger(keyPas) && object.enteredKey.length <4){
            object.enteredKey.push(keyPas)
            playString("keyPress")
        }
        else if(key == "Backspace"){
            object.enteredKey.pop()
        }
    }
    get enteredKeyVal() {
        var str = ""
        for(var i=0;i<this.enteredKey.length;i++){
            if(i==this.enteredKey.length-1){
                str += this.enteredKey[i]
            }
            else {
                str += this.enteredKey[i]+" "
            }
        }
        return str
    }
    nearObjectEffectDeath(){
        if(this.actualCollision()){
            player.isDead()
        }
    }
    keyFlagPoint(){
        //ObjectMaterial(50,550,50,90,"star",objid++,1)
        if(this.flagTouched){
            if(this.objectAnimeCycle[0]<this.height-40){
                this.flagYpos += 1
                this.objectAnimeCycle[0]++
            }
        }
        ctx.beginPath()
        ctx.moveTo(this.x, this.y); 
        ctx.lineTo(this.x, this.y+this.height);
        ctx.ellipse(this.x, this.y+5, 2, 2, Math.PI / 2, 0, 2 * Math.PI);
        ctx.ellipse(this.x, this.y+this.height, 2, 5, Math.PI / 2, 0, 2 * Math.PI);
        ctx.lineWidth = 6;
        ctx.strokeStyle = "#ddd";
        ctx.fillStyle = "#ddd"
        ctx.stroke();
        //flag triangle
        ctx.beginPath();
        ctx.moveTo(this.x, this.flagYpos+10);
        ctx.lineTo(this.x, this.flagYpos+40);
        ctx.lineTo(this.x+this.width, this.flagYpos+25);
        ctx.fill();
    }
    checkMoving(){
        if(this.isMovingX){
            if(!this.objectAnimeCycleStart[0]^this.reverse){
                this.x +=this.mSpeed
            }
            else {
                this.x -=this.mSpeed
            }
            if(!this.objectAnimeCycleStart[0]){
                this.objectAnimeCycle[0] +=this.mSpeed
            }
            else {
                this.objectAnimeCycle[0]-=this.mSpeed
            }
            if(this.objectAnimeCycle[0] <this.startX){
                this.objectAnimeCycleStart[0] = false
            }
            else if(this.objectAnimeCycle[0]>=this.endX){
                this.objectAnimeCycleStart[0] = true
            }
            
        }
        if(this.isMovingY){
            if(!this.objectAnimeCycleStart[1]^this.reverse){
                this.y +=this.mSpeed
            }
            else {
                this.y -=this.mSpeed
            }
            if(!this.objectAnimeCycleStart[1]){
                this.objectAnimeCycle[1] +=this.mSpeed
            }
            else {
                this.objectAnimeCycle[1]-=this.mSpeed
            }
            if(this.objectAnimeCycle[1] <this.startY){
                this.objectAnimeCycleStart[1] = false
            }
            else if(this.objectAnimeCycle[1]>=this.endY){
                this.objectAnimeCycleStart[1] = true
            }
            
        }
    }
    drawPlatform(){
        this.checkMoving()
        ctx.beginPath()
        ctx.fillStyle = this.fillColor;
        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.fill()
        ctx.stroke();
        ctx.beginPath()
        ctx.lineWidth = 5
        ctx.strokeStyle = "#f24d1b";
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y+this.height);
        ctx.moveTo(this.x+this.width, this.y);
        ctx.lineTo(this.x+this.width, this.y+this.height);
        ctx.stroke();

    }
    winningPoint(){
        ctx.beginPath()
        ctx.lineJoin = "round";
        ctx.strokeStyle = this.fillColor
        ctx.fillStyle = "#ddd"
        ctx.lineWidth = 8
        ctx.strokeRect(this.x, this.y, this.width, this.height)
        ctx.stroke()
        ctx.textAlign = 'center';
        ctx.beginPath()
        ctx.fillRect(this.x, this.y+(this.height/2)+20, this.width, this.height/4)
        ctx.beginPath()
        ctx.fillStyle = "rgb(59, 59, 59)"
        ctx.ellipse(this.x+this.width/2, this.y+this.height-12, 10, 10, Math.PI / 2, 0, 2 * Math.PI);
        ctx.fill()
        ctx.stroke()
    }
    objectDraw(){
        switch(this.material){
            case -1:
                this.drawPlatform()
                break
            case 0:
                this.drawPlatform()
                break
            case 1:
                this.keyFlagPoint()
                break
            case 2:
                this.winningPoint()
                break
        }
    }
    get isColliding(){
        var c = false
        for(var i=0;i<4;i++){
            if(this.collision[i]){
                c = true
                break
            }
        }
        return c
    }
    storeKeyHistory(){
        //LURD
        if(!this.playerKeyHistory[0]){
            if(this.isMovingX){
                this.playerKeyHistory[0] = playerControl.LEFT || (!this.objectAnimeCycleStart[0]^this.reverse)
            }
            else {
                this.playerKeyHistory[0] = playerControl.LEFT
            }
        }
        if(!this.playerKeyHistory[1]){
            if(this.isMovingY){
                this.playerKeyHistory[1] = (playerControl.UP || playerControl.JUMP) || (!this.objectAnimeCycleStart[1]^this.reverse)
            }
            else {
                this.playerKeyHistory[1] = playerControl.UP || playerControl.JUMP
            }
        }
        if(!this.playerKeyHistory[2]){
            if(this.isMoving){
                this.playerKeyHistory[2] = playerControl.RIGHT || (this.objectAnimeCycleStart[0]^this.reverse)
            }
            else {
                this.playerKeyHistory[2] = playerControl.RIGHT
            }
        }
        if(!this.playerKeyHistory[3]){
            if(this.isMovingY){
                this.playerKeyHistory[3] = (playerControl.DOWN || player.gravityAvailabe) || (this.objectAnimeCycleStart[1]^this.reverse)
            }
            else {
                this.playerKeyHistory[3] = playerControl.DOWN || player.gravityAvailabe
            }
        }
    }
    objYbound(val=0){
        if(player.y+player.height>this.y-val && player.y<this.y+this.height+val){
            return true
        }
        else {
            return false
        }
    }
    objXbound(val=0){
        if(player.x+player.width>=this.x - val && player.x<=this.x+this.width + val){
            return true
        }
        else {
            return false
        }
    }
    actualCollision(x=0){
        return this.objXbound(x) && this.objYbound(x)
    }
    restoreKeyHist(val){
        var i = 4
        while(i>=0){
            if(i!=val){
                this.playerKeyHistory[i]=false
            }
            i--
        }
    }
    checkCollision(x=player.x,y=player.y){
        this.storeKeyHistory()
        if(!this.isColliding &&player.isAlive){
            //if not colliding check for collision
            if(x+player.width>=this.x && x<=this.x+this.width){
                if(y<=this.y+this.height && y>=this.y && this.playerKeyHistory[1]){
                    //D collision
                    this.collision[2] = true
                    //console.log("collision D ",this.name)
                }
                else if (y+player.height>=this.y &&y+player.height<=this.y+this.height && this.playerKeyHistory[3]){
                    //U collision
                    this.collision[0] = true
                    //console.log("collision U ",this.name)
                }
            }
            if(y+player.height>=this.y+30 && y<=this.y+this.height) {
                if (x+player.width>this.x && x+player.width<this.x+this.width){
                }
                if(this.playerKeyHistory[2] && x+player.width>this.x && x+player.width<this.x+this.width){
                    //L collision
                    //this.collision[3] = true
                    //killing the player if touched right or left
                    player.isDead()
                    //console.log("collision L ",this.name) 
                }
                else if(this.playerKeyHistory[0] && x<this.x+this.width && x>this.x){
                    //R collision
                    //killing the player if touched right or left
                    player.isDead()
                    //this.collision[1] = true
                    //console.log("collision R ",this.name)
                }
            }
        }
        else {
            if(((x+player.width<this.x && this.playerKeyHistory[0]) || !this.objYbound()) && player.rCollision[this.id]){
                //L collision
                this.collision[3] = false
                //console.log("decollision L ",this.name) 
            }
            if(((x>this.x+this.width && this.playerKeyHistory[2]) || !this.objYbound()) && player.lCollision[this.id]){
                //R collision
                this.collision[1] = false
                //console.log("decollision R ",this.name)
            }
            if (((y+player.height<=this.y && (this.playerKeyHistory[1])) || !this.objXbound()) && player.dCollision[this.id]){
                //U collision
                this.collision[0] = false
                //console.log("decollision U ",this.name,this.id)
            }
            if(((y>=this.y+this.height && this.playerKeyHistory[3]) || !this.objXbound()) && player.uCollision[this.id]){
                //D collision
                this.collision[2] = false
                //console.log("decollision D ",this.name)
            }
            player.lCollision[this.id] = this.collision[1]
            player.rCollision[this.id] = this.collision[3]
            player.dCollision[this.id] = this.collision[0]
            player.uCollision[this.id] = this.collision[2]
        }
        this.restoreKeyHist()
        if(!player.isAlive){
            for(var i=0;i<4;i++){
                this.collision[i] = false
            }
        }
        //making players leg on ground if inside
        if (player.dCollision[this.id] && player.isAlive){
            if (y+player.height>this.y){
                player.y = this.y - player.height + player.speed
            }
        }
    }
}