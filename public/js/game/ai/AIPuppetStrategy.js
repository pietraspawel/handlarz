class AIPuppetStrategy extends AIStrategy {
    start;
    commands;
    infiniteLoop;
    commandPointer;
    loopPointer;

    constructor({ script }) {
        super();
        this.start = script.start ?? null;
        this.commands = script.commands ?? [];
        this.infiniteLoop = script.infiniteLoop ?? [];
        this.commandPointer = 0;
        this.loopPointer = 0;
    }

    decide(world, trader) {
        let command = null;

        if (this.commandPointer < this.commands.length) {
            command = this.commands[this.commandPointer];
            this.commandPointer++;
        } else if (this.infiniteLoop.length > 0) {
            command =
                this.infiniteLoop[this.loopPointer % this.infiniteLoop.length];
            this.loopPointer++;
        }

        if (!command) {
            return {
                city: null,
                goodId: null,
            };
        }

        return {
            city: world.findCityByName(command.city),
            goodId: world.findGoodIdByName(command.good),
        };
    }
}
