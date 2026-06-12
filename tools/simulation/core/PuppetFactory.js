import { AIPuppetStrategy } from "../../../public/js/game/ai/AIPuppetStrategy.js";
import { TraderAI } from "../../../public/js/game/model/TraderAI.js";

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
        const script = "";
        const strategy = new AIPuppetStrategy({ script });
        return new TraderAI(gameContext, index, name, city, strategy);
    }
}
