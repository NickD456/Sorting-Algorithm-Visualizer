// Import UI
import { renderArray, timerDisplay } from './ui.js';
// Import sorting algorithms
import { bubbleSort, selectionSort, insertionSort, mergeSort, quickSort, heapSort } from './sorting.js';
// Import audio
import { setVolume, masterVolume } from './audio.js';
// Import parsing
import { parseFile } from "./data.js";

// Used to control animations
export function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
export let stepDelay = 20; // default stepDelay


let array = [];
// Array used for resets
let originalArray = [];
let timerInterval;

// DOM Elements
const generateBtn = document.getElementById("generateBtn");
const sortBtn = document.getElementById("sortBtn");
const resetBtn = document.getElementById("resetBtn");
const volumeSlider = document.getElementById("volumeSlider");
const algorithmSelect = document.getElementById("algorithmSelect");
const speedSlider = document.getElementById("speedSlider");
const speedValue = document.getElementById("speedValue");
const fileInput = document.getElementById("fileInput");
const fileLabel = document.querySelector('label[for="fileInput"]');
const downloadBtn = document.getElementById("downloadBtn");

// Hide download button until sort
downloadBtn.style.display = "none";

// Algorithm dropdowns
const algorithmMap = {
	bubble: bubbleSort,
	selection: selectionSort,
	insertion: insertionSort,
	merge: mergeSort,
	quick: quickSort,
	heap: heapSort
};




// Event listeners

// Generate new array
generateBtn.addEventListener("click", generateArray);

// Start sorting
sortBtn.addEventListener("click", async () => {
	// Hide download button
	downloadBtn.style.display = "none";

	const selectedAlgorithm = algorithmSelect.value;
	const sortFunction = algorithmMap[selectedAlgorithm];

	if (!sortFunction) return;

	await timedSort(sortFunction);
	
	// Enable download after sort
	downloadBtn.style.display = "inline-block";
});

// Start array reset. Used for algorithm comparisons
resetBtn.addEventListener("click", () => {
	// Hide download button
	downloadBtn.style.display = "none";

	array = [...originalArray];
	renderArray(array);
	timerDisplay.textContent = "Time: 0.00s";
	clearInterval(timerInterval);
});

// Update volume
volumeSlider.addEventListener("input", e => {
	setVolume(e.target.value);
});

// Update animation speed
speedSlider.addEventListener("input", e => {
    let val = parseInt(e.target.value);

    const minDelay = 5; 
    const maxDelay = 120; 

    stepDelay = maxDelay - ((val / 100) * (maxDelay - minDelay));

    if (stepDelay < minDelay) stepDelay = minDelay;

    // Display speed: 1 = slowest, 100 = fastest
    speedValue.textContent = `Speed: ${val}`;
});

// File uploads
fileInput.addEventListener("change", async () => {
	// Hide download button
	downloadBtn.style.display = "none";

	const file = fileInput.files[0];
	if (!file) return;

	try {
		array = await parseFile(file);
		originalArray = [...array];
		renderArray(array);
	} catch (err) {
		alert("Invalid file format");
	}
});

// Export to CSV
downloadBtn.addEventListener("click", () => {
    downloadArrayAsCSV(array); // uses the current array
});

// Functions

// Generate a random array
function generateArray() {
	downloadBtn.style.display = "none";
	array = [];
	for (let i = 0; i < 20; i++) {
		array.push(Math.floor(Math.random() * 100) + 1);
	}

	originalArray = [...array];
	renderArray(array);
	timerDisplay.textContent = "Time: 0.00s";
	clearInterval(timerInterval);
}

// Handles sorting and timers
async function timedSort(sortFunction) {
	disableControls();
	startTimer();

	await sortFunction(array);

	stopTimer();
	enableControls();
}


function startTimer() {
	const startTime = performance.now();

	timerInterval = setInterval(() => {
		const currentTime = performance.now();
		const elapsed = ((currentTime - startTime) / 1000).toFixed(2);
		timerDisplay.textContent = `Time: ${elapsed}s`;
	}, 50);
}

function stopTimer() {
	clearInterval(timerInterval);
}

// Disable controls when sorting to prevent bugs
function disableControls() {
	generateBtn.disabled = true;
	resetBtn.disabled = true;
	sortBtn.disabled = true;
	algorithmSelect.disabled = true;
	fileInput.disabled = true;

	// Lables need to be handled manually
	fileLabel.classList.add("disabled-btn");
	fileLabel.classList.remove("btn");
	
}

// Re enable controls
function enableControls() {
	generateBtn.disabled = false;
	resetBtn.disabled = false;
	sortBtn.disabled = false;
	algorithmSelect.disabled = false;
	fileInput.disabled = false;

	// Lables need to be handled manually
	fileLabel.classList.remove("disabled-btn");
	fileLabel.classList.add("btn");
}

// Export current array as CSV file
export function downloadArrayAsCSV(array, filename = "sorted_data.csv") {

    const csvContent = array.join(",") + "\n";

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });


    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);

    // Append link to body
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Release the object URL
    URL.revokeObjectURL(url);
}

// Generate initial array
generateArray();
