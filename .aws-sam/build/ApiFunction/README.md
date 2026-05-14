# DayFlow AI — Backend (FastAPI)

Serverless FastAPI backend for DayFlow AI. Designed to run **locally** with `uvicorn`, in a **container**, or as an **AWS Lambda** behind API Gateway via Mangum.

## Quick start

```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env   # then edit values
uvicorn main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

## Endpoints

| Method | Path                       | Description                       | Auth |
| ------ | -------------------------- | --------------------------------- | ---- |
| POST   | `/auth/register`           | Sign up                           | No   |
| POST   | `/auth/login`              | Sign in (returns Cognito tokens)  | No   |
| POST   | `/auth/confirm`            | Confirm email with code           | No   |
| POST   | `/auth/resend`             | Resend confirmation code          | No   |
| GET    | `/events`                  | List all events                   | Yes  |
| POST   | `/events`                  | Create event                      | Yes  |
| PUT    | `/events/{event_id}`       | Update event                      | Yes  |
| DELETE | `/events/{event_id}`       | Delete event                      | Yes  |
| GET    | `/briefing/today`          | Today's briefing + weather        | Yes  |
| GET    | `/users/me`                | Current user profile + prefs      | Yes  |
| PUT    | `/users/me/preferences`    | Update preferences                | Yes  |
| GET    | `/health`                  | Health check                      | No   |

## Deploy to AWS Lambda

The handler is `lambda_handler.handler`. Package the `backend/` folder with its dependencies, attach API Gateway, and route all requests to the Lambda.

## Environment variables

See `.env.example`.
