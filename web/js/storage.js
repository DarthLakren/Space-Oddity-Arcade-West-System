const KEY = "spaceOddityArcadeWestSystem.bestScore.v1";

export function getBestScore() {
  try {
    const value = Number.parseInt(localStorage.getItem(KEY) ?? "0", 10);
    return Number.isFinite(value) && value >= 0 ? value : 0;
  } catch (error) {
    console.warn("No fue posible leer el récord local:", error);
    return 0;
  }
}

export function saveBestScore(score) {
  try {
    const current = getBestScore();
    const next = Math.max(current, Math.floor(score));
    localStorage.setItem(KEY, String(next));
    return next;
  } catch (error) {
    console.warn("No fue posible guardar el récord local:", error);
    return getBestScore();
  }
}
