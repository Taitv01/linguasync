# Triển khai chi tiết: Dịch Vụ Bản Địa Hóa & Lồng Tiếng Video MVP

## Bối cảnh

Hiện tại `Top1_MVP_Scaffold/` chỉ chứa 3 file tài liệu (README, Master Prompts, Blueprint JSON). Người dùng yêu cầu **implement chi tiết** — tức xây dựng một hệ thống hoạt động thực tế bao gồm: website portfolio chuyên nghiệp, backend API xử lý workflow, và hệ thống quản lý dự án tích hợp.

## Phạm vi triển khai

### Thành phần 1: Website Portfolio / Landing Page
Một website chuyên nghiệp, responsive, premium-looking để giới thiệu dịch vụ, showcase mẫu, hiển thị bảng giá, và thu thập lead qua contact form.

**Công nghệ**: Single-page HTML + CSS + JavaScript (không cần framework — lightweight, deploy lên bất kỳ hosting nào)

**Trang/Section**:
- Hero section với tagline mạnh + CTA
- Services (4 gói dịch vụ chính)
- How It Works (quy trình 4 bước)
- Pricing (bảng giá 3 tiers)
- Portfolio/Showcase (video sample cards)
- Testimonials
- FAQ accordion
- Contact form (gửi qua Formspree hoặc EmailJS — miễn phí)
- Footer với social links

**Thiết kế**: Dark premium theme, glassmorphism cards, gradient CTAs, smooth scroll animations, Google Fonts (Inter/Outfit)

---

### Thành phần 2: Backend API Server (Node.js/Express)
API server xử lý logic nghiệp vụ: nhận form liên hệ, tính giá tự động, gửi email báo giá, tích hợp webhook.

**Tính năng**:
- `POST /api/quote` — nhận thông tin dự án, tính giá, trả JSON
- `POST /api/contact` — nhận form liên hệ, gửi email thông báo
- `GET /api/pricing` — trả bảng giá hiện tại (cho frontend dynamic loading)
- Logic tính giá theo công thức: base rate + per-language + discount + rush fee
- Email notification via Nodemailer (SMTP)

---

### Thành phần 3: Dashboard Quản lý Dự án
Một admin dashboard lightweight (HTML + JS) để theo dõi dự án, khách hàng, và doanh thu — sử dụng localStorage hoặc JSON file (không cần database cho MVP).

**Tính năng**:
- Kanban board: Received → Quoted → In Progress → QC → Delivered → Paid
- Danh sách khách hàng + lịch sử dự án
- Revenue tracker & metrics
- Nút tạo dự án mới + báo giá nhanh

---

## User Review Required

> [!IMPORTANT]
> **Lựa chọn kiến trúc**: Toàn bộ MVP sẽ được build bằng **vanilla HTML/CSS/JS** cho portfolio + **Node.js Express** nhẹ cho backend API. Không dùng framework nặng (React, Next.js) vì MVP cần nhẹ, deploy nhanh, và chi phí $0 (Vercel free tier hoặc Render free).

> [!WARNING]
> **Email gửi báo giá tự động**: Backend cần SMTP credentials (Gmail App Password hoặc dịch vụ email). Tôi sẽ cấu hình sẵn code nhưng bạn cần cung cấp credentials sau.

## Proposed Changes

### Component 1: Website Portfolio

#### [NEW] `Top1_MVP_Scaffold/website/index.html`
Landing page chính — single page, 8 sections, responsive, đa ngôn ngữ (EN/VN toggle).

#### [NEW] `Top1_MVP_Scaffold/website/css/style.css`
Design system: dark theme, CSS variables, glassmorphism, gradient buttons, animations, media queries.

#### [NEW] `Top1_MVP_Scaffold/website/js/main.js`
Interactivity: smooth scroll, language toggle, pricing calculator widget, form validation & submission, intersection observer animations.

#### [NEW] `Top1_MVP_Scaffold/website/js/calculator.js`
Widget tính giá tự động trực tiếp trên web — khách hàng chọn ngôn ngữ, độ dài video, options → hiển thị giá ngay lập tức.

---

### Component 2: Backend API

#### [NEW] `Top1_MVP_Scaffold/server/package.json`
Node.js project config với dependencies: express, cors, nodemailer, dotenv.

#### [NEW] `Top1_MVP_Scaffold/server/index.js`
Express server chính — routes, middleware, error handling.

#### [NEW] `Top1_MVP_Scaffold/server/routes/api.js`
API routes: /quote, /contact, /pricing.

#### [NEW] `Top1_MVP_Scaffold/server/services/pricing.js`
Pricing engine — logic tính giá theo cấu trúc đã định nghĩa trong README.

#### [NEW] `Top1_MVP_Scaffold/server/services/email.js`
Email service — templates HTML cho báo giá, confirmation, follow-up.

#### [NEW] `Top1_MVP_Scaffold/server/.env.example`
Template environment variables (SMTP, API keys).

---

### Component 3: Dashboard

#### [NEW] `Top1_MVP_Scaffold/dashboard/index.html`
Admin dashboard — Kanban board, metrics, client list.

#### [NEW] `Top1_MVP_Scaffold/dashboard/css/dashboard.css`
Dashboard styling — dark theme, data cards, kanban columns.

#### [NEW] `Top1_MVP_Scaffold/dashboard/js/dashboard.js`
Dashboard logic — project CRUD, drag-and-drop kanban, revenue analytics, localStorage persistence.

---

### Hỗ trợ

#### [MODIFY] `Top1_MVP_Scaffold/README_Setup.md`
Cập nhật README với hướng dẫn setup chi tiết cho toàn bộ hệ thống mới.

## Verification Plan

### Automated Tests
- Chạy `npm install` + `node index.js` trong `/server/` — verify server khởi động không lỗi
- Mở `website/index.html` trực tiếp trong browser — verify responsive, animations, pricing calculator hoạt động
- Mở `dashboard/index.html` — verify kanban, CRUD, localStorage hoạt động

### Manual Verification
- Screenshot/recording các trang web để demo
- Test pricing calculator với nhiều input khác nhau
- Test form submit trên website
