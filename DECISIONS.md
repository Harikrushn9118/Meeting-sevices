# Technical Decisions

## Database Choice
**Choice:** SQLite with Prisma ORM  
**Why:** Zero-configuration, file-based database for simple local development, heavily fortified with Prisma ORM for type safety, schema migrations, and enterprise-grade codebase organization. Using an ORM isolates the business logic from raw SQL queries, making it simple to switch to PostgreSQL in production.  
**Alternatives considered:** Raw `sqlite3` driver, MongoDB.  
**Trade-offs:** Prisma adds an extra abstraction layer and generates a client folder, but significantly improves developer experience and database safety.

## Authentication Strategy
**Choice:** JWT (JSON Web Tokens)  
**Why:** Stateless authentication that does not require server-side session storage. Each request carries its own auth context via the `Authorization: Bearer <token>` header.  
**Alternatives considered:** Session-based authentication with cookies.  
**Trade-offs:** JWTs cannot be revoked before expiration without a server-side blocklist, but for this scope, token-based auth simplifies the implementation.

## AI Provider
**Choice:** Google Gemini API (gemini-2.5-flash)  
**Why:** Gemini provides strong structured JSON output capabilities, which is critical for enforcing the citation schema. The flash variant keeps response times fast.  
**Alternatives considered:** OpenAI GPT-4, Claude.  
**Trade-offs:** Depends on external API availability.

## External Integration
**Choice:** Slack/Discord Webhook  
**Why:** Webhooks are the simplest form of real third-party integration. A single `POST` request with a JSON body delivers a notification to a real channel.  
**Alternatives considered:** Email (SendGrid), Telegram Bot API.  
**Trade-offs:** Requires the user to set up a webhook URL, but avoids heavy SDK dependencies.

## Project Structure
**Choice:** Layered MVC architecture (Models, Services, Controllers, Routes, Middlewares)  
**Why:** Separates database access, business logic, and HTTP handling into distinct layers. This makes the codebase maintainable, testable, and easy to navigate for reviewers.  
**Alternatives considered:** Single-file flat structure.  
**Trade-offs:** More files to manage, but significantly better code organization and scalability.
