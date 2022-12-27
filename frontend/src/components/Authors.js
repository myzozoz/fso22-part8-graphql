import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { ALL_AUTHORS, EDIT_NUMBER } from '../queries'

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS)
  const [name, setName] = useState()
  const [born, setBorn] = useState()
  const [editNumber] = useMutation(EDIT_NUMBER, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  })

  if (!props.show) {
    return null
  }

  if (result.loading) return <div>loading...</div>

  const submit = async (event) => {
    event.preventDefault()

    editNumber({
      variables: { name, setBornTo: parseInt(born) },
    })

    setName('')
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
          {result.data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Set birthyear</h3>
      <form onSubmit={submit}>
        <div>
          name
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          born
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default Authors
