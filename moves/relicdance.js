{
    num: -3282,
    accuracy: true,
    basePower: 0,
    category: "Status",
    name: "Relic Dance",
    pp: 15,
    priority: 0,
    flags: { snatch: 1, metronome: 1, dance: 1 },
    boosts: {
      atk: 1,
      spa: 1,
      spe: 1
    },
    onHit(target, pokemon, move) {
      if (pokemon.baseSpecies.baseSpecies === "Meloetta" && !pokemon.transformed) {
        move.willChangeForme = true;
      }
    },
    onAfterMoveSecondarySelf(pokemon, target, move) {
      if (move.willChangeForme && pokemon.species.id == "meloetta") {
        const meloettaForme = pokemon.species.id === "meloettapirouette" ? "" : "-Pirouette";
        pokemon.formeChange("Meloetta" + meloettaForme, this.effect, false, "[msg]");
        return;
      }
      if (move.willChangeForme && pokemon.species.id == "meloettapirouette") {
        const meloettaForme = pokemon.species.id === "meloetta" ? "" : "";
        pokemon.formeChange("Meloetta" + meloettaForme, this.effect, false, "[msg]");
        return;
      }
    },
    secondary: null,
    target: "self",
    type: "Normal",
    zMove: { boost: { spe: 1 } },
    contestType: "Beautiful"
}