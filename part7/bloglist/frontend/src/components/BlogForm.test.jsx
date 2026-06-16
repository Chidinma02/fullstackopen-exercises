import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('calls createBlog event handler with the right details on form submission', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()

    render(<BlogForm createBlog={createBlog} />)

    const titleInput = screen.getByPlaceholderText('Enter blog title')
    const authorInput = screen.getByPlaceholderText('Enter author name')
    const urlInput = screen.getByPlaceholderText('https://example.com')
    const submitButton = screen.getByText('Create Blog')

    await user.type(titleInput, 'Form Testing in React')
    await user.type(authorInput, 'Author Name')
    await user.type(urlInput, 'http://formurl.com')

    await user.click(submitButton)

    expect(createBlog).toHaveBeenCalledTimes(1)
    expect(createBlog.mock.calls[0][0]).toEqual({
      title: 'Form Testing in React',
      author: 'Author Name',
      url: 'http://formurl.com'
    })
  })
})
