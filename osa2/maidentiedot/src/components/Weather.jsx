import React, { useState, useEffect } from "react";
import axios from "axios";

const Weather = ({ coords }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (coords) {
      const apiKey = import.meta.env.VITE_API_KEY;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}&units=metric`;

      axios.get(url).then((response) => {
        setWeather(response.data);
      });
    }
  }, [coords]);

  if (!weather) {
    return <p>Ladataan säätietoja...</p>;
  }

  return (
    <div>
      <h2>Sää</h2>
      <p>Lämpötila: {weather.main.temp} °C</p>
      <p>Säätila: {weather.weather[0].description}</p>
      <p>Tuuli: {weather.wind.speed} m/s</p>
    </div>
  );
};

export default Weather;
