// note: do zmiany:
// refreshcitycursors

class GameView {
	static refreshAll(world, trader, aiTraders) {
		GameView.refreshMapRecordView(world.highscore);
		CityView.refreshCityPrices(world.cities);
		this.refreshElementsAfterTurn(world, trader, aiTraders);
		this.refreshElementsAfterTrade(trader);
	}

	static refreshElementsAfterTurn(world, trader, aiTraders) {
		GameView.refreshTurnsLeftView(world.turnsLeft);
		TraderView.refreshElementsAfterTurn(trader);
		TraderAIView.refreshElementsAfterTurn(aiTraders);
		if (trader.isInCity()) {
			CityView.refreshElementsAfterEnterCity(trader);
			CityView.enableTrade();
		} else {
			CityView.disableTrade();
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
