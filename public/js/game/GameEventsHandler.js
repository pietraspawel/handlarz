class GameEventsHandler {
	aiTraders;
	trader;
	world;
	tooltipsView;

	constructor(aiTraders, trader, world, tooltipsView) {
		this.aiTraders = aiTraders;
		this.trader = trader;
		this.world = world;
		this.tooltipsView = tooltipsView;
		this.bind();
	}

	bind() {
		$("#cities").on("click", ".city-group", (e) => {
			let target = $(e.currentTarget);
			let id = target.data("id");
			let clickedCity = this.world.getCity(id);
			if (this.world.gameMode === World.GAME_MODE.MANUAL) {
				if (this.trader.isInCity()) {
					this.trader.setDestination({ ...clickedCity.position });
				}
				TurnSystem.nextTurn(this.world, this.trader, this.aiTraders);
			}
		});

		$(".city-info .buy").on("click", "button", (e) => {
			let target = $(e.target);
			let id = target.data("id");
			this.trader.buy(this.world, id);
			GameView.refreshElementsAfterTrade(this.trader);
		});

		$(".city-info .sell").on("click", "button", (e) => {
			let target = $(e.target);
			let id = target.data("id");
			this.trader.sell(this.world, id);
			GameView.refreshElementsAfterTrade(this.trader);
		});

		$(".menu-container").on("change", "#checkShowTooltips", () => {
			this.tooltipsView.handleTooltips();
		});
	}
}
