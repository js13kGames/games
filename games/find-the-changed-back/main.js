var canvas = document.getElementById("renderCanvas");
var scene, camera;
var textPlane;
var font;
var changeMaterial;
var startFlag=false;
var texts =["Start game",
            "Game Over",
            "TRUE! ",
            "FALSE",
            "TEST! ", 
            "press here for start",
            "",
            "Now changing...",
];
var createScene  = function () {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0.3,0.3,0.3);
  //scene.debugLayer.show();

    var sY=0;
    var sZ=2;

    //set sphere
    createSphere(-3,sY,sZ, 0.7,0.5,0, 0);//b=0
    createSphere(-1.5,sY,sZ, 0.5,0,0.2, 1);//g=0
    createSphere(0,sY,sZ, 0.6,0.2,0, 2);//b=0
    createSphere(1.5,sY,sZ, 0,0.3,0.6,3);//r=0
    createSphere(3,sY,sZ, 0.8,0,0.6,4);//g=0

    createSphere(-3,sY+2,sZ,  0,0.5,0.7, 5);//r=0
    createSphere(-1.5,sY+2,sZ, 0,0.8,0, 6);//b=0
    createSphere(0,sY+2,sZ, 0,0.2,0.9,7);//r=0
    createSphere(1.5,sY+2,sZ, 0.7,0,0.7, 8);//g=0
    createSphere(3,sY+2,sZ, 0.6,0.7,0, 9);//=b=0

    //Set color-changed sphere id
    var minNum=0;
    var maxNum=9;
    var true_id = Math.floor( Math.random() * (maxNum + 1 - minNum) ) + minNum ;
    var changeColorMesh =scene.getMeshByName("sphere"+true_id);
    
    //Set text
    genTextBoard("startBoard",texts[5],0,-5,25);
    genTextBoard("progressBoard",texts[6],0,2,25);
    genTextBoard("judgeBoard",texts[6],0,4,25);

    //For VR: Only right controller is valid.
    var selectedMesh;
    var VRHelper = scene.createDefaultVRExperience();
    VRHelper.enableInteractions();

    VRHelper.onControllerMeshLoaded.add((webVRController)=>{
        var rightLastTriggerValue;
        webVRController.onTriggerStateChangedObservable.add((stateObject)=>{
            if(webVRController.hand ==='right'){
                if(rightLastTriggerValue < 0.9 && stateObject.value >= 0.9 && selectedMesh !=null ){
                    if( (selectedMesh.name == "startBoard")&&(startFlag==false) ){
                        startFlag=true;
                        updateTextBoard("startBoard",texts[6]);
                        updateTextBoard("progressBoard",texts[7]);
                        var cnt = function(){
                            switch(true_id){
                                case 3:
                                case 5:
                                case 7:
                                    changeColorMesh.material.diffuseColor.r+=0.01;
                                    if(changeColorMesh.material.diffuseColor.r >= 1){
                                        clearInterval(timerID);
                                        updateTextBoard("progressBoard",texts[1]);
                                    }  
                                    break;
                                case 1:
                                case 4:
                                case 8:
                                    changeColorMesh.material.diffuseColor.g+=0.01;
                                    if(changeColorMesh.material.diffuseColor.g >= 1){
                                        clearInterval(timerID);
                                        updateTextBoard("progressBoard",texts[1]);
                                    }  
                                    break;
                                case 0:
                                case 2:
                                case 6:
                                case 9:
                                    changeColorMesh.material.diffuseColor.b+=0.01;
                                    if(changeColorMesh.material.diffuseColor.b >= 1){
                                        clearInterval(timerID);
                                        updateTextBoard("progressBoard",texts[1]);
                                    }        
                                    break;                              
                            }
                         }
                         var timerID = setInterval(cnt, 100);//count up 0.01 at every 100msec => duration is 10sec     
                    }else if((selectedMesh.name =="sphere"+true_id)&&(startFlag==true)){
                        updateTextBoard("judgeBoard",texts[2]);
                    }else if(selectedMesh.name.indexOf("sphere") == -1){
                    }else if((selectedMesh.name !="sphere"+true_id)&&(startFlag==true)){
                        updateTextBoard("judgeBoard",texts[3]);
                    }else{

                    }
                }
                rightLastTriggerValue = stateObject.value;
            }   
        });
    });


    VRHelper.onNewMeshSelected.add(function(mesh) {
        selectedMesh = mesh;
    });

    VRHelper.onSelectedMeshUnselected.add(function() {
        selectedMesh=null;
    });
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
    return scene;
}

var createSphere = function(posX,posY,posZ,colorR,colorG,colorB,id){
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere"+id, {diameter: 2, segments: 32}, scene);
    sphere.position = new BABYLON.Vector3(0.5+posX,1+posY,4+posZ);
    sphere.scaling = new BABYLON.Vector3(0.5,0.5,0.5);
    var mat = new BABYLON.StandardMaterial("Material"+id, scene);
    mat.diffuseColor = new BABYLON.Color3(colorR, colorG, colorB);
    mat.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
    mat.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);
    sphere.material = mat;
}

var genTextBoard = function(boardName,textMessage,posX,posY,posZ){
    var planeWidth = 10;
    var planeHeight = 3;

    textPlane = BABYLON.MeshBuilder.CreatePlane(boardName, {width:planeWidth, height:planeHeight}, scene);
    textPlane.position = new BABYLON.Vector3(posX, posY, posZ);
    var DTWidth = planeWidth * 60;
    var DTHeight = planeHeight * 60;

    var dTexture =  new BABYLON.DynamicTexture("DynamicTexture", {width:DTWidth, height:DTHeight}, scene);
    dTexture.hasAlpha=true;
    var ctx = dTexture.getContext();
    var size = 12; 
    ctx.font = size + "px " + "Arial";
    var textWidth = ctx.measureText(textMessage).width;
    var ratio = textWidth/size;
    var font_size = Math.floor(DTWidth / (ratio * 1)); 
    font = font_size + "px " + "Arial";
    dTexture.drawText(textMessage, null, null, font, "#111111", "transparent", true,true);
    var mat = new BABYLON.StandardMaterial("mat", scene);
    mat.diffuseTexture = dTexture;
    textPlane.material = mat; 
}

var updateTextBoard = function(meshName,textMessage){
    var tmp_mesh = scene.getMeshByName(meshName);
    if(tmp_mesh !=null){
        var dTexture = tmp_mesh.material.diffuseTexture;
        var DTWidth = 600;
        var DTHeight = 180;
        var ctx = dTexture.getContext();
        ctx.clearRect(0, 0, DTWidth, DTHeight);
        ctx.font = 12 + "px " + "Arial";
        var textWidth = ctx.measureText(textMessage).width;
        var ratio = textWidth/12;
        var font_size = Math.floor(DTWidth / (ratio * 1)); 
        font = font_size + "px " + "Arial";
        dTexture.drawText(textMessage, null, null, font, "#111111", "transparent", true,true);
    }

}

var engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
var scene = createScene();

engine.runRenderLoop(function () {
   if (scene) {
       scene.render();
   }
});
window.addEventListener("resize", function () {
   engine.resize();
});