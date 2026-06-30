import path from "path";
import { fileURLToPath } from "url";
import { ConfigLoader } from "./core/ConfigLoader.js";
import { SimulationContext } from "./brute-force/core/SimulationContext.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CLI
const mapName = process.argv[2];
if (!mapName) {
    console.error("❌ Podaj nazwę mapy: node evolve.js astana");
    process.exit(1);
}

// load data
const loader = new ConfigLoader(__dirname);
const mapConfig = loader.loadMapConfig(mapName);
const highscore = loader.loadHighscore(mapName);

// inject
mapConfig.game.highscore = highscore;
mapConfig.world.map = mapName;

let simulationContext = new SimulationContext(mapConfig);

console.time("⏱️ Simulation time");
simulationContext.start();
console.timeEnd("⏱️ Simulation time");
