{
    num: -3308,
    accuracy: 100,
    basePower: 80,
    basePowerCallback(target, source, move) {
      if (["iceage", "stoneage"].includes(move.sourceEffect)) {
        this.add("-combine");
        return 150;
      }
      return move.basePower;
    },
    category: "Physical",
    name: "Iron Age",
    pp: 10,
    priority: 0,
    flags: { protect: 1, mirror: 1, nonsky: 1, metronome: 1, pledgecombo: 1 },
    onPrepareHit(target, source, move) {
      for (const action of this.queue) {
        if (action.choice !== "move")
          continue;
        const otherMove = action.move;
        const otherMoveUser = action.pokemon;
        if (!otherMove || !action.pokemon || !otherMoveUser.isActive || otherMoveUser.fainted || action.maxMove || action.zmove) {
          continue;
        }
        if (otherMoveUser.isAlly(source) && ["iceage", "stoneage"].includes(otherMove.id)) {
          this.queue.prioritizeAction(action, move);
          this.add("-waiting", source, otherMoveUser);
          return null;
        }
      }
    },
    onModifyMove(move) {
      if (move.sourceEffect === "iceage") {
        move.type = "Ice";
        move.forceSTAB = true;
        move.self = { sideCondition: "mirrorshield" };
      }
      if (move.sourceEffect === "stoneage") {
        move.type = "Rock";
        move.forceSTAB = true;
        move.sideCondition = "gmaxsteelsurge";
      }
    },
    secondary: null,
    target: "normal",
    type: "Steel",
    contestType: "Clever"
}