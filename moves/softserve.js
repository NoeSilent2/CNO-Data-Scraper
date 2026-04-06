{
    num: -3297,
    accuracy: true,
    basePower: 0,
    category: "Status",
    name: "Soft Serve",
    pp: 5,
    priority: 0,
    flags: { snatch: 1, heal: 1, metronome: 1 },
    onHit(pokemon, target) {
      let factor = 0.5;
      if (this.field.isTerrain("mistyterrain") && target.isGrounded()) {
        factor = 0.667;
      }
      if (this.field.isWeather(["snow","hail"])) {
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
    target: "adjacentAllyOrSelf",
    type: "Fairy",
    zMove: { effect: "clearnegativeboost" },
    contestType: "Cute"
}