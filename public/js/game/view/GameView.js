// note: do zmiany:
// refreshcitycursors

class GameView {
	static refreshAll(world, player, aiPlayersArray) {
		GameView.refreshView(
			world.highscore,
			world.turnsLeft,
			world.cities,
			player,
		);
		TraderView.refreshView(player);
		for (
			let i = 0;
			i < World.MAX_NON_HIDDEN_AI && i < aiPlayersArray.length;
			i++
		) {
			TraderAIView.refreshPosition(aiPlayersArray[i]);
		}
		aiPlayersArray.forEach((ai) => TraderAIView.refreshInfo(ai));
	}

	static refreshView(highscore, turnsLeft, cities, player) {
		GameView.refreshMapRecordView(highscore);
		GameView.refreshTurnsLeftView(turnsLeft);
		CityView.refreshCityCursors(cities, player);
		CityView.refreshCityPrices(cities);
	}

	static refreshTurnsLeftView(turnsLeft) {
		$(".player-info .turns-left").text(turnsLeft);
	}

	static refreshMapRecordView(highscore) {
		let string = Library.separateThousands(highscore) + " $";
		$(".player-info .map-record").text(string);
	}

	static refreshPlayer(world, player) {
		GameView.refreshView(
			world.highscore,
			world.turnsLeft,
			world.cities,
			player,
		);
		TraderView.refreshView(player);
	}
}
