from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.database import get_db
from src.deps import get_current_user
from src.models.plan import Plan
from src.models.subscription import Subscription
from src.models.umkm_profile import UMKMProfile
from src.models.user import User
from src.schemas.umkm import (
    PlanResponse,
    SubscribeRequest,
    SubscriptionResponse,
    UMKMProfileResponse,
    UMKMProfileUpdate,
)

router = APIRouter(tags=["UMKM"])


# ─── Profile ───────────────────────────────────────────────────────────────


@router.get("/umkm/profile", response_model=UMKMProfileResponse)
def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = db.query(UMKMProfile).filter(UMKMProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profil UMKM belum dibuat",
        )
    return profile


@router.put("/umkm/profile", response_model=UMKMProfileResponse)
def update_profile(
    payload: UMKMProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = db.query(UMKMProfile).filter(UMKMProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profil UMKM belum dibuat",
        )

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)
    return profile


# ─── Plans ─────────────────────────────────────────────────────────────────


@router.get("/plans", response_model=list[PlanResponse])
def get_plans(db: Session = Depends(get_db)):
    return db.query(Plan).all()


# ─── Subscriptions ─────────────────────────────────────────────────────────


@router.post("/subscriptions", response_model=SubscriptionResponse, status_code=status.HTTP_201_CREATED)
def subscribe(
    payload: SubscribeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = db.query(UMKMProfile).filter(UMKMProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profil UMKM belum dibuat",
        )

    plan = db.query(Plan).filter(Plan.id == payload.plan_id).first()
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Paket tidak ditemukan",
        )

    # Batalkan langganan aktif sebelumnya
    db.query(Subscription).filter(
        Subscription.umkm_id == profile.id,
        Subscription.status == "active",
    ).update({"status": "cancelled"})

    subscription = Subscription(
        umkm_id=profile.id,
        plan_id=payload.plan_id,
        status="active",
        mulai=payload.mulai,
        selesai=payload.selesai,
    )
    db.add(subscription)
    db.commit()
    db.refresh(subscription)
    return subscription


@router.get("/subscriptions/me", response_model=SubscriptionResponse)
def get_my_subscription(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = db.query(UMKMProfile).filter(UMKMProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profil UMKM belum dibuat",
        )

    subscription = (
        db.query(Subscription)
        .filter(Subscription.umkm_id == profile.id, Subscription.status == "active")
        .order_by(Subscription.mulai.desc())
        .first()
    )
    if not subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tidak ada langganan aktif",
        )
    return subscription
