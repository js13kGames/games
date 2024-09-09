(()=> {

var PI = Math.PI;

AFRAME.registerComponent('rotation-ctrl', {

  tick: (function () {
    var rotation = this.el.object3D.rotation;
    if (window.gameRunning) {
      var limit = PI/4;
      rotation.y = -PI/2;
      if (rotation.x > limit/2) rotation.x = limit/2;
      if (rotation.x < -limit) rotation.x = -limit;
      rotation.set(rotation.x, rotation.y, rotation.z);
    } else {
      rotation.y = 0;
      rotation.x = 0;
    }
  })

});

//delete AFRAME.components['look-controls'];
//AFRAME.registerComponent('look-controls', {});

})();
