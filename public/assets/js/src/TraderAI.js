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

    turn(world) {
        let currentCityName = this.city.name;

        let decision = this.strategy.decide(world, this);
        this.buy(decision.goodId);
        this.goTo(decision.city);
        this.sellAll();

        console.log('kupił:', this.goods[decision.goodId].name);
        console.log('trasa:', currentCityName, decision.city.name);
        console.log('złoto:', this.gold);
    }
}
