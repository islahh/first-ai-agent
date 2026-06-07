interface GeocodeResult {
  latitude: number;
  longitude: number;
  name: string;
  country: string;
}

export async function getCurrentWeather(
  city: string
) {
  // Step 1: Convert city -> coordinates

  const geoResponse = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      city
    )}&count=1`
  );

  const geoData = await geoResponse.json();

  if (
    !geoData.results ||
    geoData.results.length === 0
  ) {
    throw new Error(
      `Could not find city: ${city}`
    );
  }

  const location =
    geoData.results[0] as GeocodeResult;

  // Step 2: Fetch weather

  const weatherResponse = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`
  );

  const weatherData =
    await weatherResponse.json();

  return {
    city: location.name,
    country: location.country,
    temperature:
      weatherData.current.temperature_2m,
    humidity:
      weatherData.current.relative_humidity_2m,
    windSpeed:
      weatherData.current.wind_speed_10m,
  };
}