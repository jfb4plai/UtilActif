export function getMonsterLevel(level, threshold) {
  if (threshold === null) {
    if (level < 25) return 0
    if (level < 50) return 1
    if (level < 75) return 2
    return 3
  }
  const ratio = level / threshold
  if (ratio < 0.5) return 0
  if (ratio < 0.75) return 1
  if (ratio < 1) return 2
  return 3
}
