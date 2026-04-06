{
    num: -3247,
    accuracy: true,
    basePower: 0,
    category: "Status",
    name: "Lock In",
    pp: 5,
    priority: 0,
    flags: { snatch: 1, metronome: 1 },
    volatileStatus: "noretreat",
    onTry(source, target, move) {
      if (source.volatiles["noretreat"])
        return false;
      if (source.volatiles["trapped"]) {
        delete move.volatileStatus;
      }
    },
    condition: {
      onStart(pokemon) {
        this.add("-start", pokemon, "move: Lock In");
      },
      onTrapPokemon(pokemon) {
        pokemon.tryTrap();
      }
    },
    boosts: {
      atk: 1,
      def: 1,
      spd: 1
    },
    secondary: null,
    target: "self",
    type: "Steel"
}