// src/app/components/current-weather/current-weather.component.ts
import { Component } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-current-weather',
  standalone: true,
  template: `
    @if (weatherService.currentWeather(); as weather) {
      <div class="current-weather">
        <div class="weather-main">
          <div class="location">
            <h2>{{ weather.city }}</h2>
            @if (weather.country) {
              <p class="country">{{ weather.country }}</p>
            }
          </div>

          <div class="temperature-display">
            <img 
              [src]="weatherService.getWeatherIconUrl(weather.icon)" 
              [alt]="weather.description"
              class="weather-icon-large"
            />
            <div class="temp-content">
              <div class="temperature">
                {{ getDisplayTemp(weather.temp) }}
                <span class="temp-unit">{{ themeService.getTemperatureSymbol() }}</span>
              </div>
              <p class="description">{{ weather.description }}</p>
              <p class="feels-like">
                Feels like {{ getDisplayTemp(weather.feels_like) }}{{ themeService.getTemperatureSymbol() }}
              </p>
            </div>
          </div>
        </div>

        <div class="weather-details">
          <div class="detail-card">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
            </svg>
            <div class="detail-content">
              <span class="detail-label">Humidity</span>
              <span class="detail-value">{{ weather.humidity }}%</span>
            </div>
          </div>

          <div class="detail-card">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/>
            </svg>
            <div class="detail-content">
              <span class="detail-label">Wind Speed</span>
              <span class="detail-value">{{ weather.windSpeed }} m/s</span>
            </div>
          </div>

          <div class="detail-card">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
            </svg>
            <div class="detail-content">
              <span class="detail-label">Cloudiness</span>
              <span class="detail-value">{{ weather.clouds }}%</span>
            </div>
          </div>

          <div class="detail-card">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            <div class="detail-content">
              <span class="detail-label">Pressure</span>
              <span class="detail-value">{{ weather.pressure }} hPa</span>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .current-weather {
      background: var(--surface-color);
      border-radius: 24px;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      animation: fadeIn 0.5s ease;
      margin-bottom: 2rem;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .weather-main {
      margin-bottom: 2rem;
    }

    .location {
      margin-bottom: 1.5rem;

      h2 {
        font-size: 2rem;
        font-weight: 700;
        color: var(--text-color);
        margin: 0 0 0.25rem 0;
      }

      .country {
        color: var(--text-muted);
        margin: 0;
        font-size: 1rem;
      }
    }

    .temperature-display {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .weather-icon-large {
      width: 120px;
      height: 120px;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
    }

    .temp-content {
      flex: 1;
    }

    .temperature {
      font-size: 4rem;
      font-weight: 700;
      color: var(--text-color);
      line-height: 1;
      margin-bottom: 0.5rem;

      .temp-unit {
        font-size: 2rem;
        color: var(--text-muted);
        font-weight: 400;
      }
    }

    .description {
      font-size: 1.25rem;
      color: var(--text-color);
      margin: 0 0 0.5rem 0;
      text-transform: capitalize;
    }

    .feels-like {
      color: var(--text-muted);
      margin: 0;
    }

    .weather-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }

    .detail-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: var(--background-color);
      border-radius: 12px;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      svg {
        color: var(--primary-color);
        flex-shrink: 0;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
    }

    .detail-content {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .detail-label {
      font-size: 0.875rem;
      color: var(--text-muted);
    }

    .detail-value {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-color);
    }

    @media (max-width: 768px) {
      .current-weather {
        padding: 1.5rem;
      }

      .temperature-display {
        flex-direction: column;
        text-align: center;
      }

      .weather-icon-large {
        width: 100px;
        height: 100px;
      }

      .temperature {
        font-size: 3rem;
      }

      .weather-details {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class CurrentWeatherComponent {
  constructor(
    public weatherService: WeatherService,
    public themeService: ThemeService
  ) {}

  getDisplayTemp(celsius: number): number {
    return this.themeService.convertTemperature(celsius);
  }
}