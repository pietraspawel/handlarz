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
}