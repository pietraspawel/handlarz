import { TraderAI } from "../../../public/js/game/model/TraderAI.js";

export class Puppet extends TraderAI {
	genom;

	constructor({ gameContext, index, name, city, strategy, genom }) {
		super(gameContext, index, name, city, strategy);
		this.genom = genom;
	}
}
