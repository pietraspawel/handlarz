import { GameContext } from "./GameContext.js";
import { GeneService } from "./GeneService.js";
import { PuppetFactory } from "./PuppetFactory.js";

export class SimulationContext {
    gameContext;
    map;
    aiTradersAmount;
    survivorsPercentage;
    mutationChance;
    targetPopulationSize;
    generationsAmountCondition;
    goldAmountCondition;
    puppetCollection;

    constructor(simConfig, mapConfig) {
        this.gameContext = new GameContext(mapConfig);
        this.map = simConfig.map;
        this.aiTradersAmount = simConfig.aiTradersAmount;
        this.survivorsPercentage = simConfig.survivorsPercentage;
        this.mutationChance = simConfig.mutationChance;
        this.targetPopulationSize = simConfig.targetPopulationSize;
        this.generationsAmountCondition = simConfig.generationsAmountCondition;
        this.goldAmountCondition = simConfig.goldAmountCondition;
        this.puppetCollection = [];
    }

    start() {
        this.initFirstGeneration();
        this.gameContext.playAGame(this.puppetCollection);
        this.puppetCollection = GeneService.selection(this.puppetCollection, this.survivorsPercentage);
        this.puppetCollection = GeneService.multiplication({
            gameContext: this.gameContext,
            population: this.puppetCollection,
            targetPopulationSize: this.targetPopulationSize,
        });
        this.puppetCollection = GeneService.mutation({
            gameContext: this.gameContext,
            population: this.puppetCollection,
            mutationChance: this.mutationChance,
        });
    }

    initFirstGeneration() {
        console.log("Initialize first generation.");

        this.puppetCollection = PuppetFactory.create({
            gameContext: this.gameContext,
            aiTradersAmount: this.aiTradersAmount,
        });
    }
}
