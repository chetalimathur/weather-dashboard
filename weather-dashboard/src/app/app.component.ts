// src/app/app.component.ts
import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { SearchComponent } from './components/search/search.component';
import { CurrentWeatherComponent } from './components/current-weather/current-weather.component';
import { HourlyForecastComponent } from './components/hourly-forecast/hourly-forecast.component';
import { ForecastComponent } from './components/forecast/forecast.component';
import { WeatherService } from './services/weather.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    SearchComponent,
    CurrentWeatherComponent,
    HourlyForecastComponent,
    ForecastComponent
  ],
  template: `
    <app-header />
    
    <main class="container">
      <app-search />

      @if (weatherService.loading()) {
        <div class="loading-container">
          <div class="spinner"></div>
          <p>Loading weather data...</p>
        </div>
      } @else if (weatherService.error()) {
        <div class="error-container">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p>{{ weatherService.error() }}</p>
          <button (click)="retry()" class="retry-btn">Try Again</button>
        </div>
      } @else {
        <app-current-weather />
        <app-hourly-forecast />
        <app-forecast />
      }
    </main>

    <footer class="footer">
      <p>Weather data provided by <a href="https://open-meteo.com/" target="_blank">Open-Meteo</a></p>
    </footer>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1.5rem;
      min-height: calc(100vh - 200px);
    }

    .loading-container,
    .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      text-align: center;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid var(--border-color);
      border-top-color: var(--primary-color);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-bottom: 1rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .loading-container p,
    .error-container p {
      color: var(--text-muted);
      font-size: 1.125rem;
      margin: 0;
    }

    .error-container svg {
      color: #ef4444;
      stroke-width: 2;
      margin-bottom: 1rem;
    }

    .retry-btn {
      margin-top: 1.5rem;
      padding: 0.75rem 1.5rem;
      background: var(--primary-color);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: var(--primary-hover);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      }
    }

    .footer {
      text-align: center;
      padding: 2rem;
      color: var(--text-muted);
      border-top: 1px solid var(--border-color);
      margin-top: 3rem;

      p {
        margin: 0;
        font-size: 0.875rem;
      }

      a {
        color: var(--primary-color);
        text-decoration: none;
        font-weight: 500;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    @media (max-width: 768px) {
      .container {
        padding: 1.5rem 1rem;
      }
    }
  `]
})
export class AppComponent {
  constructor(public weatherService: WeatherService) {}

  retry(): void {
    this.weatherService.getCurrentLocation();
  }
}