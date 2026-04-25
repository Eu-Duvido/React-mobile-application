import { useState, useEffect, useCallback } from 'react'
import { listCreatedChallenges } from '../services/challengeService'
import { listUserParticipations } from '../services/participationService'

// Progresso baseado no tempo (para desafios criados sem campo progress)
const computeTimeProgress = (createdAt, deadline) => {
  const start = new Date(createdAt).getTime()
  const end = new Date(deadline).getTime()
  const now = Date.now()
  if (now >= end) return 1
  if (now <= start) return 0
  return (now - start) / (end - start)
}

const mapChallengeStatus = (apiStatus) => {
  switch (apiStatus) {
    case 'ACTIVE': return 'active'
    case 'PENDING': return 'active'  // PENDING = criado mas aguardando — aparece em Ativos
    case 'COMPLETED': return 'completed'
    case 'EXPIRED': return 'defeated'
    default: return 'active'
  }
}

const mapParticipationStatus = (apiStatus) => {
  switch (apiStatus) {
    case 'INVITED': return 'pending'
    case 'ACCEPTED': return 'active'
    case 'COMPLETED': return 'completed'
    case 'REFUSED': return 'defeated'
    default: return 'pending'
  }
}

// ChallengeResponse agora tem: difficulty (EASY|MEDIUM|HARD), subject, goalType, goalValue
const normalizeCreated = (challenge) => ({
  id: challenge.id,
  participationId: null,
  title: challenge.title,
  subtitle: challenge.description,
  // Para desafios criados, não há campo progress — usamos tempo
  progress: computeTimeProgress(challenge.createdAt, challenge.deadline),
  deadline: challenge.deadline,
  createdAt: challenge.createdAt,
  locationRequired: challenge.locationRequired,
  difficulty: challenge.difficulty,     // EASY | MEDIUM | HARD
  subject: challenge.subject,
  goalType: challenge.goalType,
  goalValue: challenge.goalValue,
  creatorId: challenge.creator.id,
  creatorName: challenge.creator.name,
  isCreator: true,
  participationStatus: null,
  challengeStatus: challenge.status,
  status: mapChallengeStatus(challenge.status),
})

// ChallengeParticipationResponse agora tem: progress (Integer 0..goalValue), sem createdAt
const normalizeReceived = (participation) => {
  const challenge = participation.challenge
  const goalValue = challenge.goalValue || 100
  const progress = participation.progress != null
    ? participation.progress / goalValue
    : computeTimeProgress(challenge.createdAt, challenge.deadline)

  return {
    id: challenge.id,
    participationId: participation.id,
    title: challenge.title,
    subtitle: challenge.description,
    progress,
    deadline: challenge.deadline,
    createdAt: challenge.createdAt,
    locationRequired: challenge.locationRequired,
    difficulty: challenge.difficulty,
    subject: challenge.subject,
    goalType: challenge.goalType,
    goalValue: challenge.goalValue,
    creatorId: challenge.creator.id,
    creatorName: challenge.creator.name,
    isCreator: false,
    participationStatus: participation.status,
    challengeStatus: challenge.status,
    status: mapParticipationStatus(participation.status),
  }
}

export function useChallenges(userId) {
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchAll = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    setError(null)
    try {
      // listCreatedChallenges retorna List (não paginado)
      // listUserParticipations retorna array já desempacotado do PageResponse
      const [created, received] = await Promise.all([
        listCreatedChallenges(userId),
        listUserParticipations(userId),
      ])

      const normalizedCreated = created.map(normalizeCreated)
      const createdIds = new Set(normalizedCreated.map((c) => c.id))

      // Mapa de challengeId → participation para participações recebidas
      const receivedByChallenge = {}
      received.forEach((p) => { receivedByChallenge[p.challenge.id] = p })

      // Para desafios criados, preenche participationId/status/progress se o criador também é participante
      const mergedCreated = normalizedCreated.map((c) => {
        const ownParticipation = receivedByChallenge[c.id]
        if (ownParticipation) {
          const goalValue = c.goalValue || 100
          const realProgress = ownParticipation.progress != null
            ? ownParticipation.progress / goalValue
            : c.progress
          return {
            ...c,
            participationId: ownParticipation.id,
            participationStatus: ownParticipation.status,
            progress: realProgress,
          }
        }
        return c
      })

      // Exclui desafios criados da lista de recebidos para não duplicar
      const normalizedReceived = received
        .filter((p) => !createdIds.has(p.challenge.id))
        .map(normalizeReceived)

      setChallenges([...mergedCreated, ...normalizedReceived])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => { fetchAll() }, [fetchAll])

  return { challenges, loading, error, refetch: fetchAll }
}
