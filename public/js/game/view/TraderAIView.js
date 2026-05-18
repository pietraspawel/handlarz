class TraderAIView {
	static refreshInfo(trader) {
		let transitText = trader.city.name;
		if (trader.lastTurnInfo.lastCity !== null) {
			transitText = `${trader.lastTurnInfo.lastCity.name} -> ${trader.city.name}`;
		}
		let wealth =
			Library.separateThousands(trader.lastTurnInfo.wealth) + " $";
		const tbody = document.querySelector(".ai-player-info tbody");
		let row = tbody.querySelector(`tr[data-id="${trader.id}"]`);

		if (!row) {
			row = document.createElement("tr");
			row.dataset.id = trader.id;
			row.classList.add(`aiPlayer${trader.id}`);

			row.append(
				TraderAIView._createCell("ai-name"),
				TraderAIView._createCell("ai-transaction"),
				TraderAIView._createCell("ai-transit"),
				TraderAIView._createCell("ai-wealth"),
			);
			tbody.appendChild(row);
		}

		row.querySelector(".ai-name").textContent = trader.name;
		row.querySelector(".ai-transaction").textContent =
			trader.lastTurnInfo.transaction;
		row.querySelector(".ai-transit").textContent = transitText;
		row.querySelector(".ai-wealth").textContent = wealth;
	}

	static _createCell(className) {
		const td = document.createElement("td");
		td.className = className;
		return td;
	}
}
