class TurnLog {
    number;
    traderLog;

    constructor(number) {
        this.number = number;
        this.traderLog = [];
    }

    addTraderLog(traderLog) {
        this.traderLog.push(traderLog);
    }
}
