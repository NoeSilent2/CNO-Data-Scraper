{
    num: -3292,
    accuracy: 100,
    basePower: 25,
    category: "Special",
    name: "Starshower",
    pp: 15,
    priority: 0,
    flags: { protect: 1, mirror: 1, metronome: 1, light: 1 },
    multihit: [2, 5],
    basePowerCallback(pokemon, target, move) {
      if (pokemon.volatiles["cosmicpower"]) {
        this.debug("BP increase after Cosmic Power");
        return move.basePower * 1.5;
      }
      return move.basePower;
    },
    secondary: null,
    target: "normal",
    type: "Normal",
    zMove: { basePower: 140 },
    maxMove: { basePower: 130 },
    contestType: "Beautiful"
}