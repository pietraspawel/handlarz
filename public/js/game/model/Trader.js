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
        TraderView.refreshCargo(this);
        TraderView.refreshBuyButtons(this);
        TraderView.refreshSellButtons(this);
    }

    refreshWealth() {
        let goldString = Library.separateThousands(this.gold) + " $";
        $(".player-info .wealth").text(goldString);
    }

    refreshPosition() {
        const tile = WorldView.getHexElementByCoords(this.city.position.x, this.city.position.y);
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