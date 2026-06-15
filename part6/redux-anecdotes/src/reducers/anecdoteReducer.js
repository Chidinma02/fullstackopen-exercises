import { createSlice } from '@reduxjs/toolkit'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    incrementVotes(state, action) {
      const id = action.payload
      const anecdoteToVote = state.find((a) => a.id === id)
      if (anecdoteToVote) {
        anecdoteToVote.votes += 1
      }
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    },
  },
})

export const { incrementVotes, appendAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const response = await fetch('http://localhost:3001/anecdotes')
    const anecdotes = await response.json()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = { content, votes: 0 }
    const response = await fetch('http://localhost:3001/anecdotes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newAnecdote),
    })
    const created = await response.json()
    dispatch(appendAnecdote(created))
  }
}

export const voteAnecdote = (anecdote) => {
  return async (dispatch) => {
    const updatedAnecdote = {
      ...anecdote,
      votes: anecdote.votes + 1,
    }
    await fetch(`http://localhost:3001/anecdotes/${anecdote.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedAnecdote),
    })
    dispatch(incrementVotes(anecdote.id))
  }
}

export default anecdoteSlice.reducer
