class HexMath {
	static directions = [
		{ dq: +1, dr: 0 },
		{ dq: -1, dr: 0 },
		{ dq: 0, dr: +1 },
		{ dq: 0, dr: -1 },
		{ dq: +1, dr: -1 },
		{ dq: -1, dr: +1 },
	];

	static offsetToAxial(x, y) {
		const q = x - 1;
		const r = y - 1 - Math.floor((q - (q & 1)) / 2);

		return { q, r };
	}

	static axialToOffset(q, r) {
		const x = q + 1;
		const y = r + 1 + Math.floor((q - (q & 1)) / 2);

		return { x, y };
	}

	static distance(aQ, aR, bQ, bR) {
		return (
			(Math.abs(aQ - bQ) +
				Math.abs(aR - bR) +
				Math.abs(aQ + aR - (bQ + bR))) /
			2
		);
	}

	// tablica najlepszych kolejnych kroków na drodze z pos -> dest
	static getBestSteps(pos, dest) {
		const current = HexMath.offsetToAxial(pos.x, pos.y);
		const target = HexMath.offsetToAxial(dest.x, dest.y);

		const candidates = [];

		let bestDist = Infinity;

		for (const d of this.directions) {
			const neighborQ = current.q + d.dq;
			const neighborR = current.r + d.dr;

			const dist = HexMath.distance(
				neighborQ,
				neighborR,
				target.q,
				target.r,
			);

			if (dist < bestDist) {
				bestDist = dist;
				candidates.length = 0; // reset
				candidates.push(d);
			} else if (dist === bestDist) {
				candidates.push(d);
			}
		}

		// mapujemy do offset
		return candidates.map((d) =>
			HexMath.axialToOffset(current.q + d.dq, current.r + d.dr),
		);
	}
}
