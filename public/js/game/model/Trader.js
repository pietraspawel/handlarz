// position - obecna pozycja {x:,y:}
// destination - pozycja celu {x:,y:}
class Trader {
    city;
    gold;
    goods = [];
    position;
    destination;

    constructor(gameContext) {
        const world = gameContext.world;
        this.city = world.cities[0];
        this.gold = gameContext.startGold;
        this.goods = [];
        for (let goodKey in world.goods) {
            let good = world.goods[goodKey];
            this.goods.push(Good.createForTrader(good));
        }
        this.position = { ...world.cities[0].position };
        this.destination = undefined;
    }

    buy(gameContext, goodId) {
        if (this.isTravelling()) {
            return false;
        }
        let city = this.getCurrentCity(gameContext.world);
        let price = city.goods[goodId].price;
        let amount = Math.floor(this.gold / price);
        this.gold -= price * amount;
        this.goods[goodId].quantity += amount;
        gameContext.gameLog.addAction({
            trader: this,
            type: Action.type.BUY,
            result: {
                name: this.goods[goodId].name,
                amount: amount,
            },
        });
    }

    sell(gameContext, world, goodId) {
        if (this.isTravelling()) {
            return false;
        }
        let city = this.getCurrentCity(world);
        let price = city.goods[goodId].price;
        let amount = this.goods[goodId].quantity;
        this.gold += price * amount;
        this.goods[goodId].quantity = 0;
        gameContext.gameLog.addAction({
            trader: this,
            type: Action.type.SELL,
            result: {
                name: this.goods[goodId].name,
                amount: amount,
            },
        });
    }

    sellAll(world) {
        if (this.isTravelling()) {
            return false;
        }
        let city = this.getCurrentCity(world);
        for (let goodId in city.goods) {
            let price = city.goods[goodId].price;
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

    turn(gameContext) {
        if (this.destination) {
            this.moveOneStepToDestination(gameContext);
        }

        if (this.isInDestination()) {
            this.destinationReached(gameContext.world);
        }
    }

    moveOneStepToDestination(gameContext) {
        const world = gameContext.world;
        const steps = HexMath.getBestSteps(
            this.position,
            this.destination,
            world.xSize,
            world.ySize,
        );
        const next = steps[Math.floor(Math.random() * steps.length)];
        this.position.x = next.x;
        this.position.y = next.y;
        this.city = null;
        const destinationCity = world.getCityByPositionXY(
            this.destination.x,
            this.destination.y,
        );
        gameContext.gameLog.addAction({
            trader: this,
            type: Action.type.HEADED_TOWARDS,
            result: {
                name: destinationCity.name,
            },
        });
    }

    destinationReached(world) {
        this.destination = null;
        this.city = world.getCityByPositionXY(this.position.x, this.position.y);
    }

    isInDestination() {
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

    isDestinationSelected() {
        if (this.destination == null) {
            return false;
        }
        if (
            typeof this.destination === "object" &&
            !Array.isArray(this.destination) &&
            Object.keys(this.destination).length === 0
        ) {
            return false;
        }

        return true;
    }

    getCurrentCity(world) {
        return world.getCityByPositionXY(this.position.x, this.position.y);
    }

    isInCity() {
        return this.destination == null;
    }

    isInThatCity(city) {
        return (
            this.isInCity() &&
            HexMath.positionsEqual(this.position, city.position)
        );
    }

    isTravelling() {
        return this.destination != null;
    }

    getCityName() {
        if (this.city) {
            return this.city.name;
        }
        return "w trasie";
    }
}
