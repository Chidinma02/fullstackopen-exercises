import { useField } from '../hooks'

const BlogForm = ({ createBlog }) => {
  const { reset: resetTitle, ...title } = useField('text')
  const { reset: resetAuthor, ...author } = useField('text')
  const { reset: resetUrl, ...url } = useField('url')

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({
      title: title.value,
      author: author.value,
      url: url.value
    })
    resetTitle()
    resetAuthor()
    resetUrl()
  }

  return (
    <form onSubmit={handleSubmit} className="blog-create-form">
      <div className="form-group">
        <label htmlFor="title-input">Title</label>
        <input id="title-input" {...title} placeholder="Enter blog title" required />
      </div>

      <div className="form-group">
        <label htmlFor="author-input">Author</label>
        <input id="author-input" {...author} placeholder="Enter author name" required />
      </div>

      <div className="form-group">
        <label htmlFor="url-input">URL</label>
        <input id="url-input" {...url} placeholder="https://example.com" required />
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        style={{ width: '100%', marginTop: '0.5rem' }}
      >
        Create Blog
      </button>
    </form>
  )
}

export default BlogForm
