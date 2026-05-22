class Snapshot {
    name;

    constructor({trader}) {
        this.name = 'Player';
        if (trader instanceof TraderAI) {
            this.name = trader.name;
        }
    }
}
