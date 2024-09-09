    //w, h, d, x, y, z, rot_x, rot_y, rot_z
function createDoor(el,w, h, d, x, y, z, rot_x, rot_y, rot_z,col){
    // door 1
    var r1 = getStrut(el,0.1,3,0.1, x,y-1,z+3,rot_x, rot_y, rot_z, col),
        l1 = getStrut(el,0.1,3,0.1, x-1.5,y-1,z+3,rot_x, rot_y, rot_z, col),
        t1 = getStrut(el,1.6,0.1,0.1, x-.75,y+0.5,z+3,rot_x, rot_y, rot_z, col),
        m1 = getStrut(el,1.6,0.1,0.1, x-.75,y-1,z+3,rot_x, rot_y, rot_z, col),
        b1 = getStrut(el,1.6,0.1,0.1, x-.75,y-2.4,z+3,rot_x, rot_y, rot_z, col),
        door = getStrut(el,1.6,3,0.05, x-.75,y-0.95,z+3,rot_x, rot_y, rot_z, '#7BC8A4');
};
function createWindow(el,w, h, d, x, y, z, rot_x, rot_y, rot_z,col){
    // window 1
    var topy = y;
    var r1 = getStrut(el,0.1,2,0.1, x+.5,topy,z+3,rot_x, rot_y, rot_z, col)
        l1 = getStrut(el,0.1,2,0.1, x-.5,topy,z+3,rot_x, rot_y, rot_z, col),
        t1 = getStrut(el,1.1,0.1,0.1, x,topy+1,z+3,rot_x, rot_y, rot_z, col),
        m1 = getStrut(el,1.1,0.1,0.1, x,topy+.5,z+3,rot_x, rot_y, rot_z, col),
        b1 = getStrut(el,1.1,0.1,0.1, x,topy-.9,z+3,rot_x, rot_y, rot_z, col),
        sill = getStrut(el,1.2,0.1,0.3, x,topy-1,z+3,rot_x, rot_y, rot_z, col),
        door = getStrut(el,1,2,0.05, x,topy,z+3,rot_x, rot_y, rot_z, '#7BC8A4');
    
};

AFRAME.registerComponent('house', {
schema: {
    w: {default: 32, min: 0},
    h: {default: 32, min: 0},
    d: {default: 32, min: 0},
    rotation: {default: "0 0 0"},
    position: {default: "0 0 0"},
  },

  init: function () {
    var el = this.el, data = this.data, pos = data.position.split(' ')
    var rot = data.rotation.split(' '); 
    var x = pos[0], y = pos[1], z = pos[2];
    // building
    this.geometry = new THREE.BoxGeometry(12, 6, 10, 2, 2, 2);
    this.material = new THREE.MeshPhongMaterial({
        color: '#CCC',
        opacity: 1,
        side: THREE.DoubleSide,
        shading: THREE.FlatShading,
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(x+3,y,z-1.5);
    this.mesh.rotation.set(rot[0],rot[1],rot[2]);
    el.setObject3D('house'+Math.random(), this.mesh);
    console.log(x,y,z)

    // top floor building
    this.geometry = new THREE.BoxGeometry(12, 9, 10, 2, 2, 2);
    this.material = new THREE.MeshPhongMaterial({
        color: '#555',
        opacity: 1,
        side: THREE.DoubleSide,
        shading: THREE.FlatShading,
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(x-5,y+7.7,z-2);
    this.mesh.rotation.set(rot[0],rot[1],rot[2]);
    el.setObject3D('house'+Math.random(), this.mesh);
   
    // garage building
    this.geometry = new THREE.BoxGeometry(12, 9, 10, 2, 2, 2);
    this.material = new THREE.MeshPhongMaterial({
        color: '#CCC',
        opacity: 1,
        side: THREE.DoubleSide,
        shading: THREE.FlatShading,
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(x-9,y,z-2.5);
    this.mesh.rotation.set(rot[0],rot[1],rot[2]);
    el.setObject3D('house'+Math.random(), this.mesh);

    var pos = data.position.split(' '),
        rot = data.rotation.split(' ');

    createDoor(el,data.w, data.h, data.d, parseInt(pos[0]), pos[1], parseInt(pos[2])+0.5, parseInt(rot[0]), parseInt(rot[1]), parseInt(rot[2]), 'brown');
    createWindow(el,data.w, data.h, data.d, parseInt(pos[0])+1, parseInt(pos[1])-0.5, parseInt(pos[2])+0.5, parseInt(rot[0]), parseInt(rot[1]), parseInt(rot[2]), 'brown');
    createWindow(el,data.w, data.h, data.d, parseInt(pos[0])-5, parseInt(pos[1])-0.5, parseInt(pos[2])-0.5, parseInt(rot[0]), parseInt(rot[1]), parseInt(rot[2]), 'brown');
    createWindow(el,data.w, data.h, data.d, parseInt(pos[0])-9, parseInt(pos[1])-0.5, parseInt(pos[2])-0.5, parseInt(rot[0]), parseInt(rot[1]), parseInt(rot[2]), 'brown');
    createWindow(el,data.w, data.h, data.d, parseInt(pos[0])-7, parseInt(pos[1])+6, parseInt(pos[2]), parseInt(rot[0]), parseInt(rot[1]), parseInt(rot[2]), 'brown');
    createWindow(el,data.w, data.h, data.d, parseInt(pos[0])-4, parseInt(pos[1])+6, parseInt(pos[2]), parseInt(rot[0]), parseInt(rot[1]), parseInt(rot[2]), 'brown');

   // createDoor(el,data.w, data.h, data.d, parseInt(pos[0]), pos[1], parseInt(pos[2])-2.5, parseInt(rot[0]), 90, parseInt(rot[2]), 'red');
  },
})

function getStrut(el,w,h,d,x,y,z,rx,ry,rz, col){
    // door_leftframe
    var geometry = new THREE.BoxGeometry(w, h, d, 1, 1, 1);
    var material = new THREE.MeshPhongMaterial({
            color: col,
            opacity: 1,
            side: THREE.DoubleSide,
            shading: THREE.FlatShading
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x,y,z);
    mesh.rotation.set(rx,ry,rz);
    el.setObject3D('door_'+Math.random(), mesh);
    return mesh;
};
