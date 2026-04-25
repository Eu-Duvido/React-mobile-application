import { get, post, put, del } from './api'

export const createChallenge = ({ title, description, deadline, locationRequired, difficulty, subject, goalType, goalValue }) =>
  post('/challenges', { title, description, deadline, locationRequired, difficulty, subject, goalType, goalValue })

export const getChallengeById = (id) => get(`/challenges/${id}`)

export const updateChallenge = (id, data) => put(`/challenges/${id}`, data)

export const deleteChallenge = (id) => del(`/challenges/${id}`)

export const listCreatedChallenges = (creatorId) =>
  get(`/challenges/creator/${creatorId}`)

export const listChallenges = (status = null, title = null, page = 0, size = 20) => {
  const params = new URLSearchParams({ page, size })
  if (status) params.set('status', status)
  if (title) params.set('title', title)
  return get(`/challenges?${params.toString()}`)
}
