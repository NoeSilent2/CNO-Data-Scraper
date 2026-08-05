{
	num: 42001,
    	accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Siphon",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1},
		onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
		onHit(target, source, move) {
			if (source.hp !== source.maxhp) {
				let damage = this.actions.getDamage(source, target, move);
				this.heal(Math.ceil(damage * 0.5), source, target, 'drain');
			}
			else {
				this.add('-activate', source, 'move: Siphon');
				this.field.setTerrain('grassyterrain');
			}
		},
		target: "normal",
		type: "Grass",
		contestType: "Clever",
}