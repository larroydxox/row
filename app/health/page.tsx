'use client'
import { useState } from 'react'
import { SubTabs } from '@/components/shared/SubTabs'
import { WaterView } from '@/components/health/water/WaterView'
import { FoodView } from '@/components/health/food/FoodView'
import { GymView } from '@/components/health/gym/GymView'

const tabs = [
  { key: 'food', label: 'Alimentação', icon: '🍽️' },
  { key: 'water', label: 'Água', icon: '💧' },
  { key: 'gym', label: 'Academia', icon: '🏋️' },
]

export default function HealthPage() {
  const [tab, setTab] = useState('water')

  return (
    <div className='animate-fade-in'>
      <SubTabs tabs={tabs} active={tab} onChange={setTab} />
      {tab === 'food' && <FoodView />}
      {tab === 'water' && <WaterView />}
      {tab === 'gym' && <GymView />}
    </div>
  )
}
