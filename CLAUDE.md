# Proyek: UMKM ChatBot Platform

## Visi
Platform web fullstack untuk UMKM Indonesia mendaftar dan berlangganan
chatbot AI pintar yang melayani pelanggan mereka otomatis.

## Fitur Utama
1. Landing page + pendaftaran UMKM
2. Dashboard UMKM: kelola profil, produk, langganan
3. Admin dashboard: kelola semua UMKM dan billing
4. Chatbot engine: setiap UMKM punya bot dengan konteks bisnisnya sendiri
5. Paket berlangganan: Free / Pro / Business
6. Integrasi Telegram dan WhatsApp (Sprint 6)

## Stack Teknologi
### Backend
- Python 3.12 + FastAPI
- SQLite (dev) lalu PostgreSQL (production)
- SQLAlchemy ORM + Alembic migrations
- JWT authentication (python-jose + bcrypt)
- Anthropic API untuk chatbot AI

### Frontend
- Next.js 14 (App Router)
- Tailwind CSS + shadcn/ui
- Zustand untuk state management
- React Hook Form + Zod validasi

## Paket Berlangganan
- Free:     Rp 0/bulan       → 100 pesan, 1 bot
- Pro:      Rp 99.000/bulan  → 2.000 pesan, 3 bot, analitik
- Business: Rp 299.000/bulan → unlimited, bot tak terbatas

## Konvensi Response API
Selalu gunakan format ini:
{ "success": true, "data": {...}, "message": "OK" }
{ "success": false, "data": null, "message": "Pesan error" }

## Folder Proyek
/home/bang/projects/umkm-chatbot-platform/
