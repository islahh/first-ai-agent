export async function getWeather(city: string) {
  return {
    city,
    temperature: 30,
    condition: "Sunny",
  };
}