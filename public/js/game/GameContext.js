class GameContext {
    static GAME_MODE = { MANUAL: "manual", AUTO_TURNS: "autoTurns" };
    static MAX_NON_HIDDEN_AI = 3;

    gameMode;
    gameLog;
    world;
    highscore;
    turnsLeft;
    startGold;

    constructor({ gameMode, data, world }) {
        this.gameMode = gameMode;
        this.world = world;
        this.gameLog = new GameLog(world.map);
        this.highscore = parseInt(data.game.highscore);
        this.turnsLeft = data.game.turnsAmount;
        this.startGold = data.game.startGold;
    }
}
