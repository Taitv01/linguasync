# 📝 MASTER PROMPTS — Dịch Vụ Bản Địa Hóa & Lồng Tiếng Video

> Tài liệu này chứa các mega-prompt và template cho từng bước trong quy trình dịch vụ.
> Sao chép và sử dụng trực tiếp — chỉnh sửa phần [BRACKETS] cho phù hợp.

---

## 1. PROMPT: Phân Tích Video Đầu Vào

```
Bạn là chuyên gia bản địa hóa video. Hãy phân tích video sau và cung cấp:

1. **Thông tin cơ bản**:
   - Ngôn ngữ gốc: [XÁC ĐỊNH]
   - Độ dài: [SỐ PHÚT]
   - Số người nói: [SỐ LƯỢNG]
   - Loại nội dung: [marketing/education/entertainment/corporate]

2. **Đánh giá độ khó bản địa hóa** (1-5):
   - Thuật ngữ chuyên ngành: [ĐÁNH GIÁ]
   - Tham chiếu văn hóa cần điều chỉnh: [LIỆT KÊ]
   - Tốc độ nói: [chậm/trung bình/nhanh]
   - Chất lượng âm thanh: [tốt/trung bình/kém]

3. **Đề xuất công cụ**:
   - Nếu có lip-sync → HeyGen
   - Nếu multi-speaker → Rask AI
   - Nếu narration → ElevenLabs

4. **Ước tính thời gian & chi phí**:
   - Thời gian xử lý: [SỐ GIỜ]
   - Chi phí đề xuất: $[SỐ TIỀN]
```

---

## 2. PROMPT: Dịch Thuật Thích Ứng Văn Hóa

```
Bạn là dịch giả chuyên nghiệp với chuyên môn về bản địa hóa (localization, không chỉ translation).

**Ngôn ngữ gốc**: [NGUỒN]
**Ngôn ngữ đích**: [ĐÍCH]
**Bối cảnh**: Video [LOẠI NỘI DUNG] cho [ĐỐI TƯỢNG]

**Quy tắc bản địa hóa**:
1. KHÔNG dịch word-for-word. Điều chỉnh ý nghĩa cho phù hợp văn hóa đích.
2. Thay đổi đơn vị đo: miles → km, Fahrenheit → Celsius, v.v. (nếu phù hợp).
3. Thay thế tham chiếu văn hóa: ví dụ "As easy as apple pie" → một idiom tương đương trong ngôn ngữ đích.
4. Giữ nguyên tên riêng (người, công ty, sản phẩm) — phiên âm nếu cần.
5. Đảm bảo tone giọng phù hợp: [formal/casual/energetic/calm].
6. Matching lip-sync timing: Cố gắng giữ độ dài câu tương đương để sync tốt hơn.

**Transcript gốc**:
```
[DÁN TRANSCRIPT Ở ĐÂY]
```

**Output yêu cầu**:
- Bản dịch bản địa hóa hoàn chỉnh
- Ghi chú các điểm thay đổi văn hóa (với giải thích)
- Danh sách thuật ngữ cần xác nhận với khách hàng
```

---

## 3. PROMPT: QC (Quality Control) Sau AI Dubbing

```
Bạn là QC specialist cho dịch vụ lồng tiếng AI. Hãy review bản dub sau:

**Checklist QC**:

### Ngôn ngữ & Nội dung
- [ ] Phát âm chính xác tất cả từ, đặc biệt tên riêng
- [ ] Ngữ pháp đúng trong ngôn ngữ đích
- [ ] Không có từ bị bỏ sót hoặc thêm vào
- [ ] Thuật ngữ chuyên ngành được dùng đúng
- [ ] Tone phù hợp với bối cảnh (formal/casual)

### Kỹ thuật Âm thanh
- [ ] Không có artifacts/glitch trong giọng AI
- [ ] Tốc độ nói tự nhiên (không quá nhanh/chậm)
- [ ] Ngữ điệu tự nhiên (lên/xuống giọng phù hợp)
- [ ] Độ to nhất quán (không bị peak/drop bất thường)
- [ ] Nhạc nền & sound effects vẫn nguyên vẹn

### Đồng bộ (Sync)
- [ ] Lip-sync chấp nhận được (nếu có người nói)
- [ ] Timing khớp với visual cues
- [ ] Pause tự nhiên giữa các câu
- [ ] Không có overlap giữa các speaker

### Văn hóa
- [ ] Không có nội dung offensive trong ngôn ngữ đích
- [ ] Tham chiếu văn hóa đã được điều chỉnh
- [ ] Đơn vị đo đã được chuyển đổi (nếu cần)

**Kết quả**: [PASS / FAIL — kèm danh sách issues cần sửa]
```

