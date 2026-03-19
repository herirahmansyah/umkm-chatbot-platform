# TASK: UMKM ChatBot Platform — Sprint 1

## Objektif
Bangun fondasi backend yang bisa dijalankan lokal:
API autentikasi + database models + chatbot engine dasar.

## TASK-01: Setup Backend
- Inisialisasi FastAPI project di folder backend/
- Buat virtual environment dan requirements.txt
- Setup SQLAlchemy + SQLite + Alembic
- Buat backend/src/main.py sebagai entry point
- Pastikan: uvicorn src.main:app --reload bisa jalan

## TASK-02: Database Models
Buat models SQLAlchemy di backend/src/models/ untuk:
- User: id, email, password_hash, role, is_active, created_at
- UMKMProfile: id, user_id, nama_usaha, deskripsi, kategori, no_hp
- Plan: id, nama, harga, max_pesan, max_bot, fitur (JSON)
- Subscription: id, umkm_id, plan_id, status, mulai, selesai
- ChatBot: id, umkm_id, nama, system_prompt, is_active
- ChatMessage: id, bot_id, session_id, role, content, timestamp

## TASK-03: Auth Endpoints
Buat di backend/src/routes/auth.py:
- POST /auth/register  → daftar UMKM baru, return JWT
- POST /auth/login     → login, return JWT token
- GET  /auth/me        → profil user yang sedang login
- JWT middleware untuk proteksi route

## TASK-04: UMKM Endpoints
Buat di backend/src/routes/umkm.py:
- GET  /umkm/profile      → lihat profil
- PUT  /umkm/profile      → update profil
- GET  /plans             → daftar paket (public)
- POST /subscriptions     → berlangganan paket
- GET  /subscriptions/me  → status langganan aktif

## TASK-05: Chatbot Engine
Buat di backend/src/routes/chat.py:
- POST /chatbot           → buat bot baru
- GET  /chatbot           → daftar bot milik UMKM ini
- PUT  /chatbot/{id}      → update system prompt bot
- POST /chat/{bot_id}     → kirim pesan, dapat respons AI

## Output yang Diharapkan
- uvicorn src.main:app --reload jalan tanpa error
- Swagger docs di http://localhost:8000/docs lengkap
- Bisa register dan login via API
- Bisa chat dengan bot menggunakan Anthropic API
- File RESULT.md berisi cara menjalankan project

## Prioritas
TINGGI — ini fondasi semua fitur berikutnya
