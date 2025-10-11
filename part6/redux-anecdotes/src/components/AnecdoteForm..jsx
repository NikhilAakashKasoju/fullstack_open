import { useDispatch } from 'react-redux'
import { useRef } from 'react'
import { createNewAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()
  const anecdoteInputRef = useRef()

  const addAnecdote = (event) => {
    event.preventDefault()
    const content = anecdoteInputRef.current.value
    if (content.trim()) {
      dispatch(createNewAnecdote(content))
      anecdoteInputRef.current.value = ''
    }
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div><input ref={anecdoteInputRef} /></div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm