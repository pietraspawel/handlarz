import { AIPuppetStrategy } from "../../../../public/js/game/ai/AIPuppetStrategy.js";
import { GeneService } from "../../core/GeneService.js";
import { Puppet } from "../../model/Puppet.js";

export class PuppetFactory {
    static create({ gameContext }) {
        const puppetCollection = [];
        const loops = [...PuppetFactory.generateLoops(gameContext.world.cities)];

        console.log(loops);
        console.log(loops.length);

        for (let i = 0; i < loops.length; i++) {
            const steps = loops[i].length;
            const goodsChoices = Array.from({ length: steps }, () => gameContext.world.goods);
            const combinations = PuppetFactory.cartesian(goodsChoices);

            // console.log(loops[0], combinations[0]);

            // for (let j=0; j < combinations.length; j++) {
            //     let city = loops[i].name;
            //     let good = combinations[j].name;
            //     // let action = combo.map((good, j) => `${loops[i][j].name}${good.name}`);

            //     // console.log(city, good);
            // }

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

    static cartesian(arrays) {
        return arrays.reduce((acc, curr) => acc.flatMap((a) => curr.map((b) => [...a, b])), [[]]);
    }
}
