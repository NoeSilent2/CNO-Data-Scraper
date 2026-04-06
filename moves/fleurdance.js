{
  num: -3238,
  accuracy: 100,
  basePower: 55,
  basePowerCallback(pokemon, target, move) {
    if (!pokemon.item) {
      this.debug("BP doubled for no item");
      return move.basePower * 2;
    }
    return move.basePower;
  },
  category: "Special",
  name: "Fleur Dance",
  pp: 15,
  priority: 0,
  flags: { contact: 1, protect: 1, mirror: 1, dance: 1, metronome: 1 },
  secondary: null,
  target: "any",
  type: "Fairy",
  contestType: "Beautiful"
}