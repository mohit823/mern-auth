const AUTH_LOGOUT_EVENT = 'auth:logout'

export const notifyAuthLogout = () => {
  window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT))
}

export const subscribeToAuthLogout = (handler) => {
  window.addEventListener(AUTH_LOGOUT_EVENT, handler)

  return () => {
    window.removeEventListener(AUTH_LOGOUT_EVENT, handler)
  }
}
