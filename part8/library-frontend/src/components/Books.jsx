import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState(null)

  const allBooksResult = useQuery(ALL_BOOKS, {
    skip: !props.show,
    fetchPolicy: 'cache-and-network'
  })

  const booksResult = useQuery(ALL_BOOKS, {
    variables: { genre: selectedGenre || undefined },
    skip: !props.show,
    fetchPolicy: 'cache-and-network'
  })

  if (!props.show) {
    return null
  }

  if (allBooksResult.loading || booksResult.loading) {
    return <div>loading...</div>
  }

  const allBooks = allBooksResult.data ? allBooksResult.data.allBooks : []
  const genres = Array.from(new Set(allBooks.flatMap((b) => b.genres)))

  const booksToShow = booksResult.data ? booksResult.data.allBooks : []

  return (
    <div>
      <h2>books</h2>

      {selectedGenre && (
        <p>
          in genre <strong>{selectedGenre}</strong>
        </p>
      )}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksToShow.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {genres.map((genre) => (
          <button key={genre} onClick={() => setSelectedGenre(genre)}>
            {genre}
          </button>
        ))}
        <button onClick={() => setSelectedGenre(null)}>all genres</button>
      </div>
    </div>
  )
}

export default Books
