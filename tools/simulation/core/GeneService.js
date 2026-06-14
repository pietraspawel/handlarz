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
}
