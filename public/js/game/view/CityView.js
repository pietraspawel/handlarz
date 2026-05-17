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

	static refreshCityCursors(cities, player) {
		const playerX = player.getPosition().x;
		const playerY = player.getPosition().y;

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

			if (city.position.x === playerX && city.position.y === playerY) {
				cityElement.classList.add("city-current");
			} else {
				cityElement.classList.add("city-active");
			}
		}
	}
}
