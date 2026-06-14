import { GameContext } from "./GameContext.js";
import { PuppetFactory } from "./PuppetFactory.js";

export class SimulationContext {
    gameContext;
    map;
    aiTradersAmount;
    survivorsPercentage;
    mutationChance;
    generationsAmountCondition;
    goldAmountCondition;
    puppetCollection;

    constructor(simConfig, mapConfig) {
        this.gameContext = new GameContext(mapConfig);
        this.map = simConfig.map;
        this.aiTradersAmount = simConfig.aiTradersAmount;
        this.survivorsPercentage = simConfig.survivorsPercentage;
        this.mutationChance = simConfig.mutationChance;
        this.generationsAmountCondition = simConfig.generationsAmountCondition;
        this.goldAmountCondition = simConfig.goldAmountCondition;
        this.puppetCollection = [];
    }

    start() {
        this.initFirstGeneration();
        this.gameContext.playAGame(this.puppetCollection);
        this.selection();
    }

    initFirstGeneration() {
        console.log("Initialize first generation.");

        this.puppetCollection = PuppetFactory.create({
            gameContext: this.gameContext,
            aiTradersAmount: this.aiTradersAmount,
        });
    }

    selection() {
        if (this.puppetCollection.length === 0) {
            return [];
        }

        // ile ma przeżyć
        const survivorsAmount = Math.max(
            1,
            Math.floor((this.puppetCollection.length * this.survivorsPercentage) / 100),
        );

        // sort malejąco po goldzie
        const sortedPopulation = [...this.puppetCollection].sort((a, b) => b.gold - a.gold);
        const survivors = [];

        // zawsze przeżywa najlepszy
        survivors.push(sortedPopulation[0]);

        // wielkość turnieju
        const tournamentSize = Math.max(2, Math.floor(survivorsAmount * 0.1));

        // dobieranie reszty
        while (survivors.length < survivorsAmount) {
            const tournament = [];

            // losowanie uczestników turnieju
            for (let i = 0; i < tournamentSize; i++) {
                const randomIndex = Math.floor(Math.random() * sortedPopulation.length);
                tournament.push(sortedPopulation[randomIndex]);
            }

            // wybór najlepszego z turnieju
            tournament.sort((a, b) => b.gold - a.gold);
            const winner = tournament[0];

            // unikaj duplikatów
            if (!survivors.includes(winner)) {
                survivors.push(winner);
            }
        }

        this.puppetCollection = survivors;
    }
}
