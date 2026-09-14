# Nebula TechOps AI Prototype

Full-stack MVP for automating support ticket classification and drafting AI-agent responses.

**Stack:** Node.js, Express, TypeScript, React, Vite, OpenRouter API (Llama 3.1).

👉 **[Read the Full Technical Evaluation & Architectural Decisions here](backend/docs/evaluation.md)**

## Features

- **Task 1: Ticket Classifier:** Categorizes tickets based on strict business hierarchies.
- **Task 2: AI Assistant:** Generates a summary, retrieves Knowledge Base context, and drafts 3 tone-specific responses.
- **Human-in-the-Loop:** Automatically flags tickets requiring manual intervention (e.g., legal threats, complex refunds).

## How to Run

You can run this project either using **Docker (Recommended)** or via standard local npm scripts.

### Option A: Run with Docker (Recommended)

**Prerequisites:** Docker & Docker Compose installed, plus an OpenRouter API Key.

1. Navigate to the `backend` folder and set up your environment variables:

```bash
cd backend
cp .env.example .env
```

Open backend/.env and insert your OPENROUTER_API_KEY.

Return to the root directory and start the containers:

```bash
cd ..
docker compose up -d --build
```

The application is now running!

Frontend: <http://localhost:5173>

Backend API: <http://localhost:3001>

(To stop the containers, run docker compose down)

### Option B: Run Locally (Node.js)

### 1. Prerequisites

- Node.js (v22+)
- OpenRouter API Key

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory based on the `.env.example`:

```env
PORT=3001
OPENROUTER_API_KEY=your_api_key_here
```

Start the backend server:

```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal window:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.
