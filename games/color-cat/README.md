# Color Cat

In color cat you and all other online cats travers the colorful lands of patchwork dreams to collect colors. Use WASD and space to move. Complete the game by collecting all 5 special color blocks! Help others by collecting bright colors, then lead the way with your light!

# WebGPU

This game uses [WebGPU](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API), a cutting edge browser feature meant to be the successor to WebGL. Unfortunately WebGPU is not yet fully supported across all browsers in all OSs yet, at least be default.

- Chromium: Supported by default except on Linux but it cab be enabled with the enable-unsafe-webgpu flag.
- Safari: Supported from version 26, can be enabled with the WebGPU feature flag from 17.4
- Firefox: Supported on Windows from version 141, can be enabled with the dom.webgpu.enabled flag for non-windows OS.

## If you want to enable WebGPU

For Chrome, go to chrome://flags/#enable-vulkan. For Safari Advanced > Experimental Features and enable "WebGPU". For Firefox, got to about:config and enable "dom.webgpu.enabled" and "gfx.webrender.all".

Apologies for the poor browser support, I was unaware that the major browsers behaved differently on Linux.