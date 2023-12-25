class World
{
    constructor (data) {
        this.turnsLeft = data.world.turnsAmount;
        this.startGold = data.world.startGold;
        this.goods = [];
        for (let key in data.world.cities[0].goods) {
            let goodName = data.world.cities[0].goods[key].name;
            this.goods.push(new Good(goodName))
        }
        this.cities = [];
        for (let cityKey in data.world.cities) {
            let name = data.world.cities[cityKey].name;
            let position = data.world.cities[cityKey].position;
            let goods = [];
            for (let goodKey in data.world.cities[cityKey].goods) {
                goods.push(Good.createForCity(data.world.cities[cityKey].goods[goodKey]));
            }
            this.cities.push(new City(name, position, goods));
        }
    }
}