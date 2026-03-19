import uuid

from sqlalchemy import Column, Integer, JSON, String
from sqlalchemy.orm import relationship

from src.database import Base


class Plan(Base):
    __tablename__ = "plans"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    nama = Column(String, nullable=False)  # Free/Pro/Business
    harga = Column(Integer, nullable=False)  # Rupiah per bulan
    max_pesan = Column(Integer, nullable=False)  # -1 = unlimited
    max_bot = Column(Integer, nullable=False)
    fitur = Column(JSON)  # list fitur

    subscriptions = relationship("Subscription", back_populates="plan")
