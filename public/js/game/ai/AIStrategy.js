export class AIStrategy {
    decide(world, trader) {
        return {
            goodId: 0,
            city: world.cities[0],
        };
    }
}
