import { get, post } from './api'

export const getAiInsights = () => get('/insights')

export const gerarAiInsights = (curso = 'Administração', regiao = 'Sudeste', modalidade = 1, areaGeral = '') =>
  post(
    `/insights/gerar?curso=${encodeURIComponent(curso)}&regiao=${encodeURIComponent(regiao)}&modalidade=${modalidade}&areaGeral=${encodeURIComponent(areaGeral)}`
  )
