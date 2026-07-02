const TOKEN_KEY = 'token'
const USER_KEY = 'user'

export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const getToken = () => localStorage.getItem(TOKEN_KEY)

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY)
}

export const saveUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export const getUser = () => {
  try {
    const storedUser = localStorage.getItem(USER_KEY)
    return storedUser ? JSON.parse(storedUser) : null
  } catch {
    localStorage.removeItem(USER_KEY)
    return null
  }
}

export const removeUser = () => {
  localStorage.removeItem(USER_KEY)
}

export const clearAuthStorage = () => {
  removeToken()
  removeUser()
}
