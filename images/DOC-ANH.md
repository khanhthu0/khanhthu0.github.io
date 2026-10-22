# 📁 BẢN ĐỒ ẢNH — CẤU TRÚC THEO VỊ TRÍ SỬ DỤNG (kh128)

> **Nguyên tắc kh128 (Đại Ka): tên thư mục = vị trí ảnh hiển thị trên web.**
> Muốn thêm/thay ảnh ở vị trí nào → drop file vào đúng thư mục vị trí đó rồi cập nhật 1 chỗ (src trong `index.html`, hoặc url() trong `assets/css/style.css`).
> Tên cặp đôi: **Nông Quốc Khánh (CK)** & **Đỗ Thị Thư (VK)** · Ngày cưới: 16/01/2027.

## Cấu trúc thư mục

```
images/
├── nen/               3 nền trang trí chính
│   ├── nen-phong-bi.jpg    ← nền phía sau PHONG BÌ mở thiệp (.cover-bg)
│   ├── nen-trang-dau.jpg   ← nền TRANG ĐẦU sau khi mở (.opening — hoa v2)
│   └── nen-hero.jpg        ← nền HERO đầu trang (.hero — vòm cổng cưới hoa)
├── couple/           avatar cặp đôi
│   ├── anh-ck.jpg         ← ảnh CHÚ RỂ Khánh (card cặp đôi, 800×800 khung tròn)
│   └── anh-vk.jpg         ← ảnh CÔ DÂU Thư (card cặp đôi, 800×800 khung tròn)
├── hero/cap-doi-that.jpg  ← Ảnh hero ("Chúng tôi tổ chức đám cưới") — kh143 DỌC 2:3 1200×1800 + đầu lưới "Xem thêm"
├── gallery/          7 ảnh LƯỚI CHÍNH "Album Ảnh Cưới" + 6 ảnh MỚI kh143 cuoi-that-1..6.jpg (ảnh cưới thật)
│   └── xem-them/     8 ảnh LƯỚI "Xem thêm khoảnh khắc" (hiện khi bấm nút)
└── du-phong/         7 ảnh DỰ PHÒNG — chưa gắn web (bản cũ kh107 + 2 ảnh in ngày cưới thật 22·11·2026 + 2 ảnh áo dài đã thay kh121)
```

## BẢN ĐỒ: ảnh → vị trí → chỗ cập nhật trong code

