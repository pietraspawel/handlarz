import { GameContext } from "./GameContext.js";
import { GreedyStrategy } from "./ai/GreedyStrategy.js";
import { GameEventsHandler } from "./GameEventsHandler.js";
import { AIFactory } from "./model/AIFactory.js";
import { Trader } from "./model/Trader.js";
import { World } from "./model/World.js";
import { GameView } from "./view/GameView.js";
import { TooltipsView } from "./view/TooltipsView.js";

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

    console.log(aiTraders);

    let tooltipsView = new TooltipsView();
    let gameEventsHandler = new GameEventsHandler(
        aiTraders,
        trader,
        gameContext,
        tooltipsView,
    );

    GameView.refreshAll(gameContext, trader, aiTraders);
});
