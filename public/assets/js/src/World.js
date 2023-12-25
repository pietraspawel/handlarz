class World
{
    constructor (data) {
        this.turnsLeft = data.world.turnsAmount;
        this.goods = [];
        for (let key in data.world.cities[0].goods) {
            let goodName = data.world.cities[0].goods[key].name;
            this.goods.push(new Good(goodName))
        }
    }
}