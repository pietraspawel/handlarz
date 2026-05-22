// Przechowuje logi wszystkich tur.
class GameLog {
    mapName;
    turnsLogs;

    constructor(mapName) {
        this.mapName = mapName;
        this.turnsLogs = [];
    }

    startTurn({ trader, aiTraders }) {
        let turnNumber = this.turnsLogs.length;
        turnNumber++;
        const turnLog = new TurnLog({ turnNumber, trader, aiTraders });
        this.turnsLogs.push(turnLog);
        this.addSnapshots({ trader, aiTraders });
    }

    addSnapshots({ trader, aiTraders }) {
        this.addSnapshot({ trader });
        for (const aiTrader of aiTraders) {
            this.addSnapshot({ trader: aiTrader });
        }
    }

    addSnapshot({ trader }) {
        const currentTurnLog = this.turnsLogs[this.turnsLogs.length - 1];
        currentTurnLog.addSnapshot({ trader });
    }
}
