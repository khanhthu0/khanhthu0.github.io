========================================================
THIỆP CƯỚI ONLINE — NÔNG QUỐC KHÁNH & ĐỖ THỊ THƯ
THÔNG TIN DỰ ÁN (cập nhật 21-10-2026)
========================================================

■ 1. DỰ ÁN LÀ GÌ
- Web thiệp cưới online, 100% tĩnh (HTML/CSS/JS), tự chứa (self-contained),
  gửi cho khách qua Zalo, mở trên điện thoại như trang web thật.
- Cặp đôi: Nông Quốc Khánh & Đỗ Thị Thư.
- Ngày cưới: CHỦ NHẬT 22 · 11 · 2026 (dương) = 14 · 10 năm Bính Ngọ (âm).
- Địa chỉ:
  + LỄ THÀNH HÔN (nhà trai): Thôn Trại Lốt, xã Tam Tiến, tỉnh Bắc Ninh.
  + LỄ VU QUY (nhà gái): bản Hom, xã Yên Thế, tỉnh Bắc Ninh.

■ 2. CÁC FILE CHÍNH
- index.html          : thiệp mời CHÍNH (mở lên là xem thiệp).
- tao-thiep.html      : trang TẠO LINK THIỆP theo tên khách.
                         Đăng nhập: tk = 1, mk = 1 (demo, web tĩnh).
- assets/             : CSS (style.css) + JS (main.js).
- js/                 : am-lich.js (âm lịch), noi-dung.js (dữ liệu), qr.js (bản đồ/QR).
- images/             : toàn bộ ảnh (37 ảnh).
- images/DOC-ANH.md   : BẢN ĐỒ ẢNH — ảnh nào dùng ở vị trí nào (mở ra để biết).
- dong-goi/           : 4 file thiệp TỰ CHỨA gửi Zalo (4 tông màu).

■ 3. ĐÃ LÀM ĐƯỢC GÌ (tính năng chính)
- Cover phong bì + nút TRÁI TIM mở thiệp + dòng chữ cong "Bấm vào đây để mở thiệp".
- Trang đầu: tên cặp đôi + ngày cưới + 2 địa chỉ nhà + lời ngỏ.
- Lịch tháng 11/2026: trái tim (SVG) ôm trọn số 22 + nhãn âm lịch 14/10.
- Đếm ngược đến ngày cưới (rìa).
- Album Ảnh Cưới (gallery) + nút "xem thêm" + lightbox zoom.
- Bản đồ Google Maps 2 nhà + nút chỉ đường + mã QR + số tài khoản.
- RSVP (xác nhận tham dự: khách của cô dâu/chú rể/cả 2) + lời chúc.
- Tạo link theo tên khách: index.html?ten=<tên> (trang mở sẽ ghi "Trân trọng kính mời: <tên>").
- Chọn phông màu khi tạo link (4 tông).
- Hình nền PC: ảnh aerial đồng cỏ xanh (có thể đổi trong images/nen/).

■ 4. TÔNG MÀU (4 tông)
- XANH NON + trắng  : bản chính (index.html + thiep-pastel.html).
- Trung tính kem/be : thiep-trung-tinh.html.
- Truyền thống đỏ-vàng : thiep-truyen-thong.html.
- Mộc rustic nâu đất : thiep-moc-rustic.html.

■ 5. CÁCH DÙNG
- Xem thiệp: mở index.html (điện thoại hoặc máy tính, F12 chọn iPhone để thử mobile).
- Tạo link cho khách:
    1) Mở tao-thiep.html → đăng nhập 1 / 1.
    2) Nhập tên khách → chọn phông màu → bấm "Tạo link thiệp".
    3) Copy link gửi Zalo (hoặc gửi thẳng file trong dong-goi/).
- Gửi Zalo nhanh: gửi file dong-goi/thiep-pastel.html (tông chính).

■ 6. THAY ẢNH / ĐỔI NỘI DUNG
- Thay ảnh: mở images/DOC-ANH.md để biết ảnh nào ở đâu → thả ảnh mới cùng tên vào
  đúng thư mục là web tự cập nhật (không cần sửa code).
- Đổi tên cặp đôi / ngày cưới / địa chỉ: sửa trong js/noi-dung.js (file dữ liệu trung tâm).

■ 7. LƯU Ý KỸ THUẬT
- Web tĩnh, KHÔNG cần server. Chỉ cần internet cho: Google Fonts (font chữ) + Google Maps.
- tao-thiep.html login là DEMO (mật khẩu lưu ở client, không bảo mật thật).
  Muốn đổi tk/mk: sửa dòng "var TC_ADMIN = { tk: '1', mk: '1' }" trong tao-thiep.html.
- Âm lịch tính bằng thuật toán tự viết (js/am-lich.js) — không phụ thuộc CDN.
