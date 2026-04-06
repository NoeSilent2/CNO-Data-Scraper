{
  num: -3203,
  accuracy: 100,
  basePower: 80,
  category: "Physical",
  name: "Dig Deep",
  pp: 20,
  priority: 0,
  flags: { protect: 1, mirror: 1, metronome: 1 },
  onEffectiveness(typeMod, target, type) {
    if (type === "Ground")
      return 1;
  },
  secondary: null,
  target: "normal",
  type: "Steel",
  contestType: "Beautiful"
}