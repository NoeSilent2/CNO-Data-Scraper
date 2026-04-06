{
   num: -3206,
    accuracy: true,
    basePower: 0,
    category: "Status",
    name: "Generation Dance",
    pp: 5,
    priority: 0,
    flags: { snatch: 1, heal: 1, metronome: 1, dance: 1 },
    onHit(pokemon) {
      let factor = 0.5;
      if (this.field.isWeather("sunnyday", "desolateland")) {
        factor = 0.667;
      }
      const success = !!this.heal(this.modify(pokemon.maxhp, factor));
      if (!success) {
        this.add("-fail", pokemon, "heal");
        return this.NOT_FAIL;
      }
      return success;
    },
    secondary: null,
    target: "self",
    type: "Rock",
    zMove: { effect: "clearnegativeboost" },
    contestType: "Beautiful"
  }