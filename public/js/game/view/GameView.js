// note: do zmiany:
// refreshcitycursors

class GameView {
	static refreshAll(world, trader, aiPlayersArray) {
		GameView.refreshMapRecordView(world.highscore);
		this.refreshElementsAfterTurn(world, trader, aiPlayersArray);
	}

	static refreshElementsAfterTurn(world, trader, aiPlayersArray) {
		GameView.refreshTurnsLeftView(world.turnsLeft);
		CityView.refreshCityCursors(world.cities, trader);
		CityView.refreshCityPrices(world.cities);
		TraderView.refreshView(trader);
		for (
			let i = 0;
			i < World.MAX_NON_HIDDEN_AI && i < aiPlayersArray.length;
			i++
		) {
			TraderAIView.refreshPosition(aiPlayersArray[i]);
		}
		aiPlayersArray.forEach((ai) => TraderAIView.refreshInfo(ai));
	}

	static refreshTurnsLeftView(turnsLeft) {
		$(".player-info .turns-left").text(turnsLeft);
	}

	static refreshMapRecordView(highscore) {
		let string = Library.separateThousands(highscore) + " $";
		$(".player-info .map-record").text(string);
	}
}
