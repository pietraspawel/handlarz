import { MathLibrary } from "../../../../public/js/game/MathLibrary.js";
import { GameContext } from "../../core/GameContext.js";
import { GeneService } from "../../core/GeneService.js";
import { PuppetFactory } from "./PuppetFactory.js";

export class SimulationContext {
    gameContext;
    mapConfig;
    map;
    puppetCollection;

    constructor(mapConfig) {
        this.gameContext = new GameContext(mapConfig);
        this.mapConfig = mapConfig;
        this.map = mapConfig.map;
        this.puppetCollection = [];
    }

    start() {
        console.log("Start simulation.");
        this.puppetCollection = PuppetFactory.create({
            gameContext: this.gameContext,
        });
    }
}
