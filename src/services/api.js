import { API_BASE_URL } from '../config/api.config'

// Token JWT injetado em todas as requisições após login
let authToken = null

export const setToken = (token) => { authToken = token }
export const clearToken = () => { authToken = null }

// Monta headers base com Authorization quando token disponível
const buildHeaders = (extra = {}) => {
  const headers = { ...extra }
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`
  return headers
}

const request = async (method, path, body) => {
  const options = {
    method,
    headers: buildHeaders({ 'Content-Type': 'application/json' }),
  }
  if (body !== undefined) options.body = JSON.stringify(body)

  const response = await fetch(`${API_BASE_URL}${path}`, options)

  if (response.status === 204) return null

  const text = await response.text()
  const data = text ? JSON.parse(text) : null

  if (!response.ok) {
    throw new Error(data?.message || `Erro ${response.status}`)
  }

  return data
}

// Requisições multipart/form-data — usa XHR em vez de fetch pois o fetch
// do React Native não envia FormData com arquivo de forma confiável
const multipartRequest = (method, path, formData) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(method, `${API_BASE_URL}${path}`)
    if (authToken) xhr.setRequestHeader('Authorization', `Bearer ${authToken}`)

    xhr.onload = () => {
      if (xhr.status === 204) { resolve(null); return }
      try {
        const data = xhr.responseText ? JSON.parse(xhr.responseText) : null
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(data)
        } else {
          reject(new Error(data?.message || `Erro ${xhr.status}`))
        }
      } catch {
        reject(new Error('Erro ao processar resposta do servidor'))
      }
    }
    xhr.onerror = () => reject(new Error('Erro de conexão com o servidor'))
    xhr.send(formData)
  })

export const get = (path) => request('GET', path)
export const post = (path, body) => request('POST', path, body)
export const patch = (path, body) => request('PATCH', path, body)
export const put = (path, body) => request('PUT', path, body)
export const del = (path) => request('DELETE', path)
export const postMultipart = (path, formData) => multipartRequest('POST', path, formData)
