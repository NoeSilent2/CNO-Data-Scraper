{
  num: 5000,
  accuracy: 100,
  basePower: 75,
  category: "Special",
  name: "Soul Blaze",
  pp: 10,
  flags: { contact: 1, protect: 1, mirror: 1, gravity: 1, distance: 1, nonsky: 1, metronome: 1 },
  onEffectiveness(typeMod, target, type, move) {
    return typeMod + this.dex.getEffectiveness("Fire", type);
  },
  priority: 0,
  secondary: null,
  target: "any",
  type: "Ghost",
  zMove: { basePower: 170 },
  contestType: "Beautiful"
}