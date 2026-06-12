import { World } from "../../../public/js/game/model/World.js";

export class GameContext {
    turnsLeft;
    startGold;
    world;

    constructor(config) {
        this.turnsLeft = config.game.turnsAmount;
        this.startGold = config.game.startGold;
        this.world = new World(config);
    }
}
