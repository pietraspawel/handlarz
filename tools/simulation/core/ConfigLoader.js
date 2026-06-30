import fs from "fs";
import yaml from "js-yaml";
import path from "path";

export class ConfigLoader {
    constructor(baseDir) {
        this.baseDir = baseDir;
    }

    loadYaml(filePath) {
        try {
            const content = fs.readFileSync(filePath, "utf8");
            return yaml.load(content);
        } catch (err) {
            console.error(`❌ Błąd YAML: ${filePath}`);
            throw err;
        }
    }

    loadNumber(filePath, fallback = 0) {
        if (!fs.existsSync(filePath)) return fallback;

        try {
            const value = Number(fs.readFileSync(filePath, "utf8"));
            return Number.isFinite(value) ? value : fallback;
        } catch {
            return fallback;
        }
    }

    loadSimulationConfig(mapName) {
        const file = path.join(this.baseDir, `./genetic_algorithms/config/${mapName}.yaml`);
        return this.loadYaml(file);
    }

    loadMapConfig(mapName) {
        const file = path.join(
            this.baseDir,
            `../../config/game/maps/${mapName}/${mapName}.yaml`,
        );

        return this.loadYaml(file);
    }

    loadHighscore(mapName) {
        const file = path.join(
            this.baseDir,
            `../../config/game/maps/${mapName}/${mapName}.hs`,
        );

        return this.loadNumber(file, 0);
    }
}
