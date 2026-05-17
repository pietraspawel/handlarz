class GameOverService {
	static async gameOver(world, player, aiPlayersArray) {
		player.sellAll();
		aiPlayersArray.forEach((ai) => ai.sellAll());

		await fetch("/game-over/save", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				map: world.map,
				score: player.gold,
				highscore: world.highscore,
				aiPlayers: aiPlayersArray,
			}),
		});

		location.replace("/game-over");
	}
}
