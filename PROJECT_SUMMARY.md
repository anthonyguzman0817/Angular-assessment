# Project Summary

> ⚠️ **IMPORTANT: AI TOOLS ARE PROHIBITED**
> 
> **Candidates must NOT use AI tools such as Cursor, ChatGPT, GitHub Copilot, or any other AI coding assistants.**
> 
> **Use of AI tools will result in immediate failure of this assessment.**

## Overview
This assessment project is designed to evaluate candidates' frontend development skills using Angular with Vite. The backend is provided and mostly complete, allowing candidates to focus on frontend implementation.

## Technology Stack

### Backend
- **Node.js** with Express
- **CORS** enabled for frontend communication
- **RESTful API** with 3 main endpoints

### Frontend
- **Angular 17** (standalone components)
- **Vite** as build tool
- **TypeScript**
- **RxJS** for reactive programming
- **Angular Router** for navigation
- **Angular Forms** (Reactive Forms)

## Assessment Tasks

### Task 1: Chart Display Component
- **Complexity:** Medium
- **Focus:** Data fetching, display, error handling, responsive design
- **Estimated Time:** 2-3 hours
- **Key Skills Tested:**
  - HTTP client usage
  - Component lifecycle
  - Error handling
  - Responsive CSS
  - TypeScript interfaces

### Task 2: Birth Chart Calculator
- **Complexity:** Medium
- **Focus:** Form handling, validation, API integration
- **Estimated Time:** 2-3 hours
- **Key Skills Tested:**
  - Reactive forms
  - Form validation
  - HTTP POST requests
  - User feedback (loading, errors)
  - Form state management

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/charts` | Get all charts |
| GET | `/api/charts/:id` | Get chart by ID |
| POST | `/api/charts/calculate` | Calculate new chart |

## File Structure

```
.
├── backend/
│   ├── server.js           # Express API (complete)
│   ├── package.json
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── app.component.ts      # Main app component
│   │   │   ├── app.routes.ts         # Routing configuration
│   │   │   ├── task1/
│   │   │   │   └── task1.component.ts  # Task 1 (to implement)
│   │   │   ├── task2/
│   │   │   │   └── task2.component.ts  # Task 2 (to implement)
│   │   │   └── services/
│   │   │       └── chart.service.ts    # Optional API service
│   │   ├── main.ts                    # Application bootstrap
│   │   └── styles.css                 # Global styles
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── README.md
├── ASSESSMENT_INSTRUCTIONS.md
├── QUICK_START.md
└── PROJECT_SUMMARY.md (this file)
```

## Evaluation Criteria

1. **Code Quality** (30%)
   - Clean, readable code
   - Proper TypeScript usage
   - Component organization

2. **Functionality** (30%)
   - All requirements met
   - Error handling
   - Loading states

3. **User Experience** (25%)
   - Responsive design
   - Modern styling
   - Good user feedback

4. **Best Practices** (15%)
   - Angular patterns
   - Type safety
   - Component lifecycle

## Notes for Reviewers

- Backend is intentionally simple - it's a mock API
- Candidates can use the provided ChartService or implement their own HTTP calls
- Styling approach is flexible (CSS, SCSS, Tailwind, etc.)
- Additional features are welcome if time permits
- Focus should be on frontend implementation quality

## Expected Deliverables

1. Completed `task1.component.ts` with full implementation
2. Completed `task2.component.ts` with full implementation
3. Git repository with commit history
4. Brief summary of implementation approach (optional but recommended)

