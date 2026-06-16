import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Blog from './Blog'

describe('<Blog /> details view (routed view)', () => {
  const blog = {
    title: 'Testing React Components',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 42,
    user: {
      username: 'testuser',
      name: 'Test User'
    }
  }

  test('renders title, author, url, and likes for unauthenticated users, but no buttons', () => {
    render(
      <MemoryRouter>
        <Blog blog={blog} currentUser={null} />
      </MemoryRouter>
    )

    expect(screen.getByText('Testing React Components')).toBeInTheDocument()
    expect(screen.getByText('by Test Author')).toBeInTheDocument()
    expect(screen.getByText('http://testurl.com')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()

    // Buttons should not be displayed
    const likeButton = screen.queryByText('Like')
    const removeButton = screen.queryByText('Remove')
    expect(likeButton).toBeNull()
    expect(removeButton).toBeNull()
  })

  test('renders the like button but not the remove button for authenticated non-creators', () => {
    const nonCreatorUser = { username: 'otheruser', name: 'Other User' }
    render(
      <MemoryRouter>
        <Blog blog={blog} currentUser={nonCreatorUser} />
      </MemoryRouter>
    )

    expect(screen.getByText('Like')).toBeInTheDocument()
    expect(screen.queryByText('Remove')).toBeNull()
  })

  test('renders both like and remove buttons for the creator of the blog', () => {
    const creatorUser = { username: 'testuser', name: 'Test User' }
    render(
      <MemoryRouter>
        <Blog blog={blog} currentUser={creatorUser} />
      </MemoryRouter>
    )

    expect(screen.getByText('Like')).toBeInTheDocument()
    expect(screen.getByText('Remove')).toBeInTheDocument()
  })

  test('calls event handler twice when like button is clicked twice', async () => {
    const mockLikeHandler = vi.fn()
    const nonCreatorUser = { username: 'otheruser', name: 'Other User' }

    render(
      <MemoryRouter>
        <Blog blog={blog} currentUser={nonCreatorUser} handleLike={mockLikeHandler} />
      </MemoryRouter>
    )

    const user = userEvent.setup()
    const likeButton = screen.getByText('Like')

    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockLikeHandler).toHaveBeenCalledTimes(2)
  })
})
