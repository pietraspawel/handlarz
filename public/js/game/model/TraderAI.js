// do usunięcia:
// city

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
            lastCity: null,
            wealth: this.gold,
        };
        this.position = { ...this.city.position };
    }

    refreshView() {
        TraderAIView.refreshPosition();
        TraderAIView.refreshInfo();
    }

    turn(world) {
        if (this.isDestinationEmpty()) {
            console.log("empty");
            let decision = this.strategy.decide(world, this);
            this.setDestination({ ...decision.city.position });
            console.log(decision.city.position);
        }

        if (this.isInCity()) {
            let lastCity = this.city;
            let decision = this.strategy.decide(world, this);

            this.sellAll();
            this.buy(decision.goodId);
            this.setDestination({ ...decision.city.position });

            this.lastTurnInfo = {
                transaction: this.goods[decision.goodId].name,
                lastCity: lastCity,
                wealth: this.gold,
            };
        } else {
        }

        console.log(this.destination);
    }
}
