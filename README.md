# Gemini AI Agent (TypeScript)

A TypeScript-based AI Agent powered by Google's Gemini 2.5 Flash-Lite model with tool-calling capabilities.

This project demonstrates how to build an AI agent that can:

* Chat with users through a CLI interface
* Use tools/functions automatically
* Fetch real-time weather information
* Access system information such as current time
* Query recent agent activity from PostgreSQL
* Be extended with additional tools and integrations

## Features

* Gemini 2.5 Flash-Lite
* TypeScript
* Function Calling / Tool Usage
* Real-Time Weather Lookup
* Interactive CLI Chat
* Modular Architecture
* Easily Extensible

---

## Project Structure

```text
gemini-agent/
│
├── package.json
├── tsconfig.json
├── .env
│
└── src/
    ├── index.ts
    ├── agent.ts
    │
    ├── services/
    │   └── weatherService.ts
    │
    └── tools/
        ├── weather.ts
        ├── currentTime.ts
        └── recentAgentActivity.ts
```

---

## Prerequisites

* Node.js 18+
* npm
* Google Gemini API Key

---

## Installation

### Clone the Repository

```bash
git clone <your-repository-url>
cd gemini-agent
```

### Install Dependencies

```bash
npm install
```

### Create Environment File

Create a `.env` file in the root directory:

```env
GEMINI_API_KEY=YOUR_API_KEY_HERE
```

Generate a Gemini API key from Google AI Studio.

---

## Running the Application

Start the agent:

```bash
npm run dev
```

Expected output:

```text
Gemini Agent Started
```

Ask questions:

```text
You: What time is it?

Agent: The current time is 2026-06-07T09:15:23.123Z
```

```text
You: What's the weather in Kuala Lumpur?

Agent: The current weather in Kuala Lumpur is 31°C with moderate humidity.
```

Exit the application:

```text
exit
```

---

## Available Tools

### Weather Tool

Fetches real-time weather data using Open-Meteo APIs.

Example:

```text
What's the weather in Tokyo?
```

Returns:

```json
{
  "city": "Tokyo",
  "country": "Japan",
  "temperature": 27.4,
  "humidity": 71,
  "windSpeed": 11.2
}
```

### Current Time Tool

Returns the current system time.

Example:

```text
What time is it?
```

Returns:

```json
{
  "currentTime": "2026-06-07T09:15:23.123Z"
}
```

### Recent Agent Activity Tool

Fetches recent rows from a PostgreSQL table named `agent_activity`.

Example:

```text
Show me the last 5 agent messages.
```

Returns:

```json
{
  "table": "agent_activity",
  "limit": 5,
  "rows": [
    {
      "created_at": "2026-06-07T01:22:11.000Z",
      "role": "user",
      "content": "Show me the last 5 agent messages."
    }
  ]
}
```

Environment:

```env
DATABASE_URL=postgres://user:password@localhost:5432/ai_agent
```

---

## Architecture

The project follows a simple layered architecture.

```text
User
  │
  ▼
CLI Interface
  │
  ▼
Agent
  │
  ├── Tool Selection
  │
  ├── Weather Tool
  │
  └── Time Tool
          │
          ▼
     External APIs
```

### Responsibilities

#### index.ts

Application entry point.

Responsible for:

* User interaction
* CLI loop
* Sending prompts to the agent

#### agent.ts

Core agent orchestration.

Responsible for:

* Calling Gemini
* Processing function calls
* Executing tools
* Returning final responses

#### tools/

Contains tool wrappers used by the agent.

Examples:

* Weather
* Time
* AWS
* GitHub
* Database

#### services/

Contains integrations with external systems.

Examples:

* Weather APIs
* Databases
* Cloud Providers
* Internal APIs

---

## Extending the Agent

New tools can be added by:

### 1. Create a Tool

```ts
export async function getNews(topic: string) {
  return {
    topic,
    articles: []
  };
}
```

### 2. Register the Tool

Add the tool declaration inside `agent.ts`.

### 3. Handle Function Execution

Add a new case to the function switch statement.

```ts
case "getNews":
  toolResult = await getNews(
    functionCall.args.topic
  );
  break;
```

---

## Future Enhancements

### Conversation Memory

Store previous interactions:

* In-memory
* SQLite
* PostgreSQL

### RAG (Retrieval-Augmented Generation)

Allow the agent to search:

* PDFs
* Documentation
* Knowledge Bases
* Internal Company Data

### AWS Integration

Potential tools:

* List S3 Buckets
* View ECS Services
* Check Lambda Functions
* Read CloudWatch Logs

### GitHub Integration

Potential tools:

* List Pull Requests
* Create Issues
* Review Repositories
* Trigger Workflows

### Database Integration

Potential tools:

* Query PostgreSQL
* Search Records
* Generate Reports

### Multi-Step Agent Workflows

Allow the model to:

1. Decide which tools to call
2. Execute tools
3. Analyze results
4. Call additional tools
5. Produce a final answer

---

## Example Roadmap

```text
v1 - CLI Chatbot
v2 - Tool Calling
v3 - Real-Time Weather
v4 - Memory
v5 - RAG
v6 - AWS Tools
v7 - GitHub Tools
v8 - Multi-Step Agent
v9 - Web Dashboard
v10 - Production Deployment
```

---

## Tech Stack

* TypeScript
* Node.js
* Google Gemini 2.5 Flash-Lite
* Open-Meteo API
* Zod
* dotenv

---
