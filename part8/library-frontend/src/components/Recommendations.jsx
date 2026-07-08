import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS, ME } from '../queries'

const Recommendations = (props) => {
  const userResult = useQuery(ME, {
    skip: !props.show,
    fetchPolicy: 'cache-and-network'
  })

  const user = userResult.data ? userResult.data.me : null
  const favoriteGenre = user ? user.favoriteGenre : null

  const booksResult = useQuery(ALL_BOOKS, {
    variables: { genre: favoriteGenre || undefined },
    skip: !favoriteGenre || !props.show,
    fetchPolicy: 'cache-and-network'
  })

  if (!props.show) {
    return null
  }

  if (userResult.loading || booksResult.loading) {
    return <div>loading...</div>
  }

  if (!user) {
    return <div>No user logged in or user details not found</div>
  }

  const recommendedBooks = booksResult.data ? booksResult.data.allBooks : []

  return (
    <div>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre <strong>{favoriteGenre}</strong>
      </p>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {recommendedBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations
