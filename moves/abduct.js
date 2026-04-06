{
  num: 10003,
    accuracy: 90,
    basePower: 85,
    category: "Special",
    name: "Abduct",
    pp: 10,
    priority: 0,
    flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
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
    target: "normal",
    type: "Steel"
}
