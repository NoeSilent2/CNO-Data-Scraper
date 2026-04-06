{
    num: -3213,
    accuracy: true,
    basePower: 0,
    category: "Status",
    name: "Page Turn",
    pp: 20,
    priority: 0,
    flags: { snatch: 1, metronome: 1 },
    boosts: {
      spa: 1,
      spd: 1
    },
    onHit(target, pokemon, move) {
      if (pokemon.baseSpecies.baseSpecies === "Wizledger" && !pokemon.transformed) {
        move.willChangeForme = true;
      }
    },
    onAfterMoveSecondarySelf(pokemon, target, move) {
      if (move.willChangeForme && pokemon.species.id == "wizledgerfirespell") {
        const wizledgerForme = pokemon.species.id === "wizledgericespell" ? "" : "-Icespell";
        pokemon.formeChange("Wizledger" + wizledgerForme, this.effect, false, "[msg]");
        return;
      }
      if (move.willChangeForme && pokemon.species.id == "wizledgericespell") {
        const wizledgerForme = pokemon.species.id === "wizledgerlightningspell" ? "" : "-Lightningspell";
        pokemon.formeChange("Wizledger" + wizledgerForme, this.effect, false, "[msg]");
        return;
      }
      if (move.willChangeForme && pokemon.species.id == "wizledgerlightningspell") {
        const wizledgerForme = pokemon.species.id === "wizledgerfirespell" ? "" : "-Firespell";
        pokemon.formeChange("Wizledger" + wizledgerForme, this.effect, false, "[msg]");
        return;
      }
    },
    secondary: null,
    target: "self",
    type: "Psychic",
    zMove: { effect: "clearnegativeboost" },
    contestType: "Clever"
}