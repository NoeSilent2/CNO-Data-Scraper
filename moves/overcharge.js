{
	num: 42001,
    	accuracy: 90,
		basePower: 140,
		category: "Physical",
		name: "Overcharge",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, cantusetwice: 1 },
		onAfterMoveSecondary(target, source, move) {
			for (const ally of source.adjacentAllies()) {
				if (ally.hasType('Electric')) {
					let stats = [];
					const boost = {};
					let statPlus;
					for (statPlus in ally.boosts) {
						if (statPlus === "accuracy" || statPlus === "evasion")
						continue;
						if (ally.boosts[statPlus] < 6) {
							stats.push(statPlus);
						}
					}
					let randomStat = stats.length ? this.sample(stats) : void 0;
					if (randomStat)
					boost[randomStat] = 1;
					this.boost(boost, ally);
				}
			}
		},
		target: "normal",
		type: "Electric",
		contestType: "Tough",
}