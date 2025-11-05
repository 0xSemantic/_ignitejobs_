# IgniteJobs

**IgniteJobs** is a personalized job search platform that automates ethical web scraping, leverages AI (Gemini) for semantic job matching, and delivers real-time notifications via WebSocket. The backend is built with FastAPI, SQLite, and Python, ensuring modularity and performance, while the frontend (planned) will use React, Vite, and TailwindCSS for a responsive, user-friendly interface. The system is designed to be robust, secure, and scalable, adhering to the **Single Responsibility Principle (SRP)** and **self-documentation** principles for maintainability.

This README serves as the definitive guide for developers, detailing setup, architecture, usage, testing, deployment, and contribution processes for both the backend (`ignitejobs`) and frontend (`_ignitejobs_`) repositories. It reflects the current state (up to Phase 9 completed) and provides a roadmap for future phases.

## Table of Contents
1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Repository Structure](#repository-structure)
5. [Setup Instructions](#setup-instructions)
   - [Backend Setup](#backend-setup)
   - [Frontend Setup](#frontend-setup)
6. [Usage](#usage)
   - [Backend API](#backend-api)
   - [WebSocket Notifications](#websocket-notifications)
   - [Example Workflow](#example-workflow)
7. [Testing and Validation](#testing-and-validation)
8. [Deployment](#deployment)
9. [Roadmap](#roadmap)
10. [Contribution Guidelines](#contribution-guidelines)
11. [Troubleshooting](#troubleshooting)
12. [License](#license)

## Project Overview

IgniteJobs enables users to define job search preferences, schedule automated scraping of job boards, match jobs using AI, and receive real-time or stored notifications. The backend is fully implemented (Phases 1-9), providing a secure, async API with endpoints for authentication, configurations, scraping, campaigns, notifications, and results. The frontend is planned for Phases 11-16, with deployment in Phase 17.

### Development Principles
- **Single Responsibility Principle (SRP)**: Each file handles one responsibility (e.g., `core/db.py` for database operations, `api/routers/auth_router.py` for auth endpoints).
- **Self-Documentation**: Every file includes a module-level docstring (purpose, dependencies, flow, usage, edge cases, file path), function/class docstrings (args, returns, raises), and inline comments for complex logic (prefixed `# Inline:`).
- **Modularity**: Abstracted components (e.g., DB, LLM) allow swapping implementations (e.g., SQLite to Postgres, Gemini to other models).
- **Security**: JWT authentication, input sanitization (Pydantic), rate limiting (slowapi), and CORS for trusted origins.
- **Performance**: Async I/O, database indexing, and caching-ready design for scalability.

## Features
- **User Management**: Register/login with JWT-based authentication (bcrypt for passwords).
- **Configurations**: Store user preferences (job types, keywords, sites) in SQLite.
- **Scraping Engine**: Ethical scraping of job boards (e.g., Indeed, LinkedIn) with robots.txt compliance using Crawl4AI.
- **AI Matching**: Gemini-powered semantic matching of jobs to user qualifications, with scoring and blurbs.
- **Scheduling**: Async timers for automated, user-defined campaign schedules (e.g., "every 6 hours").
- **Notifications**: Real-time WebSocket notifications and persistent DB storage for offline users.
- **Results**: Paginated, filtered job results (by campaign, score, sorted by timestamp/score).
- **API**: Secure, rate-limited FastAPI endpoints with OpenAPI docs (`/docs`).
- **Future (Planned)**: Responsive React frontend, mobile-first UI, deployment with Docker, and advanced features like resume parsing.

## Architecture

IgniteJobs follows a modular, layered architecture:
- **Backend (`ignitejobs`)**:
  - **Core Layer (`core/`)**: Business logic (DB, auth, scraping, LLM, scheduling, notifications).
  - **API Layer (`api/routers/`)**: RESTful endpoints for each domain (auth, configs, scrape, campaigns, notifications, results).
  - **Utils (`utils/`)**: Shared helpers (logging, validation).
  - **Database**: SQLite with async operations (aiosqlite), abstracted for future Postgres support.
  - **External Services**: Crawl4AI for scraping, LiteLLM for Gemini API calls.
- **Frontend (`_ignitejobs_`, planned)**:
  - React with Vite for fast builds, TailwindCSS for styling, and react-router-dom for navigation.
  - Components for auth, dashboard, configs, campaigns, results, and notifications.
  - WebSocket integration for real-time updates.
- **Communication**: REST API (HTTP) for data, WebSocket for notifications, CORS for frontend-backend integration.
- **Deployment (planned)**: Docker with Gunicorn (backend), Vercel (frontend), SQLite volume for persistence.

## Repository Structure

### Backend (`ignitejobs`)
```
ignitejobs/
├── core/                      # Business logic (SRP: one responsibility per file)
│   ├── app.py                # Server init, lifespan, CORS, rate limiting
│   ├── db.py                 # Async SQLite abstraction
│   ├── auth.py               # Authentication logic (bcrypt, JWT)
│   ├── configs.py            # User configuration handling
│   ├── scraper.py            # Ethical scraping with Crawl4AI
│   ├── llm.py                # Gemini API integration via LiteLLM
│   ├── scheduler.py          # Async campaign scheduling
│   └── notifications.py      # WebSocket and DB notifications
├── api/                      # API endpoints
│   ├── routers/              # Domain-specific routers
│   │   ├── auth_router.py    # Auth endpoints
│   │   ├── config_router.py  # Config endpoints
│   │   ├── scrape_router.py  # Scrape endpoints
│   │   ├── campaign_router.py # Campaign endpoints
│   │   ├── notifications_router.py # Notification endpoints
│   │   ├── results_router.py # Job results endpoints
、手│   │   └── __init__.py        # Export routers
│   └── dependencies.py       # Shared dependencies (e.g., auth)
├── utils/                    # Shared utilities
│   ├── logging_setup.py      # Logging configuration
│   ├── validators.py         # Pydantic models
│   └── helpers.py           # Misc helpers
├── config/                   # Static configurations
│   └── defaults.json         # Default job sites, prompts
├── tests/                    # Tests (planned in Phase 10)
├── .pre-commit-config.yaml   # Code quality hooks
├── requirements.txt          # Python dependencies
├── .env.example              # Environment variable template
├── .env                     # Environment variables
├── .gitignore               # Ignored files
└── README.md                # This file
```

### Frontend (`_ignitejobs_`, planned)
```
_ignitejobs_/
├── src/                      # Source code
│   ├── components/           # React components
│   │   ├── AuthForm.jsx      # Auth forms
│   │   ├── DashboardLayout.jsx # Dashboard UI
│   │   ├── ConfigForm.jsx    # Config UI
│   │   ├── CampaignForm.jsx  # Campaign UI
│   │   ├── ResultsList.jsx   # Results display
│   │   └── NotificationPanel.jsx # Notifications UI
│   ├── api/                  # API services
│   │   ├── authService.js    # Auth API calls
│   │   ├── configService.js  # Config API calls
│   │   ├── scrapeService.js  # Scrape API calls
│   │   ├── campaignService.js # Campaign API calls
│   │   └── resultsService.js # Results API calls
│   ├── utils/                # Helpers
│   │   ├── useWebSocket.jsx  # WebSocket hook
│   │   └── validators.js     # Form validation
│   ├── App.jsx               # Main app with routing
│   └── main.jsx             # Render root
├── public/                   # Static assets
├── tests/                    # Tests
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # TailwindCSS configuration
├── postcss.config.js        # PostCSS configuration
├── .pre-commit-config.yaml   # Code quality hooks
├── package.json             # Node.js dependencies
├── .env.example             # Environment variable template
├── .env                     # Environment variables
└── README.md                # Frontend README
```

## Setup Instructions

### Backend Setup
1. **Clone Repository**:
   ```bash
   git clone https://github.com/<your-org>/ignitejobs.git
   cd ignitejobs
   ```
2. **Set Up Virtual Environment**:
   ```bash
   python3 -m venv env
   source env/bin/activate  # On Windows: env\Scripts\activate
   ```
3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
   Dependencies:
   - `fastapi==0.115.0`
   - `uvicorn==0.32.0`
   - `python-dotenv==1.0.1`
   - `aiosqlite==0.20.0`
   - `pydantic==2.9.2`
   - `passlib[bcrypt]==1.7.4`
   - `pyjwt==2.9.0`
   - `crawl4ai==0.2.5`
   - `litellm==1.48.0`
   - `slowapi==0.1.9`
4. **Configure Environment Variables**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env`:
   ```text
   DB_PATH=ignitejobs.db
   DB_TYPE=sqlite
   SECRET_KEY=<generate-with: python -c "import secrets; print(secrets.token_hex(32))">
   TOKEN_EXPIRY_MIN=30
   GEMINI_API_KEY=<your-gemini-api-key>
   SCRAPE_DELAY_SEC=1
   MAX_SITES_PER_RUN=5
   API_RATE_LIMIT=100/minute
   CORS_ORIGINS=http://localhost:5173,https://ignitejobs-frontend.vercel.app
   LOG_LEVEL=INFO
   ```
5. **Set Up Pre-Commit Hooks**:
   ```bash
   pip install pre-commit
   pre-commit install
   ```
6. **Run Server**:
   ```bash
   uvicorn core.app:app --reload --port 8000 --log-level info
   ```
   Access API at `http://localhost:8000`, OpenAPI docs at `http://localhost:8000/docs`.

### Frontend Setup
*Note*: Frontend setup is planned for Phase 11. Below is a placeholder based on the development plan.

1. **Clone Repository** (post-Phase 11):
   ```bash
   git clone https://github.com/<your-org>/_ignitejobs_.git
   cd _ignitejobs_
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
   Dependencies (planned):
   - `react: ^18.3.1`
   - `vite: ^5.4.8`
   - `tailwindcss: ^3.4.13`
   - `postcss: ^8.4.47`
   - `autoprefixer: ^10.4.20`
   - `chart.js: ^4.4.4`
   - `react-router-dom: ^6.26.2`
   - `axios: ^1.7.7`
   - `socket.io-client` (for WebSocket fallback)
3. **Configure Environment Variables**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env`:
   ```text
   VITE_API_BASE_URL=http://localhost:8000
   ```
4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Access at `http://localhost:5173`.

## Usage

### Backend API
The backend provides a RESTful API with the following endpoints (all require JWT authentication except `/auth` routes). Use `http://localhost:8000/docs` for interactive OpenAPI documentation.

- **Auth**:
  - `POST /auth/register`: Register a new user (`{"email": "user@example.com", "password": "SecurePass123"}`) → Returns user_id.
  - `POST /auth/login`: Login to get JWT (`{"email": "user@example.com", "password": "SecurePass123"}`) → Returns token.
- **Configs**:
  - `GET /configs`: Retrieve user configurations.
  - `POST /configs`: Create/update configuration (`{"job_types": ["developer"], "keywords": ["python"], "sites": ["indeed.com"]}`).
- **Scrape**:
  - `POST /scrape`: Trigger manual scrape based on user config.
- **Campaigns**:
  - `GET /campaigns`: List user campaigns.
  - `POST /campaigns`: Create campaign (`{"schedule_str": "every 6 hours", "duration_days": 7}`).
- **Notifications**:
  - `GET /notifications?unread_only=true`: Retrieve notifications (filtered by unread status).
  - `PATCH /notifications/{id}/read`: Mark notification as read.
- **Results**:
  - `GET /results?campaign_id=1&min_score=80&sort_by=score&sort_order=desc&limit=10&offset=0`: Retrieve paginated job results with filters.
- **Health**:
  - `GET /health`: Check server status (`{"status": "healthy", "version": "1.0.0"}`).

**Authentication**:
- Obtain a JWT token via `/auth/login`.
- Include in headers: `Authorization: Bearer <token>`.

### WebSocket Notifications
- Connect to `ws://localhost:8000/ws/{user_id}` for real-time notifications (e.g., new job matches).
- Example client (JavaScript):
  ```javascript
  const ws = new WebSocket('ws://localhost:8000/ws/1');
  ws.onopen = () => console.log('Connected');
  ws.onmessage = (msg) => console.log(JSON.parse(msg.data));
  setInterval(() => ws.send('ping'), 30000); // Heartbeat
  ```
- Notifications are stored in the `notifications` table for offline retrieval.

### Example Workflow
1. Register: `POST /auth/register` → Get user_id.
2. Login: `POST /auth/login` → Get JWT.
3. Set Config: `POST /configs` → Define job preferences.
4. Create Campaign: `POST /campaigns` → Schedule automated scraping.
5. Connect WebSocket: `ws://localhost:8000/ws/{user_id}` → Receive real-time job notifications.
6. View Results: `GET /results` → Retrieve matched jobs.
7. Mark Notifications: `PATCH /notifications/{id}/read` → Clear notifications.

## Testing and Validation

### Backend Testing
*Note*: Comprehensive testing is planned for Phase 10. Current validation steps are manual or script-based.

1. **Health Check**:
   ```bash
   curl http://localhost:8000/health
   ```
   Expected: `{"status": "healthy", "version": "1.0.0"}`, response time <50ms.
2. **Auth**:
   ```bash
   curl -X POST http://localhost:8000/auth/register -H "Content-Type: application/json" -d '{"email": "test@example.com", "password": "SecurePass123"}'
   curl -X POST http://localhost:8000/auth/login -H "Content-Type: application/json" -d '{"email": "test@example.com", "password": "SecurePass123"}'
   ```
   Expected: User ID, JWT token; 401 on invalid credentials.
3. **Results**:
   ```bash
   curl -X GET http://localhost:8000/results?campaign_id=1 -H "Authorization: Bearer <token>"
   ```
   Expected: List of `JobModel` JSON objects; 401 if unauthorized.
4. **WebSocket**:
   ```bash
   npm install -g wscat
   wscat -c ws://localhost:8000/ws/1
   ```
   Trigger campaign, expect JSON: `{"id": 1, "user_id": 1, "message": "Campaign 1 completed: X jobs", ...}`.
5. **Rate Limiting**:
   ```bash
   for i in {1..101}; do curl -X GET http://localhost:8000/results -H "Authorization: Bearer <token>"; done
   ```
   Expected: 429 after 100 requests.
6. **CORS**:
   Test from `http://localhost:5173` (frontend dev server) → Succeeds.
   Test from unlisted origin → Fails.
7. **Pylint**:
   ```bash
   pylint core/*.py api/routers/*.py utils/*.py
   ```
   Expected: Score 10/10, no missing docstrings.

### Metrics
- API response time: <200ms.
- WebSocket push: <100ms.
- DB query time: <10ms (use `EXPLAIN QUERY PLAN`).
- Scrape time: <10s/site.
- LLM call time: <2s.

## Deployment

*Note*: Deployment is planned for Phase 17. Current deployment is local or manual.

### Local Deployment
1. **Backend**:
   ```bash
   uvicorn core.app:app --host 0.0.0.0 --port 8000 --log-level info
   ```
2. **Docker (Optional)**:
   ```dockerfile
   FROM python:3.10
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install -r requirements.txt
   COPY . .
   CMD ["uvicorn", "core.app:app", "--host", "0.0.0.0", "--port", "8000"]
   ```
   ```bash
   docker build -t ignitejobs-backend .
   docker run -d -p 8000:8000 --env-file .env ignitejobs-backend
   ```

### Production (Planned)
- **Backend**: Deploy on Render with SQLite volume, Gunicorn (4 workers), env vars from `.env`.
- **Frontend**: Deploy on Vercel with `VITE_API_BASE_URL` set to backend URL.
- **HTTPS**: Enforce via hosting platform.
- **Monitoring**: Health checks via `/health`, Prometheus for metrics (Phase 17).

## Roadmap

The project follows a 17-phase development plan, with Phases 1-9 completed:

1. **Backend Project Initialization**: FastAPI server, logging, pre-commit hooks.
2. **Backend Database Module**: Async SQLite abstraction, schema for users, configs, jobs, campaigns, notifications.
3. **Backend User Management and Authentication**: JWT, bcrypt, `/auth` endpoints.
4. **Backend User Configuration Management**: `/configs` endpoints for user preferences.
5. **Backend Scraping Engine**: Ethical scraping with Crawl4AI, robots.txt compliance.
6. **Backend LLM Integration**: Gemini via LiteLLM for job matching.
7. **Backend Scheduling System**: Async timers for campaigns.
8. **Backend Notifications System**: WebSocket and DB notifications.
9. **Backend API Endpoints Integration**: Unified API with CORS, rate limiting, all routers.
10. **Backend Testing and Validation** (Planned): Pytest, >90% coverage.
11. **Frontend Project Initialization** (Planned): Vite, React, TailwindCSS.
12. **Frontend Authentication and User Components** (Planned): Login/register UI.
13. **Frontend Dashboard Components** (Planned): Dashboard with charts.
14. **Frontend Configuration and Campaign UI** (Planned): Forms for configs/campaigns.
15. **Frontend Results and Notifications UI** (Planned): Job results, WebSocket UI.
16. **Frontend Testing and Integration** (Planned): Vitest, >80% coverage.
17. **Full System Deployment and Final Testing** (Planned): Docker, Render/Vercel, E2E tests.

## Contribution Guidelines

1. **Branching**:
   - Use `feature/phase-<number>-<name>` (e.g., `feature/phase-10-testing`) or `bug/<issue-id>-<desc>`.
   - PRs must include phase objectives, changed files, test results, and manual validation steps.
2. **Commits**:
   - Follow Conventional Commits: `feat(phase-1): init FastAPI` or `fix(phase-8): WebSocket import`.
3. **Code Standards**:
   - **SRP**: One responsibility per file (e.g., `db.py` for DB only).
   - **Self-Documentation**: Module/function docstrings, inline comments (`# Inline:`).
   - **Pylint**: Score 10/10, enforced by pre-commit.
   - **Security**: Sanitize inputs (Pydantic/Yup), no secrets in code.
4. **Testing**:
   - Backend: Unit tests (pytest), integration tests (httpx), edge cases.
   - Frontend (planned): Unit tests (Vitest), E2E (Cypress).
   - Coverage: >90% backend, >80% frontend.
5. **CI/CD** (planned in Phase 17):
   - GitHub Actions: Run `pytest --cov`, `vitest --coverage`, linting.
   - Deploy on merge to `main`.
6. **Reviews**:
   - Verify SRP, self-documentation, test coverage, security.
   - Minimum one approval per PR.

## Troubleshooting

- **Server Fails to Start**:
  - Check Python version (3.10+): `python --version`.
  - Verify `.env` exists and is correct.
  - Check port 8000 availability: `lsof -i :8000`.
- **WebSocket Disconnects**:
  - Ensure heartbeat pings every 30s.
  - Check logs in `core/notifications.py`.
- **CORS Errors**:
  - Verify `CORS_ORIGINS` in `.env` matches frontend URL.
- **DB Errors**:
  - Check `ignitejobs.db` permissions.
  - Run `sqlite3 ignitejobs.db .schema` to verify tables.
- **Rate Limit Exceeded**:
  - Increase `API_RATE_LIMIT` in `.env` for testing or check client IP.
- **Pylint Fails**:
  - Run `pylint <file>` to identify issues (e.g., missing docstrings).
  - Fix and re-run pre-commit.

## License

Proprietary not open-source.