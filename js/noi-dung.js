/* ============================================================
 * NỘI DUNG THIỆP CƯỚI — NGUỒN DỮ LIỆU TRUNG TÂM (module #5 — kh108)
 * ============================================================
 * Đại Ka thay thông tin thật chỉ cần sửa file này — mọi trang
 * (index chính của #6 + trang demo) tự động cập nhật, không phải sửa HTML.
 *
 * Cách dùng:
 *   <script src="js/noi-dung.js"></script>
 *   <script src="js/qr.js"></script>
 *   rồi gọi renderKhuMaps() / renderKhuQr() vào container div.
 *
 * ⚠️ NGÀY GIỜ + TÊN TUỔI + ĐỊA CHỈ + CHỦ NHÀ đã thay THEO Ý KIẾN
 * ĐẠI KA (mục a2 ghi sau mốc 02:32 20-10 — ngày cưới 22/11/2026,
 * năm sinh 05.10.1996 / 28.05.2000, 2 nhà tại Bắc Ninh, giờ lễ 10:00).
 * Còn lại (STK QR) vẫn placeholder — thay khi Đại Ka cho số thật.
 */

const THIEP_CUOI = {

  /* ---- Cặp đôi ---- */
  couple: {
    ck: {                          // chú rể — Nông Quốc Khánh
      ten: 'Nông Quốc Khánh',
      tenQr: 'NONG QUOC KHANH',   // tên KHÔNG dấu — dùng trên QR/ứng dụng ngân hàng (kh155 mục 4(c): sửa sai chính tả NUONG→NONG)
      namSinh: '05.10.1996',      // ✅ theo Đại Ka (trước: 1996 placeholder)
    },
    vk: {                          // cô dâu — Đỗ Thị Thư
      ten: 'Đỗ Thị Thư',
      tenQr: 'DO THI THU',
      namSinh: '28.05.2000',      // ✅ theo Đại Ka (trước: 1998 placeholder)
    },
  },

  /* ---- Ngày giờ tổ chức (✅ ngày cưới MỚI theo Đại Ka: 22/11/2026) ----
   * Verify bằng thuật toán am-lich.js (Meeus): 22/11/2026 = Chủ nhật
   * = 14 tháng 10 năm Bính Ngọ 2026 — khớp ghi chú Đại Ka 100%. */
  suKien: {
    tieuDe: 'Đám cưới Khánh & Thư',
    ngayChu: 'Chủ nhật, ngày 22 tháng 11 năm 2026',
    ngayIso: '2026-11-22T10:00:00+07:00',           // dùng cho đồng hồ đếm ngược
    leThanhHon: '10:00',     // giờ lễ thành hôn (Đại Ka: "Thời gian: Chủ nhật, 10:00 · 22 · 11 · 2026")
    tiecTaiNha: '10:00',     // giờ lễ vu quy nhà gái — cũng 10:00 theo ghi chú Đại Ka
    /* Chuỗi hiển thị sự kiện (nguyên văn theo Đại Ka):
     * "Chủ nhật, 10:00 · 22 · 11 · 2026 Dương lịch tức 14.10.2026 Âm lịch" */
    thu: 'Chủ nhật',
    ngayDu: '22 · 11 · 2026',
    ngayAm: '14.10.2026',   // 14 tháng 10 năm Bính Ngọ
    /* Lịch trình trong sự kiện (mục a2 mới: "13:00 — Nghi lễ rước dâu và lễ cưới chính thức.") */
    lichTrinh: [
      { gio: '13:00', viec: 'Nghi lễ rước dâu và lễ cưới chính thức.' },
    ],
    /* Lời ngỏ (mục a2 mới — nguyên văn Đại Ka) */
    loiNgo: 'Rất mong được sự hiện diện, góp mặt của quý vị đến tham dự lễ tổ chức và bữa cơm thân mật của chúng mình. Những lời kính chúc và tình cảm chân thành của quý vị sẽ là món quà ý nghĩa nhất, góp phần làm cho ngày trọng đại của chúng mình thêm trọn vẹn và ý nghĩa.',
  },

  /* ---- Địa chỉ + Google Maps (2 chỗ: nhà trai + nhà gái) — ✅ theo Đại Ka ----
   * Mỗi nơi: { ten, chuNha, diaChi, lat, lng }
   * lat/lng lấy từ Google Maps: chuột phải vào vị trí trên bản đồ
   * → "Copy số" → dán vào đây (đúng chuẩn 6 số thập phân).
   * Module tự sinh: iframe embed + link mở Maps + link chỉ đường.
   * kh148 (20-10): tọa độ MỚI theo số Đại Ka cung cấp nguyên văn:
   *   - nhà trai: plus code "G4C5+5V8, Bản Trại Lốt, Tam Tiến, Bắc Ninh, Việt Nam"
   *     → decode chuẩn Open Location Code (prefix vùng 7PH8 + G4C5+5V8) = 21.520412, 106.109672
   *   - nhà gái: lat 21.49527, lng 106.1141 (Đại Ka cho thẳng tọa độ)
   *   (tọa độ cũ kh140 là centroid xã ước đoán — thay bằng số chính chủ này) */
  maps: {
    nhaTrai: {
      ten: 'Nhà trai',
      chuNha: 'Ông Nông Văn Chỉnh — Bà Nông Thị Thu',       // ✅ theo Đại Ka
      diaChi: 'Thôn Trại Lốt, xã Tam Tiến, tỉnh Bắc Ninh',
      diaChiMaps: 'G4C5+5V8, Bản Trại Lốt, Tam Tiến, Bắc Ninh, Việt Nam',   // nguyên văn Đại Ka kh148 — cho URL Google Maps
      lat: 21.520412, lng: 106.109672,       // decode plus code G4C5+5V8 (nguyên văn Đại Ka kh148)
    },
    nhaGai: {
      ten: 'Nhà gái',
      chuNha: 'Ông Đỗ Văn Tường — Bà Nguyễn Thị Cửu',       // ✅ theo Đại Ka
      diaChi: 'Gần Chùa Thông, bản Hom, xã Yên Thế, tỉnh Bắc Ninh',
      lat: 21.49527, lng: 106.1141,           // nguyên văn Đại Ka kh148 (thay centroid Chùa Thông cũ)
    },
  },

  /* ---- QR bắn tiền (chuẩn VietQR — quét bằng mọi app ngân hàng VN) ----
   * Cấu trúc 1 tài khoản: { nh, bin, stk, chuTk, loiNhan }
   *   nh     : tên ngân hàng hiển thị trên thiệp
   *   bin    : mã ngân hàng 6 số (danh sách: https://vietqr.co/danh-sach-ngan-hang.html)
   *            MB Bank = 970422 · Vietcombank = 970436 · Techcombank = 970407
   *   stk    : số tài khoản nhận tiền (KHÔNG dấu gạch chéo) — ⚠️ placeholder
   *   chuTk  : tên chủ TK KHÔNG dấu, VIẾT HOA (bắt buộc khớp registering ngân hàng)
   *   loiNhan: lời nhắn kèm khi khách quét QR */
  qr: {
    ck: {
      nh: 'MB Bank',
      bin: '970422',
      stk: '0800123456789',              // ⚠️ placeholder
      chuTk: 'NONG QUOC KHANH',        // kh155 mục 4(c): sửa sai chính tả NUONG→NONG (chuẩn không dấu, VIẾT HOA khớp đăng ký ngân hàng)
      loiNhan: 'Mung cuoi Khanh',        // lời nhắn QR không dấu (một số bank giới hạn ký tự)
    },
    vk: {
      nh: 'Vietcombank',
      bin: '970436',
      stk: '0123456789',                 // ⚠️ placeholder
      chuTk: 'DO THI THU',
      loiNhan: 'Mung cuoi Thu',
    },
  },
};

/* Cho phép dùng cả trong browser lẫn node test (không phá web) */
if (typeof module !== 'undefined' && module.exports) { module.exports = { THIEP_CUOI }; }
