import { GameOverService } from "./GameOverService.js";
import { GameView } from "./view/GameView.js";

// Podczas swojej tury Gracz może:
// kupować/sprzedawać
// wyznaczyć cel - to kończy turę i rozgrywa się część automatyczna

// Część automatyczna:
// Wykonywanie są działania AI.
// Jeśli Gracz jest u celu to koniec części automatycznej.
// Jeśli nie, to Gracz przesuwa się o jedno pole do celu.

// Tura AI:
// Przesuń Gracza o jedno pole.
// Jeśli Gracz jest u celu to sprzedaj wszystko, kup towar, wyznacz nowy cel.

export class TurnSystem {
    static autoTurnTimeout = null;

    static nextTurn(gameContext, trader, aiTraders) {
        let gameLog = gameContext.gameLog;

        for (const aiTrader of aiTraders) {
            aiTrader.turn(gameContext);
        }
        trader.turn(gameContext);
        gameContext.turnsLeft--;
        GameView.refreshElementsAfterTurn(gameContext, trader, aiTraders);

        gameLog.startTurn({ trader, aiTraders });

        if (gameContext.turnsLeft <= 0) {
            GameOverService.gameOver(gameContext, trader, aiTraders);
        }
    }

    static autoTurns(gameContext, trader, aiTraders) {
        if (this.autoTurnTimeout) {
            return;
        }

        const loop = () => {
            if (trader.isInCity() || gameContext.turnsLeft <= 0) {
                TurnSystem.stopAutoTurns();
                return;
            }

            TurnSystem.nextTurn(gameContext, trader, aiTraders);
            this.autoTurnTimeout = setTimeout(loop, 200);
        };

        this.autoTurnTimeout = setTimeout(loop, 200);
    }

    static stopAutoTurns() {
        if (this.autoTurnTimeout) {
            clearTimeout(this.autoTurnTimeout);
            this.autoTurnTimeout = null;
        }
    }

    static fastForwardAutoTurns(gameContext, trader, aiTraders) {
        TurnSystem.stopAutoTurns();

        while (trader.isTravelling() && gameContext.turnsLeft > 0) {
            TurnSystem.nextTurn(gameContext, trader, aiTraders);
            if (gameContext.turnsLeft <= 0) {
                break;
            }
        }
    }
}
