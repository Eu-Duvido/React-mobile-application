// Formata números grandes: 1234567 → "1,2M"
export const fmt = (n) => {
  if (n == null) return '0'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}k`
  return String(n)
}

// KPI cards do resumo geral
export const toResumoCards = (resumoGeral) => {
  const row = resumoGeral[0]
  if (!row) return []
  return [
    { label: 'IES',           value: fmt(row.totalIes),                        icon: '🏛️', color: '#2196F3', bg: '#E3F2FD' },
    { label: 'Cursos',        value: fmt(row.totalCursos),                      icon: '📚', color: '#9C27B0', bg: '#F3E5F5' },
    { label: 'Vagas',         value: fmt(row.totalVagas),                       icon: '🎫', color: '#00897B', bg: '#E0F2F1' },
    { label: 'Ingressantes',  value: fmt(row.totalIngressantes),                icon: '🎓', color: '#FF9800', bg: '#FFF3E0' },
    { label: 'Conclusão',     value: `${row.taxaConclusaoPct ?? 0}%`,           icon: '📊', color: '#4CAF50', bg: '#E8F5E9' },
    { label: 'Via ENEM',      value: `${row.pctEnem ?? 0}%`,                   icon: '📝', color: '#E53935', bg: '#FFEBEE' },
  ]
}

// EAD vs Presencial
export const toEadData = (ead) => {
  const total = ead.reduce((s, r) => s + Number(r.totalIngressantes ?? 0), 0)
  return ead.map((r) => ({
    label:      r.modalidade,
    value:      Number(r.totalIngressantes ?? 0),
    matriculados: Number(r.totalMatriculados ?? 0),
    concluintes:  Number(r.totalConcluintes ?? 0),
    numCursos:    Number(r.numCursos ?? 0),
    pct: total > 0 ? Math.round((Number(r.totalIngressantes ?? 0) / total) * 100) : 0,
  }))
}

// Gênero: usa o ano mais recente disponível
export const toGeneroData = (genero) => {
  const row = genero[0]
  if (!row) return null
  return {
    ano:          row.nuAnoCenso,
    feminino:     Number(row.feminino ?? 0),
    masculino:    Number(row.masculino ?? 0),
    pctFeminino:  Number(row.pctFeminino ?? 0),
    pctMasculino: Number(row.pctMasculino ?? 0),
  }
}

// Raça: converte objeto único em array ordenado por valor
export const toRacaData = (raca) => {
  const row = raca[0]
  if (!row) return []
  return [
    { label: 'Branca',        value: Number(row.branca ?? 0),           pct: Number(row.pctBranca ?? 0),  color: '#90CAF9' },
    { label: 'Parda',         value: Number(row.parda ?? 0),            pct: Number(row.pctParda ?? 0),   color: '#A5D6A7' },
    { label: 'Preta',         value: Number(row.preta ?? 0),            pct: Number(row.pctPreta ?? 0),   color: '#CE93D8' },
    { label: 'Amarela',       value: Number(row.amarela ?? 0),          pct: 0,                           color: '#FFE082' },
    { label: 'Indígena',      value: Number(row.indigena ?? 0),         pct: 0,                           color: '#FFAB91' },
    { label: 'Não declarada', value: Number(row.corNaoDeclarada ?? 0),  pct: 0,                           color: '#B0BEC5' },
  ].filter((r) => r.value > 0)
}

// Faixas etárias
export const toEtariaData = (etaria) => {
  const row = etaria[0]
  if (!row) return []
  return [
    { label: '< 17',  value: Number(row.faixa017  ?? 0) },
    { label: '18-24', value: Number(row.faixa1824 ?? 0) },
    { label: '25-29', value: Number(row.faixa2529 ?? 0) },
    { label: '30-34', value: Number(row.faixa3034 ?? 0) },
    { label: '35-39', value: Number(row.faixa3539 ?? 0) },
    { label: '40-49', value: Number(row.faixa4049 ?? 0) },
    { label: '50-59', value: Number(row.faixa5059 ?? 0) },
    { label: '60+',   value: Number(row.faixa60mais ?? 0) },
  ].filter((r) => r.value > 0)
}

// Ranking por área (agrupado)
export const toRankingAreaData = (rankingArea) =>
  rankingArea.map((r) => ({
    label:     r.noAreaGeral?.replace('Área geral:', '').trim() ?? r.noAreaGeral,
    value:     Number(r.totalIngressantes ?? 0),
    pct:       Number(r.pctConclusao ?? 0),
    numCursos: Number(r.numCursos ?? 0),
    matriculados: Number(r.totalMatriculados ?? 0),
    concluintes:  Number(r.totalConcluintes ?? 0),
  }))

// Ranking por região: agrupa por região (top 3 cursos por região)
export const toRankingRegiaoData = (rankingRegiao) => {
  const map = {}
  for (const r of rankingRegiao) {
    if (!map[r.noRegiao]) map[r.noRegiao] = []
    if (map[r.noRegiao].length < 3) {
      map[r.noRegiao].push({
        curso:         r.noCurso,
        area:          r.noAreaGeral,
        ingressantes:  Number(r.totalIngressantes ?? 0),
        pctConclusao:  Number(r.pctConclusao ?? 0),
        rank:          Number(r.rankNaRegiao ?? 0),
      })
    }
  }
  return Object.entries(map).map(([regiao, cursos]) => ({ regiao, cursos }))
}

// Top IES por taxa de conclusão
export const toTaxaIesData = (taxaIes) =>
  taxaIes.map((r) => ({
    nome:           r.sgIes ?? r.noIes,
    nomeCompleto:   r.noIes,
    uf:             r.sgUf,
    regiao:         r.noRegiao,
    taxaConclusao:  Number(r.taxaConclusaoPct ?? 0),
    taxaEvasao:     Number(r.taxaEvasaoPct ?? 0),
    matriculados:   Number(r.totalMatriculados ?? 0),
  }))

// ── Insights Automáticos INEP ─────────────────────────────────────────────────

export const generateInepInsights = (resumoGeral, ead, genero, etaria, rankingArea) => {
  const insights = []
  const row = resumoGeral[0]
  if (!row) return insights

  // Faixa etária alvo
  const etariaRow = etaria[0]
  if (etariaRow) {
    const pct1824 = Number(etariaRow.pct1824 ?? 0)
    if (pct1824 > 0) {
      insights.push({
        icon: '🎯',
        color: '#2196F3',
        bg: '#E3F2FD',
        text: `${pct1824}% dos ingressantes têm 18-24 anos — o principal público-alvo do euDuvido está no centro do ensino superior.`,
      })
    }
  }

  // Oportunidade EAD
  const eadTotal  = ead.reduce((s, e) => s + Number(e.totalIngressantes ?? 0), 0)
  const eadRow    = ead.find(e => e.modalidade === 'EAD')
  if (eadRow && eadTotal > 0) {
    const pctEad  = Math.round((Number(eadRow.totalIngressantes) / eadTotal) * 100)
    insights.push({
      icon: '💻',
      color: '#9C27B0',
      bg: '#F3E5F5',
      text: `EAD representa ${pctEad}% dos ingressantes (${fmt(Number(eadRow.totalIngressantes))} estudantes) — mercado online em crescimento acelerado.`,
    })
  }

  // Perfil de gênero
  const generoRow = genero[0]
  if (generoRow) {
    const pctF   = Number(generoRow.pctFeminino ?? 0)
    const pctM   = Number(generoRow.pctMasculino ?? 0)
    const dom    = pctF >= pctM ? 'feminino' : 'masculino'
    const pctDom = Math.max(pctF, pctM)
    insights.push({
      icon: '👥',
      color: '#E91E63',
      bg: '#FCE4EC',
      text: `Público ${dom} representa ${pctDom}% dos ingressantes — estratégias de conteúdo devem considerar esta maioria.`,
    })
  }

  // Área líder
  if (rankingArea.length > 0) {
    const top     = rankingArea[0]
    const area    = top.noAreaGeral?.replace('Área geral:', '').trim() ?? top.noAreaGeral
    const pctConc = Number(top.pctConclusao ?? 0)
    insights.push({
      icon: '📚',
      color: '#00897B',
      bg: '#E0F2F1',
      text: `"${area}" lidera com ${fmt(Number(top.totalIngressantes))} ingressantes e ${pctConc}% de taxa de conclusão.`,
    })
  }

  // Taxa nacional de conclusão vs oportunidade
  if (row.taxaConclusaoPct) {
    const taxa = row.taxaConclusaoPct
    insights.push({
      icon: '📈',
      color: '#FF9800',
      bg: '#FFF3E0',
      text: `Taxa nacional de conclusão do ensino superior: ${taxa}%. Um app que aumenta engajamento pode mover este número.`,
    })
  }

  // ENEM como porta de entrada
  if (row.pctEnem > 0) {
    insights.push({
      icon: '📝',
      color: '#E53935',
      bg: '#FFEBEE',
      text: `${row.pctEnem}% dos ingressantes entraram via ENEM — jovens digitais que buscam ferramentas de apoio ao estudo.`,
    })
  }

  return insights
}
