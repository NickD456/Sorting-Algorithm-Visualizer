import { playTone } from './audio.js';
import { updateBarHeight, setBarColor } from './ui.js';
import { sleep } from './main.js'; // sleep is defined in main.js
import { stepDelay } from './main.js';


export function getStepDelay() {
	return stepDelay;
}

// Bubble sort
export async function bubbleSort(array) {
	const bars = document.getElementsByClassName("bar");

	for (let i = 0; i < array.length - 1; i++) {
		for (let j = 0; j < array.length - i - 1; j++) {
			setBarColor(bars, [j, j + 1], "red");

			playTone(array[j]);
			await sleep(getStepDelay());

			if (array[j] > array[j + 1]) {
				// Swap values
				let temp = array[j];
				array[j] = array[j + 1];
				array[j + 1] = temp;

				// Reflect swap visually
				updateBarHeight(bars, j, array[j], array);
				updateBarHeight(bars, j + 1, array[j + 1], array);
			}

			// Reset bar colors
			setBarColor(bars, [j, j + 1], "#4caf50");

			await sleep(getStepDelay());
		}
	}
}

// Selection sort
export async function selectionSort(array) {
	const bars = document.getElementsByClassName("bar");

	for (let i = 0; i < array.length - 1; i++) {
		let minIdx = i;
		setBarColor(bars, [i], "blue");

		for (let j = i + 1; j < array.length; j++) {
			setBarColor(bars, [j], "red");
			playTone(array[j]);
			await sleep(getStepDelay());

			if (array[j] < array[minIdx]) {
				if (minIdx !== i) setBarColor(bars, [minIdx], "#4caf50");
				minIdx = j;
				setBarColor(bars, [minIdx], "orange");
			} else {
				setBarColor(bars, [j], "#4caf50");
			}
		}

		// Swap to correct position
		if (minIdx !== i) {
			playTone(array[minIdx]);

			let temp = array[i];
			array[i] = array[minIdx];
			array[minIdx] = temp;

			updateBarHeight(bars, i, array[i], array);
			updateBarHeight(bars, minIdx, array[minIdx], array);
		}

		setBarColor(bars, [i, minIdx], "#4caf50");
	}
}

// Insertion sort
export async function insertionSort(array) {
	const bars = document.getElementsByClassName("bar");

	for (let i = 1; i < array.length; i++) {
		let key = array[i];
		let j = i - 1;

		setBarColor(bars, [i], "blue");
		playTone(key);
		await sleep(getStepDelay());

		while (j >= 0 && array[j] > key) {
			setBarColor(bars, [j], "red");
			playTone(array[j]);
			await sleep(getStepDelay());

			array[j + 1] = array[j];
			updateBarHeight(bars, j + 1, array[j + 1], array);

			setBarColor(bars, [j], "#4caf50");
			j--;
		}

		array[j + 1] = key;
		updateBarHeight(bars, j + 1, key, array);

		setBarColor(bars, [j + 1], "#4caf50");
		await sleep(getStepDelay());
	}
}

// Merge sort
export async function mergeSort(array) {
	const bars = document.getElementsByClassName("bar");
	await mergeSortHelper(array, 0, array.length - 1, bars);
}

async function mergeSortHelper(array, left, right, bars) {
	if (left >= right) return;

	const mid = Math.floor((left + right) / 2);

	await mergeSortHelper(array, left, mid, bars);
	await mergeSortHelper(array, mid + 1, right, bars);
	await merge(array, left, mid, right, bars);
}

