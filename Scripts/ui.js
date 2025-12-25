export const container = document.getElementById("array-container");
export const timerDisplay = document.getElementById("timerDisplay");

export function renderArray(array) {
	// Clear existing bar
	container.innerHTML = "";

	const containerHeight = container.clientHeight;
	// find max of current array
	const maxValue = Math.max(...array);

	array.forEach(value => {
		const bar = document.createElement("div");
		bar.classList.add("bar");

		// normalize height
		const normalizedHeight = (value / maxValue) * containerHeight;
		bar.style.height = `${normalizedHeight}px`;

		container.appendChild(bar);
	});
}


export function updateBarHeight(bars, index, value, array = null) {
    const container = document.getElementById("array-container");
    const containerHeight = container.clientHeight;

	// Recalculate max. Default max 100
    let maxValue = array ? Math.max(...array) : 100;
    const normalizedHeight = (value / maxValue) * containerHeight;

    bars[index].style.height = `${normalizedHeight}px`;
}

export function setBarColor(bars, indices, color) {
	indices.forEach(i => {
		bars[i].style.backgroundColor = color;
	});
}
