import React from 'react'

const Persons = ({persons, search, handleDelete}) => {
  return (
    <div>
      <h2>Numbers</h2>
      <ul>
        {persons.filter((person) => person.name.toLowerCase().includes(search.toLowerCase())).map((person) => (
          <li key={person.name}>
            {person.name} {person.number}
            <button onClick={() => handleDelete(person.id)}>delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Persons
