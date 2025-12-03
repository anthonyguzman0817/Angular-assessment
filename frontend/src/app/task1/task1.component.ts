import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartService, Chart, PaginationInfo } from '../services/chart.service';
import { Subject, takeUntil } from 'rxjs';
// Optional: You can use the ChartService from services/chart.service.ts instead of HttpClient directly
// import { ChartService, Chart } from '../services/chart.service';

// ⚠️ CRITICAL WARNING: DO NOT USE AI TOOLS
// This assessment must be completed WITHOUT using AI tools such as Cursor, ChatGPT, 
// GitHub Copilot, or any other AI coding assistants.
// If you use AI tools to complete this assessment, you will FAIL.

// TODO: Task 1 - Implement this component
// Requirements:
// 1. Fetch astrological charts from the API endpoint: GET /api/charts
// 2. Display the charts in a visually appealing card layout
// 3. Each card should show:
//    - Chart name
//    - Birth date, time, and location
//    - Sun sign, Moon sign, and Rising sign
//    - List of planets with their signs and degrees
// 4. Add loading state while fetching data
// 5. Handle error states gracefully
// 6. Make it responsive for mobile devices
// 7. Add some styling to make it look modern and professional
//
// Note: A ChartService is available in services/chart.service.ts if you prefer to use it

