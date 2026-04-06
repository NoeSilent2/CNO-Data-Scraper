{
    num: -3318,
    accuracy: 100,
    basePower: 80,
    category: "Physical",
    name: "Mantis Strike",
    pp: 5,
    priority: 1,
    flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, slicing: 1 },
    onTry(source, target) {
      const action = this.queue.willMove(target);
      const move = action?.choice === "move" ? action.move : null;
      if (!move || move.category === "Status" && move.id !== "mefirst" || target.volatiles["mustrecharge"]) {
        return false;
      }
    },
    secondary: null,
    target: "normal",
    type: "Bug",
    contestType: "Beautiful"
}