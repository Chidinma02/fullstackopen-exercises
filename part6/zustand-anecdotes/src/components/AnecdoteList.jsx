import { useAnecdotes, useFilter, useAnecdoteActions } from '../store'
import { useNotificationActions } from '../notificationStore'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const filter = useFilter()
  const { vote, deleteAnecdote } = useAnecdoteActions()
  const { showNotification } = useNotificationActions()

  const filteredAnecdotes = anecdotes.filter((a) =>
    a.content.toLowerCase().includes(filter.toLowerCase())
  )

  const sortedAnecdotes = filteredAnecdotes.toSorted((a, b) => b.votes - a.votes)

  const handleVote = (anecdote) => {
    vote(anecdote.id)
    showNotification(`you voted '${anecdote.content}'`, 5)
  }

  const handleDelete = (anecdote) => {
    deleteAnecdote(anecdote.id)
    showNotification(`deleted anecdote '${anecdote.content}'`, 5)
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      {sortedAnecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
            {anecdote.votes === 0 && (
              <button onClick={() => handleDelete(anecdote)}>delete</button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
