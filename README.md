# TweetCraft 🚀

TweetCraft is a modern, AI-powered web application designed to help users refine and "elevate" their draft thoughts into polished, timeline-ready tweets. Users can customize their writing tone (e.g., Casual, Persuasive, Witty, Humorous), store personalized system instructions, and keep track of their request credits.

---

## Features
* **AI-Powered Refinement**: Powered by Llama 3.1 8B via Hugging Face Inference API.
* **Custom Tones**: Instantly convert drafts into Casual, Persuasive, Humorous, Formal, and more.
* **Personalized Prompts**: Save a custom core system instruction in your profile to drive how the AI edits your tweets.
* **Credits & Rate Limiting**: Built-in rate limiting powered by Upstash Redis (10 requests/min for logged-in users, 2 requests/hour for guests) with a real-time header count.
* **Google Authentication**: Seamless sign-in/out integration using NextAuth.
* **Stunning Dark UI**: Premium glassmorphic interface with cool magenta highlights.

---

## Local Setup Guide

Follow these steps to spin up the application on your local machine:

### 1. Prerequisites
Ensure you have the following installed:
* **Node.js** (v20+ recommended)
* **pnpm** (or npm/yarn)
* **Docker** (to run local database and cache services)

---

### 2. Run Database and Cache Services
Use Docker to spin up local PostgreSQL and Redis containers:

```bash
# Start PostgreSQL (Database)
docker run --name tweetcraft-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=secretpassword \
  -e POSTGRES_DB=tweetcraft \
  -p 5432:5432 \
  -d postgres

# Start Redis (Rate-limiting)
docker run --name tweetcraft-redis \
  -p 6379:6379 \
  -d redis
```

---

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add your keys:

```env
# NextAuth Settings
NEXTAUTH_SECRET="your_nextauth_secret_key"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth Client Credentials
GOOGLE_CLIENT_ID="your_google_client_id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# Database Connection (Prisma)
DATABASE_URL="postgresql://postgres:secretpassword@localhost:5432/tweetcraft?schema=public"

# Redis Connection (development rate limiting)
REDIS_URL="redis://localhost:6379"

# AI Inference (Hugging Face)
HF_TOKEN="your_hugging_face_user_token"
HF_MODEL="meta-llama/Llama-3.1-8B-Instruct"

# AI Prompts (Defaults)
SYSTEM_PROMPT="You are an expert tweet editor. Your job is to refine tweets for clarity, tone, and impact—without adding new content or exceeding 280 characters."
GEMINI_MODEL="gemini-1.5-flash"
GEMINI_API_KEY="optional_gemini_key"
```

---

### 4. Install Dependencies
Install all package dependencies:

```bash
pnpm install
# or npm install
```

---

### 5. Setup the Database Schema
Push the Prisma schema to your newly created local PostgreSQL database to generate client types and create tables:

```bash
npx prisma db push
```

---

### 6. Run the Application
Start the local development server:

```bash
pnpm run dev
# or npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.
