{
    num: -3245,
    accuracy: 90,
    basePower: 130,
    category: "Physical",
    name: "Nosedive",
    pp: 10,
    priority: 0,
    flags: { contact: 1, protect: 1, mirror: 1, gravity: 1, metronome: 1 },
    hasCrashDamage: true,
    onMoveFail(target, source, move) {
      if (!source.hasAbility("rockhead")) {
        this.damage(source.baseMaxhp / 2, source, source, this.dex.conditions.get("Nosedive"));
      }
    },
    secondary: null,
    target: "normal",
    type: "Flying",
    contestType: "Cool"
}