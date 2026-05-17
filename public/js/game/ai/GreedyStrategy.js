class GreedyStrategy extends AIStrategy {

    decide(world, trader) {
        let bestGoodId = this.getCheapestGood(trader.city);
        let bestCity = this.getBestCity(world, bestGoodId);

        return {
            goodId: bestGoodId,
            city: bestCity
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