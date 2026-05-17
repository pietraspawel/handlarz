class World
{
    static MAX_NON_HIDDEN_AI = 3;

    constructor (data) {
        this.map = data.world.map;
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

    refreshAll(player, aiPlayersArray) {
        this.refreshView(player);
        player.refreshView();
        for (let i = 0; i < World.MAX_NON_HIDDEN_AI && i < aiPlayersArray.length; i++) {
            aiPlayersArray[i].refreshPosition();
        }
        aiPlayersArray.forEach(ai => ai.refreshInfo());
    }

    refreshPlayer(player) {
        this.refreshView(player);
        player.refreshView();
    }

    refreshView(player) {
        this.refreshMapRecordView();
        this.refreshTurnsLeftView();
        CityView.refreshCityCursors(this.cities, player);
        CityView.refreshCityPrices(this.cities);
    }

    refreshMapRecordView() {
        let string = Library.separateThousands(this.highscore) + " $";
        $(".player-info .map-record").text(string);
    }

    refreshTurnsLeftView() {
        $(".player-info .turns-left").text(this.turnsLeft);
    }

    getCity(id) {
        return this.cities[id];
    }

    getRandomCity() {
        const index = Math.floor(Math.random() * this.cities.length);
        return this.cities[index];
    }
    
    nextTurn(player, aiPlayersArray) {
        for (const aiPlayer of aiPlayersArray) {
            aiPlayer.turn(this);
        }

        this.turnsLeft--;
        this.refreshAll(player, aiPlayersArray);

        if (this.turnsLeft <= 0) {
            this.gameOver(player, aiPlayersArray);
        }
    }

    async gameOver(player, aiPlayersArray) {
        player.sellAll();
        aiPlayersArray.forEach(ai => ai.sellAll());

        await fetch("/game-over/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                map: this.map,
                score: player.gold,
                highscore: this.highscore,
                aiPlayers: aiPlayersArray
            })
        });

        location.replace("/game-over");
    }
}