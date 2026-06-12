import { GameContext } from "./GameContext.js";

export class SimulationContext {
    gameContext;

    constructor(config) {
        this.gameContext = new GameContext(config);
    }
}
