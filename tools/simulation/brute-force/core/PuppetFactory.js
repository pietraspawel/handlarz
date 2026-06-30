import { AIPuppetStrategy } from "../../../../public/js/game/ai/AIPuppetStrategy.js";
import { GeneService } from "../../core/GeneService.js";
import { Gene } from "../../model/Gene.js";
import { Puppet } from "../../model/Puppet.js";

export class PuppetFactory {
    static create({ gameContext }) {
        const puppetCollection = [];
        const loops = [...PuppetFactory.generateLoops(gameContext.world.cities)];

        for (let i = 0; i < loops.length; i++) {
            let loop = loops[i];
            const goodChoices = PuppetFactory.generateGoodChoices(gameContext, loop);
            for (const goods of goodChoices) {
                let genome = [];
                for (let j = 0; j < goods.length; j++) {
                    let good = goods[j];
                    let city = loop[j];
                    const gene = new Gene({ city, good });
                    genome.push(gene);
                }
                const puppet = this.createPuppet({ gameContext, index: i, genome });
                puppetCollection.push(puppet);
            }
        }

        return puppetCollection;
    }

    static createPuppet({ gameContext, index, genome }) {
        const name = `Puppet-${index}`;
        const city = genome[genome.length - 1].city;
        const script = GeneService.translateGenomeToCommands(city, genome);
        const strategy = new AIPuppetStrategy({ script });
        return new Puppet({ gameContext, index, name, city, strategy, genome });
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
