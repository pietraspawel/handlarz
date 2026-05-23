// Przechowuje logi jednego Tradera.
class TraderLogs {
    trader;
    snapshot;
    actions;

    constructor({ trader }) {
        this.trader = trader;
        this.snapshot = null;
        this.actions = [];
    }

    addSnapshot({ trader }) {
        const snapshot = new Snapshot({ trader });
        this.snapshot = snapshot;
    }

    addAction({ type, result }) {
        const action = new Action({ type, result });
        this.actions.push(action);
    }

    clean() {
        delete this.trader;
    }
}
