# Quick Start Guide

> ⚠️ **WARNING: DO NOT USE AI TOOLS**
> 
> **This assessment must be completed WITHOUT AI tools like Cursor, ChatGPT, GitHub Copilot, etc.**
> 
> **If you use AI tools, you will FAIL this assessment.**

## Prerequisites
- Node.js v18 or higher
- npm or yarn

## Setup (5 minutes)

### 1. Backend Setup
```bash
cd backend
npm install
npm start
```
Backend runs on: http://localhost:3000

### 2. Frontend Setup (in a new terminal)
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: http://localhost:4200

### 3. Access the Application
- Open http://localhost:4200 in your browser
- Navigate between Task 1 and Task 2 using the navigation menu

## Testing the API

You can test the backend API directly:

```bash
# Get all charts
curl http://localhost:3000/api/charts

# Get a specific chart
curl http://localhost:3000/api/charts/1

# Calculate a new chart
curl -X POST http://localhost:3000/api/charts/calculate \
  -H "Content-Type: application/json" \
  -d '{"birthDate":"1990-01-01","birthTime":"12:00","birthLocation":"New York, NY"}'
```

## Project Structure

```
backend/
  ├── server.js          # Express API server
  ├── package.json       # Backend dependencies
  └── .gitignore

frontend/
  ├── src/
  │   ├── app/
  │   │   ├── task1/     # Task 1 component (to implement)
  │   │   ├── task2/     # Task 2 component (to implement)
  │   │   ├── services/  # ChartService (optional helper)
  │   │   └── app.component.ts
  │   └── main.ts
  ├── vite.config.ts
  └── package.json

README.md                # Full documentation
ASSESSMENT_INSTRUCTIONS.md  # Instructions for candidates
```

## Next Steps

1. Read `ASSESSMENT_INSTRUCTIONS.md` for task details
2. Review the TODO comments in `task1.component.ts` and `task2.component.ts`
3. Start implementing!

