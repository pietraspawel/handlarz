import { AIStrategy } from "./AIStrategy.js";

export class AIPuppetStrategy extends AIStrategy {
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
            command = this.infiniteLoop[this.loopPointer % this.infiniteLoop.length];
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

    toTextScript() {
        let script = "";

        if (this.start !== null) {
            script += `start(${this.start.name})\n\n`;
        }

        if (this.infiniteLoop.length > 0) {
            script += "loop:\n";
            for (const command of this.infiniteLoop) {
                script += `    (${command.good}) ${command.city}\n`;
            }
            script += ":endloop";
        }

        if (this.commands.length > 0) {
            for (const command of this.commands) {
                script += `(${command.good}) ${command.city}\n`;
            }
            script += "\n";
        }

        return script;
    }
}
