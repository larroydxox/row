export interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  updatedAt: Date
}

export const mockNotes: Note[] = [
  {
    id: '1',
    title: 'Estratégia de investimentos 2025',
    content: `## Tese principal\n\nFocar em ETFs de longo prazo com aporte mensal constante.\n\n### Alocação alvo\n\n- 60% ETFs (VOO, VTI)\n- 20% Ações individuais\n- 15% Crypto\n- 5% Caixa\n\n### Referências\n\nVer [[Leituras do mês]] para livros sobre investimentos.`,
    tags: ['finanças', 'planejamento'],
    updatedAt: new Date('2026-06-02T10:00:00'),
  },
  {
    id: '2',
    title: 'Leituras do mês',
    content: `## Em andamento\n\n- [[Atomic Habits]] — 60% lido\n\n## Próximo\n\n- [[Deep Work]] — na fila\n- The Psychology of Money\n\n## Concluídos\n\n- Sapiens\n- O Investidor Inteligente`,
    tags: ['pessoal', 'leitura'],
    updatedAt: new Date('2026-05-31T10:00:00'),
  },
  {
    id: '3',
    title: 'Sistema de produtividade',
    content: `# Meu sistema\n\nCombino GTD com time-blocking.\n\n## Rotina matinal\n\n1. Revisar tarefas do dia\n2. Definir 3 tarefas principais (MITs)\n3. Bloquear tempo no calendário\n\nVer [[ideias]] para melhorias no dashboard.`,
    tags: ['produto', 'produtividade'],
    updatedAt: new Date('2026-05-30T10:00:00'),
  },
]
