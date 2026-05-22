class GameLog {
    mapName;
    turns;

    constructor(mapName) {
        this.mapName = mapName;
        this.turns = [];
    }

    startTurn() {
        const turnAmount = this.turns.length;
        const turn = new TurnLog(turnAmount + 1);
        this.turns.push(turn);
        return turn;
    }
}
