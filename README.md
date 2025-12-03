# Terri Quintel Astrology - Assessment Project

> ⚠️ **IMPORTANT: DO NOT USE AI TOOLS**
> 
> **This assessment must be completed WITHOUT using AI tools such as Cursor, ChatGPT, GitHub Copilot, or any other AI coding assistants.**
> 
> **If you use AI tools to complete this assessment, you will FAIL.**
> 
> This assessment is designed to evaluate your personal coding skills, problem-solving abilities, and understanding of Angular and TypeScript. Using AI tools defeats the purpose of this assessment and will result in immediate disqualification.

This is an assessment project for Senior Software Engineer candidates. The project consists of a Node.js backend (mostly complete) and an Angular frontend with two tasks to complete.

## Project Structure

```
.
├── backend/          # Node.js/Express API (mostly complete)
├── frontend/         # Angular application with Vite (tasks to complete)
└── README.md         # This file
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB connection string:
```env
MONGODB_URI=mongodb://localhost:27017/terri-quintel-astrology
```

5. Seed the database with sample data (optional):
```bash
npm run seed
```

6. Start the backend server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The backend API will be available at `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend application will be available at `http://localhost:4200`

## API Endpoints

The backend provides the following endpoints:

### Core Endpoints
- `GET /api/health` - Health check endpoint
- `GET /api/charts` - Get all astrological charts (supports pagination, filtering, sorting)
- `GET /api/charts/:id` - Get a specific chart by ID
- `POST /api/charts/calculate` - Calculate a new birth chart
- `PUT /api/charts/:id` - Update a chart
- `DELETE /api/charts/:id` - Delete a chart

### Additional Endpoints
- `GET /api/charts/sign/:sign` - Get charts filtered by sun sign
- `GET /api/charts/stats/summary` - Get statistics about charts

### Query Parameters (for GET /api/charts)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `sunSign` - Filter by sun sign
- `isPublic` - Filter by public/private (true/false)
- `sortBy` - Sort field (default: createdAt)
- `sortOrder` - Sort order: asc/desc (default: desc)

See `backend/README.md` for detailed API documentation.

## Assessment Tasks

### Task 1: Display Astrological Charts

**Location:** `frontend/src/app/task1/task1.component.ts`

**Requirements:**
1. Fetch astrological charts from the API endpoint: `GET /api/charts`
2. Display the charts in a visually appealing card layout
3. Each card should show:
   - Chart name
   - Birth date, time, and location
   - Sun sign, Moon sign, and Rising sign
   - List of planets with their signs and degrees
4. Add loading state while fetching data
5. Handle error states gracefully
6. Make it responsive for mobile devices
7. Add styling to make it look modern and professional

**Expected Time:** 2-3 hours

### Task 2: Birth Chart Calculator

**Location:** `frontend/src/app/task2/task2.component.ts`

**Requirements:**
1. Create a form with the following fields:
   - Birth Date (date picker)
   - Birth Time (time input)
   - Birth Location (text input)
2. Validate all fields are required
3. On form submission, send POST request to `/api/charts/calculate`
4. Display the calculated chart result in a nice format
5. Show loading state during API call
6. Handle errors appropriately
7. Reset form after successful submission
8. Add form validation messages
9. Make the form responsive and user-friendly

**Expected Time:** 2-3 hours

## Evaluation Criteria

> ⚠️ **REMINDER: Using AI tools (Cursor, ChatGPT, GitHub Copilot, etc.) will result in immediate failure of this assessment.**

Candidates will be evaluated on:

1. **Code Quality**
   - Clean, readable, and maintainable code
   - Proper TypeScript usage
   - Component structure and organization

2. **Functionality**
   - All requirements are met
   - Proper error handling
   - Loading states implemented

3. **User Experience**
   - Responsive design
   - Modern and professional styling
   - Good user feedback (loading, errors, success)

4. **Best Practices**
   - Proper use of Angular features (reactive forms, HTTP client, etc.)
   - Component lifecycle management
   - Type safety

## Submission

> ⚠️ **FINAL WARNING: Do NOT use AI tools. Your submission will be reviewed, and use of AI tools will result in immediate disqualification.**

Please submit your completed assessment by:
1. Pushing your code to a Git repository (GitHub, GitLab, etc.)
2. Sharing the repository link
3. Including a brief summary of your implementation approach

## Backend Architecture

The backend follows a clean MVC architecture:
- **Models**: Mongoose schemas (`models/Chart.js`)
- **Controllers**: Business logic (`controllers/chartController.js`)
- **Routes**: API endpoints (`routes/chartRoutes.js`)
- **Middleware**: Validation and error handling
- **Database**: MongoDB with Mongoose ODM

See `backend/README.md` for detailed backend documentation.

## Notes

- ⚠️ **DO NOT USE AI TOOLS** - Using Cursor, ChatGPT, GitHub Copilot, or any AI coding assistants will result in immediate failure
- The backend uses MongoDB for data persistence - make sure MongoDB is running before starting the server
- The backend is mostly complete - focus your efforts on the frontend tasks
- Feel free to add any additional features or improvements you think would enhance the application
- You can use any Angular libraries or styling approaches you prefer (CSS, SCSS, Tailwind, etc.)
- The deadline for completion is 1-2 days from when you receive this assessment

## Questions?

If you have any questions about the assessment, please don't hesitate to reach out.

Good luck!

