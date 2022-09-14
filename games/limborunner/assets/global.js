let GLOBAL = {
    ASPECT_MULTIPLIER : 1,
    TILESIZE : 16,
    PROJECT_IMAGES : "assets/Images/",
    FRAMERATE : 1/15,
    CANVAS_CONTAINER : ".canvas_container",
    CANVAS_WIDTH   : 16 * 40, 
    CANVAS_HEIGHT  : 16 * 34,
    CHARS : ' 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ.:-',
    MAPS : {},
    SOUNDS : {},
    IMAGES : {},
    Assets : {
        "loaded" : 0,
        "images_url" : [
            'black-font-8.gif',
            'grass.gif',
            'dirt.gif',
            'zombie.gif',
            'hero1.gif',
            'bricks.gif',
        ],
        "json_url" : [],
        "sounds_url" : [],
        "images"    :{},
        "json"      :{},
        "sounds"    :{},
        "count":6
    },
};
function rotateCW(image,times,passed = 0){
    let buffer = document.createElement('canvas');
    buffer.width = this.entityManager.size;
    buffer.height = this.entityManager.size;
    let context = buffer.getContext('2d');
    let x = 0;
    let y = 0;
    if(passed == 1){
        x = image.width /4;
        y = image.width /2;
    }
    // context.setTransform(
    //     0,1,-1,0,this.tank.size,0
    // );
    context.rotate(Math.PI/4);
    context.drawImage(image,x,y);
    // context.rotate(-Math.PI/4);
    // context.setTransform(1,0,0,1,0,0);
    if(times <= 0) return buffer;
    else return this.rotateCW(buffer,times-1,passed++);
}
const DIRECTION = {
    UP              : Symbol("UP"),             //Rotation 0
    // UPRIGHT         : Symbol("UPRIGHT"),        //Rotation 1
    RIGHT           : Symbol("RIGHT"),          //Rotation 2
    // DOWNRIGHT       : Symbol("DOWNRIGHT"),      //Rotation 3
    DOWN            : Symbol("DOWN"),           //Rotation 4
    // DOWNLEFT        : Symbol("DOWNLEFT"),       //Rotation 5
    LEFT            : Symbol("LEFT"),           //Rotation 6       
    // UPLEFT          : Symbol("UPLEFT"),         //Rotation 7
}
function getDirection(rotation){
    rotation = rotation % 7;
    switch(rotation){
        case 0 : return DIRECTION.UP;
        case 1 : return DIRECTION.UPRIGHT;
        case 2 : return DIRECTION.RIGHT;
        case 3 : return DIRECTION.DOWNRIGHT;
        case 4 : return DIRECTION.DOWN;
        case 5 : return DIRECTION.DOWNLEFT;
        case 6 : return DIRECTION.LEFT;
        case 7 : return DIRECTION.UPLEFT;
    }
}
const rand = (a=1, b=0)=> b + (a-b)*Math.random();
const randInt = (a=1, b=0)=> rand(a,b)|0;