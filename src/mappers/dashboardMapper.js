// ── Panorama Geral ────────────────────────────────────────────────────────────

export const toSummaryCards = (ranking, challengeMetrics, evidenceMetrics, engagementMetrics) => {
  const totalParticipations = challengeMetrics.reduce((s, c) => s + Number(c.participantCount ?? 0), 0)
  const totalCompleted      = challengeMetrics.reduce((s, c) => s + Number(c.completedCount ?? 0), 0)
  const globalCompletion    = totalParticipations > 0
    ? Math.round((totalCompleted / totalParticipations) * 100)
    : 0
  const activeUsers = engagementMetrics?.activeUsers ?? ranking.filter(r => Number(r.totalPoints) > 0).length
  const retention   = engagementMetrics?.retentionRate != null
    ? `${engagementMetrics.retentionRate}% de retenção`
    : null
  const activeChallenges = engagementMetrics?.activeChallenges
    ?? challengeMetrics.filter(c => c.status === 'ACTIVE').length

  return [
    {
      label: 'Usuários Ativos',
      value: activeUsers,
      sublabel: retention,
      icon: '👥',
      color: '#2196F3',
      bg: '#E3F2FD',
    },
    {
      label: 'Desafios Ativos',
      value: activeChallenges,
      sublabel: `de ${challengeMetrics.length} total`,
      icon: '⚡',
      color: '#FF9800',
      bg: '#FFF3E0',
    },
    {
      label: 'Conclusão Global',
      value: `${globalCompletion}%`,
      sublabel: `${totalCompleted} de ${totalParticipations} participações`,
      icon: '✅',
      color: '#4CAF50',
      bg: '#E8F5E9',
    },
    {
      label: 'Aprovação',
      value: evidenceMetrics ? `${Math.round(evidenceMetrics.approvalRate ?? 0)}%` : '0%',
      sublabel: `${evidenceMetrics?.approvedCount ?? 0} evidências aprovadas`,
      icon: '📤',
      color: '#9C27B0',
      bg: '#F3E5F5',
    },
  ]
}

// ── Inteligência de Desafios ──────────────────────────────────────────────────

export const toChallengeIntelligence = (challengeMetrics) =>
  challengeMetrics
    .filter(c => Number(c.participantCount) > 0)
    .map(c => {
      const participants    = Number(c.participantCount ?? 0)
      const completed       = Number(c.completedCount ?? 0)
      const inProgress      = Number(c.inProgressCount ?? 0)
      const totalProofs     = Number(c.totalProofs ?? 0)
      const approvedProofs  = Number(c.approvedProofs ?? 0)
      const completionRate  = Math.round((completed / participants) * 100)
      const abandonmentRate = 100 - completionRate - Math.round((inProgress / participants) * 100)
      const avgProofs       = +(totalProofs / participants).toFixed(1)
      const proofQuality    = totalProofs > 0 ? Math.round((approvedProofs / totalProofs) * 100) : 0

      return {
        id: c.challengeId,
        title: c.title,
        difficulty: c.difficulty,
        subject: c.subject,
        status: c.status,
        participants,
        completed,
        completionRate,
        abandonmentRate: Math.max(0, abandonmentRate),
        avgProofs,
        proofQuality,
      }
    })
    .sort((a, b) => b.participants - a.participants)

// ── Ranking ───────────────────────────────────────────────────────────────────

export const toRankingData = (ranking) =>
  ranking.slice(0, 7).map((item) => ({
    name: item.username ?? 'Usuário',
    points: Number(item.totalPoints ?? 0),
    position: Number(item.rankingPosition ?? 0),
  }))

// ── Evolução de Pontos ────────────────────────────────────────────────────────

export const toEvolutionData = (dailyPoints) => {
  const byDate = dailyPoints.reduce((acc, item) => {
    acc[item.date] = (acc[item.date] ?? 0) + Number(item.points ?? 0)
    return acc
  }, {})

  return Object.entries(byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-10)
    .map(([date, points]) => {
      const d   = new Date(date)
      const day = d.toLocaleDateString('pt-BR', { weekday: 'short' })
      return { day: day.charAt(0).toUpperCase() + day.slice(1).replace('.', ''), points, date }
    })
}

// ── Consistência de Usuários (quantos dias ativos) ────────────────────────────

export const toConsistencyData = (dailyPoints) => {
  const byUser = {}
  for (const dp of dailyPoints) {
    if (!byUser[dp.userId]) byUser[dp.userId] = new Set()
    byUser[dp.userId].add(dp.date)
  }

  let consistent = 0
  let moderate   = 0
  let oneTime    = 0

  for (const dates of Object.values(byUser)) {
    if (dates.size >= 3)      consistent++
    else if (dates.size >= 2) moderate++
    else                      oneTime++
  }

  return { consistent, moderate, oneTime, total: Object.keys(byUser).length }
}

