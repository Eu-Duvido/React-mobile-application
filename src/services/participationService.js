import { get, post, patch, del, postMultipart } from './api'

export const acceptChallenge = (participationId) =>
  post(`/participations/${participationId}/accept`)

export const refuseChallenge = (participationId) =>
  post(`/participations/${participationId}/refuse`)

// fileObj = { uri, type, name } — formato React Native para FormData
// mediaType, latitude e longitude vão como query params (não no body)
// para não conflitar com @RequestPart no Spring
export const submitProof = (participationId, fileObj, mediaType, latitude, longitude) => {
  const formData = new FormData()
  formData.append('file', fileObj)

  const params = new URLSearchParams({ mediaType })
  if (latitude != null) params.set('latitude', String(latitude))
  if (longitude != null) params.set('longitude', String(longitude))

  return postMultipart(
    `/participations/${participationId}/proof?${params.toString()}`,
    formData,
  )
}

// Atualiza progresso (0–100) de uma participação ACCEPTED
export const updateProgress = (participationId, progress) =>
  patch(`/participations/${participationId}/progress`, { progress })

// Listar participações do usuário — paginado, filtro opcional por status
export const listUserParticipations = async (userId, status = null, page = 0, size = 50) => {
  const statusParam = status ? `&status=${status}` : ''
  const result = await get(`/participations/user/${userId}?page=${page}&size=${size}${statusParam}`)
  return result?.content ?? []
}

// Convites recebidos pelo usuário autenticado (status=INVITED, via JWT)
export const listReceivedInvites = async (page = 0, size = 20) => {
  const result = await get(`/participations/received?page=${page}&size=${size}`)
  return result?.content ?? []
}

// Convites enviados pelo criador autenticado
export const listSentInvites = async (page = 0, size = 20) => {
  const result = await get(`/participations/sent?page=${page}&size=${size}`)
  return result?.content ?? []
}

// Criar participação diretamente (criador convida usuário específico)
export const createParticipation = ({ userId, challengeId }) =>
  post('/participations', { userId, challengeId })

// Listar participantes de um desafio, ordenados por progresso (ranking real)
export const listParticipationsByChallenge = (challengeId) =>
  get(`/participations/challenge/${challengeId}`)

export const deleteParticipation = (id) => del(`/participations/${id}`)

// Criador entra no próprio desafio — cria participation ACCEPTED se não existir
export const selfJoinChallenge = (challengeId) =>
  post(`/participations/self-join/${challengeId}`)
