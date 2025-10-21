import { generatePassword, getDefaultOptions } from "../scripts/password.js";

const els = {
	length: document.getElementById("length"),
	lengthValue: document.getElementById("lengthValue"),
	upper: document.getElementById("upper"),
	lower: document.getElementById("lower"),
	digits: document.getElementById("digits"),
	special: document.getElementById("special"),
	excludeAmbiguous: document.getElementById("excludeAmbiguous"),
	generate: document.getElementById("generate"),
	copy: document.getElementById("copy"),
	output: document.getElementById("output"),
	message: document.getElementById("message"),
};

function getOptionsFromUI() {
	return {
		length: Number(els.length.value),
		upper: els.upper.checked,
		lower: els.lower.checked,
		digits: els.digits.checked,
		special: els.special.checked,
		excludeAmbiguous: els.excludeAmbiguous.checked,
		minEachSelected: true,
	};
}

function setMessage(text, ok = true) {
	els.message.textContent = text || "";
	els.message.style.color = ok ? "#0a7d33" : "#b91c1c";
}

function generate() {
	try {
		const opts = getOptionsFromUI();
		const pwd = generatePassword(opts);
		els.output.value = pwd;
		setMessage("Đã tạo mật khẩu.");
	} catch (e) {
		setMessage(e.message || "Có lỗi xảy ra.", false);
	}
}

async function copy() {
	const value = els.output.value.trim();
	if (!value) {
		setMessage("Chưa có mật khẩu để sao chép.", false);
		return;
	}
	try {
		await navigator.clipboard.writeText(value);
		setMessage("Đã sao chép vào clipboard.");
	} catch (e) {
		setMessage("Không thể sao chép. Hãy chọn và copy thủ công.", false);
	}
}

// Initialize UI
(function init() {
	const def = getDefaultOptions();
	els.length.value = String(def.length);
	els.lengthValue.textContent = String(def.length);
	els.upper.checked = def.upper;
	els.lower.checked = def.lower;
	els.digits.checked = def.digits;
	els.special.checked = def.special;
	els.excludeAmbiguous.checked = def.excludeAmbiguous;

	els.length.addEventListener("input", () => {
		els.lengthValue.textContent = String(els.length.value);
	});
	els.generate.addEventListener("click", generate);
	els.copy.addEventListener("click", copy);
})();



