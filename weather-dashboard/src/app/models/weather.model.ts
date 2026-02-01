export interface CurrentWeather{
    temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  description: string;
  icon: string;
  city: string;
  country: string;
  sunrise: number;
  sunset: number;
  windSpeed: number;
  clouds: number;
}

export interface ForecastDay {
    date: Date;
    temp: number;
    temp_min: number;
    temp_max: number;
    description: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    precipitation: number;
  }
  
  export interface HourlyForecast {
    time: Date;
    temp: number;
    icon: string;
    description: string;
  }
  
  export interface Location {
    name: string;
    lat: number;
    lon: number;
    country: string;
    admin1?: string;
  }
  
  export type Theme = 'light' | 'dark';
  export type TemperatureUnit = 'celsius' | 'fahrenheit';