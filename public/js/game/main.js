$().ready(() => {
    const GAME_MODE = { MANUAL: "manual", AUTO_TRAVEL: "autoTurns" };

    const gameMode = GAME_MODE.AUTO_TRAVEL;
    let data = JSON.parse(atob($(".js-data").data("json")));

    console.log(data);

    let world = new World(data);
    const gameContext = new GameContext({ gameMode, data, world });
    let trader = new Trader(gameContext);
    let aiTraderStrategy = new GreedyStrategy();

    const aiTraders = AIFactory.create(gameContext, data);

    gameContext.gameLog.startTurn({ trader, aiTraders });

    for (const aiTrader of aiTraders) {
        aiTrader.initTurnZero(gameContext);
    }

    let tooltipsView = new TooltipsView();
    let gameEventsHandler = new GameEventsHandler(
        aiTraders,
        trader,
        gameContext,
        tooltipsView,
    );

    GameView.refreshAll(gameContext, trader, aiTraders);
});
