class World {
    xSize;
    ySize;
    map;

    constructor(data) {
        this.xSize = data.world.xSize;
        this.ySize = data.world.ySize;
        this.map = data.world.map;
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
