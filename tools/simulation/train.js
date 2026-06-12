import path from "path";
import { fileURLToPath } from "url";
import { ConfigLoader } from "./core/ConfigLoader.js";
import { World } from "../../public/js/game/model/World.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === CLI ===
const mapName = process.argv[2];

if (!mapName) {
    console.error("❌ Podaj nazwę mapy: node train.js astana");
    process.exit(1);
}

// === loader ===
const loader = new ConfigLoader(__dirname);

// === load data ===
const simConfig = loader.loadSimulationConfig(mapName);
const mapConfig = loader.loadMapConfig(mapName);
const highscore = loader.loadHighscore(mapName);

// inject
mapConfig.game.highscore = highscore;
mapConfig.world.map = mapName;

let world = new World(mapConfig);

// === output ===
console.log("\n==============================");
console.log("🧠 SIMULATION CONFIG");
console.dir(simConfig, { depth: null });

console.log("\n==============================");
console.log("🗺️ MAP CONFIG");
console.dir(mapConfig, { depth: null });

console.log("\n==============================");
console.log("WORLD");
console.dir(world, { depth: null });
