'use client'
import { DayScore } from '@/components/home/DayScore'
import { TasksWidget } from '@/components/home/TasksWidget'
import { QuickStats } from '@/components/home/QuickStats'
import { ActivityLog } from '@/components/home/ActivityLog'
import { DayInsights } from '@/components/home/DayInsights'

export default function HomePage() {
  return (
    <div className='flex flex-col gap-4 animate-fade-in'>
      {/* Row 1: Score (60%) + Tasks (40%) */}
      <div className='grid gap-4' style={{ gridTemplateColumns: '3fr 2fr' }}>
        <DayScore />
        <TasksWidget />
      </div>

      {/* Row 2: Quick Stats (4 cards) */}
      <QuickStats />

      {/* Row 3: Activity Log + Insights */}
      <div className='grid grid-cols-2 gap-4'>
        <ActivityLog />
        <DayInsights />
      </div>
    </div>
  )
}
