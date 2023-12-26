class World
{
    constructor (data) {
        this.highscore = parseInt(data.world.highscore);
        this.turnsLeft = data.world.turnsAmount;
        this.startGold = data.world.startGold;
        this.goods = [];
        for (let key in data.world.cities[0].goods) {
            let goodName = data.world.cities[0].goods[key].name;
            this.goods.push(new Good(goodName))
        }
        this.cities = [];
        for (let cityKey in data.world.cities) {
            let name = data.world.cities[cityKey].name;
            let position = data.world.cities[cityKey].position;
            let goods = [];
            for (let goodKey in data.world.cities[cityKey].goods) {
                goods.push(Good.createForCity(data.world.cities[cityKey].goods[goodKey]));
            }
            this.cities.push(new City(name, position, goods));
        }
    }

    static getTileElementByCoords(x, y) {
        let tileSelector = `.map .tile[data-x='${x}'][data-y='${y}']`;
        return $(tileSelector);
    }

    refreshView(player) {
        this.refreshMapRecordView();
        this.refreshTurnsLeftView();
        this.refreshCityCursors(player);
    }

    refreshMapRecordView() {
        let string = Library.separateThousands(this.highscore) + " $";
        $(".player-info .map-record").text(string);
    }

    refreshTurnsLeftView() {
        $(".player-info .turns-left").text(this.turnsLeft);
    }

    refreshCityCursors(player) {
        // for (let i in this.cities) {
        //     let cityElement = $(".map .tile[]")
        //     if (this.cities[i].x == player.position.x && this.cities[i].y == player.position.y) {

        //     } else {

        //     }
        // }
    }
}