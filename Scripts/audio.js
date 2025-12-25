export let masterVolume = 0.1;

export function setVolume(value) {
	masterVolume = parseFloat(value);
}

// Create audio player
export const audioCtx = new (window.AudioContext)();

// Play a short tone based on value
export function playTone(value) {

	// Safety check
	if (!audioCtx) return; 

	const oscillator = audioCtx.createOscillator();
	const gainNode = audioCtx.createGain();

	// Map number to frequency
	const minFreq = 120;
	const maxFreq = 500;
	const maxValue = 100;

	const normalized = value / maxValue;
	const curved = Math.sqrt(normalized);
	const freq = minFreq + curved * (maxFreq - minFreq);

	oscillator.type = "triangle";
	oscillator.frequency.value = freq;

	// Simple fade in and out
	gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
	gainNode.gain.linearRampToValueAtTime(masterVolume, audioCtx.currentTime + 0.02);
	gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.12);

	oscillator.connect(gainNode);
	gainNode.connect(audioCtx.destination);

	oscillator.start();
	oscillator.stop(audioCtx.currentTime + 0.12);
}
