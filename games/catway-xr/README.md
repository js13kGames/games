---
directors_cut: https://catwayxr.desbwa.org/
video: https://youtu.be/4NF9XbDBE8Y
post: https://github.com/JackDesBwa/js13k2025_catway/blob/main/postmortem.md
---
**For entering WebXR, please see the `3D mode` button**

## Goal
The cat is living in a special world made of 2D and 3D elements.
Your goal is to help it to find its way to its cozy pillow.

## Controls
The cat can walk and jump. Action and direction keys should be pressed simultaneously.

Keyboard uses direction arrows for directions and X and C keys for action.

Gamepad use axes 0 and 1 for directions (usually joystick) and buttons 0 and 1 for action. I let you find where it is on yours.

Mouse, touchscreen or laser controller in XR allows to designate a specific location in the 3D world, which can also be used to play.

A click-drag on the screen moves the camera around. Grab in XR moves the world around. Wheel or two fingers pinch are used to zoom.

## Devices
The game can be played on several devices: VR headset, PC, mobile…

The cat can be controlled with several devices:
- mouse
- touchscreen
- keyboard
- gamepad
- VR controller

The 3D can be displayed in a lot of ways:
- as virtual reality
- as augmented reality
- on a 3D TV
- on a 3D projector
- on 3D glasses
- on a regular screen with anaglyph glasses,
- on a regular screen projected in 2D only,
- and several other exotic 3D viewing modes are available…

Note: there is no hand support in AR/VR, so a controller is necessary.

I tested it with PC + {mouse only, keyboard + mouse, gamepad + mouse} ; VR headset in {Virtual Reality, Augmented Reality} mode with its controllers ; PC connected to a 3D TV ; Mobile with touchscreen ; and a few other combinations…

## Aim
This small project was primary for me to learn to use A-FRAME. I actually learned quite a lot more in order to build this little game, like how to generate sound in browser to name only one.

I also wanted to be able to display the 3D world on a variety of devices. It was quite challenging to interface with A-FRAME that is not made for it, but with a bit of hack, I managed to make it possible. In the same idea, I tried to support several controllers.

13k is small to support so much use cases.