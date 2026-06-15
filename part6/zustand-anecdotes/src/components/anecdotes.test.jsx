import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { expect, test, describe, vi, beforeEach } from 'vitest'
import useAnecdoteStore from '../store'
import AnecdoteList from './AnecdoteList'

describe('Anecdotes App', () => {
  beforeEach(() => {
    useAnecdoteStore.setState({ anecdotes: [], filter: '' })
    vi.restoreAllMocks()
  })

  test('6.12: state is initialized with anecdotes returned by the backend', async () => {
    const mockedAnecdotes = [
      { id: '1', content: 'First anecdote', votes: 5 },
      { id: '2', content: 'Second anecdote', votes: 10 }
    ]

    const fetchSpy = vi.spyOn(window, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockedAnecdotes)
      })
    )

    const { initializeAnecdotes } = useAnecdoteStore.getState().actions
    await initializeAnecdotes()

    expect(fetchSpy).toHaveBeenCalledWith('http://localhost:3001/anecdotes')
    expect(useAnecdoteStore.getState().anecdotes).toEqual(mockedAnecdotes)
  })

  test('6.13: component displaying anecdotes receives the anecdotes from the store sorted by votes', () => {
    const unsortedAnecdotes = [
      { id: '1', content: 'Anecdote with 2 votes', votes: 2 },
      { id: '2', content: 'Anecdote with 10 votes', votes: 10 },
      { id: '3', content: 'Anecdote with 5 votes', votes: 5 }
    ]

    useAnecdoteStore.setState({ anecdotes: unsortedAnecdotes })

    render(<AnecdoteList />)

    const listItems = screen.getAllByText(/Anecdote with \d+ votes/)
    expect(listItems[0]).toHaveTextContent('Anecdote with 10 votes')
    expect(listItems[1]).toHaveTextContent('Anecdote with 5 votes')
    expect(listItems[2]).toHaveTextContent('Anecdote with 2 votes')
  })

  test('6.14: component receives a properly filtered list of anecdotes', () => {
    const anecdotes = [
      { id: '1', content: 'React hooks are easy', votes: 2 },
      { id: '2', content: 'Zustand is neat', votes: 10 },
      { id: '3', content: 'Redux is complex', votes: 5 }
    ]

    useAnecdoteStore.setState({ anecdotes, filter: 'React' })

    render(<AnecdoteList />)

    expect(screen.getByText('React hooks are easy')).toBeInTheDocument()
    expect(screen.queryByText('Zustand is neat')).not.toBeInTheDocument()
    expect(screen.queryByText('Redux is complex')).not.toBeInTheDocument()
  })

  test('6.15: voting increases the number of votes for an anecdote', async () => {
    const initialAnecdotes = [
      { id: '1', content: 'Vote for this!', votes: 3 }
    ]
    useAnecdoteStore.setState({ anecdotes: initialAnecdotes })

    const updatedAnecdote = { id: '1', content: 'Vote for this!', votes: 4 }

    const fetchSpy = vi.spyOn(window, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(updatedAnecdote)
      })
    )

    render(<AnecdoteList />)

    const voteButton = screen.getByText('vote')
    fireEvent.click(voteButton)

    expect(fetchSpy).toHaveBeenCalledWith('http://localhost:3001/anecdotes/1', expect.objectContaining({
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ votes: 4 })
    }))

    await waitFor(() => {
      expect(screen.getByText('has 4')).toBeInTheDocument()
    })

    expect(useAnecdoteStore.getState().anecdotes[0].votes).toBe(4)
  })
})
