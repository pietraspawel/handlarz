class TraderAI extends Trader {
    name;
    lastTurnInfo;
    strategy;

    constructor(gameContext, index, name, city, strategy) {
        super(gameContext);
        this.strategy = strategy;
        this.id = index;
        this.name = name;
        this.city = city;
        this.position = { ...this.city.position };
    }

    initTurnZero(gameContext, world) {
        const gold = this.gold;
        this.buySetDestinationAndSaveInfo(gameContext, world);
        this.lastTurnInfo = {
            goodName: "-",
            lastCity: this.city,
            wealth: gold,
        };
    }

    refreshView() {
        TraderAIView.refreshPosition();
        TraderAIView.refreshInfo();
    }

    turn(gameContext, world) {
        if (!this.isInDestination() && this.destination !== null) {
            this.moveOneStepToDestination(gameContext, world);
        }
        this.lastTurnInfo.goodName = "-";
        if (this.findOwnedGood() !== undefined) {
            this.lastTurnInfo.goodName = this.findOwnedGood().name;
        }

        if (this.isInDestination()) {
            this.destinationReached(world);
            this.sellAll(world);
            this.buySetDestinationAndSaveInfo(gameContext, world);
        }
    }

    buySetDestinationAndSaveInfo(gameContext, world) {
        const lastCity = this.city;
        const decision = this.strategy.decide(world, this);
        const gold = this.gold;
        let goodName = "-";

        if (this.city !== null && decision.city !== null) {
            const distance = HexMath.distanceByOffset(
                this.city.position.x,
                this.city.position.y,
                decision.city.position.x,
                decision.city.position.y,
            );
            if (distance > gameContext.turnsLeft - 1) {
                decision.goodId = null;
                decision.city = this.city;
            }
        }

        if (decision.goodId !== null) {
            this.buy(gameContext, world, decision.goodId);
            goodName = this.goods[decision.goodId].name;
        }
        if (decision.city !== null) {
            this.setDestination({ ...decision.city.position });
        }
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
