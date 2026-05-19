// Dodać:
// wygaszanie UI jeśli osiągnięto koniec gry (disable all)

class GameEventsHandler {
	aiPlayers;
	player;
	world;
	tooltipsView;

	constructor(aiPlayers, player, world, tooltipsView) {
		this.aiPlayers = aiPlayers;
		this.player = player;
		this.world = world;
		this.tooltipsView = tooltipsView;
		this.bind();
	}

	bind() {
		$("#cities").on("click", ".city-group", (e) => {
			let target = $(e.currentTarget);
			let id = target.data("id");
			let city = this.world.getCity(id);
			if (city.name != this.player.city.name) {
				this.player.setDestination({ ...city.position });
				TurnSystem.nextTurn(this.world, this.player, this.aiPlayers);
			}
		});

		$(".city-info .buy").on("click", "button", (e) => {
			let target = $(e.target);
			let id = target.data("id");
			this.player.buy(this.world, id);
			GameView.refreshPlayer(this.world, this.player);
		});

		$(".city-info .sell").on("click", "button", (e) => {
			let target = $(e.target);
			let id = target.data("id");
			this.player.sell(this.world, id);
			GameView.refreshPlayer(this.world, this.player);
		});

		$(".menu-container").on("change", "#checkShowTooltips", () => {
			this.tooltipsView.handleTooltips();
		});
	}
}
