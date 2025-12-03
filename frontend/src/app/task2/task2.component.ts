import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChartService, Chart } from '../services/chart.service';
import { Subject, takeUntil } from 'rxjs';
// Optional: You can use the ChartService from services/chart.service.ts instead of HttpClient directly
// import { ChartService, Chart, CalculateChartRequest } from '../services/chart.service';

// ⚠️ CRITICAL WARNING: DO NOT USE AI TOOLS
// This assessment must be completed WITHOUT using AI tools such as Cursor, ChatGPT, 
// GitHub Copilot, or any other AI coding assistants.
// If you use AI tools to complete this assessment, you will FAIL.

// TODO: Task 2 - Implement this component
// Requirements:
// 1. Create a form with the following fields:
//    - Birth Date (date picker)
//    - Birth Time (time input)
//    - Birth Location (text input)
// 2. Validate all fields are required
// 3. On form submission, send POST request to /api/charts/calculate
// 4. Display the calculated chart result in a nice format
// 5. Show loading state during API call
// 6. Handle errors appropriately
// 7. Reset form after successful submission
// 8. Add form validation messages
// 9. Make the form responsive and user-friendly
//
// Note: A ChartService is available in services/chart.service.ts if you prefer to use it

interface ChartResult {
  id: number;
  name: string;
  birthDate: string;
  birthTime: string;
  birthLocation: string;
  sunSign: string;
  moonSign: string;
  risingSign: string;
  planets: {
    sun: { sign: string; degree: number };
    moon: { sign: string; degree: number };
    mercury: { sign: string; degree: number };
    venus: { sign: string; degree: number };
    mars: { sign: string; degree: number };
  };
}

