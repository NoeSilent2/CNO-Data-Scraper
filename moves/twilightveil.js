{
  num: 5002,
  accuracy: true,
  basePower: 0,
  category: "Status",
  name: "Twilight Veil",
  pp: 20,
  priority: 0,
  flags: { snatch: 1, metronome: 1 },
  sideCondition: "twilightveil",
  onTryMove(pokemon) {
    if (!this.field.isTerrain(["mistyterrain"])) {
      this.directDamage(pokemon.maxhp * 0.2);
    }
  },
  condition: {
    duration: 5,
    durationCallback(target, source, effect) {
      if (source?.hasItem("lightclay")) {
        return 8;
      }
      return 5;
    },
    onAnyModifyDamage(damage, source, target, move) {
      if (target !== source && this.effectState.target.hasAlly(target)) {
        if (
          (target.side.getSideCondition("reflect") && this.getCategory(move) === "Physical") ||
          (target.side.getSideCondition("lightscreen") && this.getCategory(move) === "Special")
        ) {
          return;
        }
        const hitData = target.getMoveHitData(move);
        if (!hitData || hitData.crit || move.infiltrates) return;

        const activeAllies = source.side.active.filter(p => p && !p.fainted);
        if (activeAllies.length > 1) {
          return this.chainModify([2732, 4096]);
        }
        return this.chainModify(0.5);
      }
    },
    onSideStart(side) {
      this.add("-sidestart", side, "move: Twilight Veil");
    },
    onSideResidualOrder: 26,
    onSideResidualSubOrder: 10,
    onSideEnd(side) {
      this.add("-sideend", side, "move: Twilight Veil");
    }
  },
  secondary: null,
  target: "allySide",
  type: "Fairy",
  zMove: { boost: { spe: 1 } },
  contestType: "Beautiful"
}