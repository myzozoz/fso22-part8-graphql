import React, { useState } from 'react'
import Select from 'react-select'
import { useMutation, useQuery } from '@apollo/client'
import { ALL_AUTHORS, EDIT_NUMBER } from '../queries'

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS)
  const [nameOption, setNameOption] = useState(null)
  const [born, setBorn] = useState('')
  const [editNumber] = useMutation(EDIT_NUMBER, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  })

  if (!props.show) {
    return null
  }

  if (result.loading) return <div>loading...</div>

  const submit = async (event) => {
    event.preventDefault()

    if (nameOption != null) {
      editNumber({
        variables: { name: nameOption.value, setBornTo: parseInt(born) },
      })

      setNameOption(null)
      setBorn('')
    } else {
      console.log('Choose author to edit!')
    }
  }

  const options = result.data.allAuthors.map((a) => ({
    value: a.name,
    label: a.name,
  }))

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
          <Select
            defaultValue={nameOption}
            onChange={setNameOption}
            options={options}
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
