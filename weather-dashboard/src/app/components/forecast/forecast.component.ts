// src/app/components/forecast/forecast.component.ts
import { Component } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { ThemeService } from '../../services/theme.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-forecast',
  standalone: true,
  imports: [DatePipe],
  template: `
    @if (weatherService.forecast().length > 0) {
      <div class="forecast">
        <h3>5-Day Forecast</h3>
        <div class="forecast-grid">
          @for (day of weatherService.forecast(); track day.date) {
            <div class="forecast-card">
              <div class="forecast-day">
                {{ day.date | date:'EEE' }}
              </div>
              <img 
                [src]="weatherService.getWeatherIconUrl(day.icon)"
                [alt]="day.description"
                class="forecast-icon"
              />
              <div class="forecast-temps">
                <span class="temp-high">
                  {{ getDisplayTemp(day.temp_max) }}°
                </span>
                <span class="temp-low">
                  {{ getDisplayTemp(day.temp_min) }}°
                </span>
              </div>
              <div class="forecast-description">
                {{ day.description }}
              </div>
              @if (day.precipitation > 0) {
                <div class="precipitation">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                  </svg>
                  {{ day.precipitation }}%
                </div>
              }
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .forecast {
      background: var(--surface-color);
      border-radius: 24px;
      padding: 1.5rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      animation: fadeIn 0.5s ease 0.2s backwards;
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

    h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-color);
      margin: 0 0 1.5rem 0;
    }

    .forecast-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 1rem;
    }

    .forecast-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      padding: 1.5rem 1rem;
      background: var(--background-color);
      border-radius: 16px;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
    }

    .forecast-day {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-color);
    }

    .forecast-icon {
      width: 64px;
      height: 64px;
    }

    .forecast-temps {
      display: flex;
      gap: 0.75rem;
      font-size: 1.125rem;
      font-weight: 600;
    }

    .temp-high {
      color: var(--text-color);
    }

    .temp-low {
      color: var(--text-muted);
    }

    .forecast-description {
      font-size: 0.875rem;
      color: var(--text-muted);
      text-align: center;
      text-transform: capitalize;
    }

    .precipitation {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.875rem;
      color: var(--primary-color);
      
      svg {
        stroke-width: 2;
      }
    }

    @media (max-width: 768px) {
      .forecast-grid {
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      }

      .forecast-card {
        padding: 1rem 0.75rem;
      }

      .forecast-icon {
        width: 56px;
        height: 56px;
      }
    }
  `]
})
export class ForecastComponent {
  constructor(
    public weatherService: WeatherService,
    public themeService: ThemeService
  ) {}

  getDisplayTemp(celsius: number): number {
    return this.themeService.convertTemperature(celsius);
  }
}