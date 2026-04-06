{
    num: -3328,
    accuracy: true,
    basePower: 0,
    category: "Status",
    name: "Slick Slime",
    pp: 20,
    priority: 0,
    flags: { snatch: 1, metronome: 1 },
    onTry(source) {
      if (source.volatiles["slickslime"] && source.volatiles["slickslime"].layers >= 6)
        return false;
    },
    volatileStatus: "slickslime",
    secondary: null,
    target: "self",
    type: "Poison",
    zMove: { effect: "clearnegativeboost" },
    contestType: "Clever"
}