import React from 'react'

const Filter = ({search, setSearch}) => {
  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        <p>Search for person</p>
        <input value={search} onChange={(event) => setSearch(event.target.value)}/>
      </div>
    </div>
  )
}

export default Filter
