var ct = document.createElement("canvas");
var xc = ct.getContext("2d");

function highlight(self, colour){
   self.setAttribute('colour', colour);
};
function factory(tag_name, options, components, attrs){
    var tag = document.createElement(tag_name);
    for (k in options){
        tag.setAttribute(k, options[k]);
    }
    for (c in components){
        comp = components[c]
        tag.setAttribute(comp, attrs);
    }
    return tag;
};

function addToScene(scene, obj_arr){
    entity_count += 1;
    for (var obj in obj_arr){
        scene.appendChild(obj_arr[obj]);
    }
};

function getTextWidth(text, fontsize=30){
    xc.font=fontsize+"px Arial";
    return xc.measureText(text).width;
};

function drawPath(points, color){
    ct.width = 512;
    ct.height = 512;
    xc.clearRect(0,0,ct.width, ct.height);
    var grd=xc.createRadialGradient(ct.width*0.5,ct.height*0.5, ct.height*0.25, ct.width*0.5, ct.height*0.5, ct.height*0.50);
    grd.addColorStop(0,color);
    grd.addColorStop(1,"transparent");
    xc.fillStyle=grd;
    points = points.split(' ');
    var startCoords = points[0].split(',');
    var startx = parseInt(startCoords[0]);
    var starty = parseInt(startCoords[1]);
    xc.beginPath();
    xc.moveTo(Math.abs(startx), Math.abs(starty));
    var minX=ct.width, minY=ct.height, maxX=0, maxY=0;
    for (var p in points){
        coords = points[p].split(',');
        var x=parseInt(coords[0])
        var y=parseInt(coords[1])
        if (startx + x > maxX){
            maxX = startx + x;
        }
        if (starty + y > maxY){
            maxY = starty + y;
        }
    }
    ct.width = maxX;
    ct.height = maxY;
    for (var p in points){
        var coords = points[p].split(',');
        var x=parseInt(coords[0]);
        var y=parseInt(coords[1]);
        xc.lineTo(x, y);
    }
    xc.closePath();
    xc.stroke();
    xc.fill();
    return ct;
};
function generateTexture (width, height, color) {
var ct = document.createElement("canvas");

  var xc = ct.getContext('2d');

  xc.clearRect(0,0,ct.width, ct.height);
  ct.width = width;
  ct.height = height;
  xc.clearRect(0,0,ct.width, ct.height);

  xc.fillStyle=color; 
  var grd=xc.createRadialGradient(width*0.5,height*0.5, height*0.25, width*0.5, height*0.5, height*0.50);
  grd.addColorStop(0,color);
  grd.addColorStop(1,"transparent");
  xc.fillStyle=grd;
  xc.fillRect(0,0,width,height);
  return ct;
};

function getText(text){
    ct.width = 512;
    ct.height = 128;
    xc.clearRect(0,0,ct.width, ct.height);

    xc.shadowColor = "#000";
    xc.shadowBlur = 7;
    xc.fillStyle = "orange";
    xc.font = "30pt arial bold";
    xc.fillText(text, 10, 64);

    var xm = new THREE.MeshBasicMaterial({ map: new THREE.Texture(ct), transparent: true });
    xm.map.needsUpdate = true;

    var mesh = new THREE.Mesh(new THREE.CubeGeometry(150, 150, 150), xm);
    mesh.position.x = -400;
    mesh.position.y = 0;
    mesh.position.z = 0;
    mesh.doubleSided = true;
    return mesh;
};

