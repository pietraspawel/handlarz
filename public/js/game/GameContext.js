class GameContext {
	world;
	gameLog;

	constructor(world) {
		this.world = world;
		this.gameLog = new GameLog(world.map);
	}
}