{
    num: -3287,
    accuracy: 90,
    basePower: 130,
    category: "Physical",
    name: "Dropkix",
    pp: 10,
    priority: 0,
    flags: { contact: 1, protect: 1, mirror: 1, gravity: 1, metronome: 1, kick: 1 },
    hasCrashDamage: true,
    onMoveFail(target, source, move) {
      if (!source.hasAbility("rockhead")) {
        this.damage(source.baseMaxhp / 2, source, source, this.dex.conditions.get("Dropkix"));
      }
    },
    secondary: null,
    target: "normal",
    type: "Bug",
    contestType: "Cool"
}