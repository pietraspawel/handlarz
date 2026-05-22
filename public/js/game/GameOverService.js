class GameOverService {
    static async gameOver(gameContext, trader, aiTraders) {
        let world = gameContext.world;

        await fetch("/game-over/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                map: world.map,
                score: trader.gold,
                highscore: world.highscore,
                aiPlayers: aiTraders,
                gameLog: gameContext.gameLog,
            }),
        });

        // location.replace("/game-over");
    }
}
