AFRAME.registerComponent('tree', {
	    schema: {
                x: {default:0},
                y: {default:0},
                z: {default:0},
	    },

	    init: function() {
            var el = this.el,
                data = this.data,
                rotation = "0 " + ((Math.random()*90)-90) + " 0",
                scale = (1+(Math.random()*4)),
                x = data.x,
                y = data.y,
                z = data.z,
        tree = factory('a-entity', {
            id: "tree",
            class: "tree entity",
            position: x + " " + y + " " + z,
            rotation: rotation,
            scale:  scale + "  " + scale + " " + scale,
            mergeTo: '#tree',
        }); 
       // console.log(data)
       
        var tree0 = factory('a-box', {
            id: "tree0",
            class: "tree entity",
            geometry: "primitive: box; width: 1.1;height: 1.1;depth: 1.1;",
            position: x + " " + (y+1) + " " + z,
            mergeTo: '#tree',
            material: "color:#008000;",
        }); 
            tree.appendChild(tree0); 
        var tree1 = factory('a-box', {
            id: "tree1",
            class: "tree entity",
            geometry: "primitive: box; height: 0.6;width:0.6;depth:0.6;",
            position: (x-0.8) + " " + (y+1) + " " + z,
            mergeTo: '#tree',
            material: "color:#228B22",
        }); 
            tree.appendChild(tree1);

        var tree2 = factory('a-box', {
            id: "tree2",
            class: "tree entity",
            geometry: "primitive: box; height: 0.4;width:0.4;depth:0.4;",
            position: (x+0.6) + " " + (y+1) + " " + z,
            mergeTo: '#tree',
            material: "color:#32CD32",
        }); 
            
            tree.appendChild(tree2); 

        var trunk = factory('a-box', {
            id: "tree3",
            class: "tree entity",
            geometry: "primitive: box; height: 2.1;width:0.2;depth:0.2;",
            position: x + " " + y + " " + z,
            mergeTo: '#tree',
            material: "color:#8B4513",
        }); 
            
            tree.appendChild(trunk);
            document.querySelector('a-scene').appendChild(tree); 
            el = document.querySelector('#tree1');
	},
});

