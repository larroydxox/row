'use client'
import { useState, useEffect } from 'react'
import { useTasksStore } from '@/lib/store/use-tasks'
import { useFinanceStore } from '@/lib/store/use-finance'
import { useHealthStore } from '@/lib/store/use-health'
import { useConfigStore } from '@/lib/store/use-config'
import { calcScore } from '@/lib/utils/score'
import { getTotal } from '@/lib/utils/finance'
import { Greeting } from '@/components/home/Greeting'
import { BriefingBar } from '@/components/home/BriefingBar'
import { ScoreCard } from '@/components/home/ScoreCard'
import { TodayTasksCard } from '@/components/home/TodayTasksCard'
import { OverallInfoCard } from '@/components/home/OverallInfoCard'
import { FinanceStatsRow } from '@/components/home/FinanceStatsRow'
import { MonthProgressCard } from '@/components/home/MonthProgressCard'
import { TasksInProcess } from '@/components/home/TasksInProcess'
import { MonthGoalsCard } from '@/components/home/MonthGoalsCard'

// Evita hydration mismatch: renders apenas no client
function useMounted() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}

export default function HomePage() {
  const mounted = useMounted()

  const { tasks, monthGoals, streak, addTask, toggleTask, addMonthGoal, toggleMonthGoal, deleteMonthGoal } = useTasksStore()
  const { categories } = useFinanceStore()
  const { getTodayWater, getTodaySession, addWater } = useHealthStore()
  const { userName, waterGoal } = useConfigStore()

  if (!mounted) return null

  const todayTasks = tasks.filter((t) => t.date === 'today')
  const tasksDone  = todayTasks.filter((t) => t.done).length
  const waterMl    = getTodayWater()
  const session    = getTodaySession()
  const patrimonio = getTotal(categories)
  const score      = calcScore(tasksDone, todayTasks.length, waterMl, waterGoal, !!session, streak)

  const h = new Date().getHours()
  const greeting = h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'

  void addWater // usado implicitamente no JARVIS

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Saudação */}
      <Greeting greeting={greeting} userName={userName} score={score} />

      {/* Ticker */}
      <BriefingBar
        tasksDone={tasksDone} tasksTotal={todayTasks.length}
        waterMl={waterMl} waterGoal={waterGoal}
        patrimonio={patrimonio} streak={streak} session={session}
      />

      {/* Linha 1: Score + Tarefas hoje */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20 }}>
        <ScoreCard score={score} tasksDone={tasksDone} tasksTotal={todayTasks.length} waterMl={waterMl} waterGoal={waterGoal} trained={!!session} streak={streak} />
        <TodayTasksCard tasks={tasks} onAdd={addTask} onToggle={toggleTask} />
      </div>

      {/* Linha 2: Visão geral + Finanças + Mês */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: 20 }}>
        <OverallInfoCard tasks={tasks} streak={streak} />
        <FinanceStatsRow categories={categories} patrimonio={patrimonio} />
        <MonthProgressCard tasks={tasks} monthGoals={monthGoals} />
      </div>

      {/* Linha 3: Em processo + Metas do mês */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <TasksInProcess tasks={tasks} onToggle={toggleTask} onAdd={addTask} />
        <MonthGoalsCard goals={monthGoals} onAdd={addMonthGoal} onToggle={toggleMonthGoal} onDelete={deleteMonthGoal} />
      </div>
    </div>
  )
}
