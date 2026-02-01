// src/app/services/theme.service.ts
import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';
export type TemperatureUnit = 'celsius' | 'fahrenheit';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Only signal for theme (needs reactive UI updates)
  theme = signal<Theme>(this.getStoredTheme());
  
  // Regular property for temperature unit
  private currentUnit: TemperatureUnit;

  constructor() {
    this.currentUnit = this.getStoredUnit();
    
    // Effect for theme changes
    effect(() => {
      const currentTheme = this.theme();
      this.applyTheme(currentTheme);
      localStorage.setItem('theme', currentTheme);
    });
  }

  toggleTheme(): void {
    this.theme.update(current => current === 'light' ? 'dark' : 'light');
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
  }

  isDarkTheme(): boolean {
    return this.theme() === 'dark';
  }

  getTemperatureUnit(): TemperatureUnit {
    return this.currentUnit;
  }

  toggleTemperatureUnit(): void {
    this.currentUnit = this.currentUnit === 'celsius' ? 'fahrenheit' : 'celsius';
    localStorage.setItem('temperatureUnit', this.currentUnit);
  }

  setTemperatureUnit(unit: TemperatureUnit): void {
    this.currentUnit = unit;
    localStorage.setItem('temperatureUnit', unit);
  }

  convertTemperature(celsius: number): number {
    if (this.currentUnit === 'fahrenheit') {
      return Math.round((celsius * 9/5) + 32);
    }
    return Math.round(celsius);
  }

  getTemperatureSymbol(): string {
    return this.currentUnit === 'celsius' ? '°C' : '°F';
  }

  isFahrenheit(): boolean {
    return this.currentUnit === 'fahrenheit';
  }

  private getStoredTheme(): Theme {
    const stored = localStorage.getItem('theme') as Theme;
    if (stored && (stored === 'light' || stored === 'dark')) {
      return stored;
    }
    
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  }

  private getStoredUnit(): TemperatureUnit {
    const stored = localStorage.getItem('temperatureUnit') as TemperatureUnit;
    if (stored && (stored === 'celsius' || stored === 'fahrenheit')) {
      return stored;
    }
    return 'celsius';
  }

  private applyTheme(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
  }
}