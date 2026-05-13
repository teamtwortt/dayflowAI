"""Task schemas (DynamoDB Tasks: PK=userId SK=taskId)."""
from typing import Literal, Optional

from pydantic import BaseModel, Field, ConfigDict


TaskPriority = Literal["low", "medium", "high"]


class TaskCreate(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    title: str = Field(min_length=1, max_length=200)
    notes: Optional[str] = Field(default=None, max_length=2000)
    due_date: Optional[str] = Field(default=None, alias="dueDate")
    priority: TaskPriority = "medium"


class TaskUpdate(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    notes: Optional[str] = Field(default=None, max_length=2000)
    due_date: Optional[str] = Field(default=None, alias="dueDate")
    priority: Optional[TaskPriority] = None
    completed: Optional[bool] = None


class Task(BaseModel):
    userId: str
    taskId: str
    title: str
    notes: Optional[str] = None
    dueDate: Optional[str] = None
    priority: Optional[str] = "medium"
    completed: bool = False
    createdAt: str
    updatedAt: Optional[str] = None
