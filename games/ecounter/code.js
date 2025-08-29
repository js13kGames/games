
var canvas = document.getElementById("main")
var draw = canvas.getContext("2d")
var H = window.innerHeight
var W = window.innerWidth
var title = "Encounter\nClick to start"
var flag = false // for dialog box, main will wait until this is true to continues
var player_img = new Image()
player_img.src = "mainchar.svg"
var mx,my
var res

var player_img_w
var player_img_h

var enemy_img_w
var enemy_img_h

var enemy_img = new Image()
enemy_img.src = "enemy.svg"

var bg = new Image()
bg.src = "bg.svg"

var pistol = new Image()//kinfe acturally
pistol.src = "knife.svg"

var blood = new Image()
blood.src="blood.svg"

var holding_pistol = new Image()
holding_pistol.src = "hold_knife.svg"

var cls=(color="#000")=>{draw.fillStyle = color;draw.fillRect(0,0,W,H)}
var n=null

canvas.height = H-10
canvas.width = W

async function delay(seconds){
    await new Promise(resolve => setTimeout(resolve, seconds*1000))
}

var disp_img = (img, w, h, x=0, y=0) => 
    (w && h) ? draw.drawImage(img, x, y, w, h) : draw.drawImage(img, x, y);

var pistol_move = async() =>{
    console.log("move!")
    flag = false
    while(!flag){
        await delay(0.02)
        disp_img(bg,W,H) // put bg
        disp_img(player_img,player_img_w,player_img_h,W/2.3,H/2.3)
        one_msg("Will you...")
        disp_img(pistol,pistol.width*H*0.0015,pistol.height*H*0.0015,mx,my)
    }
    if(((mx-W/2.3-player_img.width/2)**2+(my-H/2.3-player_img.height/2)**2)**0.5 <= 100){
        return false // the cat died
    }else{
        return true
    }
}

var draw_flip_bg = () =>{
    draw.save()
    draw.translate(W-10,0)
    draw.scale(-1,1)

    disp_img(bg,W,H,0,-H/3) // put bg

    draw.restore()
    draw.setTransform(1, 0, 0, 1, 0, 0);
}

async function main(){
    cls()
    draw.font = "20px Trebuchet MS"
    draw.fillStyle = "#fff"
    draw.textAlign = "center"
    disp_txt(title,W/2,H/2)
    draw.textAlign = "left"

    
    await wait_flag()


    
    player_img_w = player_img.width*H*0.0015
    player_img_h = player_img.height*H*0.0015
    //console.log(player_img_w,player_img_h)
    
    disp_img(bg,W,H) // put bg
    await msg("[You]\nDamn Cold!",0.06)
    await msg("[An unfamiliar Voice]\nПомощь......",0.1)
    await msg("[You]\nWho's there?!",0.06)
    disp_img(player_img,player_img_w,player_img_h,W/2.3,H/2.3)
    await msg("[The Black Cat]\nПожалуйста... не убивайте меня...",0.1)
    await msg("You looked at his leg, which was covered in a bloody bandage, \nlooks that shiny under the bright moon light.\nA rifle lies besides him.",0.06)
    await msg("[You]\nWhat a chance! If I retrieve his rifle, I might get a medal!",0.06)
    
    await msg("Clearly he can't understand you, \nbut he instinctively limped back a little.")
    res = await pistol_move()
    if(!res){
        disp_img(bg,W,H)
        disp_img(player_img,player_img_w,player_img_h,W/2.3,H/2.3)
        await msg("[The black cat]\nМамочка, я хочу домой!!!!----......")
        disp_img(bg,W,H)
        disp_img(blood,blood.width*H*0.0015,blood.height*H*0.0015,W/2.3,H/1.7)
        await delay(1)
        await msg("The blade lightened across the neck, \nblood draws a perfect arc in the air. \nThe tiny body twitched on the ground for a while, \nand then stopped moving.")
    }else{
        await msg("[You]\nDamn, forget it, poor little guy...")
        disp_img(bg,W,H) // put bg
        disp_img(player_img,player_img_w,player_img_h,W/2.3,H/2.3)
        await msg("[The Black Cat]\nСпасибо......")
    }
    await msg("You picked up the rifile, and heading to the campsite......")
    cls("#fff")
    await delay(6)
    
    // UP：1st part; DOWN:2nd part
    
    cls()

    draw_flip_bg()

    await msg("[You]\nMy legs... hurt so much...")
    await msg("[You]\nWhy...... they sent me here......\nI don't want to die at the paws of the Germans...")
    await msg("[You]\nHelp......")
    await msg("[An unfamiliar Voice]\nWer ist da?!")
    disp_img(enemy_img,enemy_img.width*H*0.0015,enemy_img.height*H*0.0015,W/2.3,H/2.5)
    await msg("[You]\nPlease... don't kill me...")
    await msg("[The gray wolf]\nWas für eine Chance! Wenn ich sein Gewehr zurückhole, \nbekomme ich vielleicht eine Medaille!")
    await msg("Will he......")//等价翻译
    if(res){
        await msg("[The gray wolf]\nVerdammt, vergiss es, armer kleiner Kerl ...")
        await msg("[You]\nThank you......")
        cls()
        draw_flip_bg()
        await msg("He takes your rifile, and headed back. \nBut you don't want to do anything with it.\nSince you don't want to die yet.")
    }else{
        disp_img(holding_pistol,holding_pistol.width*H*0.0015,holding_pistol.height*H*0.0015,W/2.3,H/2)
        cls("#9f1b2acc")
        await msg("The dagger flashed cold like ice in the night, and with a swish, it slashed\n across your neck. Flowers of blood bloomed in the moonlight,\n you twitched and groaned, staring at him who is standing \nthere without a expression.")
        await msg("[You]\nMammy I want Home!!!!----......")
    }
    cls()
    await delay(3)
    disp_txt("THE END",W/2.5,H/2.3)
    await delay(1)
    disp_txt("Based on real events in World War II.",W/2.5,H/2.1)
    await delay(1)
    disp_txt("A Game by IMG_25522",W/2.5,H/1.9)
}

var wait_flag=async(d = 1)=>{
    while(!flag){await delay(d)}
}

var msg=async(say,delay_time=0.06)=>{
    flag = false
    for(var i=1;i<=say.length;i++){
        one_msg(say.substring(0,i))
        await delay(delay_time)
    }
    await wait_flag()
}

var one_msg=(say)=>{
    draw.fillStyle = "#555"
    draw.fillRect(20,H*3/4,W-30,H/4-30)
    disp_txt(say,20,H*3/4)
}

var disp_txt=(txt,x,y)=>{
    draw.fillStyle = "#fff"
    txt.split("\n").forEach((t,i)=>{draw.fillText(t,x,y+20*(i+1))})
}

window.addEventListener("click", (e)=>{
        var k = e.key
        if (!flag){
            flag = true
        }
    }
)
window.addEventListener('mousemove', (e)=>{
    mx = e.clientX
    my = e.clientY
    //console.log(mx,my)
});

main()