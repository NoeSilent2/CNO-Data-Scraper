{
  num: -3211,
  accuracy: true,
  basePower: 0,
  category: "Status",
  name: "Magic Trick",
  pp: 10,
  priority: 0,
  flags: { protect: 1, mirror: 1, bypasssub: 1, allyanim: 1, metronome: 1 },
  onHit(target, source) {
    const targetAtk = target.storedStats.atk;
    const targetSpA = target.storedStats.spa;
    target.storedStats.atk = targetSpA;
    target.storedStats.spa = targetAtk;
    this.add("-activate", source, "move: Magic Trick", "[of] " + target);
  },
  secondary: null,
  target: "self",
  type: "Fairy",
  zMove: { boost: { spe: 1 } },
  contestType: "Clever"
}