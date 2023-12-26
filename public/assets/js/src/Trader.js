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
    }

    refreshWealth() {
        let goldString = Library.separateThousands(this.gold) + " $";
        $(".player-info .wealth").text(goldString);
        console.log("refreshWealth", goldString);
    }
}