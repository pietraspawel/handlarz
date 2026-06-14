import { AIPuppetStrategy } from "../../../public/js/game/ai/AIPuppetStrategy.js";
import { Gene } from "../model/Gene.js";
import { Puppet } from "../model/Puppet.js";

export class GeneService {
    static createRandomGenes(amount, cities, goods) {
        const genome = [];
        for (let i = 0; i < amount; i++) {
            const city = GeneService.getRandomCity(cities);
            const good = GeneService.getRandomGood(goods);
            const gene = new Gene({ city, good });
            genome.push(gene);
        }
        return genome;
    }

    static getRandomCity(cities) {
        const index = Math.floor(Math.random() * cities.length);
        return cities[index];
    }

    static getRandomGood(goods) {
        const index = Math.floor(Math.random() * goods.length);
        return goods[index];
    }

    static translateGenomeToCommands(startCity, genome) {
        return {
            start: startCity,
            infiniteLoop: genome.map((gene) => ({
                good: gene.good.name,
                city: gene.city.name,
            })),
        };
    }

    static selection(population, survivorsPercentage) {
        if (population.length === 0) {
            return [];
        }

        // ile ma przeżyć
        const survivorsAmount = Math.max(1, Math.floor((population.length * survivorsPercentage) / 100));

        // sort malejąco po goldzie
        const sortedPopulation = [...population].sort((a, b) => b.gold - a.gold);
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

        return survivors;
    }

    static multiplication({ gameContext, population, targetPopulationSize }) {
        if (population.length === 0) {
            return [];
        }

        const newPopulation = [];
        let index = 0;

        while (newPopulation.length < targetPopulationSize) {
            for (const parent of population) {
                if (newPopulation.length >= targetPopulationSize) {
                    break;
                }

                const genome = GeneService.cloneGenome(parent.genome);
                const city = parent.city;
                const script = GeneService.translateGenomeToCommands(city, genome);
                const strategy = new AIPuppetStrategy({ script });
                const puppet = new Puppet({
                    gameContext,
                    index,
                    name: `Puppet-${index}`,
                    city,
                    strategy,
                    genome,
                });

                newPopulation.push(puppet);
                index++;
            }
        }

        return newPopulation;
    }

    static cloneGenome(genome) {
        return genome.map(
            (gene) =>
                new Gene({
                    city: gene.city,
                    good: gene.good,
                }),
        );
    }

    static mutation({ gameContext, population, mutationChance }) {
        if (!population || population.length === 0) {
            return [];
        }

        const mutatedPopulation = [];

        for (const puppet of population) {
            const newGenome = GeneService.cloneGenome(puppet.genome);

            for (let i = 0; i < newGenome.length; i++) {
                if (Math.random() * 100 < mutationChance) {
                    const gene = newGenome[i];

                    // mutacja miasta
                    if (Math.random() < 0.5) {
                        gene.city = GeneService.getRandomCity(gameContext.world.cities);
                    }

                    // mutacja towaru
                    if (Math.random() < 0.5) {
                        gene.good = GeneService.getRandomGood(gameContext.world.goods);
                    }
                }
            }

            const script = GeneService.translateGenomeToCommands(puppet.city, newGenome);
            const strategy = new AIPuppetStrategy({ script });
            const mutatedPuppet = new Puppet({
                gameContext: gameContext,
                index: puppet.index,
                name: puppet.name,
                city: puppet.city,
                strategy,
                genome: newGenome,
            });

            mutatedPopulation.push(mutatedPuppet);
        }

        return mutatedPopulation;
    }
}
