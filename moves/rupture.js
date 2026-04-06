{
  num: 614,
  accuracy: 100,
  basePower: 70,
  category: "Special",
  isNonstandard: "Past",
  name: "Rupture",
  pp: 10,
  priority: 0,
  flags: { protect: 1, mirror: 1, nonsky: 1 },
  onEffectiveness(typeMod, target, type, move) {
    if (move.type !== "Ground")
      return;
    if (!target)
      return;
    if (!target.runImmunity("Ground")) {
      if (target.hasType("Flying"))
        return 0;
    }
  },
  onEffectiveness(typeMod, target, type) {
    if (type === "Flying")
      return 1;
  },
  ignoreImmunity: { "Ground": true },
  secondary: null,
  target: "normal",
  type: "Ground",
  zMove: { basePower: 180 },
  contestType: "Beautiful"
}