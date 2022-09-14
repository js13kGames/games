AFRAME.registerComponent('collider',{schema:{},init:function(){this.el.sceneEl.addBehavior(this)},tick:function(){var sceneEl=this.el.sceneEl;var mesh=this.el.getObject3D('mesh');var object3D=this.el.object3D
var originPoint=this.el.object3D.position.clone();for(var vertexIndex=0;vertexIndex<mesh.geometry.vertices.length;vertexIndex++){var localVertex=mesh.geometry.vertices[vertexIndex].clone();var globalVertex=localVertex.applyMatrix4(object3D.matrix);var directionVector=globalVertex.sub(object3D.position);var ray=new THREE.Raycaster(originPoint,directionVector.clone().normalize());var collisionResults=ray.intersectObjects(sceneEl.object3D.children,!0);collisionResults.forEach(hit)}
function hit(collision){if(collision.object===object3D){return}
if(collision.distance<directionVector.length()){if(!collision.object.el){return}
collision.object.el.emit('hit')}}}});
