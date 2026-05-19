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

	static refreshCityCursors(cities, trader) {
		const traderX = trader.position.x;
		const traderY = trader.position.y;

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

			if (city.position.x === traderX && city.position.y === traderY) {
				cityElement.classList.add("city-current");
			} else {
				cityElement.classList.add("city-active");
			}
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
}
