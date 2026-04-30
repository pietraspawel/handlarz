class TraderAI extends Trader {
    strategy;

    constructor(world, strategy) {
        super(world);
        this.strategy = strategy;
    }

    turn(world, trader) {
        this.sellAll();
        let decision = this.strategy.decide(world, trader);
        this.buy(decision.goodId);
        this.goTo(decision.city);

        console.log(this);
    }
}
