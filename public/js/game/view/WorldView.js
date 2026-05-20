class WorldView {
	static getHexElementByCoords(x, y) {
		return document.querySelector(
			`#terrain .hex[data-x="${x}"][data-y="${y}"]`,
		);
	}

	static getCityElementByCoords(x, y) {
		return document.querySelector(
			`#cities .city-group[data-x="${x}"][data-y="${y}"]`,
		);
	}

	static setTravelMode(isTraveling) {
		$("#map").toggleClass("travel-mode", isTraveling);
	}
}
