class GameView {
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
}
