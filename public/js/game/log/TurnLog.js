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

    findTradersLogsByTrader(trader) {
        return this.tradersLogs.find((element) => element.trader === trader);
    }
}
