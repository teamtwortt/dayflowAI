# DayFlow AI

**A serverless, AI-augmented personal productivity assistant on AWS.**

DayFlow AI unifies smart event management, weather-aware recommendations, automated morning briefings, and multi-channel notifications behind a mobile-first experience.

> AWS Re/Start · Group 2 · Portfolio Project · 2026

---

## Repository layout

```
dayflowAI/
├── backend/          # FastAPI app (Lambda-ready via Mangum)
├── frontend-react/   # React + TypeScript + Vite + Tailwind
├── frontend/         # Legacy HTML/JS prototype (reference)
├── routes/             # Legacy Flask routes (reference)
├── services/         # Legacy Flask services (reference)
├── middleware/       # Legacy Flask auth guard (reference)
├── app.py              # Legacy Flask entrypoint (reference)
└── README.md
```

The **`backend/`** and **`frontend-react/`** folders are the production targets. Root-level Flask code is kept as reference.

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
         │ DynamoDB   │          │ EventBridge │ │ SNS / SES  │
         │ (events,   │          │ (briefing)  │ │ (briefings)│
         │  tasks,    │          └────────────┘  └────────────┘
         │  users)    │
         └────────────┘

   Observability: CloudWatch · X-Ray
   Pipeline:      GitHub Actions · Amplify CI/CD
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

The Vite dev server can proxy API requests to FastAPI locally — see `frontend-react/vite.config.ts`.

---

## API endpoints (backend)

| Method | Path                       | Description                      | Auth |
| ------ | -------------------------- | -------------------------------- | ---- |
| POST   | `/auth/register`           | Sign up                          | No   |
| POST   | `/auth/login`              | Sign in (returns Cognito tokens) | No   |
| POST   | `/auth/confirm`            | Confirm email with code          | No   |
| POST   | `/auth/resend`             | Resend confirmation code         | No   |
| GET    | `/events`                  | List events                      | Yes  |
| POST   | `/events`                  | Create event                     | Yes  |
| PUT    | `/events/{event_id}`       | Update event                     | Yes  |
| DELETE | `/events/{event_id}`       | Delete event                     | Yes  |
| GET    | `/tasks`                   | List tasks                       | Yes  |
| POST   | `/tasks`                   | Create task                      | Yes  |
| PUT    | `/tasks/{task_id}`         | Update task                      | Yes  |
| DELETE | `/tasks/{task_id}`         | Delete task                      | Yes  |
| GET    | `/briefing/today`          | Today's briefing + weather       | Yes  |
| GET    | `/users/me`                | Profile + prefs                  | Yes  |
| PUT    | `/users/me/preferences`    | Update preferences               | Yes  |
| GET    | `/health`                  | Health check                     | No   |

OpenAPI: `http://localhost:8000/docs` when the backend is running.

---

## Deployment

### Frontend → AWS Amplify

1. Connect the repo in the Amplify console.
2. Use `frontend-react/amplify.yml` as the build spec.
3. Set `VITE_API_BASE_URL = https://<api-gateway-url>` (no trailing slash).
4. Deploy.

### Backend → AWS Lambda + API Gateway

Deploy with **AWS SAM** using `template.yaml` at repo root (`sam build && sam deploy`). Handler: `lambda_handler.handler` in `backend/`.

### Required AWS resources

- **Cognito User Pool** + app client (no client secret).
- **DynamoDB**: events table (PK `userId`, SK `eventId`), users (PK `userId`), tasks (PK `userId`, SK `taskId`). Table names are set via SAM parameters / Lambda env (`DYNAMO_*`).
- **Lambda**: Python 3.10 per template, env vars from `backend/.env.example`.
- **API Gateway**: HTTP API proxy to Lambda.
- **EventBridge** (optional): scheduled briefing dispatcher per template.

---

## Design tokens

Warm editorial palette — see `frontend-react/tailwind.config.ts`.

---

## License

Internal portfolio project — AWS Re/Start, Per Scholas, 2026.
