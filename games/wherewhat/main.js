   AFRAME.registerComponent('general-scene', {
     init: function () {
       var scene = document.querySelector('a-scene');
       var welcom = document.querySelector('#welcom');
       var gamestart = document.querySelector('#gamestart');
       var firstMove = document.querySelector('#one');
       var moveOne = document.querySelector('#move1');
       var show = document.querySelector('#firstAnSphere2');
       var startEl = document.querySelector('#firstAnPlane');
       var secondSphereTop = document.querySelector('#second-sphere-one');
       var secondSphereBottom = document.querySelector('#second-sphere-two');
       var secondSphereBox = document.querySelector('#second-sphere-three');
       var secondEl = document.querySelector('#second-nextLevel');
       var moveTwo = document.querySelector('#movetwo');
       var threefirstEl = document.querySelector('#boxThree');
       var trianOne = document.querySelector('#trianOne');
       var trianTwo = document.querySelector('#trianTwo');
       var movethree = document.querySelector('#movethree');
       var sphere = document.querySelector('#right');
       var boxbluesecond = document.querySelector('#boxblue2');
       var spherebtn = document.querySelector('#spherebtn');
       var triangle = document.querySelector('#triangle');
       var movefour = document.querySelector('#movefour');
       var objects = document.querySelector('#objects');
       var plane = document.querySelector('#plane');
       var planetwo = document.querySelector('#planetwo');
       var universe = document.querySelector('#universe');
       var end = document.querySelector('#end');
       var endplane = document.querySelector('#endplane');

       gamestart.addEventListener('mouseenter', function(){
         welcom.setAttribute('scale', {x: 0, y: 0, z: 0});
       });

      //  first episode animations
       startEl.addEventListener('mouseenter', function(){
         var show = document.querySelector('#firstAnSphere2');
         show.setAttribute('scale', {x: 2.7, y: 2.7, z: 0.3});
         show.setAttribute('position', {x: -19.2, y: 6.7, z: 17.7});

       });

       show.addEventListener('mouseleave', function(){
         var nextLevel = document.querySelector('#firstAnSphere');

         nextLevel.setAttribute('position', {x: -19.2, y: 2.7, z:17.7});

       });
       firstMove.addEventListener('mouseenter', function(){
         var c = document.querySelector('a-camera');
         c.setAttribute('position', {x: -2.7, y: 2.3, z: 35.3});
         c.setAttribute('rotation', {x: 0, y: 0, z: 0});
       });

      //  second episode animations
      secondSphereTop.addEventListener('mouseleave', function(){
        var secondBox = document.querySelector('#second-box');
        secondBox.setAttribute('scale', {x: 1.1, y: 1.1, z: 0.3});
      });
      secondSphereBottom.addEventListener('mouseleave', function(){
        var secondBox = document.querySelector('#second-box');
        secondBox.setAttribute('rotate', {x: 0, y: -180, z: 0});
        secondBox.setAttribute('position', {x: 2.8 , y: 2.7, z: 21});
      });
      secondSphereBox.addEventListener('mouseenter', function(){
        var secondSphereTop = document.querySelector('#second-sphere-one');
        var secondSphereBottom = document.querySelector('#second-sphere-two');
        var secondEl = document.querySelector('#second-nextLevel');
        secondSphereTop.setAttribute('position', {x: -1.4, y: 3.9, z: 21});
        secondSphereBottom.setAttribute('position', {x: -4.5, y: 2.6, z: 21});
        secondSphereBottom.setAttribute('scale', {x: 0.7, y: 0.7, z: 0.7});
        secondSphereBox.setAttribute('position', {x: 2.8, y: 3.7, z: 19});
        secondEl.setAttribute('scale', {x: 1, y: 1, z: 1});
        console.log('hey');
      });
      secondEl.addEventListener('mouseleave', function(){
        var moveTwo = document.querySelector('#movetwo');
        moveTwo.setAttribute('position', {x: -2.8, y: 4.3, z: 21});
      });
      moveTwo.addEventListener('mouseleave', function(){
        var c = document.querySelector('a-camera');
        c.setAttribute('position', {x: 14.7, y: 1.7, z: 32});
        c.setAttribute('rotation', {x: 0, y: 0, z: 0});
      });

      // third episode
      threefirstEl.addEventListener('mouseleave', function(){
        var bottom = document.querySelector('#boxOne');
        var top = document.querySelector('#boxTwo');
        var trianOne = document.querySelector('#trianOne');
        bottom.setAttribute('position', {x: 14.69, y: 1, z: 15});
        top.setAttribute('position', {x: 13.5, y: 1, z: 15});
        threefirstEl.setAttribute('position', {x: 12.5, y: 1, z: 15});
        trianOne.setAttribute('scale', {x: 0.57, y: 0.57, z: 0.57});
      });
      trianOne.addEventListener('mouseenter', function(){
        var trianTwo = document.querySelector('#trianTwo');
        var trianThree = document.querySelector('#trianThree');
        trianTwo.setAttribute('scale', {x: 0.57, y: 0.57, z: 0.57});
        trianThree.setAttribute('scale', {x: 0.57, y: 0.57, z: 0.57});
      });
      trianTwo.addEventListener('mouseenter', function(){
        var trianOne = document.querySelector('#trianOne');
        var trianThree = document.querySelector('#trianThree');
        var enter = document.querySelector('#enter');
        var movethree = document.querySelector('#movethree');
        trianOne.setAttribute('position', {x:17.8, y: 4.1, z: 14});
        trianTwo.setAttribute('position', {x: 16.5, y: 4.1, z: 14});
        trianThree.setAttribute('position', {x: 15.3, y: 4.1, z: 14});
        enter.setAttribute('scale', {x: 0.53, y: 0.53, z: 0.53});
        movethree.setAttribute('position', {x: 14.69, y: 1.7, z: 11});
      });
      movethree.addEventListener('mouseleave', function(){
        var c = document.querySelector('a-camera');
        c.setAttribute('position', {x: 21.7, y: 1.7, z: -3.9});
        c.setAttribute('rotation', {x: 0, y: 90, z: 0});
      });

      // fourth episode
      sphere.addEventListener('mouseenter', function(){
        var boxblue = document.querySelector('#boxblue');
        var boxbluesecond = document.querySelector('#boxblue2');
        boxblue.setAttribute('scale', {x: 0, y: 0, z: 0});
        boxbluesecond.setAttribute('scale', {x: 1.3, y: 1.3, z: 1.3});
      });

      boxbluesecond.addEventListener('mouseleave', function(){
        sphere.setAttribute('scale', {x: 0, y: 0, z: 0});
        spherebtn.setAttribute('scale', {x: 1.3, y: 1.3, z: 1.3});
      });
      spherebtn.addEventListener('mouseleave', function(){
        triangle.setAttribute('scale', {x: 0, y: 0, z: 0});
        movefour.setAttribute('scale', {x: 0.9, y: 0.9, z: 0.9});
      });
      movefour.addEventListener('mouseleave', function(){
        objects.setAttribute('scale', {x: 0, y: 0, z: 0});
        plane.setAttribute('scale', {x: 0, y: 0, z: 0});
      });
      planetwo.addEventListener('mouseenter', function(){
        universe.setAttribute('scale', {x: 1, y: 1, z: 1});
      });
      end.addEventListener('mouseenter', function(){
        endplane.setAttribute('scale', {x: 5, y: 5, z: 1});
        endplane.setAttribute('rotation', {x: 0, y: 90, z: 0});

      });
   }

});
