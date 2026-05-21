class TraderAIView {
	static refreshElementsAfterTurn(aiTraders) {
		for (
			let i = 0;
			i < World.MAX_NON_HIDDEN_AI && i < aiTraders.length;
			i++
		) {
			TraderAIView.refreshPosition(aiTraders[i]);
		}
		aiTraders.forEach((aiTrader) => TraderAIView.refreshInfo(aiTrader));
	}

	static refreshPosition(trader) {
		const tile = WorldView.getHexElementByCoords(
			trader.position.x,
			trader.position.y,
		);
		const cx = parseFloat(tile.dataset.cx);
		const cy = parseFloat(tile.dataset.cy);
		const aiId = trader.id;
		const offsets = [
			{ x: 10, y: -10 },
			{ x: 10, y: 10 },
			{ x: -10, y: 10 },
		];
		const offset = offsets[aiId] || { x: 0, y: 0 };
		let aiPlayer = document.getElementById(`ai-player-${aiId}`);

		if (!aiPlayer) {
			aiPlayer = document
				.getElementById("ai-player-template")
				.cloneNode(true);
			aiPlayer.setAttribute("id", `ai-player-${aiId}`);
			aiPlayer.querySelector("text").textContent = aiId;
			document.getElementById("ai-layer").appendChild(aiPlayer);
		}

		aiPlayer.setAttribute(
			"transform",
			`translate(${cx + offset.x}, ${cy + offset.y})`,
		);
	}

	static refreshInfo(trader) {
		let lastCityName = trader.getCityName();
		if (trader.lastTurnInfo.lastCity !== null) {
			lastCityName = `${trader.lastTurnInfo.lastCity.name}`;
		}
		let wealth =
			MathLibrary.formatNumber(trader.lastTurnInfo.wealth) + " $";
		const tbody = document.querySelector(".ai-player-info tbody");
		let row = tbody.querySelector(`tr[data-id="${trader.id}"]`);

		if (!row) {
			row = document.createElement("tr");
			row.dataset.id = trader.id;
			row.classList.add(`aiPlayer${trader.id}`);

			row.append(
				TraderAIView._createCell("ai-name"),
				TraderAIView._createCell("ai-good"),
				TraderAIView._createCell("ai-lastCity"),
				TraderAIView._createCell("ai-wealth"),
			);
			tbody.appendChild(row);
		}

		row.querySelector(".ai-name").textContent = trader.name;
		row.querySelector(".ai-good").textContent =
			trader.lastTurnInfo.goodName;
		row.querySelector(".ai-lastCity").textContent = lastCityName;
		row.querySelector(".ai-wealth").textContent = wealth;
	}

	static _createCell(className) {
		const td = document.createElement("td");
		td.className = className;
		return td;
	}
}
