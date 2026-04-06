{
    num: -3249,
    accuracy: true,
    basePower: 0,
    category: "Status",
    name: "Turn Tail",
    pp: 5,
    priority: 0,
    flags: { snatch: 1, heal: 1, metronome: 1 },
    heal: [1, 3],
    onTry(source) {
      if (source.volatiles["noretreat"]) {
        this.add("-fail", source, "move: Turn Tail");
        this.hint(" A Pokemon who has the No Retreat status can't use this move.");
        return null;
      }
      if (source.species.baseSpecies === "Golisopede" || source.species.baseSpecies === "Golisomite") {
        this.add("-fail", source, "move: Turn Tail");
        this.hint(" This Pokemon cannot use this move.");
        return null;
      }
    },
    selfSwitch: true,
    secondary: null,
    target: "self",
    type: "Flying",
    contestType: "Cute"
}