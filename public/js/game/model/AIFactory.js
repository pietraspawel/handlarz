class AIFactory {
    static defaultCityIndex;

    static create(world, data) {
        const aiConfigs = data.ai.traders ?? [];
        const aiTraders = [];

        AIFactory.defaultCityIndex = 0;

        aiConfigs.forEach((config, index) => {
            const strategy = this.createStrategy(config, data);
            let city = this.resolveStartCity(config, strategy, world);
            aiTraders.push(
                new TraderAI(world, index, config.name, city, strategy),
            );
        });

        return aiTraders;
    }

    static createStrategy(config, data) {
        const strategyConfig = config.strategy;

        if (!strategyConfig) {
            return new GreedyStrategy();
        }

        switch (strategyConfig.name) {
            case "AIPuppetStrategy": {
                if (!strategyConfig.script) {
                    throw new Error(
                        `AI "${config.name}": missing script for AIPuppetStrategy`,
                    );
                }

                const script = data.ai.puppetScripts?.[strategyConfig.script];

                if (!script) {
                    throw new Error(
                        `AI "${config.name}": unknown puppet script "${strategyConfig.script}"`,
                    );
                }

                return new AIPuppetStrategy({ script });
            }

            case "GreedyStrategy":
                return new GreedyStrategy();

            default:
                throw new Error(
                    `AI "${config.name}": unknown strategy "${strategyConfig.name}"`,
                );
        }
    }

    static resolveStartCity(config, strategy, world) {
        // 1. start ze skryptu nadpisuje wszystko
        if (strategy instanceof AIPuppetStrategy && strategy.start !== null) {
            const city = world.findCityByName(strategy.start);

            if (!city) {
                throw new Error(
                    `Unknown city "${strategy.start}" in puppet script`,
                );
            }

            return city;
        }

        // 2. jawny start z YAML
        if (config.start) {
            if (config.start === "random") {
                return world.getRandomCity();
            }

            const city = world.findCityByName(config.start);

            if (!city) {
                throw new Error(
                    `AI "${config.name}": unknown city "${config.start}"`,
                );
            }

            return city;
        }

        // 3. domyślne n-te miasto
        if (AIFactory.defaultCityIndex < world.cities.length) {
            const city = world.cities[AIFactory.defaultCityIndex];
            AIFactory.defaultCityIndex++;
            return city;
        }

        // 4. fallback
        return world.getRandomCity();
    }
}
