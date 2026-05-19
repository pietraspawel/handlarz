class TraderView {
	static refreshView(trader) {
		TraderView.refreshWealth(trader);
		TraderView.refreshPosition(trader);
		TraderView.refreshCargo(trader);
		TraderView.refreshBuyButtons(trader);
		TraderView.refreshSellButtons(trader);
	}

	static refreshSellButtons(trader) {
		let container = $(".city-info .sell");
		container.find("td").remove();
		for (let i in trader.goods) {
			let string = Library.separateThousands(trader.goods[i].quantity);
			let element = `<td><button class="btn btn-info" data-id="${i}">${string}</button></td>`;
			container.append(element);
		}
	}

	static refreshBuyButtons(trader) {
		let container = $(".city-info .buy");
		container.find("td").remove();
		for (let i in trader.goods) {
			let string = Library.separateThousands(
				Math.floor(trader.gold / trader.city.goods[i].price),
			);
			let element = `<td><button class="btn btn-info" data-id="${i}">${string}</button></td>`;
			container.append(element);
		}
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

		let cityName = 'w trasie';
		if (trader.city) {
			cityName = trader.city.name;
		}
		$(".city-info .player-position").text(`Jesteś w: ${cityName}`);
	}

	static refreshWealth(trader) {
		let goldString = Library.separateThousands(trader.gold) + " $";
		$(".player-info .wealth").text(goldString);
	}
}
