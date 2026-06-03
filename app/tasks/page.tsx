'use client'
import { useTasksStore } from '@/lib/store/use-tasks'
import { TaskGroup } from '@/components/tasks/TaskGroup'
import { Flame } from 'lucide-react'

export default function TasksPage() {
  const { tasks, streak } = useTasksStore()
  const byDate = (date: string) => tasks.filter((t) => t.date === date)

  return (
    <div className='animate-fade-in'>
      <div className='flex items-center gap-2 mb-6'>
        <Flame size={16} style={{ color: 'var(--accent-amber)' }} />
        <span className='text-sm font-mono' style={{ color: 'var(--text-secondary)' }}>
          {streak > 0 ? `${streak} dias com ao menos 1 tarefa concluída` : 'Complete tarefas para iniciar seu streak'}
        </span>
      </div>

      <div className='grid gap-0' style={{ gridTemplateColumns: '280px 1fr' }}>
        <div className='pr-8'>
          <WeekCalendar tasks={tasks} />
        </div>
        <div>
          <TaskGroup label='Hoje'        date='today'    tasks={byDate('today')} />
          <TaskGroup label='Amanhã'      date='tomorrow' tasks={byDate('tomorrow')} />
          <TaskGroup label='Esta semana' date='week'     tasks={byDate('week')} />
          <TaskGroup label='Um dia'      date='someday'  tasks={byDate('someday')} showAddInput={false} />
        </div>
      </div>
    </div>
  )
}

function WeekCalendar({ tasks }: { tasks: ReturnType<typeof useTasksStore.getState>['tasks'] }) {
  const days = ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom']
  const today = new Date().getDay()
  const todayIdx = today === 0 ? 6 : today - 1

  return (
    <div>
      <div className='text-[10px] font-mono tracking-wider mb-3' style={{ color: 'var(--text-muted)' }}>ESTA SEMANA</div>
      <div className='flex flex-col gap-2'>
        {days.map((day, i) => (
          <div key={day} className='flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150'
            style={{
              background: i === todayIdx ? 'var(--bg-elevated)' : 'transparent',
              border: i === todayIdx ? '1px solid var(--border-active)' : '1px solid transparent',
            }}
          >
            <span className='text-xs font-mono w-8' style={{ color: i === todayIdx ? 'var(--text-primary)' : 'var(--text-muted)' }}>{day}</span>
            <div className='w-2 h-2 rounded-full' style={{
              background: i === todayIdx ? 'var(--accent-green)' : i < todayIdx ? 'rgba(0,255,136,0.3)' : 'var(--bg-elevated)',
            }} />
            {i === todayIdx && <span className='text-[10px]' style={{ color: 'var(--accent-green)' }}>hoje</span>}
          </div>
        ))}
      </div>
      <div className='mt-4 text-xs font-mono' style={{ color: 'var(--text-muted)' }}>
        {tasks.filter((t) => t.date === 'someday').length} no backlog
      </div>
    </div>
  )
}
