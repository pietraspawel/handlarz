import { AIPuppetStrategy } from "../../../../public/js/game/ai/AIPuppetStrategy.js";
import { GeneService } from "../../core/GeneService.js";
import { Puppet } from "../../model/Puppet.js";

export class PuppetFactory {
    static create({ gameContext }) {
        const puppetCollection = [];
        const loops = [...PuppetFactory.generateLoops(gameContext.world.cities)];

        for (const loop of loops) {
            const goodChoices = PuppetFactory.generateGoodChoices(gameContext, loop);
            for (const goods of goodChoices) {
                for (let i = 0; i < goods.length; i++) {
                    let good = goods[i];
                    let city = loop[i];
                }
            }

            // const puppet = this.createPuppet({ gameContext, index: i, loop: loops[i] });
            // puppetCollection.push(puppet);
        }

        return puppetCollection;
    }

    static createPuppet({ gameContext, index, loop }) {
        const name = `Puppet-${index}`;
        const city = loop[0];
        // const gene1 =
        // const genesAmount = Math.floor(gameContext.turnsLeft / 3) + 1;
        // const genome = GeneService.createRandomGenes(genesAmount, gameContext.world.cities, gameContext.world.goods);
        // const script = GeneService.translateGenomeToCommands(city, genome);
        // const strategy = new AIPuppetStrategy({ script });
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

    static generateGoodChoices(gameContext, loop) {
        const cityAmount = loop.length;
        const goodsChoices = Array.from({ length: cityAmount }, () => gameContext.world.goods);
        const combinations = PuppetFactory.cartesian(goodsChoices);
        return combinations;
    }

    static cartesian(arrays) {
        return arrays.reduce((acc, curr) => acc.flatMap((a) => curr.map((b) => [...a, b])), [[]]);
    }
}
