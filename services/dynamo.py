"""DynamoDB access for events, tasks, and user preferences."""
import uuid
from datetime import datetime, timezone
from typing import List

import boto3
from boto3.dynamodb.conditions import Key

from config import settings


_resource = boto3.resource("dynamodb", region_name=settings.AWS_REGION)
_events_table = _resource.Table(settings.DYNAMO_EVENTS_TABLE)
_users_table = _resource.Table(settings.DYNAMO_USERS_TABLE)
_tasks_table = _resource.Table(settings.DYNAMO_TASKS_TABLE)


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


# Events ----------------------------------------------------------------------
def list_events(user_id: str) -> List[dict]:
    resp = _events_table.query(KeyConditionExpression=Key("userId").eq(user_id))
    items = resp.get("Items", [])
    items.sort(key=lambda e: e.get("datetime", ""))
    return items


def create_event(user_id: str, data: dict) -> dict:
    event = {
        "userId": user_id,
        "eventId": str(uuid.uuid4()),
        "title": data["title"],
        "datetime": data["datetime"],
        "category": data.get("category", "general"),
        "notes": data.get("notes"),
        "priority": data.get("priority", "medium"),
        "location": data.get("location"),
        "completed": False,
        "createdAt": _now(),
    }
    _events_table.put_item(Item={k: v for k, v in event.items() if v is not None})
    return event


def update_event(user_id: str, event_id: str, data: dict) -> dict:
    updates = {k: v for k, v in data.items() if v is not None}
    if not updates:
        existing = _events_table.get_item(
            Key={"userId": user_id, "eventId": event_id}
        ).get("Item")
        return existing or {}

    updates["updatedAt"] = _now()
    expr_names = {}
    expr_values = {}
    set_parts = []
    for i, (k, v) in enumerate(updates.items()):
        name_placeholder = f"#k{i}"
        value_placeholder = f":v{i}"
        expr_names[name_placeholder] = k
        expr_values[value_placeholder] = v
        set_parts.append(f"{name_placeholder} = {value_placeholder}")

    _events_table.update_item(
        Key={"userId": user_id, "eventId": event_id},
        UpdateExpression="SET " + ", ".join(set_parts),
        ExpressionAttributeNames=expr_names,
        ExpressionAttributeValues=expr_values,
    )

    item = _events_table.get_item(
        Key={"userId": user_id, "eventId": event_id}
    ).get("Item")
    return item or {}


def delete_event(user_id: str, event_id: str) -> None:
    _events_table.delete_item(Key={"userId": user_id, "eventId": event_id})


# Tasks (PK=userId SK=taskId) -------------------------------------------------
def list_tasks(user_id: str) -> List[dict]:
    resp = _tasks_table.query(KeyConditionExpression=Key("userId").eq(user_id))
    items = resp.get("Items", [])

    def sort_key(t: dict) -> tuple:
        due = str(t.get("dueDate") or "")
        created = str(t.get("createdAt") or "")
        return (0 if due else 1, due, created)

    items.sort(key=sort_key)
    return items


def create_task(user_id: str, data: dict) -> dict:
    due_raw = data.get("dueDate") or data.get("due_date")
    task = {
        "userId": user_id,
        "taskId": str(uuid.uuid4()),
        "title": data["title"],
        "notes": data.get("notes"),
        "dueDate": due_raw,
        "priority": data.get("priority", "medium"),
        "completed": False,
        "createdAt": _now(),
    }
    _tasks_table.put_item(Item={k: v for k, v in task.items() if v is not None})
    return task


def update_task(user_id: str, task_id: str, data: dict) -> dict:
    updates = {k: v for k, v in data.items() if v is not None}
    if not updates:
        existing = _tasks_table.get_item(
            Key={"userId": user_id, "taskId": task_id}
        ).get("Item")
        return existing or {}

    updates["updatedAt"] = _now()
    expr_names = {}
    expr_values = {}
    set_parts = []
    for i, (k, v) in enumerate(updates.items()):
        name_placeholder = f"#k{i}"
        value_placeholder = f":v{i}"
        expr_names[name_placeholder] = k
        expr_values[value_placeholder] = v
        set_parts.append(f"{name_placeholder} = {value_placeholder}")

    _tasks_table.update_item(
        Key={"userId": user_id, "taskId": task_id},
        UpdateExpression="SET " + ", ".join(set_parts),
        ExpressionAttributeNames=expr_names,
        ExpressionAttributeValues=expr_values,
    )

    item = _tasks_table.get_item(
        Key={"userId": user_id, "taskId": task_id}
    ).get("Item")
    return item or {}


def delete_task(user_id: str, task_id: str) -> None:
    _tasks_table.delete_item(Key={"userId": user_id, "taskId": task_id})


# User preferences ------------------------------------------------------------
DEFAULT_PREFS = {
    "city": "Washington DC",
    "timezone": "America/New_York",
    "notifications_email": True,
    "notifications_sms": False,
    "phone": None,
    "briefing_time": "07:00",
}


def get_user_prefs(user_id: str) -> dict:
    try:
        resp = _users_table.get_item(Key={"userId": user_id})
        item = resp.get("Item")
        if item and "preferences" in item:
            merged = {**DEFAULT_PREFS, **item["preferences"]}
            return merged
    except Exception:
        pass
    return DEFAULT_PREFS.copy()


def upsert_user_prefs(user_id: str, email: str, prefs: dict) -> dict:
    current = get_user_prefs(user_id)
    merged = {**current, **{k: v for k, v in prefs.items() if v is not None}}
    _users_table.put_item(
        Item={
            "userId": user_id,
            "email": email,
            "preferences": merged,
            "updatedAt": _now(),
        }
    )
    return merged
