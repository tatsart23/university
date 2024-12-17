import React, { useState } from 'react'
import { useCountry } from './hooks/index'

const Country = ({ country }) => {
  if (!country) {
    return null
  }

  if (!country.found) {
    return <div>not found...</div>
  }

  return (
    <div>
      <h3>{country.data.name.common}</h3>
      <div>capital {country.data.capital}</div>
      <div>population {country.data.population}</div>
      <img
        src={country.data.flags.png}
        height="100"
        alt={`flag of ${country.data.name.common}`}
      />
    </div>
  )
}

const App = () => {
  const [input, setInput] = useState('') 
  const [name, setName] = useState('') 
  const country = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    setName(input) 
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

export default App
