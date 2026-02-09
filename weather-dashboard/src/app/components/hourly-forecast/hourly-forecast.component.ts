// src/app/components/hourly-forecast/hourly-forecast.component.ts
import { Component } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { ThemeService } from '../../services/theme.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-hourly-forecast',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './hourly-forecast.component.html',
  styleUrls: ['./hourly-forecast.component.scss']
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