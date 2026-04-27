// ── Utils ─────────────────────────────────────────────────────────────────────

export const fmt = (n) => {
  if (n == null) return '0'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}k`
  return String(n)
}

const pct = (a, b) => (b > 0 ? Math.round((a / b) * 100) : 0)

// ── Seção 1: KPIs do Panorama ─────────────────────────────────────────────────
// Máximo 4 KPIs. Cada um responde uma pergunta específica.

export const toPanoramaKPIs = (challengeMetrics, evidenceMetrics, engagementMetrics, resumoGeral) => {
  const totalPart   = challengeMetrics.reduce((s, c) => s + Number(c.participantCount ?? 0), 0)
  const totalDone   = challengeMetrics.reduce((s, c) => s + Number(c.completedCount    ?? 0), 0)
  const completion  = pct(totalDone, totalPart)
  const activeUsers = engagementMetrics?.activeUsers ?? 0
  const retention   = engagementMetrics?.retentionRate ?? 0
  const approval    = Math.round(Number(evidenceMetrics?.approvalRate ?? 0))
  const ingressantes = Number(resumoGeral[0]?.totalIngressantes ?? 0)

  return [
    {
      key:      'users',
      label:    'Usuários Ativos',
      value:    activeUsers,
      sublabel: retention > 0 ? `${retention}% dos cadastrados` : 'com ao menos 1 ponto',
      color:    '#2196F3',
      bg:       '#E3F2FD',
      icon:     '👥',
    },
    {
      key:      'completion',
      label:    'Taxa de Conclusão',
      value:    `${completion}%`,
      sublabel: `${totalDone} de ${totalPart} participações`,
      color:    '#4CAF50',
      bg:       '#E8F5E9',
      icon:     '✅',
    },
    {
      key:      'approval',
      label:    'Aprovação',
      value:    `${approval}%`,
      sublabel: `${evidenceMetrics?.approvedCount ?? 0} evidências ok`,
      color:    '#9C27B0',
      bg:       '#F3E5F5',
      icon:     '📤',
    },
    {
      key:      'market',
      label:    'Mercado BR',
      value:    fmt(ingressantes),
      sublabel: ingressantes > 0 ? 'ingressantes no ensino superior' : 'dado INEP não carregado',
      color:    '#FF9800',
      bg:       '#FFF3E0',
      icon:     '🎓',
    },
  ]
}

// ── Seção 2: Perfil da Audiência ──────────────────────────────────────────────
// Combina dados INEP para descrever o público-alvo do produto.

export const toAudienceProfile = (genero, etaria, ead) => {
  // Faixa etária dominante
  const etRow   = etaria[0]
  const pct1824 = etRow ? Number(etRow.pct1824 ?? 0) : null

  const etariaItems = etRow ? [
    { label: '< 17',  value: Number(etRow.faixa017  ?? 0) },
    { label: '18-24', value: Number(etRow.faixa1824 ?? 0) },
    { label: '25-29', value: Number(etRow.faixa2529 ?? 0) },
    { label: '30-34', value: Number(etRow.faixa3034 ?? 0) },
    { label: '35-39', value: Number(etRow.faixa3539 ?? 0) },
    { label: '40-49', value: Number(etRow.faixa4049 ?? 0) },
    { label: '50+',   value: Number(etRow.faixa5059 ?? 0) + Number(etRow.faixa60mais ?? 0) },
  ].filter(r => r.value > 0) : []

  // Gênero
  const genRow    = genero[0]
  const pctFem    = genRow ? Number(genRow.pctFeminino  ?? 0) : null
  const pctMasc   = genRow ? Number(genRow.pctMasculino ?? 0) : null
  const genderDom = pctFem != null && pctFem > (pctMasc ?? 0) ? 'Feminino' : 'Masculino'
  const genderPct = pctFem != null ? Math.max(pctFem, pctMasc ?? 0) : null

  // Modalidade
  const totalEad  = ead.reduce((s, r) => s + Number(r.totalIngressantes ?? 0), 0)
  const eadRow    = ead.find(r => r.modalidade === 'EAD')
  const pctEad    = eadRow && totalEad > 0 ? Math.round((Number(eadRow.totalIngressantes) / totalEad) * 100) : null
  const pctPres   = pctEad != null ? 100 - pctEad : null

  return { pct1824, etariaItems, pctFem, pctMasc, genderDom, genderPct, pctEad, pctPres, hasData: etRow != null || genRow != null || eadRow != null }
}

// ── Seção 3: Inteligência de Desafios ────────────────────────────────────────
// Poucas métricas, muito contexto.

export const toChallengeIntelligence = (challengeMetrics) => {
  const withPart = challengeMetrics.filter(c => Number(c.participantCount) > 0)
  if (!withPart.length) return null

  const totalPart    = withPart.reduce((s, c) => s + Number(c.participantCount ?? 0), 0)
  const totalDone    = withPart.reduce((s, c) => s + Number(c.completedCount   ?? 0), 0)
  const totalInProg  = withPart.reduce((s, c) => s + Number(c.inProgressCount  ?? 0), 0)
  const totalProofs  = withPart.reduce((s, c) => s + Number(c.totalProofs      ?? 0), 0)
  const approvedPrf  = withPart.reduce((s, c) => s + Number(c.approvedProofs   ?? 0), 0)

  const globalCompletion  = pct(totalDone, totalPart)
  const globalInProgress  = pct(totalInProg, totalPart)
  const globalAbandonment = Math.max(0, 100 - globalCompletion - globalInProgress)
  const avgEvidences      = totalPart > 0 ? +(totalProofs / totalPart).toFixed(1) : 0
  const evidenceQuality   = totalProofs > 0 ? pct(approvedPrf, totalProofs) : 0

  // Top desafio (melhor taxa de conclusão com pelo menos 2 participantes)
  const ranked = [...withPart]
    .filter(c => Number(c.participantCount) >= 2)
    .map(c => ({ ...c, cr: pct(Number(c.completedCount), Number(c.participantCount)) }))
    .sort((a, b) => b.cr - a.cr)

  const topChallenge  = ranked[0]  ?? null
  const worstChallenge = ranked.length > 1
    ? [...ranked].sort((a, b) => a.cr - b.cr)[0]
    : null

  const worstRate = worstChallenge
    ? 100 - pct(Number(worstChallenge.completedCount), Number(worstChallenge.participantCount))
    : 0

  return {
    globalCompletion,
    globalInProgress,
    globalAbandonment,
    avgEvidences,
    evidenceQuality,
    topChallenge:   topChallenge ? {
      title:          topChallenge.title,
      completionRate: topChallenge.cr,
      participants:   Number(topChallenge.participantCount),
      avgProofs:      Number(topChallenge.participantCount) > 0
        ? +(Number(topChallenge.totalProofs) / Number(topChallenge.participantCount)).toFixed(1)
        : 0,
    } : null,
    worstChallenge: worstChallenge && worstRate > 40 ? {
      title:         worstChallenge.title,
      abandonRate:   worstRate,
      participants:  Number(worstChallenge.participantCount),
    } : null,
    total: withPart.length,
  }
}

// ── Seção 4: Ranking & Engajamento ────────────────────────────────────────────

export const toRankingData = (ranking) =>
  ranking.slice(0, 5).map(u => ({
    name:     u.username ?? 'Usuário',
    points:   Number(u.totalPoints ?? 0),
    position: Number(u.rankingPosition ?? 0),
  }))

export const toPointsEvolution = (dailyPoints) => {
  const byDate = dailyPoints.reduce((acc, dp) => {
    acc[dp.date] = (acc[dp.date] ?? 0) + Number(dp.points ?? 0)
    return acc
  }, {})
  return Object.entries(byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-7)
    .map(([date, points]) => {
      const d   = new Date(date)
      const day = d.toLocaleDateString('pt-BR', { weekday: 'short' })
      return { day: day.charAt(0).toUpperCase() + day.slice(1).replace('.', ''), points, date }
    })
}

export const toConsistency = (dailyPoints) => {
  const byUser = {}
  for (const dp of dailyPoints) {
    if (!byUser[dp.userId]) byUser[dp.userId] = new Set()
    byUser[dp.userId].add(dp.date)
  }
  let consistent = 0, moderate = 0, oneTime = 0
  for (const dates of Object.values(byUser)) {
    if (dates.size >= 3)       consistent++
    else if (dates.size >= 2)  moderate++
    else                       oneTime++
  }
  return { consistent, moderate, oneTime, total: Object.keys(byUser).length }
}

// ── Seção 5: Insights Inteligentes ───────────────────────────────────────────
// Gerados dos dados reais. Cruzam contexto INEP com comportamento do app.

export const generateInsights = (
  challengeMetrics, evidenceMetrics, engagementMetrics,
  ranking, dailyPoints, resumoGeral, genero, etaria, ead
) => {
  const insights = []

  // ── INEP × App ──────────────────────────────────────────────────────────────

  // Faixa etária do público-alvo
  const etRow   = etaria[0]
  const pct1824 = etRow ? Math.round(Number(etRow.pct1824 ?? 0)) : null
  if (pct1824 && pct1824 > 0) {
    insights.push({
      icon: '🎯',
      color: '#2196F3',
      bg: '#E3F2FD',
      label: 'Público-alvo confirmado',
      text: `${pct1824}% dos ingressantes brasileiros têm 18–24 anos — exatamente a faixa que o euDuvido deve capturar e reter.`,
    })
  }

  // EAD como canal estratégico
  const eadTotal = ead.reduce((s, r) => s + Number(r.totalIngressantes ?? 0), 0)
  const eadRow   = ead.find(r => r.modalidade === 'EAD')
  if (eadRow && eadTotal > 0) {
    const pEad = Math.round((Number(eadRow.totalIngressantes) / eadTotal) * 100)
    insights.push({
      icon: '💻',
      color: '#9C27B0',
      bg: '#F3E5F5',
      label: 'Canal EAD estratégico',
      text: `EAD representa ${pEad}% dos ingressantes (${fmt(Number(eadRow.totalIngressantes))} estudantes online). Usuários remotos são potencialmente mais engajáveis por apps.`,
    })
  }

  // ── Comportamento do App ─────────────────────────────────────────────────────

  // Retenção
  const retention = engagementMetrics?.retentionRate
  if (retention != null && retention > 0) {
    const qual = retention >= 60 ? 'forte' : retention >= 30 ? 'moderada' : 'baixa'
    insights.push({
      icon: '🔁',
      color: '#4CAF50',
      bg: '#E8F5E9',
      label: 'Taxa de retenção',
      text: `${retention}% dos usuários cadastrados participaram ativamente — retenção ${qual}. ${retention < 40 ? 'Explorar notificações e desafios recorrentes pode aumentar este número.' : 'Manter este ritmo com desafios variados.'}`,
    })
  }

  // Aprovação de evidências
  const approvalRate = Math.round(Number(evidenceMetrics?.approvalRate ?? 0))
  if (approvalRate > 0) {
    const qual = approvalRate >= 80 ? 'excelente' : approvalRate >= 50 ? 'moderada' : 'baixa'
    insights.push({
      icon: '✅',
      color: '#00897B',
      bg: '#E0F2F1',
      label: 'Qualidade de participação',
      text: `${approvalRate}% das evidências enviadas são aprovadas — qualidade ${qual}. ${approvalRate < 60 ? 'Melhorar o guia de envio pode reduzir rejeições.' : 'Usuários compreendem bem os critérios de aprovação.'}`,
    })
  }

  // Desafio mais engajador
  const withPart = challengeMetrics.filter(c => Number(c.participantCount) >= 2)
  if (withPart.length > 0) {
    const top = withPart.reduce((a, b) =>
      Number(b.participantCount) > Number(a.participantCount) ? b : a
    )
    const cr = pct(Number(top.completedCount), Number(top.participantCount))
    insights.push({
      icon: '🏆',
      color: '#FF9800',
      bg: '#FFF3E0',
      label: 'Desafio mais engajador',
      text: `"${top.title}" lidera com ${top.participantCount} participantes e ${cr}% de conclusão. Replicar o formato deste desafio pode ampliar o engajamento geral.`,
    })
  }

  // Concentração de pontos
  if (ranking.length >= 3) {
    const totalPts = ranking.reduce((s, u) => s + Number(u.totalPoints ?? 0), 0)
    const top3Pts  = ranking.slice(0, 3).reduce((s, u) => s + Number(u.totalPoints ?? 0), 0)
    const conc     = pct(top3Pts, totalPts)
    if (conc > 0) {
      insights.push({
        icon: '📊',
        color: '#E53935',
        bg: '#FFEBEE',
        label: 'Distribuição de pontos',
        text: `Top 3 usuários concentram ${conc}% dos pontos. ${conc > 70 ? 'Alta concentração: criar desafios para usuários intermediários pode democratizar o engajamento.' : 'Distribuição saudável — engajamento bem distribuído.'}`,
      })
    }
  }

  // Consistência de usuários
  const cons = toConsistency(dailyPoints)
  if (cons.total > 0) {
    const pctConsistent = pct(cons.consistent, cons.total)
    if (pctConsistent > 0) {
      insights.push({
        icon: '🔥',
        color: '#FF5722',
        bg: '#FBE9E7',
        label: 'Usuários consistentes',
        text: `${pctConsistent}% dos usuários estiveram ativos 3+ dias — estes são os usuários com maior probabilidade de retenção a longo prazo.`,
      })
    }
  }

  return insights
}
