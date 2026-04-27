import { useState, useEffect, useCallback } from 'react'
import * as appSvc  from '../services/dashboardService'
import * as inepSvc from '../services/inepDashboardService'

export function useUnifiedDashboard() {
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

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

  useEffect(() => { fetchAll() }, [fetchAll])

  return { data, loading, error, refetch: fetchAll }
}
