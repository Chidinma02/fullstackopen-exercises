import { useState, useEffect } from 'react'
import axios from 'axios'
import CountryList from './components/CountryList'
import CountryDetails from './components/CountryDetails'

function App() {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  // Fetch all countries once
  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  // Filter countries by search input
  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  )

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    setSelectedCountry(null) // reset when typing
  }

  const handleShow = (country) => {
    setSelectedCountry(country)
  }

  return (
    <div>
      <h2>Find countries</h2>
      <input value={search} onChange={handleSearchChange} />

      {selectedCountry ? (
        <CountryDetails country={selectedCountry} />
      ) : (
        <CountryList countries={filteredCountries} onShow={handleShow} />
      )}
    </div>
  )
}

export default App
