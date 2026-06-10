class GameView {
	static refreshAll(gameContext, trader, aiTraders) {
		const world = gameContext.world;
		GameView.refreshMapRecordView(gameContext.highscore);
		CityView.refreshCityPrices(world.cities);
		this.refreshElementsAfterTurn(world, trader, aiTraders);
		this.refreshElementsAfterTrade(trader);
	}

	static refreshElementsAfterTurn(world, trader, aiTraders) {
		GameView.refreshTurnsLeftView(world.turnsLeft);
		TraderView.refreshElementsAfterTurn(trader);
		TraderAIView.refreshElementsAfterTurn(aiTraders);
		if (trader.isInCity()) {
			WorldView.setTravelMode(false);
			CityView.setTravelMode(false, trader);
		} else {
			WorldView.setTravelMode(true);
			CityView.setTravelMode(true, trader);
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
		let string = MathLibrary.formatNumber(highscore) + " $";
		$(".player-info .map-record").text(string);
	}
}
