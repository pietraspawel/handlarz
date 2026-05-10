// do usunięcia:
// refreshCityCursors(player)
// getTileElementByCoords

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

    static getTileElementByCoords(x, y) {
        let tileSelector = `.map .tile[data-x='${x}'][data-y='${y}']`;
        return $(tileSelector);
    }

    static getHexElementByCoords(x, y) {
        return document.querySelector(
            `#terrain .hex[data-x="${x}"][data-y="${y}"]`
        );
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
        this.refreshCityCursors(player);
        this.refreshCityPrices();
    }

    refreshMapRecordView() {
        let string = Library.separateThousands(this.highscore) + " $";
        $(".player-info .map-record").text(string);
    }

    refreshTurnsLeftView() {
        $(".player-info .turns-left").text(this.turnsLeft);
    }

    refreshCityCursors(player) {
        for (let i in this.cities) {
            let tile = World.getTileElementByCoords(this.cities[i].position.x, this.cities[i].position.y);
            if (this.cities[i].position.x == player.getPosition().x && this.cities[i].position.y == player.getPosition().y) {
                tile.find("img").css("cursor", "default");
            } else {
                tile.find("img").css("cursor", "pointer");
            }
        }
    }

    refreshCityPrices() {
        let container = $(".city-info .prices");
        $(".city-info .city-prices").remove();

        for (let i = this.cities.length - 1; i >= 0; i--) {
            let element = `<tr class="city-prices">`;
            element += `<th>${this.cities[i].name}</th>`;
            for (let j in this.cities[i].goods) {
                let string = Library.separateThousands(this.cities[i].goods[j].price);
                element += `<td>${string} $</td>`;
            }
            element += `</tr>`;
            container.after(element);
        }
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