import { createSlice } from '@reduxjs/toolkit'
import { showNotification } from './notificationReducer'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    updateAnecdote(state, action) {
      const updatedAnecdote = action.payload
      return state.map(anecdote =>
        anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote
      )
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { updateAnecdote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions

// Async action creators
export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const voteForAnecdote = (id) => {
  return async (dispatch, getState) => {
    const { anecdotes } = getState()
    const anecdoteToVote = anecdotes.find(anecdote => anecdote.id === id)
    
    if (anecdoteToVote) {
      const updatedAnecdote = {
        ...anecdoteToVote,
        votes: anecdoteToVote.votes + 1
      }
      
      const savedAnecdote = await anecdoteService.update(id, updatedAnecdote)
      dispatch(updateAnecdote(savedAnecdote))
      dispatch(showNotification(`You voted for: "${savedAnecdote.content}"`, 10))
    }
  }
}

export const createNewAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
    dispatch(showNotification(`New anecdote created: "${content}"`, 5))
  }
}

export default anecdoteSlice.reducer