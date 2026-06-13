import { GameContext } from "./GameContext.js";
import { PuppetFactory } from "./PuppetFactory.js";

export class SimulationContext {
    gameContext;
    map;
    aiTradersAmount;
    survivorsPercenatge;
    mutationChance;
    generationsAmountCondition;
    goldAmountCondition;
    puppetCollection;

    constructor(simConfig, mapConfig) {
        this.gameContext = new GameContext(mapConfig);
        this.map = simConfig.map;
        this.aiTradersAmount = simConfig.aiTradersAmount;
        this.survivorsPercenatge = simConfig.survivors;
        this.mutationChance = simConfig.mutationChance;
        this.generationsAmountCondition = simConfig.generationsAmountCondition;
        this.goldAmountCondition = simConfig.goldAmountCondition;
        this.puppetCollection = [];
    }

    start() {
        this.initFirstGeneration();
        for (const puppet of this.puppetCollection) {
            puppet.initTurnZero(this.gameContext);
        }
    }

    initFirstGeneration() {
        console.log("Initialize first generation.");

        this.puppetCollection = PuppetFactory.create({
            gameContext: this.gameContext,
            aiTradersAmount: this.aiTradersAmount,
        });
    }
}
