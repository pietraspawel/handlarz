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
		$(".map-container").on("click", "#map", (e) => {
			if (this.world.gameMode === World.GAME_MODE.MANUAL) {
				if (this.trader.isTravelling()) {
					TurnSystem.nextTurn(
						this.world,
						this.trader,
						this.aiTraders,
					);
				}
			}
		});

		$("#cities").on("click", ".city-group", (e) => {
			let target = $(e.currentTarget);
			let id = target.data("id");
			let clickedCity = this.world.getCity(id);
			if (
				this.trader.isInCity() &&
				!World.positionsEqual(
					this.trader.position,
					clickedCity.position,
				)
			) {
				this.trader.setDestination({ ...clickedCity.position });
			}
			if (this.world.gameMode === World.GAME_MODE.MANUAL) {
				console.log('nextTurn', this.world.gameMode, World.GAME_MODE.MANUAL);
				TurnSystem.nextTurn(this.world, this.trader, this.aiTraders);
			}
			if (this.world.gameMode === World.GAME_MODE.AUTO_TURNS) {
				TurnSystem.autoTurns(this.world, this.trader, this.aiTraders);
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
