import { createContext, useReducer, useContext } from 'react'
import PropTypes from 'prop-types'

const NotificationContext = createContext()

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.payload
    case 'CLEAR_NOTIFICATION':
      return ''
    default:
      return state
  }
}

export const NotificationContextProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, '')

  return (
    <NotificationContext.Provider value={[notification, dispatch]}>
      {children}
    </NotificationContext.Provider>
  )
}

NotificationContextProvider.propTypes = {
  children: PropTypes.node.isRequired
}

// Make sure this is a proper hook (uses other hooks)
export const useNotificationValue = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotificationValue must be used within a NotificationContextProvider')
  }
  return context[0]
}

export const useNotificationDispatch = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotificationDispatch must be used within a NotificationContextProvider')
  }
  return context[1]
}

export default NotificationContext