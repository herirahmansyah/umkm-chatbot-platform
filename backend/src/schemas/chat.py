from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ChatBotCreate(BaseModel):
    nama: str
    system_prompt: Optional[str] = None


class ChatBotUpdate(BaseModel):
    nama: Optional[str] = None
    system_prompt: Optional[str] = None


class ChatBotResponse(BaseModel):
    id: str
    umkm_id: str
    nama: str
    system_prompt: Optional[str] = None
    is_active: bool

    class Config:
        from_attributes = True


class ChatRequest(BaseModel):
    message: str
    session_id: str


class ChatMessageResponse(BaseModel):
    id: str
    bot_id: str
    session_id: str
    role: str
    content: str
    timestamp: datetime

    class Config:
        from_attributes = True


class ChatResponse(BaseModel):
    reply: str
    session_id: str
    message: ChatMessageResponse
