{
    num: -3243,
    accuracy: 90,
    basePower: 120,
    category: "Physical",
    name: "Zekrom Kick",
    pp: 5,
    priority: 0,
    flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, kick: 1 },
    onEffectiveness(typeMod, target, type, move) {
      return typeMod + this.dex.getEffectiveness("Electric", type);
    },
    secondary: {
      chance: 30,
      volatileStatus: "flinch"
    },
    target: "normal",
    type: "Dragon",
    contestType: "Cool"
}