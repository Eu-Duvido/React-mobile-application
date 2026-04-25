import React, { createContext, useContext, useState } from 'react'
import { setToken, clearToken } from '../services/api'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setTokenState] = useState(null)

  // Chamado após login bem-sucedido com user + token JWT
  const login = (userData, jwtToken) => {
    setUser(userData)
    setTokenState(jwtToken)
    setToken(jwtToken) // injeta no módulo de API imediatamente
  }

  const logout = () => {
    setUser(null)
    setTokenState(null)
    clearToken()
  }

  return (
    <UserContext.Provider value={{ user, token, login, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUserContext = () => {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUserContext deve ser usado dentro de UserProvider')
  return ctx
}