// ── Evidências ────────────────────────────────────────────────────────────────

export const toEvidenceStats = (evidenceMetrics) => {
  if (!evidenceMetrics) return []
  return [
    { label: 'Aprovadas', value: Number(evidenceMetrics.approvedCount ?? 0), color: '#4CAF50' },
    { label: 'Pendentes', value: Number(evidenceMetrics.pendingCount ?? 0),  color: '#FF9800' },
    { label: 'Recusadas', value: Number(evidenceMetrics.rejectedCount ?? 0), color: '#e53935' },
  ]
}

export const toApprovalRate = (evidenceMetrics) =>
  evidenceMetrics ? Math.round(Number(evidenceMetrics.approvalRate ?? 0)) : 0

// ── Status dos Desafios ───────────────────────────────────────────────────────

const STATUS_LABELS = { PENDING: 'Pendente', ACTIVE: 'Ativo', COMPLETED: 'Concluído', EXPIRED: 'Expirado' }
const STATUS_COLORS = { PENDING: '#FF9800', ACTIVE: '#4A90E2', COMPLETED: '#4CAF50', EXPIRED: '#9E9E9E' }

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

// ── Insights Automáticos do App ───────────────────────────────────────────────

export const generateAppInsights = (ranking, challengeMetrics, evidenceMetrics, engagementMetrics) => {
  const insights = []

  // Retenção
  if (engagementMetrics?.retentionRate > 0) {
    const r = engagementMetrics.retentionRate
    const label = r >= 60 ? 'forte' : r >= 30 ? 'moderada' : 'baixa'
    insights.push({
      icon: '🔁',
      color: '#4CAF50',
      bg: '#E8F5E9',
      text: `${r}% dos usuários cadastrados já participaram ativamente — retenção ${label}.`,
    })
  }

  // Taxa de aprovação de evidências
  if (evidenceMetrics?.approvalRate > 0) {
    const rate    = Math.round(evidenceMetrics.approvalRate)
    const quality = rate >= 80 ? 'excelente qualidade' : rate >= 50 ? 'qualidade moderada' : 'baixa qualidade'
    insights.push({
      icon: '✅',
      color: '#2196F3',
      bg: '#E3F2FD',
      text: `${rate}% das evidências enviadas são aprovadas — sinal de ${quality} das participações.`,
    })
  }

  // Desafio mais engajador
  if (challengeMetrics.length > 0) {
    const top = challengeMetrics.reduce((a, b) =>
      Number(b.participantCount) > Number(a.participantCount) ? b : a
    )
    const cr = Number(top.participantCount) > 0
      ? Math.round((Number(top.completedCount) / Number(top.participantCount)) * 100)
      : 0
    insights.push({
      icon: '🏆',
      color: '#FF9800',
      bg: '#FFF3E0',
      text: `"${top.title}" é o desafio líder com ${top.participantCount} participantes e ${cr}% de conclusão.`,
    })
  }

  // Desafio com maior abandono (candidato a revisão)
  const withPart = challengeMetrics.filter(c => Number(c.participantCount) > 1)
  if (withPart.length > 0) {
    const worst = withPart.reduce((a, b) => {
      const rA = 1 - Number(a.completedCount) / Number(a.participantCount)
      const rB = 1 - Number(b.completedCount) / Number(b.participantCount)
      return rB > rA ? b : a
    })
    const rate = Math.round((1 - Number(worst.completedCount) / Number(worst.participantCount)) * 100)
    if (rate > 40) {
      insights.push({
        icon: '⚠️',
        color: '#E53935',
        bg: '#FFEBEE',
        text: `"${worst.title}" tem ${rate}% de abandono — revisar dificuldade ou prazo pode aumentar conclusão.`,
      })
    }
  }

  // Concentração de pontos no topo
  if (ranking.length >= 3) {
    const total = ranking.reduce((s, u) => s + Number(u.totalPoints ?? 0), 0)
    const top3  = ranking.slice(0, 3).reduce((s, u) => s + Number(u.totalPoints ?? 0), 0)
    const conc  = total > 0 ? Math.round((top3 / total) * 100) : 0
    if (conc > 0) {
      insights.push({
        icon: '📊',
        color: '#9C27B0',
        bg: '#F3E5F5',
        text: `Top 3 usuários concentram ${conc}% de todos os pontos — ${conc > 70 ? 'engajamento concentrado, explorar novos usuários' : 'distribuição saudável de pontos'}.`,
      })
    }
  }

  // Matéria mais engajadora
  if (engagementMetrics?.topSubject) {
    insights.push({
      icon: '📚',
      color: '#00897B',
      bg: '#E0F2F1',
      text: `A matéria "${engagementMetrics.topSubject}" concentra o maior volume de participações no app.`,
    })
  }

  return insights
}
