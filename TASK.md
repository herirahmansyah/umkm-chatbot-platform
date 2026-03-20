# TASK: UMKM ChatBot Platform

## Status Sprint

### Sprint 1: Backend API ✓ SELESAI
- FastAPI + SQLite + SQLAlchemy
- Auth: register, login, JWT
- UMKM profile + plans + subscriptions
- Chatbot engine dengan OpenAI GPT-4o-mini
- Server: cd backend && source venv/bin/activate && uvicorn src.main:app --reload

### Sprint 2: Frontend Next.js 🔄 DALAM PROGRESS
- [x] Landing page dengan hero, fitur, pricing
- [x] Pricing 3 paket: Free(Rp0/7hari), Pro(Rp99rb/bln), Business(Rp199rb/bln)
- [ ] Halaman /register — test form submit ke backend
- [ ] Halaman /dashboard — tampilkan profil user
- [ ] Simpan JWT token ke localStorage setelah login
- Frontend: cd frontend && npm run dev

### Sprint 3: Dashboard UMKM ✗ BELUM
- Halaman kelola profil usaha
- Halaman buat dan kelola chatbot
- Halaman lihat history chat
- Halaman pilih dan upgrade paket

### Sprint 4: Sistem Berlangganan ✗ BELUM
- Flow pilih paket dari landing page
- Aktivasi paket setelah register
- Cek limit pesan per bulan
- Notifikasi jika mendekati limit

### Sprint 5: Integrasi Telegram ✗ BELUM
- Setup Telegram Bot per UMKM
- Webhook handler
- Forward pesan ke chatbot engine
- Kirim respons AI ke pelanggan

### Sprint 6: Admin Dashboard ✗ BELUM
- Login admin
- Lihat semua UMKM terdaftar
- Kelola paket dan harga
- Statistik penggunaan

## Cara Menjalankan Proyek

### Backend
cd /home/bang/projects/umkm-chatbot-platform/backend
source venv/bin/activate
uvicorn src.main:app --reload
# API: http://localhost:8000
# Docs: http://localhost:8000/docs

### Frontend
cd /home/bang/projects/umkm-chatbot-platform/frontend
npm run dev
# Web: http://localhost:3000

### Aider (AI Agent)
cd /home/bang/projects/umkm-chatbot-platform
export OPENAI_API_KEY=$(grep OPENAI_API_KEY backend/.env | cut -d '=' -f2)
aider --model gpt-4o-mini

## Paket Berlangganan
- Free:     Rp 0        → Trial 7 hari, 1 bot, Layanan CS
- Pro:      Rp 99.000   → 1 bulan, 1 bot, CS + RAG + Agenda
- Business: Rp 199.000  → 1 bulan, 1 bot, semua fitur + Invoice + Financial + Dashboard
