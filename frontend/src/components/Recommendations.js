import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ME } from '../queries'

const Recommendations = (props) => {
  const { data } = useQuery(ME)
  const genre = data?.me?.favoriteGenre
  const result = useQuery(ALL_BOOKS, {
    variables: { genre },
  })
  if (!props.show) {
    return null
  }

  if (result.loading) return <div>loading...</div>

  return (
    <div>
      <h2>books</h2>
      {genre && (
        <p>
          in your favorite genre <b>{genre}</b>
        </p>
      )}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {result.data.allBooks
            .filter((b) => b.genres.some((g) => !genre || g === genre))
            .map((a) => (
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
