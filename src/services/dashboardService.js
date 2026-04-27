import { get } from './api'

export const getRanking          = () => get('/dashboard/ranking')
export const getDailyPoints      = () => get('/dashboard/daily-points')
export const getChallengeMetrics = () => get('/dashboard/challenge-metrics')
export const getEvidenceMetrics  = () => get('/dashboard/evidence-metrics')
export const getEngagementMetrics = () => get('/dashboard/engagement')
