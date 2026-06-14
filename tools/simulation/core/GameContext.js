import { World } from "../../../public/js/game/model/World.js";
import { GameLog } from "../../../public/js/game/log/GameLog.js";

export class GameContext {
    gameLog;
    turnsLeft;
    startGold;
    world;

    constructor(config) {
        this.turnsLeft = config.game.turnsAmount;
        this.startGold = config.game.startGold;
        this.world = new World(config);
        this.gameLog = new GameLog(this.world.map);
    }

    playAGame(puppetCollection) {
        this.gameLog.startTurn({ aiTraders: puppetCollection });
        for (const puppet of puppetCollection) {
            puppet.initTurnZero(this);
        }
    }
}
