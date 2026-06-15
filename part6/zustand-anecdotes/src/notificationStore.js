import { create } from 'zustand'

const useNotificationStore = create((set) => ({
  message: '',
  timeoutId: null,
  actions: {
    showNotification: (message, seconds = 5) => {
      const existingTimeout = useNotificationStore.getState().timeoutId
      if (existingTimeout) {
        clearTimeout(existingTimeout)
      }

      const timeoutId = setTimeout(() => {
        set({ message: '', timeoutId: null })
      }, seconds * 1000)

      set({ message, timeoutId })
    },
    clearNotification: () => {
      const existingTimeout = useNotificationStore.getState().timeoutId
      if (existingTimeout) {
        clearTimeout(existingTimeout)
      }
      set({ message: '', timeoutId: null })
    },
  },
}))

export const useNotificationMessage = () => useNotificationStore((state) => state.message)
export const useNotificationActions = () => useNotificationStore((state) => state.actions)
export default useNotificationStore
