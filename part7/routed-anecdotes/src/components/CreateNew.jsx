import { useNavigate } from 'react-router-dom'
import { useField, useAnecdotes } from '../hooks'

const CreateNew = () => {
  const { addAnecdote } = useAnecdotes()
  const { reset: resetContent, ...content } = useField('text')
  const { reset: resetAuthor, ...author } = useField('text')
  const { reset: resetInfo, ...info } = useField('text')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    addAnecdote({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    })
    navigate('/')
  }

  const handleReset = (e) => {
    e.preventDefault()
    resetContent()
    resetAuthor()
    resetInfo()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>content</label>
          <input name='content' {...content} required />
        </div>
        <div className="form-group">
          <label>author</label>
          <input name='author' {...author} required />
        </div>
        <div className="form-group">
          <label>url for more info</label>
          <input name='info' {...info} required />
        </div>
        <div className="form-buttons">
          <button type="submit">create</button>
          <button type="button" onClick={handleReset}>reset</button>
        </div>
      </form>
    </div>
  )
}

export default CreateNew

