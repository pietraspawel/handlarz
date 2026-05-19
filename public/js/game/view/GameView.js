// note: do zmiany:
// refreshcitycursors

class GameView {
	static refreshAll(world, trader, aiPlayersArray) {
		GameView.refreshMapRecordView(world.highscore);
		CityView.refreshCityPrices(world.cities);
		this.refreshElementsAfterTurn(world, trader, aiPlayersArray);
		this.refreshElementsAfterTrade(trader);
	}

	static refreshElementsAfterTurn(world, trader, aiPlayersArray) {
		GameView.refreshTurnsLeftView(world.turnsLeft);
		CityView.refreshElementsAfterTurn(world.cities, trader);
		TraderView.refreshElementsAfterTurn(trader);
		for (
			let i = 0;
			i < World.MAX_NON_HIDDEN_AI && i < aiPlayersArray.length;
			i++
		) {
			TraderAIView.refreshPosition(aiPlayersArray[i]);
		}
		aiPlayersArray.forEach((ai) => TraderAIView.refreshInfo(ai));
		if (trader.isInCity()) {
			CityView.refreshElementsAfterEnterCity(trader);
		}
	}

	static refreshElementsAfterTrade(trader) {
		CityView.refreshElementsAfterTrade(trader);
		TraderView.refreshElementsAfterTrade(trader);
	}

	static refreshTurnsLeftView(turnsLeft) {
		$(".player-info .turns-left").text(turnsLeft);
	}

	static refreshMapRecordView(highscore) {
		let string = Library.separateThousands(highscore) + " $";
		$(".player-info .map-record").text(string);
	}
}
