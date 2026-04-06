{
    num: -3324,
    accuracy: 100,
    basePower: 15,
    category: "Physical",
    name: "Triple Fury",
    pp: 20,
    priority: 1,
    flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
    onBasePower(basePower, pokemon) {
      if (this.randomChance(3, 10) && pokemon.species.baseSpecies === "Dodrio") {
        this.attrLastMove("[anim] Triple Fury All Out");
        this.add("-activate", pokemon, "move: Triple Fury");
        return this.chainModify(2);
      }
    },
    multihit: 3,
    secondary: null,
    target: "normal",
    type: "Flying",
    maxMove: { basePower: 80 },
    contestType: "Cool"
}