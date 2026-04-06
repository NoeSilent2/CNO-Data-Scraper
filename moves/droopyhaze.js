{
    num: 542,
    accuracy: 80,
    basePower: 100,
    category: "Special",
    name: "Droopy Haze",
    pp: 10,
    priority: 0,
    flags: { protect: 1, mirror: 1, distance: 1, metronome: 1 },
    onModifyMove(move, pokemon, target) {
      switch (target?.effectiveWeather()) {
        case "raindance":
        case "primordialsea":
          move.accuracy = true;
          break;
      }
    },
	onHitField() {
      this.add("-clearallboost");
      for (const pokemon of this.getAllActive()) {
        pokemon.clearBoosts();
      }
    },
    secondary: null,
    target: "any",
    type: "Dragon",
    contestType: "Cool"
  }