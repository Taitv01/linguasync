# LinguaSync MVP — Session Log & Deployment Notes
*Ngày: 30/03/2026 | Phiên làm việc: b8ef8255-3b06-4e3c-baa6-b76d2ce26080*

## 📦 Tổng quan dự án

**LinguaSync** — Dịch Vụ Bản Địa Hóa & Lồng Tiếng Video bằng AI.
MVP bao gồm 3 thành phần chính được phát triển trong 1 phiên duy nhất.

---

## 🏗️ Cấu trúc thư mục (đã deploy)

```
Top1_MVP_Scaffold/
├── public/                    ← Vercel serves static files từ đây
│   ├── index.html             ← Website portfolio (copy từ website/)
│   ├── css/style.css
│   ├── js/main.js
│   ├── js/calculator.js
│   └── dashboard/             ← Admin dashboard
│       ├── index.html
│       ├── css/dashboard.css
│       └── js/dashboard.js
├── api/                       ← Vercel Serverless Functions
│   ├── health.js              ← GET /api/health
│   ├── quote.js               ← GET/POST /api/quote
│   └── contact.js             ← POST /api/contact
├── website/                   ← Source files (website gốc)
│   ├── index.html
│   ├── css/style.css
│   ├── js/main.js
│   └── js/calculator.js
├── dashboard/                 ← Source files (dashboard gốc)
│   ├── index.html
│   ├── css/dashboard.css
│   └── js/dashboard.js
├── server/                    ← Express backend (local dev)
│   ├── index.js
│   ├── package.json
│   ├── routes/api.js
│   ├── services/pricing.js
│   ├── services/email.js
│   └── .env.example
├── vercel.json                ← Vercel deployment config
├── package.json               ← Root dependencies cho Vercel
├── .gitignore
├── blueprint.json             ← Scaffold blueprint
├── Master_Prompts.md
└── README_Setup.md
```

---

## 🌐 URLs Production (Vercel)

| Component | URL | Status |
|-----------|-----|--------|
| Website | https://linguasync-wheat.vercel.app/ | ✅ Live |
| Dashboard | https://linguasync-wheat.vercel.app/dashboard | ✅ Live |
| API Health | https://linguasync-wheat.vercel.app/api/health | ✅ Live |
| API Quote | https://linguasync-wheat.vercel.app/api/quote (POST) | ✅ Live |
| GitHub Repo | https://github.com/Taitv01/linguasync | ✅ Public |

---

## ⚙️ Cách chạy Local

### Option 1: Full Express Server (Node.js)
```powershell
cd server
npm install
node index.js
# → http://localhost:3001 (website)
# → http://localhost:3001/dashboard (dashboard)
# → http://localhost:3001/api/health (API)
```

### Option 2: Static only (Python)
```powershell
py -m http.server 8080 --directory website
py -m http.server 8081 --directory dashboard
```

---

## 📋 Checklist trạng thái

### Đã hoàn thành ✅
- [x] Website landing page song ngữ EN/VN (8 sections)
- [x] Pricing Calculator (real-time, auto-discount logic)
- [x] Language toggle EN ↔ VN (localStorage persist)
- [x] Contact form (Formspree ready)
- [x] Admin Dashboard (Kanban, Clients, Analytics)
- [x] CRUD dự án (localStorage + sample data)
- [x] Backend API (Express + Serverless Functions)
- [x] Email service templates (Nodemailer)
- [x] Node.js v24.14.1 installed
- [x] GitHub repo created (Taitv01/linguasync)
- [x] Vercel deployment (Hobby free tier)
- [x] Auto-deploy from GitHub push
- [x] Formspree account created (linguasync.dubbing@gmail.com)

### Cần làm tiếp 📝
- [ ] Verify email Formspree → tạo form → lấy Form ID
- [ ] Thay `YOUR_FORM_ID` trong `/website/index.html` dòng 541 VÀ `/public/index.html`
- [ ] Cấu hình SMTP thực tế trong `.env` (Gmail App Password hoặc SendGrid)
- [ ] Mua domain tùy chỉnh (optional, Vercel hỗ trợ free)
- [ ] Tích hợp Google Sheets API thay localStorage cho dashboard
- [ ] Thêm Google Analytics tracking

---

## 🔐 Thông tin tài khoản

### Formspree
- Email: linguasync.dubbing@gmail.com
- Password: LS2026!secure#mvp
- Status: Cần verify email

### Vercel
- Đăng nhập qua Google OAuth (thaivan.tai.tai@gmail.com)
- Plan: Hobby (Free)
- Project: linguasync

### GitHub
- Repo: https://github.com/Taitv01/linguasync
- Account: Taitv01

---

## 💡 Ghi chú kỹ thuật

### Vercel Routing
- `public/` directory được Vercel serve tự động
- Dashboard dùng absolute paths (`/dashboard/css/...`) để tránh lỗi trailing slash
- API dùng Vercel Serverless Functions (`api/*.js`)
- Mỗi git push → auto redeploy

### Pricing Engine
- Base rate: $50 cho 5 phút đầu
- Per minute: $15/phút sau 5 phút đầu
- Lip-sync: +$20/ngôn ngữ
- Multi-language (≥3): -15% discount
- Rush: +30% surcharge
- Logic đồng bộ giữa frontend (calculator.js) và backend (api/quote.js)

### Sync giữa website/ và public/
- **Source of truth**: `website/` và `dashboard/` là source gốc
- **Vercel deployment**: `public/` chứa copies cho Vercel
- Khi edit source, cần copy lại vào `public/` và push
