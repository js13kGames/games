scope.playDefeatMusic = () => {
  with (new AudioContext())
    with ((G = createGain()))
      for (i in (D = [, , , , , , , , 2, 2, 3, 2, 2, 3, 2, 2, 3, 2, 2]))
        with (createOscillator())
          if (D[i])
            connect(G),
              G.connect(destination),
              start(i * 0.12),
              frequency.setValueAtTime(550 * 1.06 ** (13 - D[i]), i * 0.12),
              (type = "triangle"),
              gain.setValueAtTime(1, i * 0.12),
              gain.setTargetAtTime(0.0001, i * 0.12 + 0.1, 0.005),
              stop(i * 0.12 + 0.11);
};

scope.playMainMusic = () => {
  with (new AudioContext())
    with ((G = createGain()))
      for (i in (D = [
        16,
        ,
        18,
        18,
        18,
        13,
        13,
        13,
        ,
        ,
        18,
        18,
        18,
        ,
        13,
        13,
        13,
        ,
        18,
        18,
        18,
        13,
        13,
        13,
        ,
        18,
        18,
        18,
        13,
        13,
        13,
        ,
        18,
        18,
        18,
        ,
        13,
        13,
        13,
        ,
        18,
        18,
        18,
        13,
        13,
        13,
        ,
        15,
        15,
        ,
        18,
        18,
        18,
        13,
        13,
        13,
        16,
        16,
      ]))
        with (createOscillator())
          if (D[i])
            connect(G),
              G.connect(destination),
              start(i * 0.18),
              frequency.setValueAtTime(440 * 1.06 ** (13 - D[i]), i * 0.18),
              (type = "triangle"),
              gain.setValueAtTime(1, i * 0.18),
              gain.setTargetAtTime(0.0001, i * 0.18 + 0.16, 0.005),
              stop(i * 0.18 + 0.17);
};

scope.playVictoryMusic = () => {
  with (new AudioContext())
    with ((G = createGain()))
      for (i in (D = [
        17,
        17,
        17,
        17,
        17,
        16,
        17,
        15,
        15,
        15,
        15,
        14,
        11,
        12,
        10,
        11,
        ,
        6,
        7,
        8,
        9,
        8,
        6,
        5,
        3,
        4,
        4,
        4,
        5,
        3,
        2,
        1,
        1,
        2,
        1,
        1,
      ]))
        with (createOscillator())
          if (D[i])
            connect(G),
              G.connect(destination),
              start(i * 0.08),
              frequency.setValueAtTime(440 * 1.06 ** (13 - D[i]), i * 0.08),
              (type = "triangle"),
              gain.setValueAtTime(1, i * 0.08),
              gain.setTargetAtTime(0.0001, i * 0.08 + 0.06, 0.005),
              stop(i * 0.08 + 0.07);
};
