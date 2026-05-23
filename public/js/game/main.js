$().ready(() => {
    const GAME_MODE = { MANUAL: "manual", AUTO_TRAVEL: "autoTurns" };

    const gameMode = GAME_MODE.MANUAL;
    let data = JSON.parse(atob($(".js-data").data("json")));
    let world = new World(data);
    let trader = new Trader(world);
    let aiTraderStrategy = new GreedyStrategy();
    const aiTraders = [
        new TraderAI(world, 0, "AITrader0", world.cities[0], aiTraderStrategy),
        new TraderAI(world, 1, "AITrader1", world.cities[1], aiTraderStrategy),
        new TraderAI(world, 2, "AITrader2", world.cities[2], aiTraderStrategy),
        new TraderAI(
            world,
            3,
            "AITrader3",
            world.getRandomCity(),
            aiTraderStrategy,
        ),
        new TraderAI(
            world,
            4,
            "AITrader4",
            world.getRandomCity(),
            aiTraderStrategy,
        ),
        new TraderAI(
            world,
            5,
            "AITrader5",
            world.getRandomCity(),
            aiTraderStrategy,
        ),
    ];

    const gameContext = new GameContext(gameMode, world);
    gameContext.gameLog.startTurn({ trader, aiTraders });

    for (const aiTrader of aiTraders) {
        aiTrader.initTurnZero(gameContext, world);
    }

    let tooltipsView = new TooltipsView();
    let gameEventsHandler = new GameEventsHandler(
        aiTraders,
        trader,
        gameContext,
        tooltipsView,
    );

    GameView.refreshAll(world, trader, aiTraders);
});
