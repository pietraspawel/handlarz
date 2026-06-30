import { AIPuppetStrategy } from "../../../../public/js/game/ai/AIPuppetStrategy.js";
import { GeneService } from "../../core/GeneService.js";
import { Puppet } from "../../model/Puppet.js";

export class PuppetFactory {
    static create({ gameContext }) {
        const puppetCollection = [];
        const loops = [...PuppetFactory.generateLoops(gameContext.world.cities)];

        console.dir(loops, { depth: 2 });

        return puppetCollection;
    }

    static createPuppet({ gameContext, index }) {
        // const name = `Puppet-${index}`;
        // const city = gameContext.world.getRandomCity();
        // // odległość między miastami to min. 3, więc liczba poleceń dla całej gry to max. turnsLeft / 3
        // // +1 dla na wszelki wypadek
        // const genesAmount = Math.floor(gameContext.turnsLeft / 3) + 1;
        // const genome = GeneService.createRandomGenes(genesAmount, gameContext.world.cities, gameContext.world.goods);
        // const script = GeneService.translateGenomeToCommands(city, genome);
        const strategy = new AIPuppetStrategy({ script });
        // return new Puppet({ gameContext, index, name, city, strategy, genome });
    }

    static *generateLoops(cities) {
        const route = [];
        const visited = new Array(cities.length).fill(false);

        for (let startIndex = 0; startIndex < cities.length; startIndex++) {
            visited[startIndex] = true;
            for (let length = 1; length < cities.length; length++) {
                yield* PuppetFactory.generateRoutes(cities, startIndex, route, visited, length);
            }

            visited[startIndex] = false;
        }
    }

    static *generateRoutes(cities, startIndex, route, visited, targetLength) {
        if (route.length === targetLength) {
            yield [cities[startIndex], ...route];
            return;
        }

        for (let i = 0; i < cities.length; i++) {
            if (visited[i]) {
                continue;
            }

            visited[i] = true;
            route.push(cities[i]);

            yield* PuppetFactory.generateRoutes(cities, startIndex, route, visited, targetLength);

            route.pop();
            visited[i] = false;
        }
    }
}
