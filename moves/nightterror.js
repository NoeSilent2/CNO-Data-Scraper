{
  num: -3212,
  accuracy: 100,
  basePower: 100,
  category: "Physical",
  name: "Night Terror",
  pp: 15,
  priority: 0,
  flags: { protect: 1, mirror: 1, heal: 1, metronome: 1 },
  drain: [3, 4],
  onTryImmunity(target) {
    return target.status === "slp" || target.hasAbility("comatose");
  },
  secondary: null,
  target: "normal",
  type: "Dark",
  contestType: "Clever"
}