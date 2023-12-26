class Trader
{
    city;
    gold;
    goods = [];

    constructor(world) {
        this.city = world.cities[0];
        this.gold = world.startGold;
        this.goods = [];
        for (let goodKey in world.goods) {
            let good = world.goods[goodKey];
            this.goods.push(Good.createForTrader(good));
        }
    }

    refreshView() {
        this.refreshWealth();
        this.refreshPlayerPosition();
    }

    refreshWealth() {
        let goldString = Library.separateThousands(this.gold) + " $";
        $(".player-info .wealth").text(goldString);
    }

    refreshPlayerPosition() {
        $(".map .tile .player-position").remove();
        let tileSelector = `.map .tile[data-x='${this.city.position.x}'][data-y='${this.city.position.y}']`;
        $(tileSelector).prepend("<div class='player-position'> G </div>");
    }
}