{
  num: -3226,
  accuracy: 100,
  basePower: 50,
  category: "Physical",
  name: "Terrain Blade",
  pp: 10,
  priority: 0,
  flags: { protect: 1, mirror: 1, metronome: 1, slicing: 1 },
  onModifyType(move, pokemon) {
    if (!pokemon.isGrounded())
      return;
    switch (this.field.terrain) {
      case "electricterrain":
        move.type = "Electric";
        break;
      case "grassyterrain":
        move.type = "Grass";
        break;
      case "mistyterrain":
        move.type = "Fairy";
        break;
      case "psychicterrain":
        move.type = "Psychic";
        break;
    }
  },
  onModifyMove(move, pokemon) {
    if (this.field.terrain && pokemon.isGrounded()) {
      move.basePower *= 2;
      this.debug("BP doubled in Terrain");
    }
  },
  secondary: null,
  target: "normal",
  type: "Normal",
  zMove: { basePower: 160 },
  maxMove: { basePower: 130 }
}