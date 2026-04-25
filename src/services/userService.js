import { get, post, put, del } from './api'

export const createUser = ({ name, email, password, profileImageUrl }) =>
  post('/users', { name, email, password, profileImageUrl })

// Retorna PageResponse { content, totalElements, ... } — desempacotamos .content
export const listUsers = async (page = 0, size = 50) => {
  const result = await get(`/users?page=${page}&size=${size}`)
  return result?.content ?? []
}

export const updateUser = ({ email, name, profileImageUrl }) =>
  put('/users', { email, name, profileImageUrl })

export const deleteUser = (id) => del(`/users/${id}`)
