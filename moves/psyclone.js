{
    num: -3284,
    accuracy: 70,
    basePower: 110,
    category: "Special",
    name: "Psyclone",
    pp: 10,
    priority: 0,
    flags: { protect: 1, mirror: 1, distance: 1, metronome: 1, wind: 1 },
    onModifyMove(move, pokemon, target) {
      switch (target?.effectiveWeather()) {
        case "raindance":
        case "primordialsea":
          move.accuracy = true;
          break;
        case "sunnyday":
        case "desolateland":
          move.accuracy = 50;
          break;
      }
    },
    secondary: {
      chance: 30,
      volatileStatus: "confusion"
    },
    target: "any",
    type: "Psychic",
    contestType: "Clever"
}