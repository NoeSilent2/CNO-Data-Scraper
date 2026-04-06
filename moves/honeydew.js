{
    num: -3312,
    accuracy: true,
    basePower: 0,
    category: "Status",
    name: "Honeydew",
    pp: 5,
    priority: 0,
    flags: { snatch: 1, heal: 1, metronome: 1 },
    onTry(source) {
      return !!source.volatiles["honeygather"];
    },
    onHit(pokemon) {
      const healAmount = [0.25, 0.5, 1];
      const success = !!this.heal(this.modify(pokemon.maxhp, healAmount[pokemon.volatiles["honeygather"].layers - 1]));
      if (!success)
        this.add("-fail", pokemon, "heal");
      pokemon.removeVolatile("honeygather");
      return success || this.NOT_FAIL;
    },
    secondary: null,
    target: "self",
    type: "Bug",
    zMove: { effect: "clearnegativeboost" },
    contestType: "Cute"
}