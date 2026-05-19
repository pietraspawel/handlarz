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
			let string = Library.separateThousands(trader.goods[i].quantity);
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

		let playerIcon = document.getElementById("player");
		if (!playerIcon) {
			playerIcon = document
				.getElementById("player-template")
				.cloneNode(true);
			playerIcon.setAttribute("id", "player");
			document.getElementById("player-layer").appendChild(playerIcon);
		}

		playerIcon.setAttribute(
			"transform",
			`translate(${cx - 10}, ${cy - 10})`,
		);

		let cityName = trader.getCityName();
		$(".city-info .player-position").text(`Jesteś w: ${cityName}`);
	}

	static refreshWealth(trader) {
		let goldString = Library.separateThousands(trader.gold) + " $";
		$(".player-info .wealth").text(goldString);
	}
}
