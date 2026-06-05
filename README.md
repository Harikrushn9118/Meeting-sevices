# Meeting Intelligence Service

A backend service for managing meetings, extracting AI-powered insights (summaries, action items, decisions with transcript citations), and sending scheduled reminders for overdue tasks via Slack/Discord webhooks.

## Tech Stack

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** SQLite
- **AI:** Google Gemini API
- **Scheduler:** node-cron
- **Auth:** JWT
- **External Integration:** Slack/Discord Webhook

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/Harikrushn9118/Meeting-sevices.git
cd Meeting-sevices
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```
PORT=3000
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_google_gemini_api_key
WEBHOOK_URL=your_slack_or_discord_webhook_url
```

4. Start the server:
```bash
npm start
```

The server will start on `http://localhost:3000` and the SQLite database (`database.sqlite`) will be created automatically.

## Project Structure

```
src/
├── config/
│   ├── db.config.js         # SQLite database initialization
│   └── env.config.js         # Environment variable config
├── controllers/
│   ├── auth.controller.js    # Register & Login handlers
│   ├── meeting.controller.js # Meeting CRUD & AI analysis
│   ├── actionItem.controller.js # Action item management
│   └── health.controller.js  # Health & evaluation endpoints
├── middlewares/
│   ├── auth.middleware.js     # JWT verification
│   ├── trace.middleware.js    # Trace ID injection
│   ├── validation.middleware.js # Input validation
│   └── error.middleware.js    # Global error handler
├── models/
│   ├── user.model.js          # User DB queries
│   ├── meeting.model.js       # Meeting & analysis DB queries
│   └── actionItem.model.js   # Action item DB queries
├── routes/
│   ├── auth.routes.js
│   ├── meeting.routes.js
│   ├── actionItem.routes.js
│   └── index.js               # Main router
├── services/
│   ├── auth.service.js        # Auth business logic
│   ├── meeting.service.js     # Meeting business logic
│   ├── ai.service.js          # Gemini AI integration
│   ├── actionItem.service.js  # Action item business logic
│   └── cron.service.js        # Scheduled reminder jobs
├── utils/
│   ├── response.util.js       # Unified API response format
│   └── logger.util.js         # Structured JSON logger
├── app.js                     # Express app configuration
└── server.js                  # Entry point
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register a new user |
| POST | `/api/login` | Login and receive JWT token |

### Meetings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/meetings` | Create a new meeting with transcript |
| GET | `/api/meetings` | List all meetings (paginated) |
| GET | `/api/meetings/:id` | Get a specific meeting |
| POST | `/api/meetings/:id/analyze` | Run AI analysis on transcript |
| GET | `/api/meetings/:id/analysis` | Get saved analysis results |

### Action Items
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/action-items` | Create an action item |
| GET | `/api/action-items` | List action items (filterable) |
| PATCH | `/api/action-items/:id/status` | Update action item status |
| GET | `/api/action-items/overdue` | Get overdue action items |

### System
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/evaluation` | Candidate evaluation info |

## API Usage Examples

**Register**
```bash
curl -X POST http://localhost:3000/api/register \
-H "Content-Type: application/json" \
-d '{"username": "testuser", "password": "password123"}'
```

**Login**
```bash
curl -X POST http://localhost:3000/api/login \
-H "Content-Type: application/json" \
-d '{"username": "testuser", "password": "password123"}'
```

**Create Meeting**
```bash
curl -X POST http://localhost:3000/api/meetings \
-H "Authorization: Bearer YOUR_TOKEN" \
-H "Content-Type: application/json" \
-d '{
  "title": "Sprint Planning",
  "participants": ["Alice", "Bob"],
  "meetingDate": "2026-06-01T10:00:00Z",
  "transcript": [
    {"timestamp": "00:00", "speaker": "Alice", "text": "Lets discuss the launch timeline"},
    {"timestamp": "00:15", "speaker": "Bob", "text": "I think we should launch next Friday"},
    {"timestamp": "00:30", "speaker": "Alice", "text": "Agreed. Bob, can you prepare the deployment checklist?"},
    {"timestamp": "00:45", "speaker": "Bob", "text": "Sure, I will have it ready by Wednesday"}
  ]
}'
```

**Analyze Meeting**
```bash
curl -X POST http://localhost:3000/api/meetings/1/analyze \
-H "Authorization: Bearer YOUR_TOKEN"
```

**Create Action Item**
```bash
curl -X POST http://localhost:3000/api/action-items \
-H "Authorization: Bearer YOUR_TOKEN" \
-H "Content-Type: application/json" \
-d '{"task": "Prepare deployment checklist", "assignee": "Bob", "meetingId": 1, "dueDate": "2026-06-04T00:00:00Z"}'
```

**Update Action Item Status**
```bash
curl -X PATCH http://localhost:3000/api/action-items/1/status \
-H "Authorization: Bearer YOUR_TOKEN" \
-H "Content-Type: application/json" \
-d '{"status": "COMPLETED"}'
```

## Deployment

1. Push the code to GitHub.
2. Connect the repository to Render, Railway, or Fly.io.
3. Set the build command to `npm install` and the start command to `npm start`.
4. Add the environment variables (`JWT_SECRET`, `GEMINI_API_KEY`, `WEBHOOK_URL`) in the platform dashboard.