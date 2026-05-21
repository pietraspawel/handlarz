class TraderView {
	static refreshElementsAfterTurn(trader) {
		TraderView.refreshPosition(trader);
	}

	static refreshElementsAfterTrade(trader) {
		TraderView.refreshCargo(trader);
		TraderView.refreshWealth(trader);
	}

	static refreshCargo(trader) {
		let container = $(".city-info .cargo-quantity");
		container.find("td").remove();
		for (let i in trader.goods) {
			let string = Library.formatNumber(trader.goods[i].quantity);
			let element = `<td>${string}</td>`;
			container.append(element);
		}
	}

	static refreshPosition(trader) {
		const tile = WorldView.getHexElementByCoords(
			trader.position.x,
			trader.position.y,
		);
		const cx = tile.dataset.cx;
		const cy = tile.dataset.cy;

		let traderIcon = document.getElementById("player");
		if (!traderIcon) {
			traderIcon = document
				.getElementById("player-template")
				.cloneNode(true);
			traderIcon.setAttribute("id", "player");
			document.getElementById("player-layer").appendChild(traderIcon);
		}

		traderIcon.setAttribute(
			"transform",
			`translate(${cx - 10}, ${cy - 10})`,
		);

		let cityName = trader.getCityName();
		$(".city-info .player-position").text(`Jesteś w: ${cityName}`);
	}

	static refreshWealth(trader) {
		let goldString = Library.formatNumber(trader.gold) + " $";
		$(".player-info .wealth").text(goldString);
	}
}
