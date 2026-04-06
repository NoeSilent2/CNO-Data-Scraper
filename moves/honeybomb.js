{
    num: -3313,
    accuracy: 100,
    basePower: 60,
    basePowerCallback(pokemon, target, move) {
      if (!pokemon.volatiles["honeygather"]?.layers)
        return move.basePower;
      return move.basePower + (pokemon.volatiles["honeygather"].layers * 40);
    },
    category: "Special",
    name: "Honey Bomb",
    pp: 10,
    priority: 0,
    flags: { protect: 1, metronome: 1, bullet: 1 },
    onAfterMove(pokemon) {
      pokemon.removeVolatile("honeygather");
    },
    secondary: {
      chance: 100,
      boosts: {
        spe: -1
      }
    },
    target: "normal",
    type: "Bug",
    contestType: "Cute"
}