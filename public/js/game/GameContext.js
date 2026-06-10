class GameContext {
    static GAME_MODE = { MANUAL: "manual", AUTO_TURNS: "autoTurns" };
    static MAX_NON_HIDDEN_AI = 3;

    gameMode;
	gameLog;
	world;

	constructor(gameMode, world) {
        this.gameMode = GameContext.GAME_MODE.MANUAL;
        if (gameMode == "autoTurns") {
            this.gameMode = GameContext.GAME_MODE.AUTO_TURNS;
        }
        this.gameMode = gameMode;
		this.world = world;
		this.gameLog = new GameLog(world.map);
	}
}