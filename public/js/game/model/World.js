class World {
    xSize;
    ySize;
    map;

    constructor(data) {
        this.xSize = data.world.xSize;
        this.ySize = data.world.ySize;
        this.map = data.world.map;
        this.startGold = data.world.startGold;
        this.goods = [];
        for (let key in data.world.cities[0].goods) {
            let goodName = data.world.cities[0].goods[key].name;
            this.goods.push(new Good(goodName));
        }
        this.cities = [];
        for (let cityKey in data.world.cities) {
            let name = data.world.cities[cityKey].name;
            let position = data.world.cities[cityKey].position;
            let goods = [];
            for (let goodKey in data.world.cities[cityKey].goods) {
                goods.push(
                    Good.createForCity(
                        data.world.cities[cityKey].goods[goodKey],
                    ),
                );
            }
            this.cities.push(new City(name, position, goods));
        }
    }

    static positionsEqual(a, b) {
        if (!a || !b) return false;
        return a.x === b.x && a.y === b.y;
    }

    getCity(id) {
        return this.cities[id];
    }

    getRandomCity() {
        const index = Math.floor(Math.random() * this.cities.length);
        return this.cities[index];
    }

    getCityByPositionXY(x, y) {
        return (
            this.cities.find(
                (city) => city.position.x === x && city.position.y === y,
            ) || null
        );
    }

    hexDistance(x1, y1, x2, y2) {
        const qr1 = HexMath.offsetToAxial(x1, y1);
        const qr2 = HexMath.offsetToAxial(x2, y2);
        return HexMath.distance(qr1.q, qr1.r, qr2.q, qr2.r);
    }

    findCityByName(cityName) {
        return this.cities.find((city) => city.name === cityName);
    }

    findGoodIdByName(goodName) {
        if (goodName === null) {
            return null;
        }

        return this.goods.findIndex((good) => good.name === goodName);
    }
}