@Component({
  selector: 'app-task1',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="task1-container">
      <h2>Task 1: Display Astrological Charts</h2>
      <p class="task-description">
        Fetch and display astrological charts from the API. 
        Implement the component according to the requirements in the code comments.
      </p>
      
      <!-- TODO: Implement the chart display here -->
      <div *ngIf="loading" class="loading-container">
        <div class="spinner"></div>
        <p>Loading charts...</p>
      </div>

      <div *ngIf="error" class="error-container">
        <div class="error-icon">⚠️</div>
        <h3>Unable to load charts</h3>
        <button class="retry-button" (click)="loadCharts()">Try Again</button>
      </div>

      <div *ngIf="!loading && !error && charts.length === 0" class="empty-state">
        <div class="empty-icon">📊</div>
        <h3>No charts available</h3>
        <p>There are no astrological charts to display at this time.</p>
      </div>

      <div *ngIf="!loading && !error && charts.length > 0" class="charts-section">
        <div class="controls-bar" *ngIf="pagination">
          <div class="pagination-info">
            <span class="info-text">
              Showing {{ getStartIndex() }} - {{ getEndIndex() }} of {{ pagination.totalItems }} charts
            </span>
          </div>
          <div class="items-per-page-control">
            <label for="itemsPerPage" class="items-label">Items per page:</label>
            <select 
              id="itemsPerPage"
              class="items-select"
              [value]="itemsPerPage"
              (change)="onItemsPerPageChange($event)">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </div>
        </div>

        <div class="charts-grid">
          <div *ngFor="let chart of charts" class="chart-card">
          <div class="chart-header">
            <h3 class="chart-name">{{ chart.name }}</h3>
            <span class="chart-number">#{{ getCardNumber(chart) }}</span>
          </div>
          
          <div class="chart-birth-info">
            <div class="info-row">
              <span class="info-label">Birth Date:</span>
              <span class="info-value">{{ formatDate(chart.birthDate) }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Birth Time:</span>
              <span class="info-value">{{ chart.birthTime }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Location:</span>
              <span class="info-value">{{ chart.birthLocation }}</span>
            </div>
          </div>

          <div class="chart-signs">
            <div class="sign-badge sun-sign">
              <span class="sign-label">Sun</span>
              <span class="sign-value">{{ chart.sunSign }}</span>
            </div>
            <div class="sign-badge moon-sign">
              <span class="sign-label">Moon</span>
              <span class="sign-value">{{ chart.moonSign }}</span>
            </div>
            <div class="sign-badge rising-sign">
              <span class="sign-label">Rising</span>
              <span class="sign-value">{{ chart.risingSign }}</span>
            </div>
          </div>

          <div class="chart-planets" *ngIf="chart.planets">
            <h4 class="planets-title">Planetary Positions</h4>
            <div class="planets-list">
              <div class="planet-item" *ngIf="chart.planets.sun">
                <span class="planet-name">Sun</span>
                <span class="planet-details">{{ chart.planets.sun.sign }} {{ formatDegree(chart.planets.sun.degree) }}°</span>
              </div>
              <div class="planet-item" *ngIf="chart.planets.moon">
                <span class="planet-name">Moon</span>
                <span class="planet-details">{{ chart.planets.moon.sign }} {{ formatDegree(chart.planets.moon.degree) }}°</span>
              </div>
              <div class="planet-item" *ngIf="chart.planets.mercury">
                <span class="planet-name">Mercury</span>
                <span class="planet-details">{{ chart.planets.mercury.sign }} {{ formatDegree(chart.planets.mercury.degree) }}°</span>
              </div>
              <div class="planet-item" *ngIf="chart.planets.venus">
                <span class="planet-name">Venus</span>
                <span class="planet-details">{{ chart.planets.venus.sign }} {{ formatDegree(chart.planets.venus.degree) }}°</span>
              </div>
              <div class="planet-item" *ngIf="chart.planets.mars">
                <span class="planet-name">Mars</span>
                <span class="planet-details">{{ chart.planets.mars.sign }} {{ formatDegree(chart.planets.mars.degree) }}°</span>
              </div>
            </div>
          </div>
        </div>
        </div>

        <div class="pagination-controls" *ngIf="pagination && pagination.totalPages > 1">
          <button 
            class="pagination-button"
            [class.disabled]="pagination.currentPage === 1"
            [disabled]="pagination.currentPage === 1"
            (click)="goToPage(1)"
            title="First page">
            ««
          </button>
          <button 
            class="pagination-button"
            [class.disabled]="pagination.currentPage === 1"
            [disabled]="pagination.currentPage === 1"
            (click)="goToPage(pagination.currentPage - 1)"
            title="Previous page">
            ‹
          </button>
          
          <div class="page-numbers">
            <button
              *ngFor="let page of getPageNumbers()"
              class="page-number"
              [class.active]="page === pagination.currentPage"
              [class.ellipsis]="page === -1"
              [disabled]="page === -1"
              (click)="page !== -1 && goToPage(page)">
              {{ page === -1 ? '...' : page }}
            </button>
          </div>

          <button 
            class="pagination-button"
            [class.disabled]="pagination.currentPage === pagination.totalPages"
            [disabled]="pagination.currentPage === pagination.totalPages"
            (click)="goToPage(pagination.currentPage + 1)"
            title="Next page">
            ›
          </button>
          <button 
            class="pagination-button"
            [class.disabled]="pagination.currentPage === pagination.totalPages"
            [disabled]="pagination.currentPage === pagination.totalPages"
            (click)="goToPage(pagination.totalPages)"
            title="Last page">
            »»
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .task1-container {
      max-width: 90vw;
      margin: 0 auto;
      padding: 0 1.5rem;
      width: 90vw;
      box-sizing: border-box;
    }

    h2 {
      font-size: 2rem;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 0.5rem;
    }

    .task-description {
      color: #666;
      margin-bottom: 2rem;
      font-size: 1rem;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      text-align: center;
    }

    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .error-container {
      background: #fff5f5;
      border: 1px solid #feb2b2;
      border-radius: 12px;
      padding: 3rem 2rem;
      text-align: center;
      margin: 2rem 0;
    }

    .error-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .error-container h3 {
      color: #c53030;
      margin-bottom: 0.5rem;
    }

    .error-container p {
      color: #742a2a;
      margin-bottom: 1.5rem;
    }

    .retry-button {
      background: #667eea;
      color: white;
      border: none;
      padding: 0.75rem 2rem;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    }

    .retry-button:hover {
      background: #5568d3;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #666;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .charts-section {
      margin-top: 2rem;
    }

    .controls-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      gap: 1rem;
      flex-wrap: wrap;
      width: 100%;
    }

    .pagination-info {
      flex: 1;
      padding: 0.75rem 1rem;
      background: #f9fafb;
      border-radius: 8px;
      text-align: center;
      min-width: 200px;
    }

    .info-text {
      color: #6b7280;
      font-size: 0.9375rem;
      font-weight: 500;
    }

    .items-per-page-control {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .items-label {
      color: #374151;
      font-size: 0.9375rem;
      font-weight: 500;
      white-space: nowrap;
    }

    .items-select {
      padding: 0.625rem 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 0.9375rem;
      font-weight: 500;
      color: #374151;
      background: white;
      cursor: pointer;
      transition: border-color 0.2s, box-shadow 0.2s;
      min-width: 80px;
    }

    .items-select:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .items-select:hover {
      border-color: #d1d5db;
    }

    .charts-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 2rem;
      margin-bottom: 2rem;
      width: 100%;
      align-items: stretch;
    }

    .pagination-controls {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      margin-top: 2rem;
      flex-wrap: wrap;
    }

    .pagination-button {
      background: white;
      border: 2px solid #e5e7eb;
      color: #374151;
      padding: 0.625rem 1rem;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      min-width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .pagination-button:hover:not(:disabled) {
      background: #667eea;
      border-color: #667eea;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(102, 126, 234, 0.2);
    }

    .pagination-button.disabled,
    .pagination-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: #f3f4f6;
    }

    .page-numbers {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .page-number {
      background: white;
      border: 2px solid #e5e7eb;
      color: #374151;
      padding: 0.625rem 1rem;
      border-radius: 8px;
      font-size: 0.9375rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      min-width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .page-number:hover:not(:disabled):not(.active) {
      background: #f3f4f6;
      border-color: #d1d5db;
    }

    .page-number.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-color: #667eea;
      color: white;
      font-weight: 600;
    }

    .page-number.ellipsis {
      border: none;
      background: transparent;
      cursor: default;
      min-width: auto;
      padding: 0.625rem 0.5rem;
    }

    .page-number.ellipsis:hover {
      background: transparent;
    }

    .chart-card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transition: transform 0.2s, box-shadow 0.2s;
      border: 1px solid #e5e7eb;
      width: 100%;
      min-width: 0;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      height: 100%;
    }

    .chart-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.25rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #f3f4f6;
      min-height: 3.5rem;
    }

    .chart-name {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0;
      word-wrap: break-word;
      overflow-wrap: break-word;
      flex: 1;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.5;
      max-height: 3.75rem;
    }

    .chart-number {
      background: #f3f4f6;
      color: #6b7280;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 500;
      font-family: 'Courier New', monospace;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .chart-birth-info {
      margin-bottom: 1.5rem;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      font-size: 0.9375rem;
    }

    .info-label {
      color: #6b7280;
      font-weight: 500;
    }

    .info-value {
      color: #1a1a1a;
      font-weight: 400;
    }

    .chart-signs {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .sign-badge {
      flex: 1;
      min-width: 80px;
      padding: 0.75rem;
      border-radius: 10px;
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .sun-sign {
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      color: white;
    }

    .moon-sign {
      background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%);
      color: white;
    }

    .rising-sign {
      background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
      color: white;
    }

    .sign-label {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      opacity: 0.9;
    }

    .sign-value {
      font-size: 1rem;
      font-weight: 700;
    }

    .chart-planets {
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e5e7eb;
    }

    .planets-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0 0 1rem 0;
    }

    .planets-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .planet-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.625rem;
      background: #f9fafb;
      border-radius: 8px;
      font-size: 0.9375rem;
    }

    .planet-name {
      font-weight: 600;
      color: #374151;
    }

    .planet-details {
      color: #6b7280;
      font-weight: 500;
    }

    @media (max-width: 1400px) {
      .charts-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    @media (max-width: 1100px) {
      .charts-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 768px) {
      .charts-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
      }

      .chart-card {
        padding: 1.25rem;
      }

      h2 {
        font-size: 1.75rem;
      }

      .chart-signs {
        flex-direction: column;
      }

      .sign-badge {
        min-width: 100%;
      }

      .controls-bar {
        flex-direction: column;
        align-items: stretch;
      }

      .pagination-info {
        min-width: auto;
      }

      .items-per-page-control {
        justify-content: center;
        width: 100%;
      }

      .pagination-controls {
        gap: 0.25rem;
      }

      .pagination-button,
      .page-number {
        min-width: 40px;
        height: 40px;
        padding: 0.5rem 0.75rem;
        font-size: 0.875rem;
      }

      .page-numbers {
        gap: 0.25rem;
      }
    }

    @media (max-width: 480px) {
      .charts-grid {
        grid-template-columns: 1fr;
      }

      .task1-container {
        padding: 0 0.5rem;
      }

      .chart-card {
        padding: 1rem;
      }
    }
  `]
})
export class Task1Component implements OnInit, OnDestroy {
  // TODO: Add your implementation here
  charts: Chart[] = [];
  pagination: PaginationInfo | null = null;
  loading = false;
  error: string | null = null;
  currentPage = 1;
  itemsPerPage = 10;
  private destroy$ = new Subject<void>();

  constructor(private chartService: ChartService) {}

  ngOnInit() {
    // TODO: Fetch charts from API
    this.loadCharts();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCharts(page: number = 1) {
    this.loading = true;
    this.error = null;
    this.currentPage = page;

    this.chartService.getAllCharts({
      page: this.currentPage,
      limit: this.itemsPerPage,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.charts = response.charts;
          this.pagination = response.pagination;
          this.loading = false;
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        error: (err: any) => {
          this.error = err.error?.message || err.message || 'Failed to load charts. Please try again later.';
          this.loading = false;
        }
      });
  }

  onItemsPerPageChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const newItemsPerPage = parseInt(target.value, 10);
    
    if (newItemsPerPage !== this.itemsPerPage) {
      this.itemsPerPage = newItemsPerPage;
      this.loadCharts(1);
    }
  }

  goToPage(page: number) {
    if (page >= 1 && this.pagination && page <= this.pagination.totalPages) {
      this.loadCharts(page);
    }
  }

  getPageNumbers(): number[] {
    if (!this.pagination) return [];
    
    const totalPages = this.pagination.totalPages;
    const currentPage = this.pagination.currentPage;
    const pages: number[] = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push(-1);
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push(-1);
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push(-1);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push(-1);
        pages.push(totalPages);
      }
    }
    
    return pages;
  }

  getStartIndex(): number {
    if (!this.pagination) return 0;
    return (this.pagination.currentPage - 1) * this.pagination.itemsPerPage + 1;
  }

  getEndIndex(): number {
    if (!this.pagination) return 0;
    return (this.pagination.currentPage - 1) * this.pagination.itemsPerPage + this.pagination.count;
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  formatDegree(degree: number): string {
    return degree.toFixed(2);
  }

  getCardNumber(chart: Chart): string {
    const id = chart._id || chart.id || '';
    if (!id) return '';
    const idString = id.toString();
    return idString.length >= 6 ? idString.slice(-6) : idString;
  }
}
