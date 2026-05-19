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
        this.lastTurnInfo = {
            transaction: "-",
            lastCity: city,
            wealth: this.gold,
        };
        this.position = { ...this.city.position };
        let decision = this.strategy.decide(world, this);
        this.buy(world, decision.goodId);
        this.setDestination({ ...decision.city.position });
    }

    refreshView() {
        TraderAIView.refreshPosition();
        TraderAIView.refreshInfo();
    }

    turn(world) {
        this.moveOneStepToDestination(world);

        if (this.isInDestination()) {
            this.destinationReached(world);

            let lastCity = this.city;
            let decision = this.strategy.decide(world, this);

            this.sellAll(world);
            console.log(this.gold);

            this.buy(world, decision.goodId);
            this.setDestination({ ...decision.city.position });

            this.lastTurnInfo = {
                transaction: this.goods[decision.goodId].name,
                lastCity: lastCity,
                wealth: this.gold,
            };
        }
    }
}
