{
    num: -3311,
    accuracy: 100,
    basePower: 60,
    category: "Special",
    name: "Frigid Water",
    pp: 15,
    priority: 0,
    flags: { protect: 1, mirror: 1, metronome: 1 },
    onBasePower(basePower, source) {
      if (this.field.isWeather(["snow", "hail"])) {
        this.debug("snow buff");
        return this.chainModify(1.5);
      }
    },
    secondary: {
      chance: 30,
      status: "frz"
    },
    target: "normal",
    type: "Water",
    contestType: "Tough"
}