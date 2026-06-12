import { Gene } from "../model/Gene.js";

export class GeneService {
	static createRandomGenes(amount, cities, goods) {
		const genom = [];
		for (let i = 0; i < amount; i++) {
			const city = GeneService.getRandomCity(cities);
			const good = GeneService.getRandomGood(goods);
			const gene = new Gene({ city, good });
			genom.push(gene);
		}
		return genom;
	}

	static getRandomCity(cities) {
		const index = Math.floor(Math.random() * cities.length);
		return cities[index];
	}

	static getRandomGood(goods) {
		const index = Math.floor(Math.random() * goods.length);
		return goods[index];
	}
}
