{
	num: 42002,
    	accuracy: 100,
		basePower: 25,
		category: "Physical",
		name: "Rapid Fire",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1 },
		multihit: 3,
		critRatio: 2,
		secondaries: [
			{
				chance: 10,
				status: 'brn'
			}, {
				chance: 10,
				volatileStatus: 'flinch',
			},
		],
		target: "normal",
		type: "Ground",
		contestType: "Tough",
}