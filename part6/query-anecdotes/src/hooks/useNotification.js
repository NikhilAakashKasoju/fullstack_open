import { useNotificationDispatch } from "../notificationContext"

export const useNotification = () => {
  const dispatch = useNotificationDispatch()

  const setNotification = (message) => {
    // Clear any existing timeout
    dispatch({ type: 'SET_NOTIFICATION', payload: message })
    
    // Clear notification after 5 seconds
    setTimeout(() => {
      dispatch({ type: 'CLEAR_NOTIFICATION' })
    }, 5000)
  }

  return setNotification
}