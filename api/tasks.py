"""Task CRUD endpoints."""
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from api.deps import get_current_user
from schemas.task import Task, TaskCreate, TaskUpdate
from services.dynamo import (
    create_task,
    delete_task,
    list_tasks,
    update_task,
)

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("", response_model=List[Task])
@router.get("/", response_model=List[Task], include_in_schema=False)
def get_tasks(user: dict = Depends(get_current_user)):
    return list_tasks(user["sub"])


@router.post("", response_model=Task, status_code=201)
@router.post("/", response_model=Task, include_in_schema=False, status_code=201)
def add_task(payload: TaskCreate, user: dict = Depends(get_current_user)):
    return create_task(user["sub"], payload.model_dump(exclude_none=True, by_alias=True))


@router.put("/{task_id}", response_model=Task)
def edit_task(task_id: str, payload: TaskUpdate, user: dict = Depends(get_current_user)):
    body = payload.model_dump(exclude_none=True, by_alias=True)
    item = update_task(user["sub"], task_id, body)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return item


@router.delete("/{task_id}", status_code=204)
def remove_task(task_id: str, user: dict = Depends(get_current_user)):
    delete_task(user["sub"], task_id)
