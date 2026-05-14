# DayFlow AI

**A serverless, AI-augmented personal productivity assistant on AWS.**

DayFlow AI unifies smart event management, weather-aware recommendations, automated morning briefings, and multi-channel notifications behind a beautiful, mobile-first experience.

> AWS Re/Start · Group 2 · Portfolio Project · 2026

---

## Repository layout

```
dayflowAI/
├── backend/          # FastAPI app (Lambda-ready via Mangum)
├── frontend-react/   # React + TypeScript + Vite + Tailwind  ← new build
├── frontend/         # Legacy HTML/JS prototype (kept for reference)
├── routes/           # Legacy Flask routes (kept for reference)
├── services/         # Legacy Flask services (kept for reference)
├── middleware/       # Legacy Flask auth guard (kept for reference)
├── app.py            # Legacy Flask entrypoint (kept for reference)
└── README.md
```

The **`backend/`** and **`frontend-react/`** folders are the new, production targets. The root-level Flask code and `frontend/` HTML files are kept intentionally as a reference for the team.

---

## Architecture (AWS)

```
   ┌──────────────────┐         ┌────────────────────┐
   │  React (Amplify) │ ─HTTPS▶ │   API Gateway      │
   └──────────────────┘         └─────────┬──────────┘
            │                              │
            ▼                              ▼
   ┌──────────────────┐         ┌────────────────────┐
   │ Cognito User Pool│         │  Lambda (FastAPI / │
   │  (JWT issuer)    │         │    Mangum handler) │
   └──────────────────┘         └─────────┬──────────┘
                                          │
                ┌─────────────────────────┼──────────────┐
                ▼                         ▼              ▼
         ┌────────────┐          ┌────────────┐  ┌────────────┐
         │ DynamoDB   │          │  EventBridge│ │ SNS / SES  │
         │ (events,   │          │ (daily      │ │ (briefings,│
         │  users)    │          │  briefing)  │ │  alerts)   │
         └────────────┘          └────────────┘  └────────────┘

   Observability: CloudWatch · X-Ray · GuardDuty · Security Hub
   Pipeline:      GitHub Actions · Snyk · Amplify CI/CD
```

---

## Quick start (local dev)

You'll need **two terminals**.

### 1) Backend (FastAPI on `:8000`)

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env       # fill in Cognito + Weather keys
uvicorn main:app --reload  # http://localhost:8000  ·  /docs
```

### 2) Frontend (React on `:5173`)

```bash
cd frontend-react
npm install
npm run dev   # http://localhost:5173
```

The Vite dev server proxies API requests to the FastAPI backend automatically — no `VITE_API_BASE_URL` needed locally.

---

## Endpoints

| Method | Path                       | Description                       | Auth |
| ------ | -------------------------- | --------------------------------- | ---- |
| POST   | `/auth/register`           | Sign up                           | No   |
| POST   | `/auth/login`              | Sign in (returns Cognito tokens)  | No   |
| POST   | `/auth/confirm`            | Confirm email with code           | No   |
| POST   | `/auth/resend`             | Resend confirmation code          | No   |
| GET    | `/events`                  | List all events                   | Yes  |
| POST   | `/events`                  | Create event                      | Yes  |
| PUT    | `/events/{event_id}`       | Update event (or toggle complete) | Yes  |
| DELETE | `/events/{event_id}`       | Delete event                      | Yes  |
| GET    | `/briefing/today`          | Today's briefing + weather        | Yes  |
| GET    | `/users/me`                | Current user profile + prefs      | Yes  |
| PUT    | `/users/me/preferences`    | Update preferences                | Yes  |
| GET    | `/health`                  | Health check                      | No   |

Full OpenAPI docs at `http://localhost:8000/docs` once the backend is running.

---

## Deployment

### Frontend → AWS Amplify

1. Connect the repo in the Amplify console.
2. Use `frontend-react/amplify.yml` as the build spec.
3. Add env var `VITE_API_BASE_URL = https://<api-gateway-url>`.
4. Deploy.

### Backend → AWS Lambda + API Gateway

The handler is `backend/lambda_handler.handler`. Package and deploy via:

- **AWS SAM** / **Serverless Framework** / **Terraform** (recommended for the team), or
- Manual: `pip install -t package/ -r requirements.txt && cp *.py package/`, zip, upload to Lambda, attach API Gateway.

### Required AWS resources

- **Cognito User Pool** with email sign-in and an app client (no client secret).
- **DynamoDB**: `dayflow-events` (PK `userId`, SK `eventId`) and `dayflow-users` (PK `userId`).
- **Lambda**: Python 3.12, handler `lambda_handler.handler`, env vars from `backend/.env.example`.
- **API Gateway**: HTTP API or REST API, proxy all routes to the Lambda.
- **EventBridge** rule (cron): trigger a briefing-dispatch Lambda on `cron(0 11 ? * * *)` (07:00 ET).
- **SNS topic** for SMS, **SES verified identity** for email.

---

## Design tokens

The visual identity is intentionally warm and editorial, not generic SaaS.

| Token          | Hex        | Use                                     |
| -------------- | ---------- | --------------------------------------- |
| `cream-100`    | `#f2ede4`  | Light-mode background                   |
| `cream-200`    | `#ece4d4`  | Light-mode surface                      |
| `ink-700`      | `#1a1208`  | Dark-mode background                    |
| `ink-600`      | `#2a1e10`  | Dark-mode surface                       |
| `flame-500`    | `#c87941`  | **Primary action / brand orange**       |
| `flame-300`    | `#eb9457`  | Accents on dark surfaces                |

See `frontend-react/tailwind.config.ts` for the full scale.

---

## License

Internal portfolio project — AWS Re/Start, Per Scholas, 2026.
