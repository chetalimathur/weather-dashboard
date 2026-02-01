// src/app/components/hourly-forecast/hourly-forecast.component.ts
import { Component } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { ThemeService } from '../../services/theme.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-hourly-forecast',
  standalone: true,
  imports: [DatePipe],
  template: `
    @if (weatherService.hourlyForecast().length > 0) {
      <div class="hourly-forecast">
        <h3>Hourly Forecast</h3>
        <div class="hourly-scroll">
          @for (hour of weatherService.hourlyForecast(); track hour.time) {
            <div class="hourly-item">
              <span class="hour-time">{{ hour.time | date:'HH:mm' }}</span>
              <img 
                [src]="weatherService.getWeatherIconUrl(hour.icon)"
                [alt]="hour.description"
                class="hour-icon"
              />
              <span class="hour-temp">
                {{ getDisplayTemp(hour.temp) }}{{ themeService.getTemperatureSymbol() }}
              </span>
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .hourly-forecast {
      background: var(--surface-color);
      border-radius: 24px;
      padding: 1.5rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      margin-bottom: 2rem;
      animation: fadeIn 0.5s ease 0.1s backwards;
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

    .hourly-scroll {
      display: flex;
      gap: 1rem;
      overflow-x: auto;
      padding-bottom: 0.5rem;
      
      &::-webkit-scrollbar {
        height: 6px;
      }

      &::-webkit-scrollbar-track {
        background: var(--background-color);
        border-radius: 3px;
      }

      &::-webkit-scrollbar-thumb {
        background: var(--border-color);
        border-radius: 3px;

        &:hover {
          background: var(--text-muted);
        }
      }
    }

    .hourly-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      background: var(--background-color);
      border-radius: 12px;
      min-width: 80px;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
    }

    .hour-time {
      font-size: 0.875rem;
      color: var(--text-muted);
      font-weight: 500;
    }

    .hour-icon {
      width: 48px;
      height: 48px;
    }

    .hour-temp {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-color);
    }
  `]
})
export class HourlyForecastComponent {
  constructor(
    public weatherService: WeatherService,
    public themeService: ThemeService
  ) {}

  getDisplayTemp(celsius: number): number {
    return this.themeService.convertTemperature(celsius);
  }
}