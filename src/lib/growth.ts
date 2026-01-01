export function estimateLiveViews(
  baseViews: number,
  growthPerSecond: number,
  lastUpdated: number
) {
  const secondsPassed = (Date.now() - lastUpdated) / 1000;
  return Math.floor(baseViews + growthPerSecond * secondsPassed);
}
