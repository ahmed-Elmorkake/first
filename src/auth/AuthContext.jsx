/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)
const USERS_KEY = 'aurea-users'
const SESSION_KEY = 'aurea-session'

const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => read(SESSION_KEY, null))

  useEffect(() => {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user))
    else localStorage.removeItem(SESSION_KEY)
  }, [user])

  const value = useMemo(() => ({
    user,
    signIn(email, password) {
      const account = read(USERS_KEY, []).find(item => item.email === email.toLowerCase() && item.password === password)
      if (!account) throw new Error('Incorrect email address or password.')
      const session = { name: account.name, email: account.email, role: account.role }
      setUser(session)
      return session
    },
    signUp(name, email, password) {
      const users = read(USERS_KEY, [])
      const normalizedEmail = email.toLowerCase()
      if (users.some(item => item.email === normalizedEmail)) throw new Error('An account with this email already exists.')
      const account = { name, email: normalizedEmail, password, role: 'member' }
      localStorage.setItem(USERS_KEY, JSON.stringify([...users, account]))
      const session = { name: account.name, email: account.email, role: account.role }
      setUser(session)
      return session
    },
    signOut() { setUser(null) },
    hasRole(...roles) { return Boolean(user && roles.includes(user.role)) },
  }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider.')
  return context
}
