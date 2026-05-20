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
	static autoTurnTimeout = null;

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
		if (!trader.isTravelling()) {
			return;
		}
	}

	static autoTurns(world, trader, aiTraders) {
		if (this.autoTurnTimeout) {
			return;
		}

		const loop = () => {
			if (!trader.isTravelling()) {
				TurnSystem.stopAutoTurns();
				return;
			}

			TurnSystem.nextTurn(world, trader, aiTraders);
			this.autoTurnTimeout = setTimeout(loop, 200);
		};

		this.autoTurnTimeout = setTimeout(loop, 200);
	}

	static stopAutoTurns() {
		if (this.autoTurnTimeout) {
			clearTimeout(this.autoTurnTimeout);
			this.autoTurnTimeout = null;
		}
	}

	static finishAutoTurns(world, trader, aiTraders) {
		TurnSystem.stopAutoTurns();

		while (trader.isTravelling()) {
			TurnSystem.nextTurn(world, trader, aiTraders);
			if (world.turnsLeft <= 0) {
				break;
			}
		}
	}
}
