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
        this.gameContext.playAGame(this.puppetCollection);
        const sortedPopulation = [...this.puppetCollection].sort((a, b) => b.gold - a.gold);
        const maxGold = sortedPopulation[0].gold;
        console.log(MathLibrary.describeBigNumber(maxGold), maxGold);
        const script = sortedPopulation[0].strategy.toTextScript();
        console.log(script);
    }
}
