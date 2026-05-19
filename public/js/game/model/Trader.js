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
        this.position = { ...world.cities[0].position };
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

    setDestination(position) {
        if (
            !position ||
            typeof position.x !== "number" ||
            typeof position.y !== "number"
        ) {
            throw new Error("setDestination expects {x, y}");
        }

        this.destination = { ...position };
    }

    turn(world) {
        const steps = HexMath.getBestSteps(
            this.position,
            this.destination,
            world.xSize,
            world.ySize,
        );
        const next = steps[Math.floor(Math.random() * steps.length)];
        this.position.x = next.x;
        this.position.y = next.y;
        // this.city = null;

        if (this.isInCity()) {
            this.destination = null;
            this.city = world.getCityByPositionXY(
                this.position.x,
                this.position.y,
            );
        }
    }

    isInCity() {
        if (
            this.position &&
            this.destination &&
            this.position.x == this.destination.x &&
            this.position.y == this.destination.y
        ) {
            return true;
        }
        return false;
    }

    isDestinationEmpty() {
        return (
            this.destination &&
            typeof this.destination === "object" &&
            !Array.isArray(this.destination) &&
            Object.keys(this.destination).length === 0
        );
    }
}
