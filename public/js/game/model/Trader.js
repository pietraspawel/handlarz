// do usunięcia:
// city

// position - obecna pozycja {x:,y:}
// destination - pozycja celu {x:,y:}
class Trader {
    city;
    gold;
    goods = [];
    position;
    destination;

    constructor(world) {
        this.city = world.cities[0];
        this.gold = world.startGold;
        this.goods = [];
        for (let goodKey in world.goods) {
            let good = world.goods[goodKey];
            this.goods.push(Good.createForTrader(good));
        }
        this.position = world.cities[0].position;
        this.destination = undefined;
    }

    buy(goodId) {
        let price = this.city.goods[goodId].price;
        let amount = Math.floor(this.gold / price);
        this.gold -= price * amount;
        this.goods[goodId].quantity += amount;
    }

    sell(goodId) {
        let price = this.city.goods[goodId].price;
        let amount = this.goods[goodId].quantity;
        this.gold += price * amount;
        this.goods[goodId].quantity = 0;
    }

    sellAll() {
        for (let goodId in this.city.goods) {
            let price = this.city.goods[goodId].price;
            let amount = this.goods[goodId].quantity;
            this.gold += price * amount;
            this.goods[goodId].quantity = 0;
        }
    }

    setDestination(city) {
        this.destination = city.position;
    }
}
