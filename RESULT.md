# RESULT: UMKM ChatBot Platform — Sprint 1 (TASK-01 s/d TASK-05)

## Status: SELESAI

## Cara Menjalankan Backend

```bash
cd /home/bang/projects/umkm-chatbot-platform/backend
source venv/bin/activate
uvicorn src.main:app --reload
```

Server: http://localhost:8000
Swagger docs: http://localhost:8000/docs

## Struktur Folder Backend

```
backend/
├── venv/                    # Virtual environment Python 3.10
├── src/
│   ├── __init__.py
│   ├── main.py              # FastAPI entry point
│   ├── database.py          # SQLAlchemy engine + session
│   ├── deps.py              # Dependency: get_current_user (JWT guard)
│   ├── models/
│   │   ├── user.py, umkm_profile.py, plan.py
│   │   ├── subscription.py, chatbot.py, chat_message.py
│   ├── routes/
│   │   └── auth.py          # POST /auth/register, POST /auth/login, GET /auth/me
│   ├── schemas/
│   │   └── auth.py          # Pydantic schemas
│   └── utils/
│       ├── config.py        # Settings dari .env (pydantic-settings)
│       └── security.py      # bcrypt hash + JWT (python-jose)
├── alembic/                 # Migrasi database
├── alembic.ini
├── requirements.txt
├── .env                     # Secrets (jangan commit!)
└── tests/
```

## Database

SQLite (`umkm.db`) dengan 6 tabel:
- `users` — autentikasi & role
- `umkm_profiles` — profil bisnis UMKM
- `plans` — paket Free/Pro/Business
- `subscriptions` — langganan aktif UMKM
- `chatbots` — bot milik tiap UMKM
- `chat_messages` — riwayat percakapan

## Auth Endpoints (TASK-03)

### Register
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"toko@example.com","password":"rahasia123","nama_usaha":"Toko Saya"}'
```

### Login
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"toko@example.com","password":"rahasia123"}'
```

### Profil (butuh token)
```bash
curl http://localhost:8000/auth/me \
  -H "Authorization: Bearer <token>"
```

## Environment Variables (.env)

```env
DATABASE_URL=sqlite:///./umkm.db
SECRET_KEY=super-secret-key-ganti-di-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
ANTHROPIC_API_KEY=<isi API key Anthropic>
```

## Catatan Teknis
- Menggunakan `bcrypt` 4.x langsung (bukan passlib — tidak kompatibel dengan bcrypt 4.x+)
- JWT via `python-jose` dengan HS256
- Config di-load dari `.env` via `pydantic-settings`

## UMKM Endpoints (TASK-04)

### Lihat profil (butuh token)
```bash
curl http://localhost:8000/umkm/profile \
  -H "Authorization: Bearer <token>"
```

### Update profil (butuh token)
```bash
curl -X PUT http://localhost:8000/umkm/profile \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"deskripsi":"Toko sembako","kategori":"kuliner","alamat":"Jl. Mawar 1"}'
```

### Daftar paket (public)
```bash
curl http://localhost:8000/plans
```

### Berlangganan paket (butuh token)
```bash
curl -X POST http://localhost:8000/subscriptions \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"plan_id":"<id-plan>","mulai":"2026-03-19","selesai":"2026-04-19"}'
```

### Status langganan aktif (butuh token)
```bash
curl http://localhost:8000/subscriptions/me \
  -H "Authorization: Bearer <token>"
```

### Seed Plans
3 paket otomatis di-seed saat startup (hanya jika tabel kosong):
- **Free**: Rp 0 — 100 pesan, 1 bot
- **Pro**: Rp 99.000 — 2.000 pesan, 3 bot
- **Business**: Rp 299.000 — unlimited

## Chatbot Engine (TASK-05)

### Buat bot baru (butuh token)
```bash
curl -X POST http://localhost:8000/chatbot \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"nama":"Bot Toko Saya","system_prompt":"Kamu asisten toko kami."}'
```

### Daftar bot (butuh token)
```bash
curl http://localhost:8000/chatbot \
  -H "Authorization: Bearer <token>"
```

### Update bot (butuh token)
```bash
curl -X PUT http://localhost:8000/chatbot/<bot_id> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"nama":"Bot Baru","system_prompt":"Prompt baru."}'
```

### Chat dengan bot (butuh token + ANTHROPIC_API_KEY)
```bash
curl -X POST http://localhost:8000/chat/<bot_id> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"message":"Halo, ada produk apa?","session_id":"sess-001"}'
```

### Konfigurasi AI
- Model: `claude-haiku-4-5-20251001`
- Isi `ANTHROPIC_API_KEY` di `.env` agar `/chat` bisa memanggil Anthropic API
- History percakapan per `session_id` tersimpan di tabel `chat_messages`
