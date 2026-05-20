class CityView {
	static refreshElementsAfterTurn(cities, trader) {
		CityView.refreshCityCursors(cities, trader);
	}

	static refreshElementsAfterTrade(trader) {
		CityView.refreshBuyButtons(trader);
		CityView.refreshSellButtons(trader);
	}

	static refreshElementsAfterEnterCity(trader) {
		CityView.refreshBuyButtons(trader);
		CityView.refreshSellButtons(trader);
	}

	static refreshCityPrices(cities) {
		let container = $(".city-info .prices");
		$(".city-info .city-prices").remove();

		for (let i = cities.length - 1; i >= 0; i--) {
			let element = `<tr class="city-prices">`;
			element += `<th>${cities[i].name}</th>`;
			for (let j in cities[i].goods) {
				let string = Library.separateThousands(
					cities[i].goods[j].price,
				);
				element += `<td>${string} $</td>`;
			}
			element += `</tr>`;
			container.after(element);
		}
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

	static disableTrade() {
		$(".city-info .buy button").prop("disabled", true);
		$(".city-info .sell button").prop("disabled", true);
	}

	static enableTrade() {
		$(".city-info .buy button").prop("disabled", false);
		$(".city-info .sell button").prop("disabled", false);
	}

	static refreshCityCursors(cities, trader) {
		for (let i in cities) {
			const city = cities[i];
			const cityElement = WorldView.getCityElementByCoords(
				city.position.x,
				city.position.y,
			);

			if (!cityElement) {
				continue;
			}

			cityElement.classList.remove("city-active");
			cityElement.classList.remove("city-current");

			if (trader.isInCity()) {
				cityElement.classList.add("city-active");
			} else {
				cityElement.classList.add("city-current");
			}
		}
	}
}
