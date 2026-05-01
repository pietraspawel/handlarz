class TraderAI extends Trader {
    name;
    lastTurnInfo;
    strategy;

    constructor(world, index, name, strategy) {
        super(world);
        this.strategy = strategy;
        this.id = index;
        this.name = name;
        this.city = world.cities[index];
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
        const aiPlayerIdString = `aiPlayer${this.id}`;
        $(`.map .tile .${aiPlayerIdString}-position`).remove();
        let tile = World.getTileElementByCoords(this.city.position.x, this.city.position.y);
        tile.prepend(`<div class='${aiPlayerIdString}-position'> ${this.id} </div>`);
    }

    refreshInfo() {
        let transitText = this.city.name;
        if (this.lastTurnInfo.lastCity !== null) {
            transitText = `${this.lastTurnInfo.lastCity.name} -> ${this.city.name}`;
        }
        let wealth = Library.separateThousands(this.lastTurnInfo.wealth) + " $";
        const tbody = document.querySelector(".ai-player-info tbody");
        let row = tbody.querySelector(`tr[data-id="${this.id}"]`);

        if (!row) {
            row = document.createElement("tr");
            row.dataset.id = this.id;
            row.classList.add(`aiPlayer${this.id}`);

            row.append(
                this._createCell("ai-name"),
                this._createCell("ai-transaction"),
                this._createCell("ai-transit"),
                this._createCell("ai-wealth")
            );
            tbody.appendChild(row);
        }

        row.querySelector(".ai-name").textContent = this.name;
        row.querySelector(".ai-transaction").textContent = this.lastTurnInfo.transaction;
        row.querySelector(".ai-transit").textContent = transitText;
        row.querySelector(".ai-wealth").textContent = wealth;
    }

    _createCell(className) {
        const td = document.createElement("td");
        td.className = className;
        return td;
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
