{
    num: -3317,
    accuracy: 100,
    basePower: 60,
    basePowerCallback(pokemon, target, move) {
      if (target.beingCalledBack || target.switchFlag) {
        this.debug("Ensnare damage boost");
        return move.basePower * 2;
      }
      return move.basePower;
    },
    category: "Physical",
    isNonstandard: "Past",
    name: "Ensnare",
    pp: 15,
    priority: 0,
    flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
    beforeTurnCallback(pokemon) {
      for (const side of this.sides) {
        if (side.hasAlly(pokemon))
          continue;
        side.addSideCondition("ensnare", pokemon);
        const data = side.getSideConditionData("ensnare");
        if (!data.sources) {
          data.sources = [];
        }
        data.sources.push(pokemon);
      }
    },
    onModifyMove(move, source, target) {
      if (target?.beingCalledBack || target?.switchFlag)
        move.accuracy = true;
    },
    onTryHit(target, pokemon) {
      target.side.removeSideCondition("ensnare");
    },
    secondary: null,
    target: "normal",
    type: "Bug",
    contestType: "Clever"
}