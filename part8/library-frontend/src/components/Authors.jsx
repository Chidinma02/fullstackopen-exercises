import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client/react'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS)
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  const authors = result.data ? result.data.allAuthors : []

  useEffect(() => {
    if (authors.length > 0 && !name) {
      setName(authors[0].name)
    }
  }, [authors, name])

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const submit = async (event) => {
    event.preventDefault()

    if (!name || !born) {
      return
    }

    editAuthor({ variables: { name, setBornTo: parseInt(born) } })
    setBorn('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.id || a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {props.token && (
        <div>
          <h2>Set birthyear</h2>
          <form onSubmit={submit}>
            <div>
              <label htmlFor="author-select">name</label>
              <select
                id="author-select"
                name="name"
                value={name}
                onChange={({ target }) => setName(target.value)}
              >
                {authors.map((a) => (
                  <option key={a.name} value={a.name}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="born-input">born</label>
              <input
                id="born-input"
                type="number"
                value={born}
                onChange={({ target }) => setBorn(target.value)}
              />
            </div>
            <button type="submit">update author</button>
          </form>
        </div>
      )}
    </div>
  )
}

export default Authors
