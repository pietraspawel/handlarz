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
        this.refreshPosition();
        this.refreshCargo();
        this.refreshBuyButtons();
    }

    refreshWealth() {
        let goldString = Library.separateThousands(this.gold) + " $";
        $(".player-info .wealth").text(goldString);
    }

    refreshPosition() {
        $(".map .tile .player-position").remove();
        let tile = World.getTileElementByCoords(this.city.position.x, this.city.position.y);
        tile.prepend("<div class='player-position'> G </div>");
        let string = `Jesteś w: ${this.city.name}`;
        $(".city-info .player-position").text(string);
    }

    refreshCargo() {
        let container = $(".city-info .cargo-quantity");
        container.find("td").remove();
        for (let i in this.goods) {
            let string = Library.separateThousands(this.goods[i].quantity);
            let element = `<td>${string}</td>`;
            container.append(element);
        }
    }

    refreshBuyButtons() {
        let container = $(".city-info .buy");
        container.find("td").remove();
        for (let i in this.goods) {
            let string = Library.separateThousands(Math.floor(this.gold / this.city.goods[i].price));
            let element = `<td><button class="btn btn-info">${string}</button></td>`;
            container.append(element);
        }
    }

    getPosition() {
        return this.city.position;
    }
}