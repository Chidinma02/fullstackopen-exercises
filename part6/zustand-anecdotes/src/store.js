import { create } from 'zustand'


const useAnecdoteStore = create((set) => ({
  anecdotes: [],
  filter: '',
  actions: {
    initializeAnecdotes: async () => {
      const response = await fetch('http://localhost:3001/anecdotes')
      const anecdotes = await response.json()
      set({ anecdotes })
    },
    vote: async (id) => {
      const state = useAnecdoteStore.getState()
      const anecdoteToVote = state.anecdotes.find((a) => a.id === id)
      if (anecdoteToVote) {
        const updatedVotes = anecdoteToVote.votes + 1
        const response = await fetch(`http://localhost:3001/anecdotes/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ votes: updatedVotes }),
        })
        const updatedAnecdote = await response.json()
        set((state) => ({
          anecdotes: state.anecdotes.map((a) =>
            a.id === id ? updatedAnecdote : a
          ),
        }))
      }
    },
    createAnecdote: async (content) => {
      const newAnecdote = { content, votes: 0 }
      const response = await fetch('http://localhost:3001/anecdotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAnecdote),
      })
      const created = await response.json()
      set((state) => ({
        anecdotes: state.anecdotes.concat(created),
      }))
    },
    deleteAnecdote: async (id) => {
      await fetch(`http://localhost:3001/anecdotes/${id}`, {
        method: 'DELETE',
      })
      set((state) => ({
        anecdotes: state.anecdotes.filter((a) => a.id !== id),
      }))
    },
    setFilter: (filter) => set({ filter }),
  },
}))

export const useAnecdotes = () => useAnecdoteStore((state) => state.anecdotes)
export const useFilter = () => useAnecdoteStore((state) => state.filter)
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)
export default useAnecdoteStore
