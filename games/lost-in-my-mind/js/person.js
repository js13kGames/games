AFRAME.registerComponent('person', {  
  schema: {
    width: {default: 32, min: 0},
    depth: {default: 32, min: 0},
    rotation: {x: -90, y: 0, z: 0},
    density: {default: 10},
    amplitude: {default: 0.1},
    amplitudeVariance: {default: 0.3},
    speed: {default: 1},
    speedVariance: {default: 2},
    color: {default: '#7AD2F7', type: 'color'},
    opacity: {default: 0.8},
  },
  init: function(){
    var data = this.data;
    this.canvas = drawPath("620.71428,318.79078 555.35714,337.00506 523.57143,400.93363 562.85714,468.07649 525.71429,544.50506 522.85714,780.93363 511.42857,1003.7908 571.42857,1003.7908 579.28572,1115.2194 545.71429,1309.5051 534.28571,1446.6479 554.28571,1452.3622 545,1488.0765 549.28572,1526.6479 616.07143,1513.7908 712.85714,1515.2193 757.85714,1499.505 742.14286,1475.9336 685.71429,1475.2193 654.28571,1446.6479 648.57143,1249.5051 669.28571,1121.6479 711.42857,966.64792 730,918.79077 717.85714,858.07649 717.14285,836.64792 735,824.50506 715.71428,648.79077 666.42858,532.36221 673.57142,508.07649 650,493.79078 664.28571,455.93363 700,434.50506 687.85715,397.3622 678.57143,383.07649 683.57143,368.79077 650,354.50506 644.28571,342.71935 620.71428,333.96935", data.color);

    var el = this.el, data = this.data, material = el.components.material,
        texture = new THREE.CanvasTexture(this.canvas),
        geometry = new THREE.PlaneGeometry(data.width, data.depth, data.density, data.density),
        material = new THREE.MeshPhongMaterial({
           map: texture, 
           color: '#7AD2F7',
           transparent: data.opacity < 1,
           opacity: data.opacity,
           shading: THREE.FlatShading,
        });
    texture.wrapS = THREE.ClampToEdgeWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping;
 
    this.mesh = new THREE.Mesh(geometry, material);
    el.setObject3D('mesh'+Math.random(), this.mesh);
  },  

  tick: function (t, dt) {
    
  }
});
