const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = async () => {
  const res = await fetch(baseUrl)
  if (!res.ok) {
    throw new Error('Network response was not ok')
  }
  return res.json()
}

export const createAnecdote = async (newAnecdote) => {
  const res = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newAnecdote),
  })
  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.error || 'Failed to create anecdote')
  }
  return res.json()
}

export const updateAnecdote = async (updatedAnecdote) => {
  const res = await fetch(`${baseUrl}/${updatedAnecdote.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedAnecdote),
  })
  if (!res.ok) {
    throw new Error('Failed to update anecdote')
  }
  return res.json()
}
