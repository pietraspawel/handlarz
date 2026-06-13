import { AIPuppetStrategy } from "../../../public/js/game/ai/AIPuppetStrategy.js";
import { GeneService } from "./GeneService.js";
import { Puppet } from "../model/Puppet.js";

export class PuppetFactory {
    static create({ gameContext, aiTradersAmount }) {
        const puppetCollection = [];

        for (let i = 0; i < aiTradersAmount; i++) {
            const puppet = this.createPuppet({ gameContext, index: i });
            puppetCollection.push(puppet);
        }

        return puppetCollection;
    }

    static createPuppet({ gameContext, index }) {
        const name = `Puppet-${index}`;
        const city = gameContext.world.getRandomCity();
        const genom = GeneService.createRandomGenes(
            3,
            gameContext.world.cities,
            gameContext.world.goods,
        );
        const script = "";
        const strategy = new AIPuppetStrategy({ script });
        return new Puppet({ gameContext, index, name, city, strategy, genom });
    }
}
