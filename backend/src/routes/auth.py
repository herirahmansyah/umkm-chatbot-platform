from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from src.database import get_db
from src.deps import get_current_user
from src.models.umkm_profile import UMKMProfile
from src.models.user import User
from src.schemas.auth import LoginRequest, RegisterRequest, TokenResponse, UserResponse
from src.utils.security import create_access_token, hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["Authentication"])


def admin_required(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email sudah terdaftar",
        )

    user = User(
        email=payload.email,
        password_hash=hash_password(payload.password),
        role="umkm",
    )
    db.add(user)
    db.flush()  # dapat user.id sebelum commit

    profile = UMKMProfile(
        user_id=user.id,
        nama_usaha=payload.nama_usaha,
        kategori=payload.kategori,
        no_hp=payload.no_hp,
    )
    db.add(profile)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": user.id, "role": user.role})
    return {"success": True, "access_token": token, "token_type": "bearer", "user": user}


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()

    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email atau password salah",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Akun tidak aktif",
        )

    token = create_access_token({"sub": user.id, "role": user.role})
    return {"success": True, "access_token": token, "token_type": "bearer", "user": user}


@router.get("/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/admin/users", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db), current_user: User = Depends(admin_required)):
    users = db.query(User).filter(User.role == "umkm").all()
    return [{"id": user.id, "email": user.email, "role": user.role, "is_active": user.is_active, "created_at": user.created_at} for user in users]


@router.get("/admin/stats")
def get_stats(db: Session = Depends(get_db), current_user: User = Depends(admin_required)):
    total_umkm = db.query(func.count(User.id)).filter(User.role == "umkm").scalar()
    total_active = db.query(func.count(User.id)).filter(User.role == "umkm", User.is_active == True).scalar()
    total_inactive = db.query(func.count(User.id)).filter(User.role == "umkm", User.is_active == False).scalar()
    return {"total_umkm": total_umkm, "total_active": total_active, "total_inactive": total_inactive}


@router.put("/admin/users/{user_id}/toggle")
def toggle_user_active(user_id: str, db: Session = Depends(get_db), current_user: User = Depends(admin_required)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    user.is_active = not user.is_active
    db.commit()
    return {"success": True, "is_active": user.is_active}
