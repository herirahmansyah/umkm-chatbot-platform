from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.database import Base, engine, SessionLocal
import src.models  # noqa: F401 — register all models before create_all
from src.routes import auth
from src.routes import umkm
from src.routes import chat

# Buat semua tabel di database
Base.metadata.create_all(bind=engine)


def seed_plans():
    """Seed 3 paket berlangganan jika belum ada."""
    from src.models.plan import Plan

    db = SessionLocal()
    try:
        if db.query(Plan).count() > 0:
            return

        plans = [
            Plan(
                nama="Free",
                harga=0,
                max_pesan=100,
                max_bot=1,
                fitur=["100 pesan/bulan", "1 bot", "Dukungan email"],
            ),
            Plan(
                nama="Pro",
                harga=99000,
                max_pesan=2000,
                max_bot=3,
                fitur=["2.000 pesan/bulan", "3 bot", "Analitik dasar", "Dukungan prioritas"],
            ),
            Plan(
                nama="Business",
                harga=299000,
                max_pesan=-1,
                max_bot=-1,
                fitur=["Pesan unlimited", "Bot tak terbatas", "Analitik lanjutan", "Dukungan 24/7"],
            ),
        ]
        db.add_all(plans)
        db.commit()
    finally:
        db.close()


seed_plans()

app = FastAPI(
    title="UMKM ChatBot Platform API",
    description="Platform SaaS chatbot AI untuk UMKM Indonesia",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router)
app.include_router(umkm.router)
app.include_router(chat.router)


@app.get("/", tags=["Health"])
def root():
    return {"success": True, "data": {"status": "running"}, "message": "UMKM ChatBot Platform API"}


@app.get("/health", tags=["Health"])
def health_check():
    return {"success": True, "data": {"status": "ok"}, "message": "OK"}
