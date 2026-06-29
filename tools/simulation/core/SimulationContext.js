import { MathLibrary } from "../../../public/js/game/MathLibrary.js";
import { GameContext } from "./GameContext.js";
import { GeneService } from "./GeneService.js";
import { PuppetFactory } from "./PuppetFactory.js";

export class SimulationContext {
    gameContext;
    mapConfig;
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
        this.mapConfig = mapConfig;
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
        let gameIndex = 0;
        let maxGold = 0;
        let maxPuppet;

        this.initFirstGeneration();

        while (gameIndex < this.generationsAmountCondition) {
            gameIndex++;

            this.gameContext = new GameContext(this.mapConfig);

            this.gameContext.playAGame(this.puppetCollection);
            this.puppetCollection = GeneService.selection(this.puppetCollection, this.survivorsPercentage);

            if (this.puppetCollection[0].gold > maxGold) {
                console.log(`\nGeneration ${gameIndex}`);
                console.log(
                    MathLibrary.describeBigNumber(this.puppetCollection[0].gold),
                    this.puppetCollection[0].gold,
                );
                maxGold = this.puppetCollection[0].gold;
                maxPuppet = this.puppetCollection[0];
            } else if (gameIndex % 100 == 0) {
                console.log(`\nGeneration ${gameIndex}`);
            } else {
                process.stdout.write(".");
            }

            if (this.puppetCollection[0].gold > this.goldAmountCondition) {
                break;
            }

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
        console.log(`\nGeneration ${gameIndex}`);
        console.log(MathLibrary.describeBigNumber(maxGold), maxGold);
        const script = maxPuppet.strategy.toTextScript();
        console.log(script);
    }

    initFirstGeneration() {
        console.log("Initialize first generation.");

        this.puppetCollection = PuppetFactory.create({
            gameContext: this.gameContext,
            aiTradersAmount: this.aiTradersAmount,
        });
    }
}
