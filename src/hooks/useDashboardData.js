import { useState, useEffect, useCallback } from 'react'
import * as dashboardService from '../services/dashboardService'

export function useDashboardData() {
  const [ranking, setRanking]                   = useState([])
  const [dailyPoints, setDailyPoints]           = useState([])
  const [challengeMetrics, setChallengeMetrics] = useState([])
  const [evidenceMetrics, setEvidenceMetrics]   = useState(null)
  const [engagementMetrics, setEngagementMetrics] = useState(null)
  const [loading, setLoading]                   = useState(true)
  const [error, setError]                       = useState(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [rank, daily, challenges, evidence, engagement] = await Promise.all([
        dashboardService.getRanking(),
        dashboardService.getDailyPoints(),
        dashboardService.getChallengeMetrics(),
        dashboardService.getEvidenceMetrics(),
        dashboardService.getEngagementMetrics(),
      ])
      setRanking(rank ?? [])
      setDailyPoints(daily ?? [])
      setChallengeMetrics(challenges ?? [])
      setEvidenceMetrics(evidence ?? null)
      setEngagementMetrics(engagement ?? null)
    } catch (e) {
      setError(e.message ?? 'Erro ao carregar dados do dashboard')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  return {
    ranking,
    dailyPoints,
    challengeMetrics,
    evidenceMetrics,
    engagementMetrics,
    loading,
    error,
    refetch: fetchAll,
  }
}
