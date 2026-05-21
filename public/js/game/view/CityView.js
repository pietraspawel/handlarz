class CityView {
	static setTravelMode(isTraveling, trader) {
		$(".city-group").toggleClass("travel-mode", isTraveling);
		if (isTraveling) {
			CityView.disableTrade();
		} else {
			CityView.refreshElementsAfterEnterCity(trader);
			CityView.enableTrade();
		}
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
				let string = MathLibrary.formatNumber(
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
			let string = MathLibrary.formatNumber(trader.goods[i].quantity);
			let element = `<td><button class="btn btn-info" data-id="${i}">${string}</button></td>`;
			container.append(element);
		}
	}

	static refreshBuyButtons(trader) {
		let container = $(".city-info .buy");
		container.find("td").remove();
		for (let i in trader.goods) {
			let string = MathLibrary.formatNumber(
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
}
