{
	num: 42001,
    	accuracy: 95,
		basePower: 90,
		category: "Physical",
		name: "Fester",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1},
		onModifyAccuracy(accuracy, target) {
			if (target.hasType('Dark') || target.hasType('Psychic') || target.hasType('Grass')) {
				return true;
			}
		},
		onModifyMove(move, pokemon, target) {
			if (target.hasType('Dark') || target.hasType('Psychic') || target.hasType('Grass')) {
				move.self = { boosts: { atk: 1 } };
			}
		},
		target: "normal",
		type: "Bug",
		contestType: "Tough",
}