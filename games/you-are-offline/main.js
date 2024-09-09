/*global document*/
/*global window*/
/*global updateCanvas_rack*/
/*global playSound*/

var endGame; // here just for testing

(function () {
    
    "use strict";
    
    // End game
    endGame = function (type) {
        
        if (type === "out-of-time") {
            
            document.querySelector("#end-game-title1").setAttribute("value", "Out of Time!");
            document.querySelector("#end-game-message1").setAttribute("value", "The laptop battery has run out of charge. Your chance of escape has gone.");
            document.querySelector("#end-game-title2").setAttribute("value", "Out of Time!");
            document.querySelector("#end-game-message2").setAttribute("value", "The laptop battery has run out of charge. Your chance of escape has gone.");
            document.querySelector("#room").setAttribute("visible", "false");
            document.querySelector("#end-game1").setAttribute("visible", "true");
            document.querySelector("#end-game2").setAttribute("visible", "true");

        } else if (type === "complete") {

            document.querySelector("#room").emit("game-complete");
            window.setTimeout(function () {
                document.querySelector("#room").setAttribute("visible", "false");
                document.querySelector("#end-game1").setAttribute("visible", "true");
                document.querySelector("#end-game2").setAttribute("visible", "true");
            }, 3000);

        }

        window.setTimeout(function () {
            document.querySelector("#end-game1 a-plane").setAttribute("visible", "true");
            document.querySelector("#end-game2 a-plane").setAttribute("visible", "true");
        }, 5000);
        
    };
    
    document.querySelector(".start button").onclick = function () {
        
        // create lights
        var lightsContainer = document.createElement("a-entity"),
            light,
            i,
            position,
            highQuality = document.querySelector(".quality input").checked;

        lightsContainer.setAttribute("id", "ceiling-lights");
        lightsContainer.setAttribute("visible", true);
        
        for (i = 0; i < 4; i = i + 1) {
            
            if (i === 0) {
                position = "4.3 5.9 4.3";
            } else if (i === 1) {
                position = "4.3 5.9 -4.4";
            } else if (i === 2) {
                position = "-4.4 5.9 -4.4";
            } else if (i === 3) {
                position = "-4.4 5.9 4.3";
            }
            
            light = document.createElement("a-entity");
            light.setAttribute("position", position);
            light.setAttribute("geometry", "primitive: box; height: 0.1; width: 2.8; depth: 2.8");
            light.setAttribute("material", "color: white; shader: flat;");
            
            if (highQuality) {
                light.setAttribute("light", "type: point; color: #fff; intensity: 0.2; castShadow:true;");
            }
            
            lightsContainer.appendChild(light);

        }
        
        if (!highQuality) {
            light = document.createElement("a-light");
            light.setAttribute("position", "0 5.9 0");
            light.setAttribute("type", "point");
            light.setAttribute("color", "white");
            light.setAttribute("intensity", "0.8");
            lightsContainer.appendChild(light);
        }
 
            /*
            <a-light position="-10 3 10" type="point" color="tomato" intensity="0.8"></a-light>
            */
        
        document.querySelector("#room").appendChild(lightsContainer);

        // show scene
        document.querySelector(".start").style.display = "none";
        document.querySelector("a-scene").style.display = "block";
    };

    // countdown timer
    (function () {
        var mins = 13,
            secs = 0,
            $countdown = document.querySelector("#countdown-text"),
            count,
            timer;

        count = function () {

            var to2 = function (val) {
                if (val < 10) {
                    return "0" + val;
                } else {
                    return val.toString();
                }
            };

            if (mins === 0 && secs === 0) {
                clearInterval(timer);
                playSound("out-of-time");
                endGame("out-of-time");  
            } else {
                if (secs === 0) {
                    mins = mins - 1;
                    secs = 59;
                    
                    if (mins === 7) {
                        document.querySelector("#battery").setAttribute("src", "#battery2");
                    } else if (mins === 2) {
                        document.querySelector("#battery").setAttribute("src", "#battery3");
                    }
                    
                } else {
                    secs = secs - 1;
                }
                $countdown.setAttribute("value", to2(mins) + ":" + to2(secs));
            }

        };

        timer = window.setInterval(count, 1000);

        document.querySelector("#countdown").onclick = function () {
            var i;
            playSound("clock-tamper");
            for (i = 0; i < 60; i = i + 1) {
                window.setTimeout(count, (i * 10) + 1);
            }
        };

    }());


    // lights
    (function () {
        var lightsOn = true;
        document.querySelector("#light-switch").onclick = function () {
            lightsOn = !lightsOn;
            document.querySelector("#ceiling-lights").setAttribute("visible", lightsOn ? "true" : "false");
            document.querySelector("#ceiling-code").setAttribute("visible", lightsOn ? "false" : "true");
            document.querySelector("#light-switch-rocker").setAttribute("rotation", lightsOn ? "-20 0 0" : "20 0 0");
        };
    }());


    // combination lock
    (function () {

        var numbers = document.querySelectorAll(".lock-number"),
            i,
            checkCode,
            timer;
        
        checkCode = function () {
            var i,
                code = "",
                walls;
            for (i = 0; i < numbers.length; i = i + 1) {
                code = code + numbers[i].querySelector("a-text").getAttribute("value");
            }
            if (code === "840913") {
                walls = document.querySelectorAll(".sliding-wall");
                playSound("wall-slide");
                for (i = 0; i < walls.length; i = i + 1) {
                    walls[i].emit("slide");
                }
            }
        };

        for (i = 0; i < numbers.length; i = i + 1) {
            numbers[i].onmouseenter = function (event) {
                var number = event.target.querySelector("a-text");
                timer = window.setInterval(function () {
                    var value = parseInt(number.getAttribute("value"), 10);
                    value = (value === 9) ? 0 : value + 1;
                    number.setAttribute("value", value);
                    checkCode();
                }, 1000);
            };
            numbers[i].onmouseleave = function (event) {
                window.clearInterval(timer);
            };
        }

    }());


    // ID Card
    (function () {

        var hasIDcard = false,
            tileOut = false,
            cardReaderInteract;

        document.querySelector("#loose-tile").onclick = function (event) {
            if (tileOut) {
                event.target.emit("slide-in");
                tileOut = false;
            } else {
                event.target.emit("slide-out");
                tileOut = true;
            }
        };

        document.querySelector("#id-card").onclick = function (event) {
            event.target.setAttribute("visible", "false");
            hasIDcard = true;
        };
        
        cardReaderInteract = function () {
            var ctx = document.querySelector("canvas").getContext("2d");
            if (hasIDcard) {
                playSound("rack-on");
                updateCanvas_rack(ctx, 1000, 1000, true);
                document.querySelector("#screen-text").setAttribute("value", "You are online");
                document.querySelector("#screen-button").setAttribute("visible", "true");
            }
        };

        document.querySelector("#card-reader").onclick = cardReaderInteract;
        document.querySelector("#card-reader-slot").onclick = cardReaderInteract;

        document.querySelector("#screen-button").onclick = function () {
            playSound("song");
            document.querySelector("#door").emit("open-door");
            endGame("complete");
        };

    }());


    // Locker
    document.querySelector("#locker-door").onclick = function (event) {
        event.target.emit("open-locker");
        /*
        window.setTimeout(function() {
            playSound("locker");
        }, 3000);
        */
    };
    
    
    // Hints
    (function () {

        var currentHint = -1,
            hints = [
                "Warning: this contains spoilers...",
                "Only click here if you are stuck at a particular point.",
                "To get the code for the keypad on the wall, you will first need to find some letters...",
                "Try switching the lights off...",
                "The inside of the locker door tells you how to convert the letters to numbers...",
                "A IS 0, J IS 9...",
                "So the first number (for letter I) is 8",
                "Once the numbers have been entered into the keypad you will see the network rack...",
                "These will stay on standby until you insert the ID card",
                "Try looking at the floor for the ID card...",
                "Do any tiles look different to you?",
                "Green lights on, network is up and running",
                "Use the laptop to get help",
                "That's it!"
            ];
        
        document.querySelector(".hint-button").onclick = function () {
            currentHint = currentHint + 1;
            if (currentHint < hints.length) {
                document.querySelector(".hint").innerHTML = hints[currentHint];
            }
        };
        
    }());

}());