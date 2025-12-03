import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
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

interface Planet {
  sign: string;
  degree: number;
}

interface Chart {
  id: number;
  name: string;
  birthDate: string;
  birthTime: string;
  birthLocation: string;
  sunSign: string;
  moonSign: string;
  risingSign: string;
  planets: {
    sun: Planet;
    moon: Planet;
    mercury: Planet;
    venus: Planet;
    mars: Planet;
  };
}

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
      <div class="placeholder">
        <p>Your implementation goes here...</p>
      </div>
    </div>
  `,
  styles: [`
    .task1-container {
      max-width: 1000px;
      margin: 0 auto;
    }
    .task-description {
      color: #666;
      margin-bottom: 2rem;
    }
    .placeholder {
      padding: 3rem;
      text-align: center;
      background: #f5f5f5;
      border-radius: 8px;
      color: #999;
    }
  `]
})
export class Task1Component implements OnInit {
  // TODO: Add your implementation here

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // TODO: Fetch charts from API
  }
}

