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
            'transaction': '-',
            'lastCity': null,
            'wealth': this.gold
        };
    }

    refreshView() {
        TraderAIView.refreshPosition();
        TraderAIView.refreshInfo();
    }

    turn(world) {
        let lastCity = this.city;

        let decision = this.strategy.decide(world, this);
        this.buy(decision.goodId);
        this.setDestination(decision.city);
        this.sellAll();

        this.lastTurnInfo = {
            'transaction': this.goods[decision.goodId].name,
            'lastCity': lastCity,
            'wealth': this.gold
        };
    }
}
