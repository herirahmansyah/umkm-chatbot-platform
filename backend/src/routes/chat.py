from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from openai import OpenAI

from src.database import get_db
from src.deps import get_current_user
from src.models.chat_message import ChatMessage
from src.models.chatbot import ChatBot
from src.models.umkm_profile import UMKMProfile
from src.models.user import User
from src.schemas.chat import (
    ChatBotCreate,
    ChatBotResponse,
    ChatBotUpdate,
    ChatRequest,
    ChatResponse,
)
from src.utils.config import settings

router = APIRouter(tags=["Chatbot"])

MODEL = "gpt-4o-mini"


def _get_profile_or_404(user_id: str, db: Session) -> UMKMProfile:
    profile = db.query(UMKMProfile).filter(UMKMProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profil UMKM belum dibuat")
    return profile


def _get_bot_or_404(bot_id: str, umkm_id: str, db: Session) -> ChatBot:
    if umkm_id:
        bot = db.query(ChatBot).filter(ChatBot.id == bot_id, ChatBot.umkm_id == umkm_id).first()
    else:
        bot = db.query(ChatBot).filter(ChatBot.id == bot_id).first()
    if not bot:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bot tidak ditemukan")
    return bot


@router.post("/chatbot", response_model=ChatBotResponse, status_code=status.HTTP_201_CREATED)
def create_bot(
    payload: ChatBotCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = _get_profile_or_404(current_user.id, db)
    bot = ChatBot(
        umkm_id=profile.id,
        nama=payload.nama,
        system_prompt=payload.system_prompt,
    )
    db.add(bot)
    db.commit()
    db.refresh(bot)
    return bot


@router.get("/chatbot", response_model=list[ChatBotResponse])
def list_bots(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = _get_profile_or_404(current_user.id, db)
    return db.query(ChatBot).filter(ChatBot.umkm_id == profile.id).all()


@router.put("/chatbot/{bot_id}", response_model=ChatBotResponse)
def update_bot(
    bot_id: str,
    payload: ChatBotUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = _get_profile_or_404(current_user.id, db)
    bot = _get_bot_or_404(bot_id, profile.id, db)
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(bot, field, value)
    db.commit()
    db.refresh(bot)
    return bot


@router.post("/chat/{bot_id}", response_model=ChatResponse)
def chat(
    bot_id: str,
    payload: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not settings.OPENAI_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="OPENAI_API_KEY belum dikonfigurasi",
        )

    profile = _get_profile_or_404(current_user.id, db)
    bot = _get_bot_or_404(bot_id, profile.id, db)

    history = (
        db.query(ChatMessage)
        .filter(ChatMessage.bot_id == bot_id, ChatMessage.session_id == payload.session_id)
        .order_by(ChatMessage.timestamp.asc())
        .all()
    )

    messages = []
    if bot.system_prompt:
        messages.append({"role": "system", "content": bot.system_prompt})
    for msg in history:
        messages.append({"role": msg.role, "content": msg.content})
    messages.append({"role": "user", "content": payload.message})

    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    response = client.chat.completions.create(
        model=MODEL,
        messages=messages,
        max_tokens=1024,
    )
    reply_text = response.choices[0].message.content

    user_msg = ChatMessage(
        bot_id=bot_id,
        session_id=payload.session_id,
        role="user",
        content=payload.message,
    )
    db.add(user_msg)

    ai_msg = ChatMessage(
        bot_id=bot_id,
        session_id=payload.session_id,
        role="assistant",
        content=reply_text,
    )
    db.add(ai_msg)
    db.commit()
    db.refresh(ai_msg)

    return ChatResponse(reply=reply_text, session_id=payload.session_id, message=ai_msg)


@router.post("/webhook/whatsapp/{bot_id}")
async def whatsapp_webhook(bot_id: str, payload: dict):
    db = next(get_db())
    bot = _get_bot_or_404(bot_id, "", db)

    chat_id = payload['chat_id']
    message = payload['message']
    session_id = chat_id

    messages = [{"role": "system", "content": bot.system_prompt},
                {"role": "user", "content": message}]

    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    response = client.chat.completions.create(
        model=MODEL,
        messages=messages,
        max_tokens=1024,
    )
    reply_text = response.choices[0].message.content

    user_msg = ChatMessage(
        bot_id=bot_id,
        session_id=session_id,
        role="user",
        content=message,
    )
    db.add(user_msg)

    ai_msg = ChatMessage(
        bot_id=bot_id,
        session_id=session_id,
        role="assistant",
        content=reply_text,
    )
    db.add(ai_msg)
    db.commit()
    db.refresh(ai_msg)

    return {"status": "ok", "reply": reply_text}


@router.get("/webhook/whatsapp/{bot_id}/url")
async def get_webhook_url(bot_id: str):
    webhook_url = f"http://localhost:8000/webhook/whatsapp/{bot_id}"
    return {"webhook_url": webhook_url}


@router.get("/webhook/whatsapp/{bot_id}/info")
async def get_bot_info(bot_id: str):
    db = next(get_db())
    bot = _get_bot_or_404(bot_id, "", db)
    return {
        "bot_id": bot.id,
        "webhook_url": f"/webhook/whatsapp/{bot_id}",
        "bot_name": bot.nama,
        "is_active": bot.is_active,
    }
