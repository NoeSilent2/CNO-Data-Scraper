{
  num: 50099,
  accuracy: 100,
  basePower: 85,
  category: "Special",
  name: "Somber Song",
  pp: 15,
  priority: 0,
    flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1 },

  secondary: {
    chance: 10,
    status: "par"
  },

  onHit(target, pokemon, move) {
    if (pokemon.baseSpecies?.baseSpecies === "Meloettam" && !pokemon.transformed) {
      move.willChangeForme = true;
    }
  },

  onAfterMoveSecondarySelf(pokemon, target, move) {
    if (!move.willChangeForme) return;

    const isRock = pokemon.species.id === "meloettamrock";
    const newForm = isRock ? "Meloettam" : "Meloettam-Rock";

    pokemon.formeChange(newForm, this.effect, true);
  },

    target: "allAdjacentFoes",
  type: "Fairy",
  contestType: "Beautiful"
}
