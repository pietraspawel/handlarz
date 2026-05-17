class CityView {
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
}
