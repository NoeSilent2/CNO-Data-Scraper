{
    num: -3325,
    accuracy: 100,
    basePower: 120,
    category: "Physical",
    name: "Root Out",
    pp: 5,
    priority: 0,
    flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
    basePowerCallback(pokemon, target, move) {
      if (pokemon.volatiles["ingrain"]) {
        return move.basePower + 30;
      }
      return move.basePower;
    },
    self: {
      onHit(source) {
        if (source.volatiles["ingrain"]) {
          this.add("-activate", source, "move: Root Out");
          source.removeVolatile("ingrain");
        }
      },
      boosts: {
        def: -1,
        spd: -1
      }
    },
    secondary: null,
    target: "normal",
    type: "Grass",
    contestType: "Tough"
}