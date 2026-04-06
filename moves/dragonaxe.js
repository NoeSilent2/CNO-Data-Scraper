{
    num: -3251,
    accuracy: 85,
    basePower: 85,
    category: "Physical",
    name: "Dragon Axe",
    pp: 10,
    priority: 0,
    flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, slicing: 1 },
    onAfterHit(target, source, move) {
      if (!move.hasSheerForce && source.hp) {
        for (const side of source.side.foeSidesWithConditions()) {
          side.addSideCondition("gmaxsteelsurge");
        }
      }
    },
    onAfterSubDamage(damage, target, source, move) {
      if (!move.hasSheerForce && source.hp) {
        for (const side of source.side.foeSidesWithConditions()) {
          side.addSideCondition("gmaxsteelsurge");
        }
      }
    },
    secondary: {},
    target: "normal",
    type: "Dragon"
}