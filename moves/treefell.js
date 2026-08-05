{
	num: 42001,
    	accuracy: 90,
		basePower: 90,
		category: "Physical",
		name: "Tree Fell",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, slicing: 1 },
		onEffectiveness(typeMod, target, type) {
			if (type === 'Grass') return 1;
		},
		target: "normal",
		type: "Steel",
		contestType: "Tough",
}