// src/app/components/search/search.component.ts
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WeatherService } from '../../services/weather.service';
import { Location } from '../../models/weather.model';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="search-container">
      <div class="search-wrapper">
        <button 
          class="location-btn"
          (click)="getCurrentLocation()"
          [disabled]="weatherService.loading()"
          [attr.aria-label]="'Use current location'">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </button>

        <div class="search-input-wrapper">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (input)="onSearchInput()"
            (focus)="showSuggestions.set(true)"
            (blur)="onBlur()"
            placeholder="Search for a city..."
            class="search-input"
            [attr.aria-label]="'Search for city'"
          />
          
          <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>

          @if (searchQuery) {
            <button 
              class="clear-btn"
              (click)="clearSearch()"
              [attr.aria-label]="'Clear search'">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          }
        </div>
      </div>

      @if (showSuggestions() && suggestions().length > 0) {
        <div class="suggestions-dropdown">
          @for (location of suggestions(); track location.name + location.country) {
            <button
              class="suggestion-item"
              (mousedown)="selectLocation(location)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <div class="suggestion-content">
                <span class="city-name">{{ location.name }}</span>
                <span class="country-name">{{ location.country }}</span>
              </div>
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .search-container {
      position: relative;
      width: 100%;
      max-width: 600px;
      margin: 0 auto 2rem;
    }

    .search-wrapper {
      display: flex;
      gap: 0.75rem;
    }

    .location-btn {
      flex-shrink: 0;
      padding: 0.875rem;
      background: var(--surface-color);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      color: var(--primary-color);

      &:hover:not(:disabled) {
        background: var(--primary-color);
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      svg {
        display: block;
        stroke-width: 2;
      }
    }

    .search-input-wrapper {
      position: relative;
      flex: 1;
    }

    .search-input {
      width: 100%;
      padding: 0.875rem 3rem;
      border: 1px solid var(--border-color);
      border-radius: 12px;
      font-size: 1rem;
      background: var(--surface-color);
      color: var(--text-color);
      transition: all 0.3s ease;

      &:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      &::placeholder {
        color: var(--text-muted);
      }
    }

    .search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-muted);
      pointer-events: none;
      stroke-width: 2;
    }

    .clear-btn {
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      padding: 0.25rem;
      background: transparent;
      border: none;
      cursor: pointer;
      color: var(--text-muted);
      border-radius: 50%;
      transition: all 0.2s ease;

      &:hover {
        background: var(--hover-color);
        color: var(--text-color);
      }

      svg {
        stroke-width: 2;
      }
    }

    .suggestions-dropdown {
      position: absolute;
      top: calc(100% + 0.5rem);
      left: 0;
      right: 0;
      background: var(--surface-color);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      max-height: 300px;
      overflow-y: auto;
      z-index: 1000;
      animation: slideDown 0.2s ease;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .suggestion-item {
      width: 100%;
      padding: 0.875rem 1rem;
      border: none;
      background: transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      transition: background 0.2s ease;
      text-align: left;

      &:hover {
        background: var(--hover-color);
      }

      &:not(:last-child) {
        border-bottom: 1px solid var(--border-color);
      }

      svg {
        flex-shrink: 0;
        color: var(--primary-color);
        stroke-width: 2;
      }
    }

    .suggestion-content {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
    }

    .city-name {
      font-weight: 500;
      color: var(--text-color);
    }

    .country-name {
      font-size: 0.875rem;
      color: var(--text-muted);
    }

    @media (max-width: 768px) {
      .search-wrapper {
        flex-direction: row;
      }

      .location-btn {
        padding: 0.75rem;
      }
    }
  `]
})
export class SearchComponent {
  searchQuery = '';
  suggestions = signal<Location[]>([]);
  showSuggestions = signal(false);
  private searchTimeout: any;

  constructor(public weatherService: WeatherService) {
    // Load weather for current location on init
    this.getCurrentLocation();
  }

  onSearchInput(): void {
    clearTimeout(this.searchTimeout);

    if (this.searchQuery.length < 2) {
      this.suggestions.set([]);
      return;
    }

    this.searchTimeout = setTimeout(() => {
      this.weatherService.searchLocation(this.searchQuery).subscribe({
        next: (response: any) => {
          if (response.results) {
            const locations = response.results.map((r: any) => ({
              name: r.name,
              lat: r.latitude,
              lon: r.longitude,
              country: r.country,
              admin1: r.admin1
            }));
            this.suggestions.set(locations);
          }
        }
      });
    }, 300);
  }

  selectLocation(location: Location): void {
    this.searchQuery = location.name;
    this.weatherService.getWeatherByCoordinates(location.lat, location.lon, location.name);
    this.showSuggestions.set(false);
    this.suggestions.set([]);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.suggestions.set([]);
  }

  onBlur(): void {
    setTimeout(() => {
      this.showSuggestions.set(false);
    }, 200);
  }

  getCurrentLocation(): void {
    this.weatherService.getCurrentLocation();
  }
}