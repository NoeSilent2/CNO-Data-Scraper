{
    num: -3281,
    accuracy: 100,
    basePower: 60,
    category: "Physical",
    name: "Hammer Down",
    pp: 15,
    priority: 0,
    flags: { protect: 1, mirror: 1, nonsky: 1, metronome: 1, hammer: 1 },
    volatileStatus: "smackdown",
    onEffectiveness(typeMod, target, type) {
      if (type === "Steel")
        return 1;
    },
    secondary: null,
    target: "normal",
    type: "Rock",
    contestType: "Tough"
}