import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,  setUser]  = useState(() => JSON.parse(localStorage.getItem('1g_user')  || 'null'))
  const [token, setToken] = useState(() => localStorage.getItem('1g_token') || null)

  const login = (userData, tokenData) => {
    setUser(userData); setToken(tokenData)
    localStorage.setItem('1g_user',  JSON.stringify(userData))
    localStorage.setItem('1g_token', tokenData)
  }

  const logout = () => {
    setUser(null); setToken(null)
    localStorage.removeItem('1g_user')
    localStorage.removeItem('1g_token')
  }

  // liked properties stored locally per user
  const getLiked = () => JSON.parse(localStorage.getItem(`1g_liked_${user?._id}`) || '[]')
  const toggleLike = (prop) => {
    const liked = getLiked()
    const exists = liked.find(p => p._id === prop._id)
    const updated = exists ? liked.filter(p => p._id !== prop._id) : [...liked, prop]
    localStorage.setItem(`1g_liked_${user?._id}`, JSON.stringify(updated))
    return !exists
  }
  const isLiked = (id) => getLiked().some(p => p._id === id)

  // contacted properties stored locally
  const getContacted = () => JSON.parse(localStorage.getItem(`1g_contacted_${user?._id}`) || '[]')
  const addContacted = (prop) => {
    const list = getContacted()
    if (!list.find(p => p._id === prop._id)) {
      localStorage.setItem(`1g_contacted_${user?._id}`, JSON.stringify([...list, prop]))
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, getLiked, toggleLike, isLiked, getContacted, addContacted }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
