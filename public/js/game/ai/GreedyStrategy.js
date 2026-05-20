class GreedyStrategy extends AIStrategy {
    decide(world, trader) {
        const city = trader.getCurrentCity(world);
        let bestGoodId = this.getCheapestGood(city);
        let bestCity = this.getBestCity(world, bestGoodId);

        const distance = world.hexDistance(
            city.position.x,
            city.position.y,
            bestCity.position.x,
            bestCity.position.y,
        );
        const remainingTurns = world.turnsLeft;

        if (distance > remainingTurns) {
            return {
                goodId: null,
                city: city,
            };
        }

        return {
            goodId: bestGoodId,
            city: bestCity,
        };
    }

    getCheapestGood(city) {
        let minId = 0;
        let minPrice = city.goods[0].price;

        for (let i = 1; i < city.goods.length; i++) {
            if (city.goods[i].price < minPrice) {
                minPrice = city.goods[i].price;
                minId = i;
            }
        }

        return minId;
    }

    getBestCity(world, goodId) {
        let bestCity = null;
        let bestPrice = -Infinity;

        for (let city of world.cities) {
            let price = city.goods[goodId].price;

            if (price > bestPrice) {
                bestPrice = price;
                bestCity = city;
            }
        }

        return bestCity;
    }
}
