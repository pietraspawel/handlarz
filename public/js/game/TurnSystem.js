// Podczas swojej tury Gracz może:
// kupować/sprzedawać
// wyznaczyć cel - to kończy turę i rozgrywa się część automatyczna

// Część automatyczna:
// Wykonywanie są działania AI.
// Jeśli Gracz jest u celu to koniec części automatycznej.
// Jeśli nie, to Gracz przesuwa się o jedno pole do celu.

// Tura AI:
// Przesuń Gracza o jedno pole.
// Jeśli Gracz jest u celu to sprzedaj wszystko, kup towar, wyznacz nowy cel.

class TurnSystem {
	static nextTurn(world, trader, aiTraders) {
		for (const aiPlayer of aiTraders) {
			aiPlayer.turn(world);
		}
		trader.turn(world);
		world.turnsLeft--;
		GameView.refreshElementsAfterTurn(world, trader, aiTraders);

		if (world.turnsLeft <= 0) {
			GameOverService.gameOver(world, trader, aiTraders);
		}
	}

	static autoTurns(world, trader, aiTraders) {
		const interval = setInterval(() => {
			TurnSystem.nextTurn(world, trader, aiTraders);

			if (trader.isInCity()) {
				clearInterval(interval);
			}
		}, 200);
	}
}
