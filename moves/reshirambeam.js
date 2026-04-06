{
    num: -3277,
    accuracy: 90,
    basePower: 120,
    category: "Special",
    name: "Reshiram Beam",
    pp: 5,
    priority: 0,
    flags: { protect: 1, mirror: 1, metronome: 1, beam: 1 },
    onEffectiveness(typeMod, target, type, move) {
      return typeMod + this.dex.getEffectiveness("Fire", type);
    },
    secondary: {
      chance: 30,
      volatileStatus: "confusion"
    },
    target: "normal",
    type: "Dragon",
    contestType: "Cool"
}