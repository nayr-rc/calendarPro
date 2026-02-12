# CalendarPro

A complete multi-container calendar application built with SvelteKit, ASP.NET Core, and MongoDB.

## Features

- **Frontend**: SvelteKit with TailwindCSS & DaisyUI (Static Adapter)
- **Backend**: ASP.NET Core 8.0 API
- **Database**: MongoDB (Containerized)
- **Testing**: Playwright E2E Tests
- **Infrastructure**: Docker Compose

## Prerequisites

- Docker Desktop
- Node.js (for local development)
- .NET SDK (for local development)

## Quick Start

1. Start the application:
   ```bash
   docker compose up --build
   ```

2. Access the application:
   http://localhost:5174

## Project Structure

- `frontend/`: SvelteKit application
- `backend/`: ASP.NET Core API
- `docker-compose.yml`: Service orchestration

## Running Tests

To run the Playwright tests against the running application:

1. Ensure the app is running (docker compose up)
2. In a new terminal:
   ```bash
   cd frontend
   npm install
   npx playwright install --with-deps chromium
   npm run test:e2e
   ```

## Development

- **Frontend**: `cd frontend && npm run dev` (Port 5174)
- **Backend**: `cd backend && dotnet run` (Port 5000)

## API Endpoints

- `GET /events`: List all events
- `POST /events`: Create a new event
- `GET /events/{id}`: Get a specific event
- `PUT /events/{id}`: Update an event
- `DELETE /events/{id}`: Delete an event
