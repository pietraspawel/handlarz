class Snapshot {
    name;
    position;
    cityName;
    goods;
    gold;

    constructor({ trader }) {
        this.name = "Player";
        if (trader instanceof TraderAI) {
            this.name = trader.name;
        }
        this.position = { ...trader.position };
        this.cityName = trader.city?.name ?? "";
        this.goods = [];
        for (const good of trader.goods) {
            const obj = new Good(good.name);
            obj.quantity = good.quantity;
            this.goods.push(obj);
        }
        this.gold = trader.gold;
    }
}
