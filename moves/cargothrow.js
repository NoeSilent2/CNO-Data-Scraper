{
    num: -3310,
    accuracy: 95,
    basePower: 70,
    category: "Physical",
    name: "Cargo Throw",
    pp: 10,
    priority: 0,
    flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, noassist: 1, failcopycat: 1, throwing: 1 },
    onHit(target, source, move) {
      if (source.isActive) {
        target.addVolatile("cargothrow", source, move, "cargograb");
      }
    },
    onModifyMove(move, pokemon, target) {
      if (target.volatiles["cargothrow"] && pokemon.volatiles["cargograb"]) {
        move.forceSwitch = true;
      }
    },
    target: "normal",
    type: "Grass",
    contestType: "Tough"
}