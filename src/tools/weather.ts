import {
  getCurrentWeather,
} from "../services/weather.service.js";

export async function getWeather(
  city: string
) {
  return await getCurrentWeather(city);
}