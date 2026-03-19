import uuid

from sqlalchemy import Column, ForeignKey, String, Text
from sqlalchemy.orm import relationship

from src.database import Base


class UMKMProfile(Base):
    __tablename__ = "umkm_profiles"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False, unique=True)
    nama_usaha = Column(String, nullable=False)
    deskripsi = Column(Text)
    kategori = Column(String)  # kuliner/fashion/jasa/dll
    no_hp = Column(String)
    alamat = Column(Text)

    user = relationship("User", back_populates="profile")
    subscriptions = relationship("Subscription", back_populates="umkm")
    chatbots = relationship("ChatBot", back_populates="umkm")
