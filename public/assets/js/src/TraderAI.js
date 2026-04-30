class TraderAI extends Trader {
    strategy;

    constructor(world, strategy) {
        super(world);
        this.strategy = strategy;
    }

    refreshView() {
        this.refreshPosition();
    }

    refreshPosition() {
        $(".map .tile .aiPlayer1-position").remove();
        let tile = World.getTileElementByCoords(this.city.position.x, this.city.position.y);
        tile.prepend("<div class='aiPlayer1-position'> 1 </div>");
    }

    turn(world, trader) {
        this.sellAll();
        let decision = this.strategy.decide(world, trader);
        this.buy(decision.goodId);
        this.goTo(decision.city);

        console.log(this);
    }
}
