import { create } from 'zustand'
import blogService from '../services/blogs'
import loginService from '../services/login'
import persistentUserService from '../services/persistentUser'

export const useUserStore = create((set) => ({
  user: null,
  initializeUser: () => {
    const user = persistentUserService.getUser()
    if (user) {
      blogService.setToken(user.token)
      set({ user })
    }
  },
  login: async (username, password) => {
    const user = await loginService.login({ username, password })
    persistentUserService.saveUser(user)
    blogService.setToken(user.token)
    set({ user })
    return user
  },
  logout: () => {
    persistentUserService.removeUser()
    set({ user: null })
  }
}))
