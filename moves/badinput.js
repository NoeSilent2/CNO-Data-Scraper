{
	num: 42001,
    	accuracy: 95,
		basePower: 100,
		category: "Physical",
		name: "Bad Input",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1},
		onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) < pokemon.getStat('spa', false, true)) move.category = 'Special';
		},
		onAfterMoveSecondary(target, source, move) {
			let typelist = [
					"Normal",
					"Fire",
					"Water",
					"Electric",
					"Grass",
					"Ice",
					"Fighting",
					"Poison",
					"Ground",
					"Flying",
					"Psychic",
					"Bug",
					"Rock",
					"Ghost",
					"Dragon",
					"Dark",
					"Steel",
					"Fairy"
				];

				let newtype = this.sample(typelist);
				let newtypes = [newtype];
				const index = typelist.indexOf(newtype);
				typelist.splice(index, 1);
				if (this.randomChance(1, 2)) {
					this.add('-start', source, 'typechange', newtypes[0]);
					source.setType(newtypes[0]);
					return;
				}
				newtypes.push(this.sample(typelist));
				this.add('-start', source, 'typechange', newtypes[0] + "/" + newtypes[1]);
				source.setType(newtypes);
		},
		target: "normal",
		type: "Normal",
		contestType: "Clever",
}