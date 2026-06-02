export const mockHealth = {
  water: {
    goal: 3000,
    consumed: 1200,
    log: [
      { time: '09:14', amount: 350 },
      { time: '11:30', amount: 500 },
      { time: '13:05', amount: 350 },
    ],
    streak: 12,
    weeklyData: [
      { day: 'Seg', consumed: 2800, goal: 3000 },
      { day: 'Ter', consumed: 3100, goal: 3000 },
      { day: 'Qua', consumed: 2400, goal: 3000 },
      { day: 'Qui', consumed: 3000, goal: 3000 },
      { day: 'Sex', consumed: 2600, goal: 3000 },
      { day: 'Sáb', consumed: 1800, goal: 3000 },
      { day: 'Dom', consumed: 1200, goal: 3000 },
    ],
  },
  food: {
    kcalGoal: 2200,
    kcalConsumed: 1840,
    macros: {
      protein: { consumed: 142, goal: 160, unit: 'g', color: '#3b82f6' },
      carbs: { consumed: 210, goal: 250, unit: 'g', color: '#f59e0b' },
      fat: { consumed: 65, goal: 70, unit: 'g', color: '#ef4444' },
      fiber: { consumed: 22, goal: 30, unit: 'g', color: '#00ff88' },
    },
    meals: [
      {
        name: 'Café da manhã',
        kcal: 480,
        items: [
          { name: 'Ovos mexidos (3)', kcal: 210 },
          { name: 'Pão integral (2 fatias)', kcal: 160 },
          { name: 'Café preto', kcal: 5 },
          { name: 'Banana', kcal: 105 },
        ],
      },
      {
        name: 'Almoço',
        kcal: 720,
        items: [
          { name: 'Frango grelhado 200g', kcal: 330 },
          { name: 'Arroz integral 150g', kcal: 195 },
          { name: 'Brócolis refogado', kcal: 85 },
          { name: 'Azeite 1 col', kcal: 110 },
        ],
      },
      {
        name: 'Lanche',
        kcal: 200,
        items: [
          { name: 'Whey protein', kcal: 120 },
          { name: 'Maçã', kcal: 80 },
        ],
      },
      {
        name: 'Jantar',
        kcal: 440,
        items: [],
      },
    ],
    weeklyKcal: [
      { day: 'Seg', kcal: 2150 },
      { day: 'Ter', kcal: 1980 },
      { day: 'Qua', kcal: 2300 },
      { day: 'Qui', kcal: 2100 },
      { day: 'Sex', kcal: 2450 },
      { day: 'Sáb', kcal: 1850 },
      { day: 'Dom', kcal: 1840 },
    ],
  },
  gym: {
    today: {
      status: 'done' as 'done' | 'pending' | 'rest',
      type: 'Push',
      exercises: [
        { name: 'Supino Reto', sets: 4, reps: 8, kg: 80 },
        { name: 'Desenvolvimento', sets: 3, reps: 10, kg: 50 },
        { name: 'Crucifixo Inclinado', sets: 3, reps: 12, kg: 20 },
        { name: 'Tríceps Pulley', sets: 4, reps: 12, kg: 35 },
      ],
    },
    history: [
      { date: '2025-06-01', type: 'Push', volume: 4800 },
      { date: '2025-05-30', type: 'Pull', volume: 5200 },
      { date: '2025-05-29', type: 'Legs', volume: 6100 },
      { date: '2025-05-28', type: 'Rest', volume: 0 },
      { date: '2025-05-27', type: 'Push', volume: 4600 },
      { date: '2025-05-26', type: 'Pull', volume: 5100 },
      { date: '2025-05-25', type: 'Legs', volume: 5900 },
    ],
  },
}
