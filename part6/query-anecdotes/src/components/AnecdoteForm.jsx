import { useCreateAnecdoteMutation } from '../hooks/useAnecdoteQuery'
import { useNotify } from '../NotificationContext'

const AnecdoteForm = () => {
  const createMutation = useCreateAnecdoteMutation()
  const notify = useNotify()

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.reset()
    
    createMutation.mutate(
      { content, votes: 0 },
      {
        onSuccess: () => {
          notify(`anecdote '${content}' created`)
        },
        onError: (error) => {
          notify(error.message)
        },
      }
    )
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm