class TraderAI extends Trader {
    name;
    lastTurnInfo;
    strategy;

    constructor(world, index, name, city, strategy) {
        super(world);
        this.strategy = strategy;
        this.id = index;
        this.name = name;
        this.city = city;
        this.position = { ...this.city.position };
        const gold = this.gold;
        this.buySetDestinationAndSaveInfo(world);
        this.lastTurnInfo = {
            goodName: "-",
            lastCity: city,
            wealth: gold,
        };
    }

    refreshView() {
        TraderAIView.refreshPosition();
        TraderAIView.refreshInfo();
    }

    turn(world) {
        if (!this.isInDestination()) {
            this.moveOneStepToDestination(world);
        }
        this.lastTurnInfo.goodName = "-";
        if (this.findOwnedGood() !== undefined) {
            this.lastTurnInfo.goodName = this.findOwnedGood().name;
        }

        if (this.isInDestination()) {
            this.destinationReached(world);
            this.sellAll(world);
            this.buySetDestinationAndSaveInfo(world);
        }
    }

    buySetDestinationAndSaveInfo(world) {
        const lastCity = this.city;
        const decision = this.strategy.decide(world, this);
        const gold = this.gold;
        let goodName = "-";
        if (decision.goodId !== null) {
            this.buy(world, decision.goodId);
            goodName = this.goods[decision.goodId].name;
        }
        this.setDestination({ ...decision.city.position });
        this.lastTurnInfo = {
            goodName: goodName,
            lastCity: lastCity,
            wealth: gold,
        };
    }

    findOwnedGood() {
        return this.goods.find((good) => good.quantity > 0);
    }
}
