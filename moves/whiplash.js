{
	num: 42001,
    	accuracy: 100,
		basePower: 40,
		category: "Special",
		name: "Whiplash",
		pp: 20,
		priority: 1,
		flags: { protect: 1, mirror: 1, distance: 1, metronome: 1, wind: 1 },
		onBasePower(basePower, attacker, defender, move) {
			const sides = [attacker.side, ...attacker.side.foeSidesWithConditions()];
			for (const side of sides) {
				if (side.getSideCondition('tailwind')) {
					this.add('-activate', attacker, 'move: Whiplash');
					return this.chainModify(1.5);
				}
			}
		},
		target: "normal",
		type: "Flying",
		contestType: "Beauty",
}