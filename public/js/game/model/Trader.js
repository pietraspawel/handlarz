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
        this.refreshSellButtons();
    }

    refreshWealth() {
        let goldString = Library.separateThousands(this.gold) + " $";
        $(".player-info .wealth").text(goldString);
    }

    refreshPosition() {
        const tile = World.getHexElementByCoords(this.city.position.x, this.city.position.y);
        const cx = tile.dataset.cx;
        const cy = tile.dataset.cy;

        let player = document.getElementById("player");
        if (!player) {
            player = document.getElementById("player-template").cloneNode(true);
            player.setAttribute("id", "player");
            document.getElementById("player-layer").appendChild(player);
        }

        player.setAttribute("transform", `translate(${cx-10}, ${cy-10})`);
        $(".city-info .player-position").text(`Jesteś w: ${this.city.name}`);
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
            let element = `<td><button class="btn btn-info" data-id="${i}">${string}</button></td>`;
            container.append(element);
        }
    }

    refreshSellButtons() {
        let container = $(".city-info .sell");
        container.find("td").remove();
        for (let i in this.goods) {
            let string = Library.separateThousands(this.goods[i].quantity);
            let element = `<td><button class="btn btn-info" data-id="${i}">${string}</button></td>`;
            container.append(element);
        }
    }

    getPosition() {
        return this.city.position;
    }

    buy(goodId) {
        let price = this.city.goods[goodId].price;
        let amount = Math.floor(this.gold / price);
        this.gold -= price * amount;
        this.goods[goodId].quantity += amount;
    }

    sell(goodId) {
        let price = this.city.goods[goodId].price;
        let amount = this.goods[goodId].quantity;
        this.gold += price * amount;
        this.goods[goodId].quantity = 0;
    }

    sellAll() {
        for (let goodId in this.city.goods){
            let price = this.city.goods[goodId].price;
            let amount = this.goods[goodId].quantity;
            this.gold += price * amount;
            this.goods[goodId].quantity = 0;
        }
    }

    goTo(city) {
        this.city = city;
        this.position = city.position;
    }    
}