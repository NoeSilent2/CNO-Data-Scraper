{
    num: -3278,
    accuracy: 85,
    basePower: 25,
    basePowerCallback(pokemon, target, move) {
      return 20 + (5 * move.hit);
    },
    category: "Physical",
    name: "Five Star Punch",
    pp: 10,
    priority: 0,
    flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, punch: 1 },
    overrideOffensiveStat: "spd",
    multihit: 5,
    multiaccuracy: true,
    secondary: null,
    target: "normal",
    type: "Bug",
    zMove: { basePower: 160 },
    maxMove: { basePower: 200 }
}