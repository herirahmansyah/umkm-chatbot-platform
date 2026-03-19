import uuid

from sqlalchemy import Column, Date, Enum, ForeignKey, String
from sqlalchemy.orm import relationship

from src.database import Base


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    umkm_id = Column(String, ForeignKey("umkm_profiles.id"), nullable=False)
    plan_id = Column(String, ForeignKey("plans.id"), nullable=False)
    status = Column(
        Enum("active", "expired", "cancelled", name="subscription_status"),
        default="active",
        nullable=False,
    )
    mulai = Column(Date, nullable=False)
    selesai = Column(Date, nullable=False)

    umkm = relationship("UMKMProfile", back_populates="subscriptions")
    plan = relationship("Plan", back_populates="subscriptions")
