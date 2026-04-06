{
  num: -3201,
  accuracy: 90,
  basePower: 25,
  category: "Physical",
  name: "Bullet Barrage",
  pp: 15,
  priority: 0,
  flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1 },
  onModifyMove(move, pokemon) {
    if (pokemon.terastallized && pokemon.getStat("spa", false, true) > pokemon.getStat("atk", false, true)) {
      move.category = "Special";
    }
  },
  multihit: [2, 5],
  secondary: null,
  target: "normal",
  type: "Steel",
  zMove: { basePower: 140 },
  maxMove: { basePower: 130 }
}