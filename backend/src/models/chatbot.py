import uuid

from sqlalchemy import Boolean, Column, ForeignKey, String, Text
from sqlalchemy.orm import relationship

from src.database import Base


class ChatBot(Base):
    __tablename__ = "chatbots"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    umkm_id = Column(String, ForeignKey("umkm_profiles.id"), nullable=False)
    nama = Column(String, nullable=False)
    system_prompt = Column(Text)
    is_active = Column(Boolean, default=True)

    umkm = relationship("UMKMProfile", back_populates="chatbots")
    messages = relationship("ChatMessage", back_populates="bot")
