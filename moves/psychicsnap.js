{
    num: -3217,
    accuracy: 100,
    basePower: 75,
    category: "Special",
    name: "Psychic Snap",
    pp: 15,
    priority: 0,
    flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1 },
    onTryHit(pokemon) {
      pokemon.side.removeSideCondition("reflect");
      pokemon.side.removeSideCondition("lightscreen");
      pokemon.side.removeSideCondition("auroraveil");
    },
    secondary: null,
    target: "normal",
    type: "Psychic",
    contestType: "Cool"
  }