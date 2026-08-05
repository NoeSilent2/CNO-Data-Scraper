{
	num: 42006,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Dealer",
		pp: 10,
		priority: 0,
		flags: { bypasssub: 1 },
		onHitField(target, source, move) {
			const targets = this.getAllActive();
			var items = [];
			for (const pkmn of targets) {
				if (!pkmn.item) continue;
				items.push(pkmn.item);
			}
			this.add('-activate', source, 'move: Dealer', '[msg]shuffle');
			for (const item of items) {
				let pkmn = this.sample(targets);
				const index = targets.indexOf(pkmn);
				pkmn.setItem(item, source, move);
				targets.splice(index, 1);
				this.add("-item", pkmn, this.dex.items.get(item), "[from] move: Dealer");
			}
		},
		target: "all",
		type: "Normal",
		contestType: "Clever",
	}