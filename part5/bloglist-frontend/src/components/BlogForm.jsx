import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={handleSubmit} className="blog-create-form">
      <div className="form-group">
        <label htmlFor="title-input">Title</label>
        <input
          id="title-input"
          type="text"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          placeholder="Enter blog title"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="author-input">Author</label>
        <input
          id="author-input"
          type="text"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
          placeholder="Enter author name"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="url-input">URL</label>
        <input
          id="url-input"
          type="url"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
          placeholder="https://example.com"
          required
        />
      </div>

      <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
        Create Blog
      </button>
    </form>
  )
}

export default BlogForm
