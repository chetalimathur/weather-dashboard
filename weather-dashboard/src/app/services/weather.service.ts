// src/app/services/weather.service.ts
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { CurrentWeather, ForecastDay, HourlyForecast, Location } from '../models/weather.model';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private geocodingUrl = 'https://geocoding-api.open-meteo.com/v1';
  private weatherUrl = 'https://api.open-meteo.com/v1';

  // Signals for reactive state (necessary for UI updates)
  currentWeather = signal<CurrentWeather | null>(null);
  forecast = signal<ForecastDay[]>([]);
  hourlyForecast = signal<HourlyForecast[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  searchLocation(query: string) {
    const url = `${this.geocodingUrl}/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
    
    return this.http.get<any>(url).pipe(
      catchError(error => {
        console.error('Location search error:', error);
        return of({ results: [] });
      })
    );
  }

  getWeatherByCoordinates(lat: number, lon: number, cityName: string = 'Current Location'): void {
    this.loading.set(true);
    this.error.set(null);

    const url = `${this.weatherUrl}/forecast?` +
      `latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,wind_speed_10m,pressure_msl` +
      `&hourly=temperature_2m,weather_code,precipitation_probability` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max` +
      `&timezone=auto`;

    this.http.get<any>(url).pipe(
      catchError(error => {
        console.error('Weather fetch error:', error);
        this.error.set('Failed to fetch weather data. Please try again.');
        this.loading.set(false);
        return of(null);
      })
    ).subscribe(data => {
      if (!data) return;

      // Current weather
      const current: CurrentWeather = {
        temp: Math.round(data.current.temperature_2m),
        feels_like: Math.round(data.current.apparent_temperature),
        temp_min: Math.round(data.daily.temperature_2m_min[0]),
        temp_max: Math.round(data.daily.temperature_2m_max[0]),
        humidity: data.current.relative_humidity_2m,
        description: this.getWeatherDescription(data.current.weather_code),
        icon: this.getWeatherIcon(data.current.weather_code, data.current.is_day),
        city: cityName,
        country: '',
        windSpeed: Math.round(data.current.wind_speed_10m),
        clouds: data.current.cloud_cover,
        pressure: Math.round(data.current.pressure_msl),
        sunrise: 0,
        sunset: 0
      };
      this.currentWeather.set(current);

      // Daily forecast (next 5 days)
      const forecast: ForecastDay[] = [];
      for (let i = 1; i < 6; i++) {
        forecast.push({
          date: new Date(data.daily.time[i]),
          temp: Math.round((data.daily.temperature_2m_max[i] + data.daily.temperature_2m_min[i]) / 2),
          temp_min: Math.round(data.daily.temperature_2m_min[i]),
          temp_max: Math.round(data.daily.temperature_2m_max[i]),
          description: this.getWeatherDescription(data.daily.weather_code[i]),
          icon: this.getWeatherIcon(data.daily.weather_code[i], 1),
          humidity: 0,
          windSpeed: Math.round(data.daily.wind_speed_10m_max[i]),
          precipitation: data.daily.precipitation_probability_max[i]
        });
      }
      this.forecast.set(forecast);

      // Hourly forecast (next 24 hours)
      const hourly: HourlyForecast[] = [];
      for (let i = 0; i < 8; i++) {
        hourly.push({
          time: new Date(data.hourly.time[i]),
          temp: Math.round(data.hourly.temperature_2m[i]),
          icon: this.getWeatherIcon(data.hourly.weather_code[i], 1),
          description: this.getWeatherDescription(data.hourly.weather_code[i])
        });
      }
      this.hourlyForecast.set(hourly);

      this.loading.set(false);
    });
  }

  getCurrentLocation(): void {
    if ('geolocation' in navigator) {
      this.loading.set(true);
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.getWeatherByCoordinates(
            position.coords.latitude,
            position.coords.longitude,
            'Current Location'
          );
        },
        (error) => {
          console.error('Geolocation error:', error);
          this.error.set('Unable to get your location. Showing default city.');
          // Fallback to New York
          this.getWeatherByCoordinates(40.7128, -74.0060, 'New York');
        }
      );
    } else {
      this.error.set('Geolocation not supported.');
      this.getWeatherByCoordinates(40.7128, -74.0060, 'New York');
    }
  }

  private getWeatherDescription(code: number): string {
    const weatherCodes: { [key: number]: string } = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail'
    };
    return weatherCodes[code] || 'Unknown';
  }

  private getWeatherIcon(code: number, isDay: number): string {
    const iconMap: { [key: number]: { day: string, night: string } } = {
      0: { day: '01d', night: '01n' },
      1: { day: '01d', night: '01n' },
      2: { day: '02d', night: '02n' },
      3: { day: '03d', night: '03n' },
      45: { day: '50d', night: '50n' },
      48: { day: '50d', night: '50n' },
      51: { day: '09d', night: '09n' },
      53: { day: '09d', night: '09n' },
      55: { day: '09d', night: '09n' },
      61: { day: '10d', night: '10n' },
      63: { day: '10d', night: '10n' },
      65: { day: '10d', night: '10n' },
      71: { day: '13d', night: '13n' },
      73: { day: '13d', night: '13n' },
      75: { day: '13d', night: '13n' },
      77: { day: '13d', night: '13n' },
      80: { day: '09d', night: '09n' },
      81: { day: '09d', night: '09n' },
      82: { day: '09d', night: '09n' },
      85: { day: '13d', night: '13n' },
      86: { day: '13d', night: '13n' },
      95: { day: '11d', night: '11n' },
      96: { day: '11d', night: '11n' },
      99: { day: '11d', night: '11n' }
    };

    const icons = iconMap[code] || { day: '01d', night: '01n' };
    return isDay ? icons.day : icons.night;
  }

  getWeatherIconUrl(iconCode: string): string {
    return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  }
}