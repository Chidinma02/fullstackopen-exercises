/* eslint-disable react-refresh/only-export-components */
import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'CLEAR':
      return ''
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, '')

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotificationValue must be used within a NotificationContextProvider')
  }
  return context[0]
}

let notificationTimeoutId = null

export const useNotify = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotify must be used within a NotificationContextProvider')
  }
  const dispatch = context[1]

  return (message, seconds = 5) => {
    dispatch({ type: 'SET', payload: message })

    if (notificationTimeoutId) {
      clearTimeout(notificationTimeoutId)
    }

    notificationTimeoutId = setTimeout(() => {
      dispatch({ type: 'CLEAR' })
      notificationTimeoutId = null
    }, seconds * 1000)
  }
}
