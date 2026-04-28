export const clickSound = new Audio("/assets/click.ogg");
export const moveSound = new Audio("/assets/move.webm");
export const captureSound = new Audio("/assets/capture.webm");
export const gameStartSound = new Audio("/assets/game-start.webm");
export const gameEndSound = new Audio("/assets/game-end.webm");
export const illegalSound = new Audio("/assets/illegal.webm");
export const selectSound = new Audio("/assets/select.mp3");

export const playSound = (audio) => {
    audio.currentTime = 0;
    audio.play().catch(e => console.warn("Audio play blocked by browser:", e));
};
