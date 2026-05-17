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
}