---

## 4. PROMPT: Email Template — Báo Giá Cho Khách Hàng

```
Subject: Báo Giá Dịch Vụ Bản Địa Hóa Video — [TÊN CÔNG TY]

Kính gửi [TÊN KHÁCH HÀNG],

Cảm ơn anh/chị đã liên hệ về dịch vụ bản địa hóa video. Sau khi review video của anh/chị, tôi xin gửi báo giá như sau:

---

**📋 THÔNG TIN DỰ ÁN**
- Video: [TÊN VIDEO]
- Độ dài: [SỐ PHÚT]
- Ngôn ngữ gốc: [NGUỒN]
- Ngôn ngữ đích: [ĐÍCH 1], [ĐÍCH 2]

**💰 BÁO GIÁ**

| Hạng mục | Chi phí |
|----------|:-------:|
| Dịch thuật & bản địa hóa | $[XX] |
| Lồng tiếng AI + QC thủ công | $[XX] |
| Lip-sync adjustment | $[XX] |
| Subtitle file (SRT/VTT) | Miễn phí kèm theo |
| **TỔNG** | **$[XX]** |

**⏱️ THỜI GIAN GIAO HÀNG**: [X] ngày làm việc

**🎁 ƯU ĐÃI**: Đặt thêm [X] ngôn ngữ → giảm 15%

---

Anh/chị có thể xác nhận báo giá bằng cách reply email này. Tôi sẽ bắt đầu ngay trong ngày.

Nếu có câu hỏi, xin liên hệ tôi bất cứ lúc nào.

Trân trọng,
[TÊN CỦA BẠN]
[CHỨC DANH]
[WEBSITE]
[SỐ ĐIỆN THOẠI]
```

---

## 5. PROMPT: Cold Outreach — LinkedIn/Email

### Phiên bản tiếng Anh (cho khách quốc tế)

```
Subject: I can help you reach [COUNTRY] audience — video localization

Hi [NAME],

I noticed your [YouTube channel / course platform / company] has great content in English. Have you considered expanding to [Vietnamese / Japanese / Korean / Spanish] speaking audiences?

I specialize in AI-powered video localization — dubbing your videos into new languages with:
✅ Natural-sounding AI voices (not robotic TTS)
✅ Lip-sync matching for talking-head videos
✅ Cultural adaptation (not just translation)
✅ Human QC on every project

**Pricing starts at $50/video** for basic dubbing. I'd love to do a FREE sample for you — just send me any 2-minute clip and I'll localize it into one language of your choice.

Would you be open to a quick 15-min call this week?

Best,
[YOUR NAME]
```

### Phiên bản tiếng Việt (cho khách VN)

```
Subject: Giúp anh/chị đưa nội dung video ra thị trường quốc tế

Chào anh/chị [TÊN],

Tôi thấy nội dung video của [KÊNH/CÔNG TY] rất chất lượng. Anh/chị đã nghĩ đến việc mở rộng sang thị trường [Mỹ/Nhật/Hàn] chưa?

Tôi chuyên cung cấp dịch vụ bản địa hóa video bằng AI:
✅ Giọng AI tự nhiên (không phải robot)
✅ Lip-sync cho video có người nói
✅ Thích ứng văn hóa (không chỉ dịch từng chữ)
✅ Kiểm soát chất lượng thủ công cho mọi dự án

**Giá khởi điểm chỉ từ 750,000 VNĐ/video**. Tôi muốn làm MỘT MẪU MIỄN PHÍ cho anh/chị — chỉ cần gửi tôi clip 2 phút bất kỳ.

Anh/chị có muốn trao đổi nhanh 15 phút trong tuần này không?

Trân trọng,
[TÊN CỦA BẠN]
```

