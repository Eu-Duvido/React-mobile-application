// Formata números grandes: 1234567 → "1,2M"
export const fmt = (n) => {
  if (n == null) return '0'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}k`
  return String(n)
}

// KPI cards do resumo geral (usa o ano mais recente)
export const toResumoCards = (resumoGeral) => {
  const row = resumoGeral[0]
  if (!row) return []
  return [
    { label: 'IES',           value: fmt(row.totalIes),          icon: '🏛️', color: '#2196F3', bg: '#E3F2FD' },
    { label: 'Cursos',        value: fmt(row.totalCursos),        icon: '📚', color: '#9C27B0', bg: '#F3E5F5' },
    { label: 'Ingressantes',  value: fmt(row.totalIngressantes),  icon: '🎓', color: '#00897B', bg: '#E0F2F1' },
    { label: 'Concluintes',   value: fmt(row.totalConcluintes),   icon: '✅', color: '#4CAF50', bg: '#E8F5E9' },
    { label: 'Conclusão',     value: `${row.taxaConclusaoPct ?? 0}%`, icon: '📊', color: '#FF9800', bg: '#FFF3E0' },
    { label: 'Via ENEM',      value: `${row.pctEnem ?? 0}%`,     icon: '📝', color: '#E53935', bg: '#FFEBEE' },
  ]
}

// EAD vs Presencial
export const toEadData = (ead) => {
  const total = ead.reduce((s, r) => s + Number(r.totalIngressantes ?? 0), 0)
  return ead.map((r) => ({
    label: r.modalidade,
    value: Number(r.totalIngressantes ?? 0),
    pct: total > 0 ? Math.round((Number(r.totalIngressantes ?? 0) / total) * 100) : 0,
    numCursos: Number(r.numCursos ?? 0),
  }))
}

// Gênero: usa o ano mais recente disponível
export const toGeneroData = (genero) => {
  const row = genero[0]
  if (!row) return null
  return {
    ano: row.nuAnoCenso,
    feminino: Number(row.feminino ?? 0),
    masculino: Number(row.masculino ?? 0),
    pctFeminino: Number(row.pctFeminino ?? 0),
    pctMasculino: Number(row.pctMasculino ?? 0),
  }
}

// Raça: converte o objeto único em array ordenado por valor
export const toRacaData = (raca) => {
  const row = raca[0]
  if (!row) return []
  return [
    { label: 'Branca',        value: Number(row.branca ?? 0),        pct: Number(row.pctBranca ?? 0),    color: '#90CAF9' },
    { label: 'Parda',         value: Number(row.parda ?? 0),         pct: Number(row.pctParda ?? 0),     color: '#A5D6A7' },
    { label: 'Preta',         value: Number(row.preta ?? 0),         pct: Number(row.pctPreta ?? 0),     color: '#CE93D8' },
    { label: 'Amarela',       value: Number(row.amarela ?? 0),       pct: 0,                             color: '#FFE082' },
    { label: 'Indígena',      value: Number(row.indigena ?? 0),      pct: 0,                             color: '#FFAB91' },
    { label: 'Não declarada', value: Number(row.corNaoDeclarada ?? 0), pct: 0,                           color: '#B0BEC5' },
  ].filter((r) => r.value > 0)
}

// Faixas etárias: converte o objeto único em array
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

// Ranking por área: já vem pronto
export const toRankingAreaData = (rankingArea) =>
  rankingArea.map((r) => ({
    label: r.noAreaGeral?.replace('Área geral:', '').trim() ?? r.noAreaGeral,
    value: Number(r.totalIngressantes ?? 0),
    pct: Number(r.pctConclusao ?? 0),
    numCursos: Number(r.numCursos ?? 0),
  }))

// Ranking por região: agrupa por região para exibir top 5 de cada
export const toRankingRegiaoData = (rankingRegiao) => {
  const map = {}
  for (const r of rankingRegiao) {
    if (!map[r.noRegiao]) map[r.noRegiao] = []
    map[r.noRegiao].push({
      curso: r.noCurso,
      area: r.noAreaGeral,
      ingressantes: Number(r.totalIngressantes ?? 0),
      pctConclusao: Number(r.pctConclusao ?? 0),
      rank: Number(r.rankNaRegiao ?? 0),
    })
  }
  return Object.entries(map).map(([regiao, cursos]) => ({ regiao, cursos }))
}

// Top IES por taxa de conclusão
export const toTaxaIesData = (taxaIes) =>
  taxaIes.map((r) => ({
    nome: r.sgIes ?? r.noIes,
    nomeCompleto: r.noIes,
    uf: r.sgUf,
    regiao: r.noRegiao,
    taxaConclusao: Number(r.taxaConclusaoPct ?? 0),
    taxaEvasao: Number(r.taxaEvasaoPct ?? 0),
    matriculados: Number(r.totalMatriculados ?? 0),
  }))
