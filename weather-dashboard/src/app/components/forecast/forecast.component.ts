// src/app/components/forecast/forecast.component.ts
import { Component } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { ThemeService } from '../../services/theme.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-forecast',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.scss']
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