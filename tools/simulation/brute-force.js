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

// const cities = ["A", "B", "C"];
// const goods = ["1", "2", "3"];

// function cartesian(arrays) {
//     return arrays.reduce((acc, curr) => acc.flatMap((a) => curr.map((b) => [...a, b])), [[]]);
// }

// function generateStrategies() {
//     const strategies = [];

//     for (const loop of loops) {
//         const steps = loop.length;

//         // każda pozycja = wybór towaru
//         const goodsChoices = Array.from({ length: steps }, () => goods);
//         const combinations = cartesian(goodsChoices);

//         // for (const combo of combinations) {
//         //     strategies.push({
//         //         start: loop[0],
//         //         loop: loop,
//         //         actions: combo.map((good, i) => ({
//         //             city: loop[i],
//         //             good,
//         //         })),
//         //     });
//         // }
//         for (const combo of combinations) {
//             strategies.push(combo.map((good, i) => `${loop[i]}${good}`));
//         }
//     }

//     return strategies;
// }

// function* generateLoops(cities) {
//     for (const start of cities) {
//         const others = cities.filter((city) => city !== start);

//         // długość ścieżki od 1 do wszystkich pozostałych miast
//         for (let length = 1; length <= others.length; length++) {
//             yield* generateRoutes(start, others, [], length);
//         }
//     }
// }

// function* generateRoutes(start, available, route, targetLength) {
//     if (route.length === targetLength) {
//         yield [start, ...route];
//         return;
//     }

//     for (let i = 0; i < available.length; i++) {
//         const city = available[i];

//         const nextAvailable = [...available.slice(0, i), ...available.slice(i + 1)];

//         yield* generateRoutes(start, nextAvailable, [...route, city], targetLength);
//     }
// }

// const loops = [...generateLoops(cities)];

// // dodaj powrót do startu
// const cycles = loops.map((l) => [...l, l[0]]);

// console.log(loops);
// console.log(loops.length); // 12

// const strategies = generateStrategies();

// console.log(strategies.length);
// console.dir(strategies, { depth: null, maxArrayLength: null });
