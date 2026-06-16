import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useBlogStore } from '../stores/blogStore'
import { useUserStore } from '../stores/userStore'
import { useNotificationStore } from '../stores/notificationStore'

const Blog = ({
  blog: propBlog,
  handleLike: propHandleLike,
  handleDelete: propHandleDelete,
  currentUser: propUser
}) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [commentText, setCommentText] = useState('')

  const { blogs, likeBlog, deleteBlog, addComment } = useBlogStore()
  const { user: storeUser } = useUserStore()
  const { showNotification } = useNotificationStore()

  const blog = propBlog || blogs.find((b) => b.id === id)
  const user = propUser !== undefined ? propUser : storeUser
  const handleLike = propHandleLike || likeBlog
  const handleDelete = propHandleDelete || deleteBlog

  if (!blog) {
    return (
      <div className="glass-panel">
        <p>Blog not found</p>
      </div>
    )
  }

  const isCreator = blog.user && user && blog.user.username === user.username
  const isAuthenticated = user !== null

  const handleLikeClick = async () => {
    try {
      await handleLike(blog)
      showNotification(`Liked "${blog.title}"!`, 'success')
    } catch (error) {
      console.error(error)
      showNotification('Failed to like blog post', 'error')
    }
  }

  const handleDeleteClick = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await handleDelete(blog)
        showNotification(`Blog ${blog.title} removed successfully`, 'success')
        if (navigate) navigate('/')
      } catch (error) {
        console.error(error)
        showNotification('Failed to delete blog post', 'error')
      }
    }
  }

  const handleCommentSubmit = async (event) => {
    event.preventDefault()
    if (!commentText.trim()) return

    try {
      await addComment(blog.id, commentText)
      showNotification('Comment added!', 'success')
      setCommentText('')
    } catch (error) {
      console.error(error)
      showNotification('Failed to add comment', 'error')
    }
  }

  return (
    <div className="glass-panel blog-card-container">
      <h2 className="blog-title" style={{ textAlign: 'left', marginBottom: '0.5rem' }}>
        {blog.title}
      </h2>
      <div
        className="blog-author"
        style={{ color: '#94a3b8', fontSize: '1.05rem', marginBottom: '1.5rem' }}
      >
        by {blog.author}
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.8rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: '1.2rem'
        }}
      >
        <div className="blog-url">
          <a
            href={blog.url}
            target="_blank"
            rel="noreferrer"
            style={{
              color: '#14b8a6',
              textDecoration: 'none',
              wordBreak: 'break-all',
              fontWeight: '500'
            }}
          >
            {blog.url}
          </a>
        </div>

        <div className="blog-likes" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#e2e8f0' }}>
            likes <strong style={{ fontSize: '1.1rem', color: '#818cf8' }}>{blog.likes}</strong>
          </span>
          {isAuthenticated && (
            <button
              onClick={handleLikeClick}
              className="btn btn-secondary"
              style={{
                padding: '0.3rem 0.8rem',
                fontSize: '0.8rem',
                background: 'rgba(99, 102, 241, 0.15)',
                borderColor: 'rgba(99, 102, 241, 0.25)',
                color: '#a5b4fc'
              }}
            >
              Like
            </button>
          )}
        </div>

        <div style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
          Added by{' '}
          <span style={{ color: '#cbd5e1', fontWeight: 500 }}>
            {blog.user ? blog.user.name || blog.user.username : 'Anonymous'}
          </span>
        </div>

        {isAuthenticated && isCreator && (
          <div style={{ marginTop: '0.8rem' }}>
            <button onClick={handleDeleteClick} className="btn btn-danger">
              Remove
            </button>
          </div>
        )}
      </div>

      {/* Comments Section */}
      <div
        style={{
          marginTop: '2.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '1.5rem'
        }}
      >
        <h3
          style={{
            textAlign: 'left',
            fontSize: '1.3rem',
            marginBottom: '1.2rem',
            fontFamily: 'var(--font-title)'
          }}
        >
          Comments
        </h3>

        <form
          onSubmit={handleCommentSubmit}
          style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}
        >
          <input
            type="text"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            style={{ flexGrow: 1 }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem' }}>
            Add Comment
          </button>
        </form>

        {blog.comments && blog.comments.length > 0 ? (
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {blog.comments.map((comment, index) => (
              <li
                key={index}
                style={{
                  padding: '0.75rem 1.25rem',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.03)',
                  display: 'block'
                }}
              >
                <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{comment}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  )
}

export default Blog
