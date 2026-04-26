// Ranking: top 5 usuários para o gráfico de barras
export const toRankingData = (ranking) =>
  ranking.slice(0, 5).map((item) => ({
    name: item.username ?? 'Usuário',
    points: Number(item.totalPoints ?? 0),
    position: Number(item.rankingPosition ?? 0),
  }))

// Pontos diários: agrega por data e retorna os últimos 7 dias
export const toEvolutionData = (dailyPoints) => {
  const byDate = dailyPoints.reduce((acc, item) => {
    const key = item.date
    acc[key] = (acc[key] ?? 0) + Number(item.points ?? 0)
    return acc
  }, {})

  const sorted = Object.entries(byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-7)

  return sorted.map(([date, points]) => {
    const d = new Date(date)
    const day = d.toLocaleDateString('pt-BR', { weekday: 'short' })
    return {
      day: day.charAt(0).toUpperCase() + day.slice(1).replace('.', ''),
      points,
      date,
    }
  })
}

// Estatísticas de evidências para o gráfico de barras coloridas
export const toEvidenceStats = (evidenceMetrics) => {
  if (!evidenceMetrics) return []
  return [
    { label: 'Aprovadas', value: Number(evidenceMetrics.approvedCount ?? 0),  color: '#4CAF50' },
    { label: 'Pendentes', value: Number(evidenceMetrics.pendingCount ?? 0),   color: '#FF9800' },
    { label: 'Recusadas', value: Number(evidenceMetrics.rejectedCount ?? 0),  color: '#e53935' },
  ]
}

// Taxa de aprovação como número inteiro 0-100
export const toApprovalRate = (evidenceMetrics) =>
  evidenceMetrics ? Math.round(Number(evidenceMetrics.approvalRate ?? 0)) : 0

// Cards de resumo: total de desafios, usuários, evidências e desafios ativos
export const toSummaryCards = (ranking, challengeMetrics, evidenceMetrics) => [
  {
    label: 'Desafios',
    value: challengeMetrics.length,
    icon: '🏆',
    color: '#1c1c1e',
    bg: '#f5f5f5',
  },
  {
    label: 'Usuários',
    value: ranking.length,
    icon: '👥',
    color: '#4A90E2',
    bg: '#EBF4FF',
  },
  {
    label: 'Evidências',
    value: Number(evidenceMetrics?.totalCount ?? 0),
    icon: '📤',
    color: '#4CAF50',
    bg: '#E8F5E9',
  },
  {
    label: 'Ativos',
    value: challengeMetrics.filter((c) => c.status === 'ACTIVE').length,
    icon: '⚡',
    color: '#FF9800',
    bg: '#FFF3E0',
  },
]

const STATUS_LABELS = {
  PENDING: 'Pendente',
  ACTIVE: 'Ativo',
  COMPLETED: 'Concluído',
  EXPIRED: 'Expirado',
}

const STATUS_COLORS = {
  PENDING: '#FF9800',
  ACTIVE: '#4A90E2',
  COMPLETED: '#4CAF50',
  EXPIRED: '#9E9E9E',
}

// Distribuição de desafios agrupados por status
export const toChallengeStatusData = (challengeMetrics) => {
  const counts = challengeMetrics.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] ?? 0) + 1
    return acc
  }, {})
  return Object.entries(counts).map(([status, count]) => ({
    status,
    label: STATUS_LABELS[status] ?? status,
    count,
    color: STATUS_COLORS[status] ?? '#888',
  }))
}

// Top 5 desafios por número de participantes
export const toChallengeParticipationData = (challengeMetrics) =>
  [...challengeMetrics]
    .sort((a, b) => Number(b.participantCount) - Number(a.participantCount))
    .slice(0, 5)
    .map((c) => ({
      title: c.title.length > 22 ? c.title.slice(0, 22) + '…' : c.title,
      participants: Number(c.participantCount ?? 0),
      completed: Number(c.completedCount ?? 0),
    }))
