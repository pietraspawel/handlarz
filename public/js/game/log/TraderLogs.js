// Przechowuje logi jednego Tradera.
class TraderLogs {
	trader;
	log;

	constructor({ trader }) {
		this.trader = trader;
		this.log = [];
	}

	addSnapshot({ trader }) {
		const log = new Snapshot({ trader });
		this.log.push(log);
	}

	clean() {
		delete this.trader;
	}
}
