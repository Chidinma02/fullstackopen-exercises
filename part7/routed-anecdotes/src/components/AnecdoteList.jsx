import { useAnecdotes } from '../hooks'

const AnecdoteList = () => {
  const { anecdotes, deleteAnecdote } = useAnecdotes()

  return (
    <div>
      <h2>Anecdotes</h2>
      <ul>
        {anecdotes.map(anecdote => (
          <li key={anecdote.id}>
            <span className="anecdote-content">{anecdote.content}</span>
            <button className="btn-danger" onClick={() => deleteAnecdote(anecdote.id)}>delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AnecdoteList
