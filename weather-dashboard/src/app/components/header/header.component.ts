// src/app/components/header/header.component.ts
import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="header">
      <div class="logo">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
        </svg>
        <h1>Weather Dashboard</h1>
      </div>
      
      <div class="controls">
        <button 
          class="control-btn"
          (click)="themeService.toggleTheme()"
          [attr.aria-label]="themeService.isDarkTheme() ? 'Switch to light mode' : 'Switch to dark mode'">
          
          @if (!themeService.isDarkTheme()) {
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          } @else {
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          }
        </button>

        <button 
          class="control-btn unit-btn"
          (click)="themeService.toggleTemperatureUnit()">
          {{ themeService.getTemperatureSymbol() }}
        </button>
      </div>
    </header>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 2rem;
      background: var(--surface-color);
      border-bottom: 1px solid var(--border-color);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;

      svg {
        color: var(--primary-color);
        stroke-width: 2;
      }

      h1 {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--text-color);
        margin: 0;
      }
    }

    .controls {
      display: flex;
      gap: 0.75rem;
    }

    .control-btn {
      padding: 0.625rem;
      background: var(--background-color);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      cursor: pointer;
      color: var(--text-color);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 44px;
      min-height: 44px;

      &:hover {
        background: var(--primary-color);
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      }

      &:active {
        transform: translateY(0);
      }

      svg {
        stroke: currentColor;
        fill: none;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
    }

    .unit-btn {
      font-weight: 600;
      font-size: 1rem;
      padding: 0.625rem 0.875rem;
    }

    @media (max-width: 768px) {
      .header {
        padding: 1rem 1.5rem;
      }

      .logo h1 {
        font-size: 1.25rem;
      }
    }
  `]
})
export class HeaderComponent {
  constructor(public themeService: ThemeService) {}
}