# Changelog

## [1.0.0] - 2026-06-06

### Added
- Express server with layered MVC architecture (Models, Services, Controllers, Routes, Middlewares).
- Unified API response format with `traceId`, `success`, and `data`/`error` fields.
- Structured JSON logging with request traceability.
- SQLite database with tables for Users, Meetings, Action Items, and Meeting Analysis.
- JWT-based authentication (`POST /api/register`, `POST /api/login`).
- Meeting management endpoints (Create, List, Get by ID).
- AI Meeting Analysis using Google Gemini with enforced transcript citations.
- Analysis results are persisted to the `meeting_analysis` table.
- Action Item management (Create, List with filters, Update Status, Get Overdue).
- `node-cron` scheduled job that checks for overdue action items every minute.
- Webhook integration to send reminder notifications to Slack/Discord.
- Input validation middleware for required fields.
- Health check (`GET /health`) and evaluation (`GET /api/evaluation`) endpoints.
- Documentation: README.md, DECISIONS.md, AI_APPROACH.md, TESTING.md, CHANGELOG.md, CHECKLIST.md.
