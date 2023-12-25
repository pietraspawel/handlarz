class Good
{
    price;
    quantity;
    constructor(name) {
        this.name = name;
    }

    static createForCity(data) {
        let good = new Good(data.name);
        good.price = data.price;
        return good;
    }

    static createForTrader(data) {
        let good = new Good(data.name);
        good.quantity = 0;
        return good;
    }
}