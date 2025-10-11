import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    clearNotification(state, action) {
      return ''
    }
  }
})

export const { setNotification, clearNotification } = notificationSlice.actions

// Improved action creator that handles timeout automatically
export const showNotification = (message, duration = 5) => {
  return async (dispatch) => {
    dispatch(setNotification(message))
    
    // Convert seconds to milliseconds for setTimeout
    const timeoutInMs = duration * 1000
    
    setTimeout(() => {
      dispatch(clearNotification())
    }, timeoutInMs)
  }
}

export default notificationSlice.reducer