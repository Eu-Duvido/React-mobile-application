import { post } from './api'

// POST /api/v1/auth/login → { token, expiresAt, user }
export const loginApi = ({ email, password }) =>
  post('/auth/login', { email, password })
