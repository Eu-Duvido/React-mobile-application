import { useState, useEffect, useCallback } from 'react'
import * as appSvc  from '../services/dashboardService'
import * as inepSvc from '../services/inepDashboardService'
import { getAiInsights, gerarAiInsights } from '../services/aiInsightsService'

const NIVEL_CONFIG = {
  alto:  { color: '#4CAF50', bg: '#E8F5E9', icon: '📈' },
  medio: { color: '#2196F3', bg: '#E3F2FD', icon: '💡' },
  baixo: { color: '#FF9800', bg: '#FFF3E0', icon: '⚠️' },
}

const TIPO_CONFIG = {
  tendencia:    { icon: '📊', color: '#9C27B0', bg: '#F3E5F5' },
  oportunidade: { icon: '🎯', color: '#00897B', bg: '#E0F2F1' },
  alerta:       { icon: '🚨', color: '#E53935', bg: '#FFEBEE' },
  engajamento:  { icon: '👥', color: '#E91E63', bg: '#FCE4EC' },
  mercado:      { icon: '🏢', color: '#FF9800', bg: '#FFF3E0' },
}

function mapAiInsight(ins) {
  const nivel = NIVEL_CONFIG[ins.nivel] ?? NIVEL_CONFIG.medio
  const tipo  = TIPO_CONFIG[(ins.tipo ?? '').toLowerCase()] ?? {}
  return {
    icon:  tipo.icon  ?? nivel.icon,
    color: tipo.color ?? nivel.color,
    bg:    tipo.bg    ?? nivel.bg,
    label: ins.titulo,
    text:  ins.descricao || ins.interpretacao || '',
  }
}

export function useUnifiedDashboard() {
  const [data, setData]         = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [aiInsights, setAiInsights] = useState(null)
  const [loadingAi, setLoadingAi]   = useState(false)

  const fetchAiInsights = useCallback(async () => {
    setLoadingAi(true)
    try {
      // Backend retorna array direto de AiInsightEntity
      let raw = await getAiInsights()
      if (!raw || raw.length === 0) {
        raw = await gerarAiInsights()
      }
      const insights = (raw ?? []).map(mapAiInsight)
      setAiInsights(insights.length > 0 ? insights : null)
    } catch {
      setAiInsights(null)
    } finally {
      setLoadingAi(false)
    }
  }, [])

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [
        ranking, dailyPoints, challengeMetrics, evidenceMetrics, engagementMetrics,
        resumoGeral, genero, etaria, ead, rankingArea,
      ] = await Promise.all([
        appSvc.getRanking(),
        appSvc.getDailyPoints(),
        appSvc.getChallengeMetrics(),
        appSvc.getEvidenceMetrics(),
        appSvc.getEngagementMetrics(),
        inepSvc.getResumoGeral(),
        inepSvc.getGeneroIngressantes(),
        inepSvc.getEtariaIngressantes(),
        inepSvc.getEadVsPresencial(),
        inepSvc.getRankingCursosArea(),
      ])

      setData({
        // App data
        ranking:           ranking           ?? [],
        dailyPoints:       dailyPoints       ?? [],
        challengeMetrics:  challengeMetrics  ?? [],
        evidenceMetrics:   evidenceMetrics   ?? null,
        engagementMetrics: engagementMetrics ?? null,
        // INEP data (only what matters for product intelligence)
        resumoGeral:  resumoGeral  ?? [],
        genero:       genero       ?? [],
        etaria:       etaria       ?? [],
        ead:          ead          ?? [],
        rankingArea:  rankingArea  ?? [],
      })
    } catch (e) {
      setError(e.message ?? 'Erro ao carregar dashboard')
    } finally {
      setLoading(false)
    }
  }, [])

  const refetch = useCallback(() => {
    fetchAll()
    fetchAiInsights()
  }, [fetchAll, fetchAiInsights])

  useEffect(() => {
    fetchAll()
    fetchAiInsights()
  }, [fetchAll, fetchAiInsights])

  return { data, loading, error, aiInsights, loadingAi, refetch }
}
