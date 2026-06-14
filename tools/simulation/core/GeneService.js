import { Gene } from "../model/Gene.js";

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
}
