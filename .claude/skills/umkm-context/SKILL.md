---
name: umkm-context
description: |
  Konteks domain bisnis dan schema database proyek UMKM ChatBot Platform.
  Selalu aktif saat mengerjakan proyek ini.
---

# UMKM ChatBot Platform — Konteks Proyek

## Domain Bisnis
Platform SaaS untuk UMKM Indonesia yang ingin punya chatbot AI
untuk melayani pelanggan mereka di Telegram dan WhatsApp.

## Database Schema

### users
- id: UUID PK
- email: VARCHAR UNIQUE
- password_hash: VARCHAR (bcrypt)
- role: ENUM → 'umkm' atau 'admin'
- is_active: BOOLEAN default True
- created_at: TIMESTAMP

### umkm_profiles
- id: UUID PK
- user_id: FK → users
- nama_usaha: VARCHAR
- deskripsi: TEXT (konteks untuk chatbot)
- kategori: VARCHAR (kuliner/fashion/jasa/dll)
- no_hp: VARCHAR
- alamat: TEXT

### plans
- id: UUID PK
- nama: VARCHAR (Free/Pro/Business)
- harga: INTEGER (Rupiah per bulan)
- max_pesan: INTEGER (-1 = unlimited)
- max_bot: INTEGER
- fitur: JSON (list fitur)

### subscriptions
- id: UUID PK
- umkm_id: FK → umkm_profiles
- plan_id: FK → plans
- status: ENUM → active/expired/cancelled
- mulai: DATE
- selesai: DATE

### chatbots
- id: UUID PK
- umkm_id: FK → umkm_profiles
- nama: VARCHAR
- system_prompt: TEXT
- is_active: BOOLEAN

### chat_messages
- id: UUID PK
- bot_id: FK → chatbots
- session_id: VARCHAR
- role: ENUM → 'user' atau 'assistant'
- content: TEXT
- timestamp: TIMESTAMP

## Konvensi Kode

### Format Response API
```python
# Sukses
{"success": True, "data": {...}, "message": "OK"}
# Error
{"success": False, "data": None, "message": "Pesan error"}
```

### Load Environment Variables
```python
from src.utils.config import settings
```

### Struktur Router
```python
from fastapi import APIRouter
router = APIRouter(prefix="/auth", tags=["Authentication"])
```

## Paket Berlangganan
- Free:     Rp 0/bulan       → 100 pesan, 1 bot
- Pro:      Rp 99.000/bulan  → 2.000 pesan, 3 bot
- Business: Rp 299.000/bulan → unlimited, tak terbatas
