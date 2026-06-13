import { TraderAI } from "../../../public/js/game/model/TraderAI.js";

export class Puppet extends TraderAI {
	genome;

	constructor({ gameContext, index, name, city, strategy, genome }) {
		super(gameContext, index, name, city, strategy);
		this.genome = genome;
	}
}
