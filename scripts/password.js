export function generatePassword(options) {
	const {
		length = 16,
		upper = true,
		lower = true,
		digits = true,
		special = true,
		excludeAmbiguous = true,
		minEachSelected = true,
	} = options || {};

	const U_ALL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const L_ALL = "abcdefghijklmnopqrstuvwxyz";
	const D_ALL = "0123456789";
	const S_ALL = "!@#$%^&*()-_=+[]{};:,./?";

	const AMBIGUOUS = new Set(Array.from("O0oIl1|`'\"{}[]()<>:;,."));

	function filterAmbiguous(s) {
		if (!excludeAmbiguous) return s;
		let out = "";
		for (const ch of s) {
			if (!AMBIGUOUS.has(ch)) out += ch;
		}
		return out;
	}

	const U = filterAmbiguous(U_ALL);
	const L = filterAmbiguous(L_ALL);
	const D = filterAmbiguous(D_ALL);
	const S = filterAmbiguous(S_ALL);

	const pools = [];
	if (upper) pools.push(U);
	if (lower) pools.push(L);
	if (digits) pools.push(D);
	if (special) pools.push(S);
	if (pools.length === 0) {
		throw new Error("Vui lòng chọn ít nhất một loại ký tự");
	}

	const allChars = pools.join("");
	if (allChars.length === 0) {
		throw new Error("Tập ký tự trống sau khi loại bỏ ký tự dễ nhầm lẫn");
	}

	// Secure random generator
	function getRandomInt(maxExclusive) {
		// Use crypto.getRandomValues if available (MV3 environments support Web Crypto)
		const buf = new Uint32Array(1);
		crypto.getRandomValues(buf);
		return buf[0] % maxExclusive;
	}

	const result = [];

	// Ensure at least one char from each selected group if requested
	if (minEachSelected) {
		for (const pool of pools) {
			result.push(pool[getRandomInt(pool.length)]);
		}
	}

	for (let i = result.length; i < length; i++) {
		result.push(allChars[getRandomInt(allChars.length)]);
	}

	// Shuffle (Fisher-Yates)
	for (let i = result.length - 1; i > 0; i--) {
		const j = getRandomInt(i + 1);
		[result[i], result[j]] = [result[j], result[i]];
	}

	return result.slice(0, length).join("");
}

export function getDefaultOptions() {
	return {
		length: 16,
		upper: true,
		lower: true,
		digits: true,
		special: true,
		excludeAmbiguous: true,
		minEachSelected: true,
	};
}



