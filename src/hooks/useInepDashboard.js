import { useState, useEffect, useCallback } from 'react'
import * as svc from '../services/inepDashboardService'

export function useInepDashboard() {
  const [resumoGeral, setResumoGeral]               = useState([])
  const [rankingRegiao, setRankingRegiao]           = useState([])
  const [rankingArea, setRankingArea]               = useState([])
  const [genero, setGenero]                         = useState([])
  const [raca, setRaca]                             = useState([])
  const [etaria, setEtaria]                         = useState([])
  const [ead, setEad]                               = useState([])
  const [taxaIes, setTaxaIes]                       = useState([])
  const [loading, setLoading]                       = useState(true)
  const [error, setError]                           = useState(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [rg, rr, ra, ge, rc, et, ev, ti] = await Promise.all([
        svc.getResumoGeral(),
        svc.getRankingCursosRegiao(),
        svc.getRankingCursosArea(),
        svc.getGeneroIngressantes(),
        svc.getRacaIngressantes(),
        svc.getEtariaIngressantes(),
        svc.getEadVsPresencial(),
        svc.getTaxaConclusaoIes(),
      ])
      setResumoGeral(rg ?? [])
      setRankingRegiao(rr ?? [])
      setRankingArea(ra ?? [])
      setGenero(ge ?? [])
      setRaca(rc ?? [])
      setEtaria(et ?? [])
      setEad(ev ?? [])
      setTaxaIes(ti ?? [])
    } catch (e) {
      setError(e.message ?? 'Erro ao carregar dados INEP')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  return {
    resumoGeral, rankingRegiao, rankingArea,
    genero, raca, etaria, ead, taxaIes,
    loading, error, refetch: fetchAll,
  }
}
