export class Action {
    static type = {
        BUY: "buy",
        SELL: "sell",
        HEADED_TOWARDS: "headed towards",
    };
    result;

    constructor({ type, result }) {
        this.type = type;
        this.result = result;
    }
}
