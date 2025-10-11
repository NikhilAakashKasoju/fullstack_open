import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { getAnecdotes, updateAnecdote } from './services/anecdotes'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotification } from './hooks/useNotification'

const App = () => {
  const queryClient = useQueryClient()
  const setNotification = useNotification()

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1
  })

  const voteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      // Update the cache with the voted anecdote
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      const updatedAnecdotes = anecdotes.map(anecdote =>
        anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote
      )
      queryClient.setQueryData(['anecdotes'], updatedAnecdotes)
      
      // Show notification
      setNotification(`You voted for: "${updatedAnecdote.content}"`)
    }
  })

  const handleVote = (anecdote) => {
    const votedAnecdote = {
      ...anecdote,
      votes: anecdote.votes + 1
    }
    voteMutation.mutate(votedAnecdote)
  }

  if (result.isLoading) {
    return <div>Loading anecdotes...</div>
  }

  if (result.isError) {
    return (
      <div>
        <h3>Anecdote service not available due to problems in server on localhost</h3>
        <p>Error: {result.error.message}</p>
      </div>
    )
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App