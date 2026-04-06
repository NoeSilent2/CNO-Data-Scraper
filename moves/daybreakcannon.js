{
  num: 5003,
  accuracy: 100,
  basePower: 150,
  category: "Special",
  name: "Daybreak Cannon",
  pp: 5,
  priority: 0,
  flags: { recharge: 1, protect: 1, mirror: 1, metronome: 1 },
  onTryMove(attacker, defender, move) {
    if (!this.field.isWeather('sunnyday') && !this.field.isWeather('desolateland')) {
      attacker.addVolatile('mustrecharge');
    }
  },
  secondary: null,
  target: "normal",
  type: "Fire",
  contestType: "Cool"
}