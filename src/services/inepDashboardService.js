import { get } from './api'

export const getResumoGeral        = () => get('/inep/resumo-geral')
export const getRankingCursosRegiao = () => get('/inep/ranking-cursos-regiao')
export const getRankingCursosArea   = () => get('/inep/ranking-cursos-area')
export const getGeneroIngressantes  = () => get('/inep/genero-ingressantes')
export const getRacaIngressantes    = () => get('/inep/raca-ingressantes')
export const getEtariaIngressantes  = () => get('/inep/etaria-ingressantes')
export const getEadVsPresencial     = () => get('/inep/ead-vs-presencial')
export const getTaxaConclusaoIes    = () => get('/inep/taxa-conclusao-ies')
