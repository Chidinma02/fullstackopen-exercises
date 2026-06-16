import { createContext, useState, useEffect } from 'react'
import anecdoteService from '../services/anecdotes'

export const AnecdoteContext = createContext()

export const AnecdoteProvider = ({ children }) => {
  const [anecdotes, setAnecdotes] = useState([])

  useEffect(() => {
    anecdoteService.getAll().then(data => setAnecdotes(data))
  }, [])

  const addAnecdote = async (anecdote) => {
    const newAnecdote = await anecdoteService.createNew(anecdote)
    setAnecdotes(anecdotes.concat(newAnecdote))
  }

  const deleteAnecdote = async (id) => {
    await anecdoteService.remove(id)
    setAnecdotes(anecdotes.filter(a => a.id !== id))
  }

  return (
    <AnecdoteContext.Provider value={{ anecdotes, addAnecdote, deleteAnecdote }}>
      {children}
    </AnecdoteContext.Provider>
  )
}
