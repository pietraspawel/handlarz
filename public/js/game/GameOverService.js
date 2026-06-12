export class GameOverService {
    static async gameOver(gameContext, trader, aiTraders) {
        const world = gameContext.world;
        const gameLog = gameContext.gameLog;
        gameLog.clean();

        await fetch("/game-over/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                map: world.map,
                score: trader.gold,
                highscore: gameContext.highscore,
                aiPlayers: aiTraders,
                gameLog: gameLog,
            }),
        });

        location.replace("/game-over");
    }
}
