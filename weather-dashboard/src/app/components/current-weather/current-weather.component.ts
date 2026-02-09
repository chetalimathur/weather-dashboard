// src/app/components/current-weather/current-weather.component.ts
import { Component } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-current-weather',
  standalone: true,
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.scss']
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