async function merge(array, left, mid, right, bars) {
	const leftArr = array.slice(left, mid + 1);
	const rightArr = array.slice(mid + 1, right + 1);

	let i = 0;
	let j = 0;
	let k = left;

	// Highlight merge range
	for (let x = left; x <= right; x++) {
		setBarColor(bars, [x], "blue");
	}

	await sleep(getStepDelay());

	while (i < leftArr.length && j < rightArr.length) {
		setBarColor(bars, [k], "red");
		playTone(leftArr[i]);

		if (leftArr[i] <= rightArr[j]) {
			array[k] = leftArr[i];
			i++;
		} else {
			array[k] = rightArr[j];
			j++;
		}

		updateBarHeight(bars, k, array[k], array);
		await sleep(getStepDelay());
		setBarColor(bars, [k], "blue");
		k++;
	}

	while (i < leftArr.length) {
		array[k] = leftArr[i];
		updateBarHeight(bars, k, array[k], array);
		playTone(leftArr[i]);

		await sleep(getStepDelay());
		i++;
		k++;
	}

	while (j < rightArr.length) {
		array[k] = rightArr[j];
		updateBarHeight(bars, k, array[k], array);
		playTone(rightArr[j]);

		await sleep(getStepDelay());
		j++;
		k++;
	}

	// Reset colors
	for (let x = left; x <= right; x++) {
		setBarColor(bars, [x], "#4caf50");
	}
}

// Quick sort
export async function quickSort(array) {
	const bars = document.getElementsByClassName("bar");
	await quickSortHelper(array, 0, array.length - 1, bars);
}

async function quickSortHelper(array, low, high, bars) {
	if (low < high) {
		const pivotIndex = await partition(array, low, high, bars);
		await quickSortHelper(array, low, pivotIndex - 1, bars);
		await quickSortHelper(array, pivotIndex + 1, high, bars);
	}
}

async function partition(array, low, high, bars) {
	const pivot = array[high];
	let i = low - 1;

	// Highlight pivot
	setBarColor(bars, [high], "purple");
	playTone(pivot);
	await sleep(getStepDelay());

	for (let j = low; j < high; j++) {
		setBarColor(bars, [j], "red");
		playTone(array[j]);
		await sleep(getStepDelay());

		if (array[j] < pivot) {
			i++;

			setBarColor(bars, [i, j], "orange");

			let temp = array[i];
			array[i] = array[j];
			array[j] = temp;

			updateBarHeight(bars, i, array[i], array);
			updateBarHeight(bars, j, array[j], array);

			await sleep(getStepDelay());
		}

		setBarColor(bars, [j], "#4caf50");
	}

	// Place pivot in correct position
	let temp = array[i + 1];
	array[i + 1] = array[high];
	array[high] = temp;

	updateBarHeight(bars, i + 1, array[i + 1], array);
	updateBarHeight(bars, high, array[high], array);

	setBarColor(bars, [high], "#4caf50");
	setBarColor(bars, [i + 1], "#4caf50");

	await sleep(getStepDelay());

	return i + 1;
}

// Heap sort
export async function heapSort(array) {
	const bars = document.getElementsByClassName("bar");
	let n = array.length;

	// Build max heap
	for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
		await heapify(array, n, i, bars);
	}

	// Extract elements
	for (let i = n - 1; i > 0; i--) {
		setBarColor(bars, [0, i], "orange");
		await sleep(getStepDelay());

		let temp = array[0];
		array[0] = array[i];
		array[i] = temp;

		updateBarHeight(bars, 0, array[0], array);
		updateBarHeight(bars, i, array[i], array);
		playTone(array[i]);

		setBarColor(bars, [0, i], "#4caf50");

		await heapify(array, i, 0, bars);
	}
}

async function heapify(array, n, i, bars) {
	let largest = i;
	let left = 2 * i + 1;
	let right = 2 * i + 2;

	if (left < n) {
		setBarColor(bars, [left, largest], "red");
		playTone(array[left]);
		await sleep(getStepDelay());
		if (array[left] > array[largest]) largest = left;
		setBarColor(bars, [left, largest], "#4caf50");
	}

	if (right < n) {
		setBarColor(bars, [right, largest], "red");
		playTone(array[right]);
		await sleep(getStepDelay());
		if (array[right] > array[largest]) largest = right;
		setBarColor(bars, [right, largest], "#4caf50");
	}

	if (largest !== i) {
		setBarColor(bars, [i, largest], "orange");
		await sleep(getStepDelay());

		let swap = array[i];
		array[i] = array[largest];
		array[largest] = swap;

		updateBarHeight(bars, i, array[i], array);
		updateBarHeight(bars, largest, array[largest], array);
		playTone(array[largest]);

		setBarColor(bars, [i, largest], "#4caf50");

		await heapify(array, n, largest, bars);
	}
}