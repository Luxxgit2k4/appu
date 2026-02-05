# APPU — Automated Productivity and Prioritization Utility

APPU is a task manager that helps you prioritize work using the **Eisenhower Matrix**:

1. Urgent & Important
2. Not Urgent & Important
3. Urgent & Not Important
4. Not Urgent & Not Important

This project includes:
- A REST API (`server.js`) to manage tasks.
- A CLI (`cli.js`) to interact with the API from terminal.

## Features

- Add tasks with urgency and importance flags.
- Update existing tasks.
- Delete one task or clear all tasks.
- View all tasks and categorized matrix buckets.
- Input validation for cleaner data.

## Setup

```bash
npm install
```

Create a `.env` file (optional):

```env
PORT=3000
APPU_API_URL=http://localhost:3000
```

## Run the server

```bash
node server.js
```

Server starts at `http://localhost:3000` by default.

## CLI Usage

Run commands with:

```bash
node cli.js <command>
```

### Commands

- Add task:
  ```bash
  node cli.js add --name "Write docs" --urgent true --important true
  ```
- List tasks + matrix:
  ```bash
  node cli.js list
  ```
- Update task:
  ```bash
  node cli.js update <taskId> --name "New title" --important true
  ```
- Delete task:
  ```bash
  node cli.js delete <taskId>
  ```
- Clear all tasks:
  ```bash
  node cli.js clear
  ```

## API Endpoints

- `GET /` — welcome message
- `POST /tasks` — create task
- `PATCH /tasks/:id` — update task
- `DELETE /tasks/:id` — delete one task
- `DELETE /tasks` — clear all tasks
- `GET /tasks` — fetch all tasks and matrix buckets

## Testing

```bash
npm test
```
