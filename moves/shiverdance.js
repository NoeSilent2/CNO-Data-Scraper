{
    num: -3220,
    accuracy: true,
    basePower: 0,
    category: "Status",
    name: "Shiver Dance",
    pp: 20,
    priority: 0,
    flags: { snatch: 1, dance: 1, metronome: 1 },
    onModifyMove(move, pokemon) {
      if (["snow", "hail"].includes(pokemon.effectiveWeather()))
        move.boosts = { atk: 2, spa: 2 };
    },
    boosts: {
      atk: 1,
      spa: 1
    },
    secondary: null,
    target: "self",
    type: "Ice",
    zMove: { effect: "clearnegativeboost" },
    contestType: "Beautiful"
}