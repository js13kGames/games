function loadMusic(){




const song=
[5513,
[
[
[7,0,0,0,192,2,7,0,0,0,192,2,0,0,0,20000,192,0,0,0,0,121,0,0,0,0,0,0,0],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[
[132,,,,,,,,130,,,,,,,,128,,,,,,,,127]]]]];





return new Promise((resolve)=>{
  let audioContext=new AudioContext();
  pl_synth_wasm_init(audioContext,(synth)=>{
    const buffer=synth.song(song);
    const source=audioContext.createBufferSource();
    source.buffer=buffer;
    source.loop=true;
    source.connect(audioContext.destination);
    resolve({source,context:audioContext,buffer});
  });
});

}

