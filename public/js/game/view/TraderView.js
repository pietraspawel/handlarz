class TraderView {
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
}
