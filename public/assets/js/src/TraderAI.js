class TraderAI extends Trader {
    name;
    lastTurnInfo;
    strategy;

    constructor(world, name, city, strategy) {
        super(world);
        this.strategy = strategy;
        this.name = name;
        this.city = city;
        this.lastTurnInfo = {
            'transaction': '-',
            'lastCity': null,
            'wealth': this.gold
        };
    }

    refreshView() {
        this.refreshPosition();
        this.refreshInfo();
    }

    refreshPosition() {
        $(".map .tile .aiPlayer1-position").remove();
        let tile = World.getTileElementByCoords(this.city.position.x, this.city.position.y);
        tile.prepend("<div class='aiPlayer1-position'> 1 </div>");
    }

    refreshInfo() {
        let transitText = this.city.name;
        if (this.lastTurnInfo.lastCity !== null) {
            transitText = `${this.lastTurnInfo.lastCity.name} -> ${this.city.name}`;
        }

        let wealth = Library.separateThousands(this.lastTurnInfo.wealth) + " $";

        $(".ai-player-info .ai-name").text(this.name);
        $(".ai-player-info .ai-transaction").text(this.lastTurnInfo.transaction);
        $(".ai-player-info .ai-transit").text(transitText);
        $(".ai-player-info .ai-wealth").text(wealth);
    }

    turn(world) {
        let lastCity = this.city;

        let decision = this.strategy.decide(world, this);
        this.buy(decision.goodId);
        this.goTo(decision.city);
        this.sellAll();

        this.lastTurnInfo = {
            'transaction': this.goods[decision.goodId].name,
            'lastCity': lastCity,
            'wealth': this.gold
        };
    }
}
