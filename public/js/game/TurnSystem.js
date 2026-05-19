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
	static nextTurn(world, player, aiPlayersArray) {
		for (const aiPlayer of aiPlayersArray) {
			aiPlayer.turn(world);
		}
		player.turn(world);
		world.turnsLeft--;
		GameView.refreshElementsAfterTurn(world, player, aiPlayersArray);

		if (world.turnsLeft <= 0) {
			GameOverService.gameOver(world, player, aiPlayersArray);
		}
	}
}