| Thư mục vị trí | File | Hiển thị trên web | Cập nhật src ở đâu |
|---|---|---|---|
| `nen/` | `nen-phong-bi.jpg` | Nền sau phong bì — khung mở thiệp (`alt`="Cảnh nền" 2 event-img + nền `.cover-bg`) | `index.html` (2 `<img class="event-img">`) + `assets/css/style.css` dòng ~64 `url()` |
| `nen/` | `nen-trang-dau.jpg` | Nền TRANG ĐẦU sau khi mở thiệp (`.opening`) | `assets/css/style.css` dòng ~191 `url()` |
| `nen/` | `nen-hero.jpg` | Nền HERO đầu trang — vòm cổng cưới (`.hero`) | `assets/css/style.css` dòng ~256 `url()` |
| `couple/` | `anh-ck.jpg` | Ảnh chú rể Khánh — card cặp đôi (**kh149 fix xoay EXIF** — mặt ĐỨNG đúng chiều, khung tròn viền vàng giữ style) | `index.html` `src="images/couple/anh-ck.jpg"` |
| `couple/` | `anh-vk.jpg` | Ảnh cô dâu Thư — card cặp đôi (**kh149 fix xoay EXIF**) | `index.html` `src="images/couple/anh-vk.jpg"` |
| `hero/` | `cap-doi-that.jpg` | Ảnh cặp đôi trong hero ("Chúng tôi tổ chức đám cưới") + ảnh đầu "Xem thêm" — kh143 DỌC 2:3 1200×1800, **kh149 fix xoay EXIF** (_SEE9199 EXIF=8 → xoay đúng chiều trước crop; khung đèn + cặp đôi ĐỨNG thẳng) | `index.html` `src="images/hero/cap-doi-that.jpg"` (2 chỗ: hero + gallery-more) · CSS `.hero-photo` aspect-ratio 2/3 (#6 đã sửa kh144) |
| `gallery/` | 7 file `.jpg` cũ + **6 file `cuoi-that-1..6.jpg`** kh143 (896×1176 crop 3:4 từ 15 ảnh thật drive-download — **kh149 fix xoay EXIF**, người ĐỨNG đúng chiều) | Lưới gallery chính "Album Ảnh Cưới"; ảnh: 1=7780 ôm vườn, 2=9233 cột vàng cô dâu, 3=9237 cô dâu trước cột, 4=9238 ôm sát cột, 5=9240 giữa vườn, 6=9242 trước cột vàng | `index.html` (`<img src="images/gallery/cuoi-that-N.jpg">` trong `#galleryGrid`; CSS `aspect-ratio:3/4` khớp) |
| `gallery/xem-them/` | 8 file `.jpg` | Lưới "Xem thêm khoảnh khắc" (hiện sau khi bấm nút) | `index.html` (8 `<img>` trong `#galleryMore`) |
| `du-phong/` | 7 file | **KHÔNG hiển thị** — tài sản chờ gắn (2 ảnh ngày cưới thật 22·11·2026 + âm 14·10·2026 đã sẵn sàng; 2 ảnh áo dài cũ; bản kh107 v1) | — |
| — | `le-ta-on.jpg` | Nền footer "lễ tạ ơn" + ảnh trong lưới gallery chính | `index.html` + `assets/css/style.css` dòng ~794 `url()` |

⚠️ **2 ảnh in ngày CƯỚI THẬT 22 · 11 · 2026** (`du-phong/hero-couple.jpg` + `du-phong/save-the-date.jpg`, làm lại 20-10 theo a2 Đại Ka — dòng âm lịch 14 · 10 · 2026): **CHƯA gắn** vào web (assert test chặn tham chiếu cũ) — đã sẵn sàng để #6/Đại Ka gắn khi muốn; script làm lại: `tools/dung_anh_ngay_that.swift`.

## Cách THÊM / THAY ảnh (hướng dẫn nhanh)

1. **Nền trang trí (nen/)**: thả ảnh mới vào `images/nen/`, đổi tên trùng file đang dùng (vd `nen-hero.jpg`) → web tự hưởng ngay, KHÔNG cần sửa code (build script nhúng theo đường dẫn).
2. **Avatar cặp đôi (couple/)**: thả ảnh mới vào `images/couple/`, đổi tên `anh-ck.jpg`/`anh-vk.jpg` → tự gắn. Muốn đổi tên khác thì sửa `src` trong `index.html` 1 chỗ.
3. **Gallery chính**: thêm `<img src="images/gallery/<file-mới>.jpg" alt="...">` vào lưới `#galleryGrid` trong `index.html` — test assert hiện 7 ảnh, thêm thì cập nhật assert số lượng.
4. **Xem thêm**: thêm `<img>` vào `#galleryMore` (8 ảnh hiện có — thêm/bớt tự do, nút toggle vẫn hoạt động).
5. **Đóng gói 5 tông (build)**: `python3 tools/build_dong_goi_kh122.py` — script nhúng toàn bộ ảnh theo `IMAGES` trong script; thêm ảnh mới vào web → cập nhật đường dẫn trong `IMAGES` + rule nén `NEN` tương ứng.

## Lịch sử ảnh (tóm tắt)

- **kh107 (#4)**: bộ ảnh cơ bản đầu tiên (nen-hero, avatar v1, hero-couple/save-the-date in ngày 20·12·2026 placeholder, gallery 7 ảnh).
- **kh116 (#4)**: avatar v2 chuẩn hơn (crop mặt to + khung tròn 660px viền vàng kép), nền hoa v2 + vòm cổng cưới, ảnh cặp đôi 2 khung tròn.
- **kh121 (#6)**: hero bỏ 2 hình áo dài (ck-khanh/vk-thu) → 1 ảnh cặp đôi thật `_SEE8469` (khung polaroid) — 2 ảnh áo dài giờ nằm `du-phong/`.
- **v3 (#4, 20-10 — fix a2 "cắt nhầm vị trí đầu")**: avatar v3 crop ĐỦ ĐẦU (Khánh 905,380,520 — kh116 cũ y520 cắt đúng đỉnh tóc; Thư 1275,360,500) — `tools/dung_anh_avatar_v3.swift` (self-contained, test `tools/test_kh132.js` 12 assert). Hero `cap-doi-that.jpg` thay bằng bản nén `_SEE9199.JPG` (Đại Ka chỉ định cho khu "tổ chức đám cưới") 1800×1200 — 5 file dong-goi đã rebuild theo.
- **kh124 (#6)**: merge kh116 + kh117 vào main, tích hợp avatar v2 + nền vòm + gallery-more 9 ảnh (cap-doi-that đầu lưới).
- **kh143 (#4, 20-10)**: (a) hero `cap-doi-that.jpg` chuyển **CHIỀU DỌC 2:3 1200×1800** (crop x0 từ _SEE9199 — preview verify Read 4 vị trí, chọn x0: khung đèn + cặp đôi cân giữa; script `tools/dung_anh_doc_kh143.swift`); (b) **6 ảnh gallery MỚI** `cuoi-that-1..6.jpg` 896×1176 (3:4 khớp CSS) crop từ 6/15 ảnh cưới thật đẹp nhất trong drive-download (7780/9233/9237/9238/9240/9242 — verify Read từng ảnh chọn vùng crop theo vị trí người, không crop máy móc giữa; script `tools/crop_gallery_kh143.swift`) — chờ #6 gắn `<img>` trong kh144.
- **kh128 (#6)**: tổ chức lại toàn bộ `images/` theo vị trí (nen/couple/hero/gallery/du-phong) — git mv giữ history, 0 đổi nội dung ảnh.
- **kh149 (#4, 20-10 — fix "ảnh _SEE9199 vào index bị xoay ngang")**: **NGUYÊN NHÂN**: ảnh gốc Sony ILCE-7M4 có **EXIF Orientation=8** (lower-left) — pixel lưu NGANG 3504×2336 nhưng Preview/iPhone/Finder hiển thị DỌC. Script Swift cũ (`CGImageSourceCreateImageAtIndex`) KHÔNG áp EXIF → crop từ pixel thô → bản xuất XOAY 90° so ảnh gốc. **BẢN BỊ**: `hero/cap-doi-that.jpg` (_SEE9199) + `couple/anh-ck|anh-vk.jpg` (_SEE8469) + `gallery/cuoi-that-1..6.jpg` (drive-download) — 9 ảnh. **BẢN KHÔNG BỊ**: ảnh vẽ tay (nen/, du-phong/, le-ta-on) + chibi AI (cap-doi-*, co-dau). **FIX**: `tools/fix_exif_xoay_kh149.swift` xoay về đúng chiều (rotate +π/2 trong CGContext = EXIF 8) TRƯỚC khi crop/scale — hero dọc full 2336×3504 → 1200×1800; avatar tọa độ dọc Khánh (380,2078,520) / Thư (360,1728,500); gallery crop 3:4 y=60. Ghi đè cùng tên (kh128) → web tự hưởng. Test `tools/test_kh149.js` 34 assert (kích thước + 0 EXIF orientation tag + reproduction MD5 identical + mobile + 0 PAGEERROR). ⚠️ Từ kh149: MỌI script crop ảnh nguồn Sony PHẢI áp EXIF trước (dùng `rotateDoc()` trong script kh149) — không crop pixel thô.

## Ghi chú kỹ thuật

- Ảnh cặp đôi trong `gallery/` là sản phẩm dự án GhepAnh (kh8–kh28, face-swap giữ nhận diện mặt thật) — Đại Ka từng duyệt đẹp, tận dụng lại thay vì sinh ảnh mới (key Gemini API 402 hết credit, OpenRouter không có credit sinh ảnh).
- Script dựng ảnh v3 (avatar đủ đầu + hero _SEE9199): `tools/dung_anh_avatar_v3.swift` — self-contained, output NGAY vào cấu trúc vị trí kh128 (`images/couple/` + `images/hero/` — không cần đổi OUT như script kh116). Chạy lại: `swift tools/dung_anh_avatar_v3.swift` (tọa độ crop đã verify Read từng bước).
- Script dựng ảnh kh116: `tools/dung_anh_kh116.swift` — **self-contained** (đọc thẳng ảnh gốc `/Users/fadc/ai/GhepAnh/nen-1/_SEE8469.JPG`, KHÔNG phụ thuộc /tmp): avatar crop chuẩn (Khánh 925,520,480 / Thư 1295,520,460) + ảnh cặp đôi + 2 nền hoa. Chạy lại: `swift tools/dung_anh_kh116.swift`. Hoa nền vẽ tổ hợp CoreGraphics deterministic (seed cố định — chạy lại ra đúng kết quả). ⚠️ Cũ: avatar bản này bị "cắt nhầm vị trí đầu" (y520 = đúng đỉnh tóc) → đã thay bằng v3 ở trên.
  - ⚠️ LƯU Ý kh128: script đang ghi output vào `.../thiepcuoi-B/images/` (worktree #4 — tên file cũ kh107/kh116). Sau reorg, khi chạy lại cần đổi `OUT` + tên file output theo cấu trúc vị trí mới (nen/ couple/ hero/) — hoặc output vào thư mục tạm rồi copy tay vào đúng vị trí.
- Script dựng ảnh kh107: `tools/dung_anh_kh107.swift` (tham chiếu input trung gian `/tmp/tc107_*.jpg` đã mất khi reboot — cần tái tạo từ ảnh gốc khi chạy lại).
- Script crop kh107: `tools/crop_kh107.swift`.
- **Nền footer** dùng `images/gallery/le-ta-on.jpg` (cả `<img>` gallery lẫn `url()` footer) — thuộc gallery folder nhưng kiêm luôn nền footer (ảnh hoa trắng xám crop ngang).
- Mọi ảnh JPEG hợp lệ (sips đọc được) — build script `tools/build_dong_goi_kh122.py` tự nén theo rule `NEN` khi đóng gói 5 tông.
