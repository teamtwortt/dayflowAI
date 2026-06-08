# DayFlow AI

**A serverless, AI-augmented personal productivity assistant on AWS.**

DayFlow AI unifies smart event management, weather-aware recommendations, automated morning briefings, and multi-channel notifications behind a mobile-first experience.

> AWS Re/Start · Group 2 · Portfolio Project · 2026

---

## Repository layout

```
dayflowAI/
├── backend/          
├── frontend-react/   
├── frontend/         
├── routes/          
├── services/        
├── middleware/      
├── app.py            
└── README.md
```


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
cp .env.example .env       # insert your Cognito + Weather keys
uvicorn main:app --reload  # http://localhost:8000  ·  /docs
```

### 2) Frontend (React on `:5173`)

```bash
cd frontend-react
npm install
npm run dev   # http://localhost:5173
```


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


### Required AWS resources

- **Cognito User Pool** + app client (no client secret).
- **DynamoDB**: events table (PK `userId`, SK `eventId`), users (PK `userId`), tasks (PK `userId`, SK `taskId`). Table names are set via SAM parameters / Lambda env (`DYNAMO_*`).
- **Lambda**: Python 3.10 per template, env vars from `backend/.env.example`.
- **API Gateway**: HTTP API proxy to Lambda.
- **EventBridge** (optional): scheduled briefing dispatcher per template.

---


---

## License

Internal portfolio project — AWS Re/Start, Per Scholas, 2026.
