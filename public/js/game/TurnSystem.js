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

class TurnSystem {
    static autoTurnTimeout = null;

    static nextTurn(gameContext, trader, aiTraders) {
        let world = gameContext.world;

        for (const aiTrader of aiTraders) {
            aiTrader.turn(world);
        }
        trader.turn(world);
        world.turnsLeft--;
        GameView.refreshElementsAfterTurn(world, trader, aiTraders);

        if (world.turnsLeft <= 0) {
            GameOverService.gameOver(gameContext, trader, aiTraders);
        }

        gameContext.gameLog.startTurn({ trader, aiTraders });
        console.log(gameContext.gameLog);
    }

    static autoTurns(gameContext, trader, aiTraders) {
        let world = gameContext.world;
        if (this.autoTurnTimeout) {
            return;
        }

        const loop = () => {
            if (trader.isInCity() || world.turnsLeft <= 0) {
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
        let world = gameContext.world;
        TurnSystem.stopAutoTurns();

        while (trader.isTravelling() && world.turnsLeft > 0) {
            TurnSystem.nextTurn(gameContext, trader, aiTraders);
            if (world.turnsLeft <= 0) {
                break;
            }
        }
    }
}
