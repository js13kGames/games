AFRAME.registerComponent('ocean', {  
  schema: {
    // Dimensions of the ocean area.
    width: {default: 32, min: 0},
    depth: {default: 32, min: 0},
    rotation: {x: -90, y: 0, z: 0},
    position: {x: 0, y: 0, z: 0},
    // Density of waves.
    density: {default: 10},
    // Wave amplitude and variance.
    amplitude: {default: 0.1},
    amplitudeVariance: {default: 0.3},
    // Wave speed and variance.
    speed: {default: 1},
    speedVariance: {default: 2},
    // Material.
    color: {default: '#7AD2F7', type: 'color'},
    opacity: {default: 0.9},
    transparent:{default:false},
    type: {default:'ocean'}
  },
  init: function(){
    var data = this.data;
    if (data.type=="ocean"){
        this.canvas = generateTexture(32,32, '#7AD2F7');
    }
    if (data.type=="river"){
        //this.canvas = drawPath("594.28571,320.93364 531.42857,366.64792 537.14286,440.93363 562.85715,466.64792 522.85714,780.93363 511.42857,1003.7908 571.42857,1003.7908 577.14286,1109.5051 545.71429,1309.5051 534.28571,1446.6479 554.28571,1452.3622 545.71429,1480.9336 545.71429,1520.9336 722.85714,1520.9336 762.85714,1495.2193 745.71429,1472.3622 685.71429,1475.2193 654.28571,1446.6479 648.57143,1249.5051 711.42857,966.64792 734.28571,920.93363 714.28571,858.07649 722.85714,826.64792 731.42857,832.3622 731.42857,709.50506 705.71429,620.93364 665.71428,538.07649 677.14286,515.21935 651.42857,500.93363 668.57143,446.64792 697.14286,429.50506 677.14286,386.64792 688.57143,372.3622 657.14286,355.21935", data.color);
    }
   var el = this.el, data = this.data, material = el.components.material;
    var texture = new THREE.CanvasTexture(this.canvas);
    texture.wrapS = THREE.ClampToEdgeWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping;

    var geometry = new THREE.PlaneGeometry(data.width, data.depth, data.density, data.density);
    geometry.mergeVertices();
    this.waves = [];
    for (var v, i = 0, l = geometry.vertices.length; i < l; i++) {
      v = geometry.vertices[i];
      this.waves.push({
        z: v.z,
        ang: Math.random() * Math.PI * 2,
        amp: data.amplitude + Math.random() * data.amplitudeVariance,
        speed: (data.speed + Math.random() * data.speedVariance) / 1000 // radians / frame
      });
    }
    if (!material) {
      material = new THREE.MeshPhongMaterial({
        map: texture, 
        color: '#7AD2F7',
        transparent: data.transparent,
        opacity: data.opacity,
        shading: THREE.FlatShading,
      });
    }

    this.mesh = new THREE.Mesh(geometry, material);
    el.setObject3D('mesh', this.mesh);
    el.setAttribute('class', 'ocean');
  },  
  remove: function () {
    this.el.removeObject3D('mesh');
  },

  tick: function (t, dt) {
    if (!dt) return;

    var verts = this.mesh.geometry.vertices;
    for (var v, vprops, i = 0; (v = verts[i]); i++){
      vprops = this.waves[i];
      v.z = vprops.z + Math.sin(vprops.ang) * vprops.amp;
      vprops.ang += vprops.speed * dt;
    }
    this.mesh.geometry.verticesNeedUpdate = true;
  }
});
