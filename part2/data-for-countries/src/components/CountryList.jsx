function CountryList({ countries, onShow }) {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  if (countries.length === 1) {
    const country = countries[0]
    return (
      <div>
        <h2>{country.name.common}</h2>
        <p>Capital: {country.capital}</p>
        <p>Area: {country.area}</p>
        <h4>Languages:</h4>
        <ul>
          {Object.values(country.languages).map(lang => (
            <li key={lang}>{lang}</li>
          ))}
        </ul>
        <img src={country.flags.png} alt="flag" width="150" />
      </div>
    )
  }

  return (
    <ul>
      {countries.map(country => (
        <li key={country.cca3}>
          {country.name.common}{' '}
          <button onClick={() => onShow(country)}>Show</button>
        </li>
      ))}
    </ul>
  )
}

export default CountryList
