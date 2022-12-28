import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const [filter, setFilter] = useState(null)
  const result = useQuery(ALL_BOOKS, { variables: { genre: filter } })
  const result_all = useQuery(ALL_BOOKS)
  if (!props.show) {
    return null
  }

  if (result.loading) return <div>loading...</div>

  const allGenres = result_all.data.allBooks.reduce((prev, curr) => {
    curr.genres &&
      curr.genres.forEach((g) => {
        if (!prev.some((p) => p === g)) prev.push(g)
      })
    return prev
  }, [])

  return (
    <div>
      <h2>books</h2>
      {filter && (
        <p>
          in genre <b>{filter}</b>
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
            .filter((b) => b.genres.some((g) => !filter || g === filter))
            .map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
        </tbody>
      </table>

      {allGenres.map((g) => (
        <button key={g} onClick={() => setFilter(g)}>
          {g}
        </button>
      ))}
      <button onClick={() => setFilter(null)}>clear</button>
    </div>
  )
}

export default Books
