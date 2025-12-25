export let masterVolume = 0.1;

export function setVolume(value) {
	masterVolume = parseFloat(value);
}

export const audioCtx = new (window.AudioContext)();

export function playTone(value) {
	if (!audioCtx) return;

	const oscillator = audioCtx.createOscillator();
	const gainNode = audioCtx.createGain();

	const minFreq = 120;
	const maxFreq = 500;
	const maxValue = 100;

	const normalized = value / maxValue;
	const curved = Math.sqrt(normalized);
	const freq = minFreq + curved * (maxFreq - minFreq);

	oscillator.type = "triangle";
	oscillator.frequency.value = freq;

	gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
	gainNode.gain.linearRampToValueAtTime(masterVolume, audioCtx.currentTime + 0.02);
	gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.12);

	oscillator.connect(gainNode);
	gainNode.connect(audioCtx.destination);

	oscillator.start();
	oscillator.stop(audioCtx.currentTime + 0.12);
}
