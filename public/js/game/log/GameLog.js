class GameLog {
    mapName;
    turns;

    constructor(mapName) {
        this.mapName = mapName;
        this.turns = [];
    }

    startTurn(turnNumber) {
        const turn = new TurnLog(turnNumber);
        this.turns.push(turn);
        return turn;
    }
}
