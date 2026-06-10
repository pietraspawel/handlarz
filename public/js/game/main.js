$().ready(() => {
    const GAME_MODE = { MANUAL: "manual", AUTO_TRAVEL: "autoTurns" };

    const gameMode = GAME_MODE.MANUAL;
    let data = JSON.parse(atob($(".js-data").data("json")));
    let world = new World(data);
    let trader = new Trader(world);
    let aiTraderStrategy = new GreedyStrategy();

    console.log(data);

    const aiTraders = AIFactory.create(world, data);

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
