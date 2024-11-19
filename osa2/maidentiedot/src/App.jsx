import React, { useEffect, useState } from "react";
import noteService from "./services/notes";
import Weather from "./components/Weather";

const App = () => {
  const [search, setSearch] = useState("");
  const [countries, setCountries] = useState([]);
  const [visibleCountry, setVisibleCountry] = useState(null);
  const [selectedCountryCoords, setSelectedCountryCoords] = useState(null); 

  const handleShowClick = (country) => {
    if (visibleCountry === country.name.common) {
      setVisibleCountry(null);
      setSelectedCountryCoords(null); 
    } else {
      setVisibleCountry(country.name.common);
      setSelectedCountryCoords({
        lat: country.latlng[0], 
        lon: country.latlng[1], 
      });
    }
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  useEffect(() => {
    noteService.getAll().then((data) => {
      setCountries(data);
    });
  }, []);

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div>
        <label>
          <h2>Hae maata</h2>{" "}
        </label>
        <input type="text" value={search} onChange={handleSearchChange} />
      </div>

      <ul>
        {filteredCountries.length > 10 ? (
          <p>Tarkenna hakua</p>
        ) : visibleCountry ? (
          filteredCountries
            .filter((country) => country.name.common === visibleCountry)
            .map((country) => (
              <li key={country.name.common}>
                <p>{country.name.common}</p>
                <button onClick={() => handleShowClick(country)}>hide</button>
                <h2>Pääkaupunki</h2>
                <p>{country.capital}</p>
                <h2>Väkiluku</h2>
                <p>{country.population}</p>
                <h2>Kielet</h2>
                <ul>
                  {Object.values(country.languages).map((language) => (
                    <li key={language}>{language}</li>
                  ))}
                </ul>
                <img
                  src={country.flags.png}
                  alt={country.name.common}
                  width="100"
                />
                {/* Välitetään koordinaatit Weather-komponentille */}
                {selectedCountryCoords && (
                  <Weather coords={selectedCountryCoords} />
                )}
              </li>
            ))
        ) : (
          filteredCountries.map((country) => (
            <li key={country.name.common}>
              <p>{country.name.common}</p>
              <button onClick={() => handleShowClick(country)}>show</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default App;
