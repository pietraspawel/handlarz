// Przechowuje logi jednej tury.
class TurnLog {
    number;
    tradersLogs;

    constructor({ turnNumber, trader, aiTraders }) {
        this.number = turnNumber;
        this.tradersLogs = [];
        this.addTraderLogs({ trader });
        for (const aiTrader of aiTraders) {
            this.addTraderLogs({ trader: aiTrader });
        }
    }

    addTraderLogs({ trader }) {
        const traderLogs = new TraderLogs({ trader });
        this.tradersLogs.push(traderLogs);
    }

    addSnapshot({ trader }) {
        const traderLogs = this.findTradersLogsByTrader(trader);
        traderLogs.addSnapshot({ trader });
    }

    addAction({ trader, type, result }) {
        const traderLogs = this.findTradersLogsByTrader(trader);
        traderLogs.addAction({ type, result });
    }

    findTradersLogsByTrader(trader) {
        return this.tradersLogs.find((element) => element.trader === trader);
    }

    clean() {
        for (const traderLogs of this.tradersLogs) {
            traderLogs.clean();
        }
    }
}
