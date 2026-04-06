{
  num: -3221,
  accuracy: 75,
  basePower: 0,
  category: "Status",
  name: "Sleep Charm",
  pp: 5,
  priority: 0,
  flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1, heal: 1 },
  onHit(target, source) {
    this.heal(Math.ceil(source.maxhp * 0.25), source);
  },
  status: "slp",
  secondary: null,
  target: "normal",
  type: "Psychic",
  contestType: "Cute"
}