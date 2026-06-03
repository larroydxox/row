'use client'
import { DailyBriefing } from '@/components/home/DailyBriefing'
import { DayScore } from '@/components/home/DayScore'
import { TasksWidget } from '@/components/home/TasksWidget'
import { QuickStats } from '@/components/home/QuickStats'
import { ActivityLog } from '@/components/home/ActivityLog'
import { DayInsights } from '@/components/home/DayInsights'
import { FocusNow } from '@/components/home/FocusNow'

export default function HomePage() {
  return (
    <div className='flex flex-col animate-fade-in'>
      {/* Ticker de status do dia */}
      <DailyBriefing />

      <div className='flex flex-col gap-4'>
        {/* Row 1: Score (60%) + Tasks (40%) */}
        <div className='grid gap-4' style={{ gridTemplateColumns: '3fr 2fr' }}>
          <DayScore />
          <TasksWidget />
        </div>

        {/* Row 2: Quick Stats */}
        <QuickStats />

        {/* Row 3: Activity Log + Insights */}
        <div className='grid grid-cols-2 gap-4'>
          <ActivityLog />
          <DayInsights />
        </div>

        {/* Bloco Foco Agora */}
        <FocusNow />
      </div>
    </div>
  )
}
