import { AIPuppetStrategy } from "../../../../public/js/game/ai/AIPuppetStrategy.js";
import { GeneService } from "../../core/GeneService.js";
import { Puppet } from "../../model/Puppet.js";

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
        // odległość między miastami to min. 3, więc liczba poleceń dla całej gry to max. turnsLeft / 3
        // +1 dla na wszelki wypadek
        const genesAmount = Math.floor(gameContext.turnsLeft / 3) + 1;
        const genome = GeneService.createRandomGenes(
            genesAmount,
            gameContext.world.cities,
            gameContext.world.goods,
        );
        const script = GeneService.translateGenomeToCommands(city, genome);
        const strategy = new AIPuppetStrategy({ script });
        return new Puppet({ gameContext, index, name, city, strategy, genome });
    }
}
