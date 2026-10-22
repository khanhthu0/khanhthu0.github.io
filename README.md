# 💍 Thiệp Cưới Online — Khánh & Thư

> **Nông Quốc Khánh & Đỗ Thị Thư**
> Chủ Nhật · 22 · 11 · 2026 (dương) — 14 · 10 năm Bính Ngọ (âm)

Trang web thiệp cưới online **100% tĩnh** (HTML / CSS / JS), tự chứa, gửi cho khách qua Zalo hoặc mở trực tiếp trên điện thoại như một trang web thật.

🌐 **Trực tuyến:** [khanhthu.github.io](https://khanhthu.github.io)

---

## 📁 Cấu trúc thư mục

| Đường dẫn | Mô tả |
|---|---|
| `index.html` | **Thiệp chính** — mở lên là xem thiệp ngay |
| `tao-thiep.html` | Trang **tạo link thiệp theo tên khách** (demo: tk/mk = `1`/`1`) |
| `assets/css/style.css` | Toàn bộ style của thiệp chính |
| `assets/js/main.js` | Logic thiệp chính (mở thiệp, gallery, lightbox, RSVP…) |
| `js/noi-dung.js` | **File dữ liệu trung tâm** — tên cặp đôi, ngày cưới, địa chỉ, tài khoản |
| `js/am-lich.js` | Thuật toán âm lịch tự viết (không phụ thuộc CDN) |
| `js/qr.js` | Bản đồ Google Maps, mã QR ngân hàng, nút chỉ đường |
| `images/` | Toàn bộ ảnh (37 ảnh) — xem `images/DOC-ANH.md` để biết ảnh nào dùng ở đâu |
| `dong-goi/` | 5 file thiệp **tự chứa** (nhúng ảnh base64) để gửi qua Zalo |
| `tools/build-dong-goi.py` | Script build lại các tông màu (thêm/sửa tông) |

---

## ✨ Tính năng

- Cover phong bì + nút **trái tim** mở thiệp + dòng chữ cong *"Bấm vào đây để mở thiệp"*
- Trang đầu: tên cặp đôi, ngày cưới, địa chỉ nhà trai / nhà gái, lời ngỏ
- Lịch tháng 11/2026: **trái tim (SVG) ôm trọn số 22** + nhãn âm lịch 14/10
- **Đếm ngược** đến ngày cưới (chữ rìa)
- Album ảnh cưới + nút *"xem thêm"* + **lightbox** phóng to
- Google Maps 2 nhà + nút chỉ đường + **mã QR** + số tài khoản
- **RSVP**: xác nhận tham dự (cô dâu / chú rể / cả 2) + lời chúc
- Tạo link riêng theo tên khách: `index.html?ten=<tên>`
- Chọn **5 tông màu** khi tạo link thiệp

### 🎨 5 tông màu

| Tông | File |
|---|---|
| Xanh non + trắng (bản chính) | `index.html` / `dong-goi/thiep-pastel.html` |
| Hồng pastel + kem | `dong-goi/thiep-hong.html` |
| Trung tính kem – be | `dong-goi/thiep-trung-tinh.html` |
| Truyền thống đỏ – vàng | `dong-goi/thiep-truyen-thong.html` |
| Mộc rustic nâu đất | `dong-goi/thiep-moc-rustic.html` |

---

## 🚀 Chạy thử trên máy

Mở trực tiếp `index.html` bằng trình duyệt (không cần server).
Muốn xem trên điện thoại: nhấn `F12` → chọn device **iPhone** để test mobile.

## 📤 Gửi thiệp cho khách

1. Mở `tao-thiep.html` → đăng nhập `1` / `1`
2. Nhập tên khách → chọn phông màu → bấm **"Tạo link thiệp"**
3. Copy link gửi Zalo — hoặc gửi thẳng file trong `dong-goi/`

> Gửi Zalo nhanh nhất: gửi file `dong-goi/thiep-pastel.html` (tông chính).

---

## ✏️ Sửa nội dung

| Muốn đổi | Sửa ở đâu |
|---|---|
| Tên cặp đôi / ngày cưới / địa chỉ / số tài khoản | `js/noi-dung.js` |
| Ảnh | Thả ảnh mới **cùng tên** vào đúng thư mục trong `images/` (xem `images/DOC-ANH.md`) |
| Mật khẩu trang tạo link | `tao-thiep.html` → dòng `var TC_ADMIN = { tk: '1', mk: '1' }` |
| Giao diện / màu sắc | `assets/css/style.css` |

### 🎨 Thêm / sửa một tông màu mới

Các file trong `dong-goi/` chỉ khác nhau ở **3 chỗ**: `<title>`, khối `:root` (bảng màu), và
hex màu tim trong `url SVG` (`stroke='%23xxxxxx'` = `--pink-deep` của tông).

Dùng script có sẵn — **không cần build lại ảnh**:

```bash
python tools/build-dong-goi.py hong          # build tông "hong" (tông hồng)
python tools/build-dong-goi.py               # build tất cả các tông
python tools/build-dong-goi.py --check       # chỉ kiểm tra, không ghi file
```

Muốn thêm tông mới: mở `tools/build-dong-goi.py`, thêm 1 mục vào `THEMES`
(bảng màu `:root` + `title` + `file`), chạy script, rồi thêm `<option>` tương ứng
vào `tao-thiep.html`.

> Nếu đã sửa nội dung trong `index.html` / `js/` / `assets/` và muốn đồng bộ lại cả
> 5 tông, dùng `--from-source` (dựng lại từ `index.html` + `assets/` + `js/`).

---

## ⚙️ Ghi chú kỹ thuật

- Web **hoàn toàn tĩnh**, không cần server. Chỉ cần Internet cho *Google Fonts* và *Google Maps*.
- Đăng nhập ở `tao-thiep.html` là **DEMO** (mật khẩu nằm ở client, không bảo mật thật).
- Âm lịch tính bằng thuật toán tự viết trong `js/am-lich.js` — không phụ thuộc CDN.
- Triển khai bằng **GitHub Pages**: repo `khanhthu.github.io`, nhánh `main`, source `/ (root)`.

---

## 📍 Địa chỉ

- **Lễ Thành Hôn (nhà trai):** Thôn Trại Lốt, xã Tam Tiến, tỉnh Bắc Ninh
- **Lễ Vu Quy (nhà gái):** Bản Hom, xã Yên Thế, tỉnh Bắc Ninh
