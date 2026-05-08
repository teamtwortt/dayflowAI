import boto3
import uuid
from datetime import datetime
from boto3.dynamodb.conditions import Key

table = boto3.resource("dynamodb", region_name="us-east-1") \
             .Table("dayflow-events")

def get_events(user_id):
    resp = table.query(
        KeyConditionExpression=Key("userId").eq(user_id)
    )
    return resp["Items"]

def create_event(user_id, data):
    event = {
        "userId":    user_id,
        "eventId":   str(uuid.uuid4()),
        "title":     data["title"],
        "datetime":  data["datetime"],
        "category":  data.get("category", "general"),
        "createdAt": datetime.utcnow().isoformat()
    }
    table.put_item(Item=event)
    return event

def update_event(user_id, event_id, data):
    table.update_item(
        Key={"userId": user_id, "eventId": event_id},
        UpdateExpression="SET title=:t, #dt=:d, category=:c",
        ExpressionAttributeNames={"#dt": "datetime"},
        ExpressionAttributeValues={
            ":t": data["title"],
            ":d": data["datetime"],
            ":c": data.get("category", "general")
        }
    )
    return {**data, "userId": user_id, "eventId": event_id}

def delete_event(user_id, event_id):
    table.delete_item(Key={"userId": user_id, "eventId": event_id})