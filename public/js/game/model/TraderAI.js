// do usunięcia:
// city

class TraderAI extends Trader {
    name;
    lastTurnInfo;
    strategy;

    constructor(world, index, name, city, strategy) {
        super(world);
        this.strategy = strategy;
        this.id = index;
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
        TraderAIView.refreshInfo();
    }

    refreshPosition() {
        const tile = WorldView.getHexElementByCoords(this.city.position.x, this.city.position.y);
        const cx = parseFloat(tile.dataset.cx);
        const cy = parseFloat(tile.dataset.cy);
        const aiId = this.id;
        const offsets = [
            { x:  10, y: -10 },
            { x:  10, y:  10 },
            { x: -10, y:  10 },
        ];
        const offset = offsets[aiId] || { x: 0, y: 0 };
        let aiPlayer = document.getElementById(`ai-player-${aiId}`);

        if (!aiPlayer) {
            aiPlayer = document.getElementById("ai-player-template").cloneNode(true);
            aiPlayer.setAttribute("id", `ai-player-${aiId}`);
            aiPlayer.querySelector("text").textContent = aiId;
            document.getElementById("ai-layer").appendChild(aiPlayer);
        }

        aiPlayer.setAttribute("transform", `translate(${cx + offset.x}, ${cy + offset.y})`);
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
