const n = (frequency, lengthSecs, audioContext, amplitude) => {

  for(
    
    // Modulation
    // This function generates the i'th sample of a sinusoidal signal with a specific frequency and amplitude
    b = (frequency, t, a, i) => Math.sin(frequency / t * 6.28 * a + i),
    
    // Instrument synthesis
    w = (frequency, t) =>
    
      Math.sin(frequency / 44100 * t * 6.28 + b(frequency, 44100, t, 0) ** 2 + .75 * b(frequency, 44100, t, .25) + .1 * b(frequency, 44100, t, .5)),
    
    // Sound samples
    D = [],
    
    // Loop on all the samples
    i = 0;
    i < 44100 * lengthSecs;
    i++
  ){
  
    // Fill the samples array
    D[i] =
    
      // The first 88 samples represent the note's attack
      i < 88 
      ? i / 88.2 * w(i, frequency) 
      
      // The other samples represent the rest of the note
      : (1 - (i - 88.2) / (44100 * (lengthSecs - .002))) ** ((.5 * Math.log(1e4 * frequency / 44100)) ** 2) * w(i, frequency);
		
		D[i] *= amplitude;
  }
  
  // Play the note
  m = audioContext.createBuffer(1, 1e6, 44100),
  m.getChannelData(0).set(D),
  s = audioContext.createBufferSource(),
  s.buffer = m,
  s.connect(audioContext.destination),
  s.start()
}