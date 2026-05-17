class TurnSystem {
	static nextTurn(world, player, aiPlayersArray) {
		for (const aiPlayer of aiPlayersArray) {
			aiPlayer.turn(world);
		}

		world.turnsLeft--;
		GameView.refreshAll(world, player, aiPlayersArray);

		if (world.turnsLeft <= 0) {
			GameOverService.gameOver(world, player, aiPlayersArray);
		}
	}
}
