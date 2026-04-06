{
    num: -3250,
    accuracy: true,
    basePower: 0,
    category: "Status",
    name: "Storm Siphon",
    pp: 5,
    priority: 0,
    flags: { snatch: 1, heal: 1, metronome: 1, light: 1 },
    onHit(pokemon) {
      let factor = 0.5;
      if (this.field.isWeather(["raindance","primordialsea"])) {
        factor = 0.667;
      }
      if (this.field.isTerrain(["electricterrain"])) {
        factor = 0.667;
      }
      if (this.field.isWeather(["sunnyday","desolateland","sandstorm"])) {
        factor = 0.25;
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
    type: "Electric",
    zMove: { effect: "clearnegativeboost" },
    contestType: "Clever"
}