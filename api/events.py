"""Event CRUD endpoints."""
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from api.deps import get_current_user
from schemas.event import Event, EventCreate, EventUpdate
from services.dynamo import (
    create_event,
    delete_event,
    list_events,
    update_event,
)

router = APIRouter(prefix="/events", tags=["events"])


@router.get("", response_model=List[Event])
@router.get("/", response_model=List[Event], include_in_schema=False)
def get_events(user: dict = Depends(get_current_user)):
    return list_events(user["sub"])


@router.post("", response_model=Event, status_code=201)
@router.post("/", response_model=Event, include_in_schema=False, status_code=201)
def add_event(payload: EventCreate, user: dict = Depends(get_current_user)):
    return create_event(user["sub"], payload.model_dump())


@router.put("/{event_id}", response_model=Event)
def edit_event(
    event_id: str, payload: EventUpdate, user: dict = Depends(get_current_user)
):
    item = update_event(user["sub"], event_id, payload.model_dump(exclude_none=True))
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    return item


@router.delete("/{event_id}", status_code=204)
def remove_event(event_id: str, user: dict = Depends(get_current_user)):
    delete_event(user["sub"], event_id)
