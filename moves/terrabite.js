{
    num: -3321,
    accuracy: 95,
    basePower: 70,
    category: "Physical",
    name: "Terra Bite",
    pp: 15,
    priority: 0,
    flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, bite: 1 },
    secondary: {
      chance: 100,
      onHit(target, source, move) {
        if (source.isActive)
          target.addVolatile("trapped", source, move, "trapper");
      }
    },
    target: "normal",
    type: "Ground",
    contestType: "Clever"
}