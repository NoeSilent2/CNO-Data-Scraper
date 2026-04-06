{
    num: -3200,
    accuracy: 100,
    basePower: 0,
    basePowerCallback(pokemon, target) {
      let ratio = Math.floor(pokemon.getStat("spe") / target.getStat("spe"));
      if (!isFinite(ratio))
        ratio = 0;
      const bp = [40, 60, 80, 120, 150][Math.min(ratio, 4)];
      this.debug("BP: " + bp);
      return bp;
    },
    category: "Special",
    name: "Breeze Ball",
    pp: 10,
    priority: 0,
    flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1 },
    onModifyMove(move, pokemon) {
      if (pokemon.getStat("atk", false, true) > pokemon.getStat("spa", false, true))
        move.category = "Physical";
    },
    secondary: null,
    target: "normal",
    type: "Flying",
    zMove: { basePower: 160 },
    maxMove: { basePower: 130 },
    contestType: "Cool"
  }