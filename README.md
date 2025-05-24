# Task Master


A full-stack application to create, view, update, and delete tasks, with a user-friendly interface and persistent storage.

## Tech Stack

- **Backend:** TypeScript, Bun runtime, SQLite database, HTML serving with htmx
- **Frontend:** HTML, CSS, JavaScript, htmx, Alpine.js
- **Deployment:** Fly.io (with persistent volume for SQLite database)

## Features

- Create, retrieve, update, and delete tasks
- Task properties: Title, Description (optional), Status, Due date/time
- User-friendly frontend with dynamic updates (htmx + Alpine.js)
- API documentation and validation
- Unit tests included

## Getting Started

1. Clone the repository
2. Install dependencies (requires Bun)
3. Run the server:  
   ```sh
   bun run start
   ```
4. Access the app in your browser

## Deployment

- Deployed on Fly.io with a persistent volume for the SQLite database
