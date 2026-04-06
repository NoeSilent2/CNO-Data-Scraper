{
  num: -3224,
    accuracy: 100,
    basePower: 90,
    category: "Special",
    name: "Spirit Song",
    pp: 10,
    priority: 0,
    flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1 },
    secondary: null,
    onHit(target, pokemon, move) {
      if (pokemon.baseSpecies.baseSpecies === "Meloetta" && !pokemon.transformed) {
        move.willChangeForme = true;
      }
    },
    onAfterMoveSecondarySelf(pokemon, target, move) {
      if (move.willChangeForme && pokemon.species.id == "meloettasoprano") {
        const meloettaForme = pokemon.species.id === "meloettaacoustic" ? "" : "-Acoustic";
        pokemon.formeChange("Meloetta" + meloettaForme, this.effect, false, "[msg]");
        return;
      }
      if (move.willChangeForme && pokemon.species.id == "meloettaacoustic") {
        const meloettaForme = pokemon.species.id === "meloettasoprano" ? "" : "-Soprano";
        pokemon.formeChange("Meloetta" + meloettaForme, this.effect, false, "[msg]");
        return;
      }
    },
    onTryHit(target) {
      const activeTeam = target.side.activeTeam();
      const foeActiveTeam = target.side.foe.activeTeam();
      for (const [i, allyActive] of activeTeam.entries()) {
        if (allyActive && allyActive.status === "slp")
          allyActive.cureStatus();
        const foeActive = foeActiveTeam[i];
        if (foeActive && foeActive.status === "slp")
          foeActive.cureStatus();
      }
    },
    target: "allAdjacentFoes",
    type: "Normal",
    contestType: "Beautiful"
}