@Component({
  selector: 'app-task2',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="task2-container">
      <h2>Task 2: Birth Chart Calculator</h2>
      <p class="task-description">
        Create a form to calculate and display birth chart information.
        Implement the component according to the requirements in the code comments.
      </p>
      
      <!-- TODO: Implement the form and result display here -->
      <form [formGroup]="chartForm" (ngSubmit)="onSubmit()" class="chart-form">
        <div class="form-group">
          <label for="birthDate" class="form-label">
            Birth Date <span class="required">*</span>
          </label>
          <input
            type="date"
            id="birthDate"
            formControlName="birthDate"
            class="form-input"
            [class.error]="isFieldInvalid('birthDate')"
            [max]="maxDate"
          />
          <div *ngIf="isFieldInvalid('birthDate')" class="error-message">
            <span *ngIf="chartForm.get('birthDate')?.errors?.['required']">
              Birth date is required
            </span>
          </div>
        </div>

        <div class="form-group">
          <label for="birthTime" class="form-label">
            Birth Time <span class="required">*</span>
          </label>
          <input
            type="time"
            id="birthTime"
            formControlName="birthTime"
            class="form-input"
            [class.error]="isFieldInvalid('birthTime')"
          />
          <div *ngIf="isFieldInvalid('birthTime')" class="error-message">
            <span *ngIf="chartForm.get('birthTime')?.errors?.['required']">
              Birth time is required
            </span>
          </div>
        </div>

        <div class="form-group">
          <label for="birthLocation" class="form-label">
            Birth Location <span class="required">*</span>
          </label>
          <input
            type="text"
            id="birthLocation"
            formControlName="birthLocation"
            class="form-input"
            [class.error]="isFieldInvalid('birthLocation')"
            placeholder="e.g., New York, NY"
          />
          <div *ngIf="isFieldInvalid('birthLocation')" class="error-message">
            <span *ngIf="chartForm.get('birthLocation')?.errors?.['required']">
              Birth location is required
            </span>
          </div>
        </div>

        <button
          type="submit"
          class="submit-button"
          [disabled]="chartForm.invalid || calculating"
        >
          <span *ngIf="!calculating">Calculate Chart</span>
          <span *ngIf="calculating" class="button-loading">
            <span class="button-spinner"></span>
            Calculating...
          </span>
        </button>
      </form>

      <div *ngIf="error" class="error-container">
        <div class="error-icon">⚠️</div>
        <h3>Calculation Error</h3>
        <p>{{ error }}</p>
        <button class="retry-button" (click)="clearError()">Dismiss</button>
      </div>

      <div *ngIf="calculatedChart && !calculating && calculatedChart.planets" class="result-container">
        <div class="result-header">
          <h3>Your Birth Chart</h3>
          <span class="result-id">Chart #{{ calculatedChart.id || calculatedChart._id }}</span>
        </div>

        <div class="result-birth-info">
          <div class="result-info-row">
            <span class="result-label">Birth Date:</span>
            <span class="result-value">{{ formatDate(calculatedChart.birthDate) }}</span>
          </div>
          <div class="result-info-row">
            <span class="result-label">Birth Time:</span>
            <span class="result-value">{{ calculatedChart.birthTime }}</span>
          </div>
          <div class="result-info-row">
            <span class="result-label">Location:</span>
            <span class="result-value">{{ calculatedChart.birthLocation }}</span>
          </div>
        </div>

        <div class="result-signs">
          <div class="result-sign-badge sun-sign">
            <span class="result-sign-label">Sun</span>
            <span class="result-sign-value">{{ calculatedChart.sunSign }}</span>
          </div>
          <div class="result-sign-badge moon-sign">
            <span class="result-sign-label">Moon</span>
            <span class="result-sign-value">{{ calculatedChart.moonSign }}</span>
          </div>
          <div class="result-sign-badge rising-sign">
            <span class="result-sign-label">Rising</span>
            <span class="result-sign-value">{{ calculatedChart.risingSign }}</span>
          </div>
        </div>

        <div class="result-planets">
          <h4 class="result-planets-title">Planetary Positions</h4>
          <div class="result-planets-list">
            <div class="result-planet-item" *ngIf="calculatedChart.planets.sun">
              <span class="result-planet-name">Sun</span>
              <span class="result-planet-details">{{ calculatedChart.planets.sun.sign }} {{ formatDegree(calculatedChart.planets.sun.degree) }}°</span>
            </div>
            <div class="result-planet-item" *ngIf="calculatedChart.planets.moon">
              <span class="result-planet-name">Moon</span>
              <span class="result-planet-details">{{ calculatedChart.planets.moon.sign }} {{ formatDegree(calculatedChart.planets.moon.degree) }}°</span>
            </div>
            <div class="result-planet-item" *ngIf="calculatedChart.planets.mercury">
              <span class="result-planet-name">Mercury</span>
              <span class="result-planet-details">{{ calculatedChart.planets.mercury.sign }} {{ formatDegree(calculatedChart.planets.mercury.degree) }}°</span>
            </div>
            <div class="result-planet-item" *ngIf="calculatedChart.planets.venus">
              <span class="result-planet-name">Venus</span>
              <span class="result-planet-details">{{ calculatedChart.planets.venus.sign }} {{ formatDegree(calculatedChart.planets.venus.degree) }}°</span>
            </div>
            <div class="result-planet-item" *ngIf="calculatedChart.planets.mars">
              <span class="result-planet-name">Mars</span>
              <span class="result-planet-details">{{ calculatedChart.planets.mars.sign }} {{ formatDegree(calculatedChart.planets.mars.degree) }}°</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .task2-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 0 1rem;
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

    .chart-form {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      border: 1px solid #e5e7eb;
      margin-bottom: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-label {
      display: block;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.5rem;
      font-size: 0.9375rem;
    }

    .required {
      color: #ef4444;
    }

    .form-input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 10px;
      font-size: 1rem;
      transition: border-color 0.2s, box-shadow 0.2s;
      box-sizing: border-box;
    }

    .form-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-input.error {
      border-color: #ef4444;
    }

    .error-message {
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 0.5rem;
      display: block;
    }

    .submit-button {
      width: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      margin-top: 0.5rem;
    }

    .submit-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .submit-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .button-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .button-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .error-container {
      background: #fff5f5;
      border: 1px solid #feb2b2;
      border-radius: 12px;
      padding: 2rem;
      text-align: center;
      margin-bottom: 2rem;
    }

    .error-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .error-container h3 {
      color: #c53030;
      margin-bottom: 0.5rem;
      font-size: 1.25rem;
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

    .result-container {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      border: 1px solid #e5e7eb;
      animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #f3f4f6;
    }

    .result-header h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0;
    }

    .result-id {
      background: #f3f4f6;
      color: #6b7280;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .result-birth-info {
      margin-bottom: 1.5rem;
    }

    .result-info-row {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem 0;
      font-size: 1rem;
      border-bottom: 1px solid #f3f4f6;
    }

    .result-info-row:last-child {
      border-bottom: none;
    }

    .result-label {
      color: #6b7280;
      font-weight: 500;
    }

    .result-value {
      color: #1a1a1a;
      font-weight: 400;
    }

    .result-signs {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .result-sign-badge {
      flex: 1;
      min-width: 100px;
      padding: 1rem;
      border-radius: 12px;
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
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

    .result-sign-label {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      opacity: 0.9;
    }

    .result-sign-value {
      font-size: 1.125rem;
      font-weight: 700;
    }

    .result-planets {
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e5e7eb;
    }

    .result-planets-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0 0 1rem 0;
    }

    .result-planets-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .result-planet-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.875rem;
      background: #f9fafb;
      border-radius: 10px;
      font-size: 1rem;
    }

    .result-planet-name {
      font-weight: 600;
      color: #374151;
    }

    .result-planet-details {
      color: #6b7280;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .chart-form,
      .result-container {
        padding: 1.5rem;
      }

      h2 {
        font-size: 1.75rem;
      }

      .result-signs {
        flex-direction: column;
      }

      .result-sign-badge {
        min-width: 100%;
      }

      .result-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }
    }

    @media (max-width: 480px) {
      .task2-container {
        padding: 0 0.5rem;
      }

      .chart-form,
      .result-container {
        padding: 1.25rem;
      }
    }
  `]
})
export class Task2Component implements OnDestroy {
  // TODO: Add your implementation here
  chartForm: FormGroup;
  calculatedChart: Chart | null = null;
  calculating = false;
  error: string | null = null;
  maxDate: string;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private chartService: ChartService
  ) {
    const today = new Date();
    this.maxDate = today.toISOString().split('T')[0];

    this.chartForm = this.fb.group({
      birthDate: ['', [Validators.required]],
      birthTime: ['', [Validators.required]],
      birthLocation: ['', [Validators.required]]
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.chartForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit() {
    if (this.chartForm.invalid) {
      this.chartForm.markAllAsTouched();
      return;
    }

    this.calculating = true;
    this.error = null;
    this.calculatedChart = null;

    const formValue = this.chartForm.value;
    const request = {
      birthDate: formValue.birthDate,
      birthTime: formValue.birthTime,
      birthLocation: formValue.birthLocation.trim()
    };

    this.chartService.calculateChart(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (chart: Chart) => {
          this.calculatedChart = chart;
          this.calculating = false;
          this.chartForm.reset();
          this.chartForm.markAsUntouched();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        error: (err: any) => {
          this.error = err.error?.message || err.message || 'Failed to calculate chart. Please check your input and try again.';
          this.calculating = false;
        }
      });
  }

  clearError() {
    this.error = null;
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
}