---

## 6. PROMPT: Tạo Case Study

```
Bạn là content writer chuyên viết case study cho B2B services.

**Thông tin dự án**:
- Khách hàng: [TÊN] (ngành [NGÀNH])
- Vấn đề: [MÔ TẢ VẤN ĐỀ]
- Giải pháp: Bản địa hóa [SỐ] video từ [NGUỒN] sang [ĐÍCH]
- Kết quả: [SỐ LIỆU CỤ THỂ]

**Viết case study theo cấu trúc**:
1. **Bối cảnh**: Khách hàng là ai, họ muốn gì
2. **Thách thức**: Tại sao họ cần localization, thử tự làm nhưng gặp vấn đề gì
3. **Giải pháp**: Quy trình bạn thực hiện (cụ thể từng bước)
4. **Kết quả**: Metrics rõ ràng (views tăng X%, engagement Y%, new market Z)
5. **Lời chứng thực**: Quote từ khách hàng (xin phép trước)

Tone: Chuyên nghiệp nhưng dễ đọc. Dài 400-600 từ. Kèm 2-3 metrics nổi bật.
```

---

## 7. PROMPT: Workflow Decision Matrix

```
Khi nhận video mới, sử dụng decision tree sau:

┌─ Video có người nói trực tiếp (talking head)?
│  ├── CÓ → Cần lip-sync?
│  │   ├── CÓ → 🔹 HeyGen (lip-sync tốt nhất)
│  │   └── KHÔNG → 🔸 Rask AI (voice clone chính xác)
│  │
│  └── Nhiều người nói (>2 speakers)?
│      ├── CÓ → 🔸 Rask AI (multi-speaker detection)
│      └── KHÔNG → 🔹 HeyGen hoặc ElevenLabs
│
└─ Video dạng narration/voice-over (không thấy mặt)?
   ├── Cần giọng siêu realistic → 🔶 ElevenLabs
   ├── Cần tốc độ nhanh + giá rẻ → 🔸 Rask AI
   └── Cần tích hợp avatar → 🔹 HeyGen

📌 NGUYÊN TẮC VÀNG:
- Luôn chạy AI dub trước → QC thủ công → sửa → delivery
- Không bao giờ giao video chưa qua QC thủ công
- Nếu chất lượng AI không đạt → dùng ElevenLabs tạo voice riêng + edit thủ công
```

---

## 8. PROMPT: Monthly Report Cho Khách Hàng

```
# BÁO CÁO HÀNG THÁNG — [THÁNG/NĂM]

## Tóm tắt
- Tổng số video đã localize: [SỐ]
- Ngôn ngữ: [DANH SÁCH]
- Tổng thời lượng: [SỐ PHÚT]

## Hiệu suất
| Metric | Tháng trước | Tháng này | Thay đổi |
|--------|:-----------:|:---------:|:--------:|
| Videos localized | [X] | [Y] | +[Z]% |
| Average turnaround | [X] ngày | [Y] ngày | -[Z]% |
| QC pass rate (lần 1) | [X]% | [Y]% | +[Z]% |

## Đề xuất tháng tới
1. [GỢI Ý MỞ RỘNG NGÔN NGỮ]
2. [GỢI Ý TỐI ƯU NỘI DUNG]
3. [GỢI Ý TĂNG VOLUME]

## Chi phí
| Hạng mục | Số lượng | Đơn giá | Tổng |
|----------|:--------:|:-------:|:----:|
| Dubbing cơ bản | [X] | $[Y] | $[Z] |
| Multi-language | [X] | $[Y] | $[Z] |
| **TỔNG** | | | **$[TỔNG]** |
```

---

*Master Prompts v1.0 — Cập nhật 30/03/2026*
