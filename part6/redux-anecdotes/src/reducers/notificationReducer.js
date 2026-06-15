import { createSlice } from '@reduxjs/toolkit'

let timeoutId = null

const notificationSlice = createSlice({
  name: 'notification',
  initialState: 'initial notification message',
  reducers: {
    updateNotification(state, action) {
      return action.payload
    },
    clearNotification() {
      return ''
    },
  },
})

export const { updateNotification, clearNotification } = notificationSlice.actions

export const setNotification = (message, seconds = 5) => {
  return (dispatch) => {
    dispatch(updateNotification(message))
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      dispatch(clearNotification())
      timeoutId = null
    }, seconds * 1000)
  }
}

export default notificationSlice.reducer
