from datetime import date
from typing import Any, List, Optional

from pydantic import BaseModel


class UMKMProfileResponse(BaseModel):
    id: str
    user_id: str
    nama_usaha: str
    deskripsi: Optional[str] = None
    kategori: Optional[str] = None
    no_hp: Optional[str] = None
    alamat: Optional[str] = None

    class Config:
        from_attributes = True


class UMKMProfileUpdate(BaseModel):
    nama_usaha: Optional[str] = None
    deskripsi: Optional[str] = None
    kategori: Optional[str] = None
    no_hp: Optional[str] = None
    alamat: Optional[str] = None


class PlanResponse(BaseModel):
    id: str
    nama: str
    harga: int
    max_pesan: int
    max_bot: int
    fitur: Optional[List[Any]] = None

    class Config:
        from_attributes = True


class SubscribeRequest(BaseModel):
    plan_id: str
    mulai: date
    selesai: date


class SubscriptionResponse(BaseModel):
    id: str
    umkm_id: str
    plan_id: str
    status: str
    mulai: date
    selesai: date
    plan: Optional[PlanResponse] = None

    class Config:
        from_attributes = True
