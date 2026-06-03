export const calcScore = (
  tasksDone: number,
  tasksTotal: number,
  waterMl: number,
  waterGoal: number,
  trained: boolean,
  streak: number
): number => {
  if (tasksTotal === 0 && waterMl === 0 && !trained) return 0
  let score = 0
  if (tasksTotal > 0) score += (tasksDone / tasksTotal) * 40
  score += Math.min(waterMl / waterGoal, 1) * 30
  if (trained) score += 20
  score += Math.min(streak / 10, 1) * 10
  return Math.round(score)
}
