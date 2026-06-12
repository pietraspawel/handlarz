import { GameContext } from "./GameContext.js";
import { HexMath } from "./HexMath.js";
import { TurnSystem } from "./TurnSystem.js";
import { GameView } from "./view/GameView.js";

export class GameEventsHandler {
    gameContext;
    gameLog;
    aiTraders;
    trader;
    world;
    tooltipsView;

    constructor(aiTraders, trader, gameContext, tooltipsView) {
        this.gameContext = gameContext;
        this.gameLog = this.gameContext.gameLog;
        this.aiTraders = aiTraders;
        this.trader = trader;
        this.world = gameContext.world;
        this.tooltipsView = tooltipsView;
        this.bind();
    }

    bind() {
        $(".map-container").on("click", "#map", (e) => {
            if (this.gameContext.gameMode === GameContext.GAME_MODE.MANUAL) {
                if (
                    this.trader.isTravelling() &&
                    this.gameContext.turnsLeft > 0
                ) {
                    TurnSystem.nextTurn(
                        this.gameContext,
                        this.trader,
                        this.aiTraders,
                    );
                }
            }
            if (
                this.gameContext.gameMode === GameContext.GAME_MODE.AUTO_TURNS
            ) {
                if (this.trader.isTravelling()) {
                    TurnSystem.fastForwardAutoTurns(
                        this.gameContext,
                        this.trader,
                        this.aiTraders,
                    );
                    return;
                }
            }
        });

        $("#cities").on("click", ".city-group", (e) => {
            // Kliknięte miasto.
            e.stopPropagation();
            let target = $(e.currentTarget);
            let id = target.data("id");
            let clickedCity = this.world.getCity(id);
            // Jeśli jest w mieście i kliknięte inne miasto, wtedy tam się ustawia cel.
            if (
                this.trader.isInCity() &&
                !HexMath.positionsEqual(
                    this.trader.position,
                    clickedCity.position,
                )
            ) {
                this.trader.setDestination({ ...clickedCity.position });
            }
            // Dla manual mode.
            // Zrób następną kolejkę.
            if (
                this.gameContext.gameMode === GameContext.GAME_MODE.MANUAL &&
                this.gameContext.turnsLeft > 0
            ) {
                TurnSystem.nextTurn(
                    this.gameContext,
                    this.trader,
                    this.aiTraders,
                );
            }
            // Dla auto mode.
            if (
                this.gameContext.gameMode === GameContext.GAME_MODE.AUTO_TURNS
            ) {
                this.handleCityClickForAutoMode(clickedCity);
            }
        });

        $(".city-info .buy").on("click", "button", (e) => {
            let target = $(e.target);
            let id = target.data("id");
            this.trader.buy(this.gameContext, id);
            GameView.refreshElementsAfterTrade(this.trader);
        });

        $(".city-info .sell").on("click", "button", (e) => {
            let target = $(e.target);
            let id = target.data("id");
            this.trader.sell(this.gameContext, id);
            GameView.refreshElementsAfterTrade(this.trader);
        });

        $(".menu-container").on("change", "#checkShowTooltips", () => {
            this.tooltipsView.handleTooltips();
        });
    }

    // Dla kliknięcia w miasto. Wykonuje tylko jeden if.
    // Jeśli klika w miasto, w którym jest, to następna kolejka.
    // Jeśli jest w trybie auto, to przewiń kolejki do końca.
    // Lub po prostu włącz tryb auto.
    handleCityClickForAutoMode(clickedCity) {
        if (
            this.trader.isInThatCity(clickedCity) &&
            this.gameContext.turnsLeft > 0
        ) {
            TurnSystem.nextTurn(this.gameContext, this.trader, this.aiTraders);
            return;
        }
        if (TurnSystem.autoTurnTimeout) {
            TurnSystem.fastForwardAutoTurns(
                this.gameContext,
                this.trader,
                this.aiTraders,
            );
            return;
        }
        TurnSystem.autoTurns(this.gameContext, this.trader, this.aiTraders);
    }
}
