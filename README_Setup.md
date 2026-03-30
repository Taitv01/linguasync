# 🎬 MVP — Dịch Vụ Bản Địa Hóa & Lồng Tiếng Video

## Tổng Quan

Đây là MVP scaffold cho dịch vụ bản địa hóa video, bao gồm:
- **Blueprint tự động hóa** (Make.com) cho quy trình nhận video → xử lý → giao hàng
- **Mega-Prompts** cho từng bước trong pipeline
- **SOP** (Quy trình vận hành chuẩn) hoàn chỉnh
- **Cấu trúc giá** và template hợp đồng

## Yêu Cầu Hệ Thống

### Tài khoản cần đăng ký
| Công cụ | Gói | Chi phí/tháng |
|---------|-----|:-------------:|
| [HeyGen](https://heygen.com) | Creator | $29 |
| [Rask AI](https://rask.ai) | Creator | $60 |
| [ElevenLabs](https://elevenlabs.io) | Creator | $22 |
| [Make.com](https://make.com) | Core | $9 |
| [Notion](https://notion.so) | Free | $0 |
| [Google Workspace](https://workspace.google.com) | Business Starter | $6 |
| **Tổng OPEX** | | **~$126/tháng** |

### Tài khoản freelance
- [Upwork](https://upwork.com) — Tạo profile "Video Localization Specialist"
- [Fiverr](https://fiverr.com) — Tạo gig "AI Video Translation & Dubbing"
- [LinkedIn](https://linkedin.com) — Tối ưu profile cho B2B outreach

## Hướng Dẫn Cài Đặt

### Bước 1: Đăng ký công cụ
1. Tạo tài khoản HeyGen Creator → Kích hoạt unlimited audio dubbing
2. Tạo tài khoản Rask AI Creator → 25 phút dubbing/tháng
3. Tạo tài khoản ElevenLabs Creator → 100,000 ký tự/tháng
4. Tạo tài khoản Make.com Core → Import blueprint từ `blueprint.json`

### Bước 2: Import Blueprint Make.com
1. Đăng nhập Make.com
2. Vào **Scenarios** → **Create a new scenario**
3. Click **...** (More) → **Import Blueprint**
4. Upload file `blueprint.json` từ thư mục này
5. Cấu hình connections cho Google Drive, Gmail, Notion

### Bước 3: Setup Notion Workspace
1. Duplicate template từ link trong `Master_Prompts.md`
2. Tạo database: **Projects**, **Clients**, **Invoices**
3. Properties: Status, Client Name, Source Language, Target Languages, Due Date, Price

### Bước 4: Portfolio Website
1. Tạo trang Carrd.co hoặc Framer (miễn phí)
2. Showcase 5 video mẫu localization
3. Thêm form liên hệ và bảng giá

## Cấu Trúc Giá Đề Xuất

### Bảng Giá Cơ Bản

| Dịch vụ | Giá (USD) | Chi tiết |
|---------|:---------:|----------|
| **Dubbing cơ bản** (1 ngôn ngữ, ≤5 phút) | $50–80 | AI dub + QC thủ công |
| **Dubbing nâng cao** (1 ngôn ngữ, ≤15 phút) | $100–200 | AI dub + lip-sync + QC |
| **Multi-language pack** (3 ngôn ngữ, ≤10 phút) | $250–400 | Giảm giá khi đặt nhiều ngôn ngữ |
| **Subtitles only** (SRT/VTT, 1 ngôn ngữ) | $20–40 | Dịch + timing + review |
| **Retainer monthly** (≤20 video/tháng) | $800–1500 | Giảm 20-30% so với đơn lẻ |

### Chiến lược giá cho thị trường VN
- Giảm 40-50% so với bảng giá quốc tế
- Bắt đầu với $30-50/video cho SME Việt Nam
- Tăng dần khi có testimonials và case studies

## Quy Trình Vận Hành (SOP)

### Giai đoạn 1: Tiếp nhận (Ngày 1)
1. Khách gửi video qua form/email
2. Make.com tự động tạo task trong Notion
3. Review video: độ dài, chất lượng âm thanh, ngôn ngữ gốc
4. Gửi báo giá tự động qua email template

### Giai đoạn 2: Xử lý (Ngày 2-3)
1. Upload video lên HeyGen hoặc Rask AI
2. Chọn công cụ phù hợp:
   - **HeyGen**: Tốt cho video có người nói, cần lip-sync
   - **Rask AI**: Tốt cho multi-speaker, voice cloning chính xác
   - **ElevenLabs**: Tốt cho voice-over narration thuần túy
3. Generate AI dub lần 1
4. **QC thủ công** (QUAN TRỌNG):
   - Kiểm tra phát âm tên riêng
   - Kiểm tra ngữ cảnh văn hóa
   - Sửa timing/sync
   - Điều chỉnh tone

### Giai đoạn 3: Giao hàng (Ngày 3-4)
1. Export video final (1080p/4K)
2. Tạo file SRT/VTT subtitle kèm theo
3. Upload lên Google Drive shared folder
4. Gửi link cho khách + form feedback
5. Make.com tự động cập nhật Notion status

### Giai đoạn 4: Follow-up (Ngày 7)
1. Gửi email follow-up tự động
2. Yêu cầu testimonial
3. Đề xuất gói retainer

## Liên Hệ & Hỗ Trợ

Xem file `Master_Prompts.md` để biết các mega-prompt chi tiết cho từng bước.
Xem file `blueprint.json` để import automation workflow vào Make.com.

---

*MVP được tạo bởi AI Enterprise Architect — Google Antigravity IDE*
*Ngày 30/03/2026*
