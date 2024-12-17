import { useState, useEffect } from 'react'
import axios from 'axios'

export const useCountry = (name) => {
    const [country, setCountry] = useState(null)
  
    useEffect(() => {
      if (name) {
        const fetchCountry = async () => {
          try {
            const response = await axios.get(
              `https://studies.cs.helsinki.fi/restcountries/api/name/${name}`
            )
            setCountry({ data: response.data, found: true })
          } catch (error) {
            setCountry({ found: false })
          }
        }
  
        fetchCountry()
      }
    }, [name])
  
    return country
  }
  