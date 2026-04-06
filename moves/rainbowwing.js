{
    num: -3285,
    accuracy: 95,
    basePower: 80,
    category: "Physical",
    name: "Rainbow Wing",
    pp: 10,
    priority: 0,
    flags: { protect: 1, mirror: 1, distance: 1, metronome: 1, wind: 1 },
    onModifyMove(move, pokemon, target) {
      if (["raindance"].includes(pokemon.effectiveWeather())) {
        this.field.clearWeather();
        this.field.setWeather("sunnyday");
        move.self = { sideCondition: "waterpledge" };
      }
    },
    secondary: null,
    target: "any",
    type: "Flying",
    contestType: "Beautiful"
}