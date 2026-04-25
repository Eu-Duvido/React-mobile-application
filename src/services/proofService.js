import { get, post } from './api'

export const listProofsByParticipation = (participationId) =>
  get(`/participations/${participationId}/proofs`)

export const listProofsByChallenge = (challengeId) =>
  get(`/participations/challenge/${challengeId}/proofs`)

export const approveProof = (proofId) => post(`/proofs/${proofId}/approve`)

export const rejectProof = (proofId, reason = null) =>
  post(`/proofs/${proofId}/reject`, reason ? { reason } : undefined)
