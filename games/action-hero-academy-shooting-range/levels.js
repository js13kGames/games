GameContainer.setLevels([
  {
    // level 0,
    text: {
      "table-text": "Welcome to Action Hero Training Week!\n\nToday's lesson is aiming and shooting behind your back. One day, you WILL be chasing a creepy and mysterious enemy through a mirror maze.\nAfter today, you'll be prepared.\n\nThe rear-view helmet you're wearing can be activated by shooting the ON button up there.\n\nWith a gun, of course.\n\nThere is an emergency OFF button at your feet but you'll need to restart that lesson. Good luck."
    },
    onload: function() {
      GameContainer.makeGun("red");
    },
    onstart: function() {
      GameContainer.makeTarget({ color: "red", position: "0 2 2" });
      GameContainer.setText({"wall-hint": "Achievement Unlocked\nEyes in the Back of Your Head"});
    }
  },
  {
    // level 1,
    text: {
      "table-text": "Easy as pie.\n\nYou were so good that we've decided to give you DUAL WIELDING.\n\nJust like a video game."
    },
    onload: function() {
      GameContainer.makeGun("blue");
    },
    onstart: function() {
      GameContainer.makeTarget({ color: "red", position: "-2 2 2" });
      GameContainer.makeTarget({ color: "purple", position: "0 2 2" });
      GameContainer.makeTarget({ color: "blue", position: "2 2 2" });
      GameContainer.setText({"wall-hint": "RED + BLUE = PURPLE"});
    }
  },
  {
    // level 2
    text: {
      "table-text": "You know what. Let's do this.\n\nTRIPLE. WIELDING.\n\nLuckily the guns stay in the air exactly where you drop them so it's just a matter of remembering where you put them!\n\nPut this YELLOW gun where you'll know where to grab it then activate your helmet."
    },
    onload: function() {
      GameContainer.makeGun("yellow");
    },
    onstart: function() {
      const rainbow = ["red", "orange", "yellow", "green", "blue", "purple"];
      let pos = [0,2,0];
      const theta = 2 * Math.PI / rainbow.length;
      for (let i in rainbow) {
        pos[0] = Math.cos(theta * i);
        pos[2] = Math.sin(theta * i) + 3;
        GameContainer.makeTarget({ color: rainbow[i], position: pos.join(" ") });
      }
      GameContainer.setText({"wall-hint": "Remember your finger painting"});
    }
  },
  {
    // level 3
    text: {
      "table-text": "One last thing before we test your skills: you're going to have to shoot WHITE targets with all the guns.\n\nThere's one behind you now. Give it a shot.\n\n(literally)"
    },
    onload: function() {
    },
    onstart: function() {
      GameContainer.makeTarget({ color: "white", position: "0 2 2" });
      GameContainer.setText({"wall-hint": "Look out! It's that one guy."});
    }
  }
]);
