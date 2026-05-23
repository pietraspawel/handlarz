class Action {
    static type = {
        BUY: "buy",
        SELL: "sell",
    };
    result;

    constructor({ type, result }) {
        this.type = type;
        this.result = result;
    }
}
