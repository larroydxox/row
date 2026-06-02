export const mockFinance = {
  total: 12400,
  currency: 'CHF',
  history: [
    { month: 'Jan', value: 9800 },
    { month: 'Fev', value: 10200 },
    { month: 'Mar', value: 9600 },
    { month: 'Abr', value: 11000 },
    { month: 'Mai', value: 11800 },
    { month: 'Jun', value: 12400 },
  ],
  categories: [
    {
      name: 'Contas Bancárias',
      icon: 'landmark',
      color: '#3b82f6',
      total: 4200,
      items: [
        { name: 'Neon', value: 2800 },
        { name: 'UBS', value: 1400 },
      ],
    },
    {
      name: 'Ações & Investimentos',
      icon: 'trending-up',
      color: '#00ff88',
      total: 5800,
      items: [
        { name: 'VOO ETF', value: 3200 },
        { name: 'NVDA', value: 2600 },
      ],
    },
    {
      name: 'Crypto',
      icon: 'coins',
      color: '#f59e0b',
      total: 1800,
      items: [
        { name: 'BTC', value: 1200 },
        { name: 'ETH', value: 600 },
      ],
    },
    {
      name: 'Outros Ativos',
      icon: 'package',
      color: '#8b5cf6',
      total: 600,
      items: [
        { name: 'Empréstimo a receber', value: 600 },
      ],
    },
  ],
  recentActivity: [
    { action: 'Conta Neon atualizada', delta: '+500 CHF', time: 'há 2 dias' },
    { action: 'VOO ETF comprado', delta: '+320 CHF', time: 'há 5 dias' },
    { action: 'Aporte mensal registrado', delta: '+800 CHF', time: 'há 8 dias' },
  ],
}
