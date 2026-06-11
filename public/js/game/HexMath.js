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

    static distanceByOffset(x1, y1, x2, y2) {
        const qr1 = HexMath.offsetToAxial(x1, y1);
        const qr2 = HexMath.offsetToAxial(x2, y2);
        return HexMath.distance(qr1.q, qr1.r, qr2.q, qr2.r);
    }

	// tablica najlepszych kolejnych kroków na drodze z pos -> dest
	static getBestSteps(pos, dest, worldXSize, worldYSize) {
		const current = HexMath.offsetToAxial(pos.x, pos.y);
		const target = HexMath.offsetToAxial(dest.x, dest.y);

		const candidates = [];
		let bestDist = Infinity;

		for (const d of HexMath.directions) {
			const neighborQ = current.q + d.dq;
			const neighborR = current.r + d.dr;

			const offset = HexMath.axialToOffset(neighborQ, neighborR);

			// 🔥 filtr mapy (offset space)
			if (
				offset.x < 1 ||
				offset.x > worldXSize ||
				offset.y < 1 ||
				offset.y > worldYSize
			) {
				continue;
			}

			const dist = HexMath.distance(
				neighborQ,
				neighborR,
				target.q,
				target.r,
			);

			if (dist < bestDist) {
				bestDist = dist;
				candidates.length = 0;
				candidates.push(offset);
			} else if (dist === bestDist) {
				candidates.push(offset);
			}
		}

		return candidates;
	}

	static positionsEqual(a, b) {
		if (!a || !b) return false;
		return a.x === b.x && a.y === b.y;
	}
}
