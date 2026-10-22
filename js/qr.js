/* ============================================================
 * MODULE ĐỊA CHỈ + GOOGLE MAPS + QR BẮN TIỀN (module #5 — kh108)
 * ============================================================
 * Hỗ trợ #6 ghép vào index chính. Phụ thuộc: js/noi-dung.js
 * (const THIEP_CUOI phải được nạp TRƯỚC file này).
 *
 * Cách dùng trong index.html của #6:
 *   <script src="js/noi-dung.js"></script>
 *   <script src="js/qr.js"></script>
 *   ...
 *   <div id="khuMaps"></div> <div id="khuQr"></div>
 *   <script> renderKhuMaps(); renderKhuQr(); </script>
 *
 * Nguyên tắc: KHÔNG thư viện ngoài —
 *   - Google Maps: iframe embed chính chủ (KHÔNG cần API key).
 *   - QR chuyển khoản: ảnh VietQR (img.vietqr.io) chuẩn Napas,
 *     quét được bằng mọi app ngân hàng VN; rơi mạng → 2 tầng
 *     fallback về ảnh QR rút gọn → bảng STK text.
 *
 * kh117: nút Maps tối ưu IPHONE + ZALO — KHÔNG Apple Maps (VN không
 * dùng được): web URL kèm tên địa chỉ + deep-link app Google Maps
 * (comgooglemaps:// iOS, geo: Android), Zalo chặn scheme → mở web thẳng.
 */

/* ---------- helpers ---------- */
function _tcGet(id) { return document.getElementById(id); }

/* Mã hoá giá trị cho URL (tiếng Việt hiển thị đúng). */
function _tcUrl(v) { return encodeURIComponent(String(v)); }

/* ---------- Google Maps: embed + link (kh117 — iPhone & Zalo) ----------
 * Tại VN Apple Maps gần như không dùng được → module KHÔNG dùng
 * maps.apple.com ở BẤT KỲ đâu. Mọi nút mở bản đồ đều GOOGLE MAPS:
 *   1. WEB URL (https://maps.google.com/maps?q=...) — luôn kèm TÊN ĐỊA CHỈ
 *      đầy đủ (không chỉ tọa độ trơ) nên mở từ TRÌNH DUYỆT ZALO trên iPhone
 *      vẫn thấy ngay địa chỉ nhà trai/nhà gái trên bản đồ.
 *   2. iOS    : deep-link comgooglemaps:// (mở app Google Maps nếu đã cài;
 *               Zalo browser chặn scheme lạ → tự rơi về web URL sau 0.6s).
 *   3. Android: geo:lat,lng (mở app Maps mặc định — thường là Google Maps). */

/* URL IFRAME embed Google Maps KHÔNG API key (đã verify trả 200):
 * bản đồ tương tác — kéo/zoom được, ghim tại lat/lng. */
function tcGoogleMapsEmbedUrl(diaDiem) {
  return 'https://maps.google.com/maps?q=' + diaDiem.lat + ',' + diaDiem.lng +
    '&z=15&hl=vi&output=embed';
}

/* Nhãn ghim đầy đủ: "Nhà trai — <địa chỉ>". */
function _tcMapsLabel(diaDiem) {
  return (diaDiem.ten || '') + ' — ' + (diaDiem.diaChi || '');
}

/* Quyết định URL mở bản đồ (thuần tính — test gọi trực tiếp dễ):
 * trả { web, deep, isIOS, isAndroid }
 *   web  = URL web Google Maps kèm TÊN ĐỊA CHỈ (mở mọi trình duyệt, kể cả Zalo).
 *   deep = deep-link app ('' trên máy tính): iOS comgooglemaps:// — Android geo:.
 * KHÔNG bao giờ sinh maps.apple.com. */
function tcMapsPlan(diaDiem, cheDo) {
  var d = diaDiem || {};
  var pin = cheDo !== 'dir';
  var web = '', deep = '';
  var ua = (typeof navigator !== 'undefined' && navigator.userAgent) || '';
  var isIOS = /iPad|iPhone|iPod/.test(ua);
  var isAndroid = /Android/.test(ua);
  var isZalo = /Zalo/i.test(ua);   /* trình duyệt trong app Zalo: chặn scheme
                                     * app lạ → KHÔNG khởi động deep-link, mở web thẳng */
  if (pin) {
    /* q=lat,lng(Nhà trai — địa chỉ): ghim đúng tọa độ + HIỆN TÊN ĐỊA CHỈ. */
    web = 'https://maps.google.com/maps?q=' + (d.lat || 0) + ',' + (d.lng || 0) +
      '(' + _tcUrl(_tcMapsLabel(d)) + ')&z=16&hl=vi';
    if (isIOS) {
      deep = 'comgooglemaps://?q=' + _tcUrl(_tcMapsLabel(d)) +
        '&center=' + (d.lat || 0) + ',' + (d.lng || 0);
    } else if (isAndroid) {
      deep = 'geo:' + (d.lat || 0) + ',' + (d.lng || 0) + '?q=' +
        (d.lat || 0) + ',' + (d.lng || 0) + '(' + _tcUrl(_tcMapsLabel(d)) + ')';
    }
    if (isZalo) deep = '';   /* Zalo: scheme app ngoài bị chặn — mở web URL có địa chỉ */
  } else {
    /* Chỉ đường: điểm đến = ĐỊA CHỈ ĐẦY ĐỦ (không chỉ tọa độ trơ).
     * kh148: nhà có diaChiMaps (plus code chính chủ từ Đại Ka) → ưu tiên
     * dùng cho URL chỉ đường (Google Maps定位 plus code chính xác hơn text). */
    var diaDiemDen = d.diaChiMaps || d.diaChi || ((d.lat || 0) + ',' + (d.lng || 0));
    web = 'https://maps.google.com/maps?daddr=' + _tcUrl(diaDiemDen) + '&hl=vi';
    if (isIOS) {
      deep = 'comgooglemaps://?daddr=' + _tcUrl(diaDiemDen) + '&directionsmode=driving';
    } else if (isAndroid) {
      deep = 'geo:' + (d.lat || 0) + ',' + (d.lng || 0) + '?q=' + _tcUrl(diaDiemDen);
    }
    if (isZalo) deep = '';   /* Zalo: scheme app ngoài bị chặn — mở web URL có địa chỉ */
  }
  return { web: web, deep: deep, isIOS: isIOS, isAndroid: isAndroid };
}

/* URL web Google Maps ghim tại nhà (nút "Mở Google Maps" + href dự phòng).
 * Kèm TÊN ĐỊA CHỈ đầy đủ trong q — mở bằng Zalo/iPhone vẫn thấy địa chỉ. */
function tcGoogleMapsPinUrl(diaDiem) {
  return tcMapsPlan(diaDiem, 'pin').web;
}

/* URL web Google Maps chỉ đường tới nhà (nút "Chỉ đường"). */
function tcGoogleMapsUrl(diaDiem) {
  return tcMapsPlan(diaDiem, 'dir').web;
}

/* Bấm nút Maps (onclick mọi nút module render — href vẫn là web URL Google
 * Maps nên JS có lỗi nút vẫn mở Maps web bình thường):
 * iPhone/Android thử mở APP trước; không có app hoặc trình duyệt Zalo
 * chặn scheme lạ thì sau 0.6s TỰ MỞ WEB Google Maps (có địa chỉ). */
function tcMoMaps(el) {
  var d = {
    ten: el.getAttribute('data-ten') || '',
    diaChi: el.getAttribute('data-diachi') || '',
    lat: parseFloat(el.getAttribute('data-lat')) || 0,
    lng: parseFloat(el.getAttribute('data-lng')) || 0,
  };
  var plan = tcMapsPlan(d, el.getAttribute('data-map') === 'dir' ? 'dir' : 'pin');
  var web = el.href || plan.web;
  window._tcMapsDaMo = false;              /* reset guard (bấm nhiều lần) */
  if (!plan.deep) {                       /* máy tính / Zalo PC: tab mới */
    try { window.open(web, '_blank'); } catch (e) { window.location.href = web; }
    return false;
  }
  var daMo = function () { window._tcMapsDaMo = true; };   /* app đã mở trang ẩn */
  document.addEventListener('visibilitychange', daMo, { once: true });
  window.addEventListener('pagehide', daMo, { once: true });
  window.location.href = plan.deep;      /* thử mở app Google Maps trước */
  setTimeout(function () {               /* app không mở → về web có địa chỉ */
    if (!window._tcMapsDaMo && !document.hidden) window.location.href = web;
  }, 600);
  return false;
}

/* ---------- QR bắn tiền (chuẩn VietQR — quét bằng mọi app ngân hàng VN) ---------- */

/* URL ảnh VietQR đầy đủ: bin-STK-tên chủ TK, template compact
 * (QR + logo ngân hàng + tên NH + số TK), kèm lời nhắn addInfo. */
function tcVietQrUrl(cfg) {
  return 'https://img.vietqr.io/image/' +
    cfg.bin + '-' + cfg.stk + '-' + _tcUrl(cfg.chuTk) +
    '-compact.png?addInfo=' + _tcUrl(cfg.loiNhan);
}

/* Bản rút gọn (không tên chủ TK) — ảnh dự phòng tầng 1
 * nếu bản đầy đủ lỗi (tên dài/ký tự lạ khiến một số bank từ chối). */
function tcVietQrUrlShort(cfg) {
  return 'https://img.vietqr.io/image/' +
    cfg.bin + '-' + cfg.stk + '-compact.png?addInfo=' + _tcUrl(cfg.loiNhan);
}

/* Ảnh SVG placeholder tầng 2 (offline hoàn toàn) — hiện STK + ngân hàng
 * để khách vẫn chuyển khoản thủ công được. */
function tcQrPlaceholder(cfg) {
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">' +
    '<rect width="100%" height="100%" fill="#ffffff" stroke="#b76e79" stroke-width="4"/>' +
    '<text x="150" y="120" font-size="17" text-anchor="middle" fill="#4a3b32" font-family="sans-serif">' +
    'Không tải được ảnh QR</text>' +
    '<text x="150" y="155" font-size="14" text-anchor="middle" fill="#8a7a6e" font-family="sans-serif">' +
    'Vui lòng chuyển khoản thủ công:</text>' +
    '<text x="150" y="195" font-size="20" text-anchor="middle" fill="#4a3b32" font-family="monospace">' +
    cfg.stk + '</text>' +
    '<text x="150" y="230" font-size="15" text-anchor="middle" fill="#b76e79" font-family="sans-serif">' +
    cfg.nh + '</text>' +
    '<text x="150" y="262" font-size="13" text-anchor="middle" fill="#8a7a6e" font-family="sans-serif">' +
    cfg.chuTk + '</text></svg>';
  return 'data:image/svg+xml;charset=utf-8,' + _tcUrl(svg);
}

/* ---------- render ---------- */

/* Vẽ 1 card địa chỉ (nhà trai / nhà gái) — iframe embed + 2 nút. */
function _tcMapCard(diaDiem) {
  const d = diaDiem;
  return `
  <div class="tc-map-card">
    <div class="tc-map-thumb">
      <iframe src="${tcGoogleMapsEmbedUrl(d)}" title="Bản đồ ${d.ten}"
              loading="lazy" referrerpolicy="no-referrer-when-downgrade"
              allowfullscreen></iframe>
    </div>
    <div class="tc-map-info">
      <h3>${d.ten}</h3>
      <p class="tc-chu-nha">${d.chuNha}</p>
      <p class="tc-dia-chi">${d.diaChi}</p>
      <div class="tc-map-btns">
        <a href="${tcGoogleMapsPinUrl(d)}" target="_blank" rel="noopener" class="tc-btn-maps"
           data-map="pin" data-ten="${d.ten}" data-diachi="${d.diaChi}" data-lat="${d.lat}" data-lng="${d.lng}"
           onclick="return tcMoMaps(this)">📍 Mở Google Maps</a>
        <a href="${tcGoogleMapsUrl(d)}" target="_blank" rel="noopener" class="tc-btn-maps"
           data-map="dir" data-ten="${d.ten}" data-diachi="${d.diaChi}" data-lat="${d.lat}" data-lng="${d.lng}"
           onclick="return tcMoMaps(this)">🧭 Chỉ đường</a>
      </div>
    </div>
  </div>`;
}

/* Render toàn bộ khu địa chỉ + bản đồ (nhà trai + nhà gái).
 * containerId mặc định 'khuMaps'. */
function renderKhuMaps(containerId) {
  const el = _tcGet(containerId || 'khuMaps');
  if (!el) return;
  const M = THIEP_CUOI.maps;
  el.innerHTML = `
    <section class="tc-khu-maps">
      <h2>📍 Địa chỉ &amp; Bản đồ</h2>
      <p class="tc-gioi-thieu">Đám cưới Khánh &amp; Thư — địa chỉ nhà trai &amp; nhà gái.</p>
      <div class="tc-map-grid">${_tcMapCard(M.nhaTrai)}${_tcMapCard(M.nhaGai)}</div>
    </section>`;
}

/* Vẽ 1 card QR bắn tiền (chồng / vợ). */
function _tcQrCard(cfg, label) {
  return `
  <div class="tc-qr-card">
    <div class="tc-qr-thumb">
      <img src="${tcVietQrUrl(cfg)}" alt="QR mừng cưới ${label}" loading="lazy"
           onerror="this.onerror=function(){this.onerror=null;this.src='${tcQrPlaceholder(cfg)}'};this.src='${tcVietQrUrlShort(cfg)}';">
    </div>
    <div class="tc-qr-info">
      <h3>🎁 Mừng cưới — ${label}</h3>
      <p class="tc-nh">${cfg.nh}</p>
      <p class="tc-stk">${cfg.stk}</p>
      <p class="tc-chu-tk">${cfg.chuTk}</p>
      <button class="tc-btn-copy" onclick="tcSaoChep('${cfg.stk}', '${cfg.chuTk}', this)">⧉ Sao chép STK</button>
    </div>
  </div>`;
}

/* Render khu QR bắn tiền (2 QR: chú rể + cô dâu, kèm nút sao chép STK).
 * containerId mặc định 'khuQr'. */
function renderKhuQr(containerId) {
  const el = _tcGet(containerId || 'khuQr');
  if (!el) return;
  const Q = THIEP_CUOI.qr;
  el.innerHTML = `
    <section class="tc-khu-qr">
      <h2>🎁 QR Mừng cưới</h2>
      <p class="tc-gioi-thieu">Quét mã QR bằng app ngân hàng để mừng cưới Khánh &amp; Thư.</p>
      <div class="tc-qr-grid">
        <!-- kh155 mục 4(b): NHÀ GÁI (cô dâu) TRƯỚC → NHÀ TRAI (chú rể) SAU (theo yêu cầu Đại Ka) -->
        ${_tcQrCard(Q.vk, THIEP_CUOI.couple.vk.ten)}
        ${_tcQrCard(Q.ck, THIEP_CUOI.couple.ck.ten)}
      </div>
    </section>`;
}

/* Sao chép STK vào clipboard (nút trong card QR). */
function tcSaoChep(stk, chuTk, btn) {
  const text = stk + ' — ' + chuTk;
  const done = () => {
    if (btn) {
      const old = btn.textContent;
      btn.textContent = '✓ Đã sao chép';
      setTimeout(() => { btn.textContent = old; }, 1800);
    }
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done, done);
  } else {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    done();
  }
}

/* ============================================================
 * ĐỒNG BỘ DATA #5 VÀO INDEX (kh mới 20-10 — mục a2 Đại Ka sau 02:32)
 * ============================================================
 * main.js của #6 (kh106→kh128) còn một số chỗ HIỂN THỊ hardcoded ngày
 * 16·01·2027 / năm sinh 1996·1998 (HTML tĩnh) — hàm này chạy SAU main.js
 * (script qr.js nạp trước main.js nhưng DOMContentLoaded chạy sau cùng),
 * ghi đè mọi chỗ hiển thị theo data mới trong THIEP_CUOI:
 *   - Ngày cưới MỚI: 22/11/2026 = 14.10.2026 âm lịch (Bính Ngọ)
 *   - Năm sinh: 05.10.1996 (CK) / 28.05.2000 (VK)
 *   - Giờ lễ 10:00, lịch trình 13:00 rước dâu, lời ngỏ
 * KHÔNG đổi cấu trúc DOM của #6 — chỉ set textContent các id sẵn có
 * + THÊM phần lịch trình/lời ngỏ vào đúng section (nếu section chưa có
 * thì tự chèn — id riêng tiền tố tc- để không đụng #6). */

/* Chuỗi ngày ngắn kiểu thiệp "22 · 11 · 2026" từ data. */
function tcNgayNgan() {
  const sk = THIEP_CUOI.suKien || {};
  if (sk.ngayDu) return sk.ngayDu;
  const d = new Date(sk.ngayIso);
  const p = n => ('0' + n).slice(-2);
  return p(d.getDate()) + ' · ' + p(d.getMonth() + 1) + ' · ' + d.getFullYear();
}

/* Chuỗi thứ + ngày đầy đủ "Chủ nhật, 10:00 · 22 · 11 · 2026 Dương lịch tức 14.10.2026 Âm lịch"
 * (kh138 mục 4 — nguyên văn Đại Ka: kèm cả dòng âm lịch trong chuỗi thời gian sự kiện). */
function tcChuoiThoiGian(gio) {
  const sk = THIEP_CUOI.suKien || {};
  let s = (sk.thu || 'Chủ nhật') + ', ' + (gio || sk.leThanhHon || '10:00') + ' · ' + tcNgayNgan() + ' Dương lịch';
  if (sk.ngayAm) s += ' tức ' + sk.ngayAm + ' Âm lịch';
  return s;
}

/* Đồng bộ toàn bộ — gọi tự động khi DOMContentLoaded (sau main.js). */
function tcDongBoData() {
  if (typeof THIEP_CUOI === 'undefined') return;
  const sk = THIEP_CUOI.suKien || {};
  const C = THIEP_CUOI.couple || {};
  const M = THIEP_CUOI.maps || {};
  const set = (id, v) => { const el = _tcGet(id); if (el && v != null) el.textContent = v; };

  /* 1. Ngày ngắn (cover/countdown/footer) — main.js đã set từ ngayIso nhưng
   * chuẩn format "22 · 11 · 2026" giống chuỗi sẵn trong HTML của #6. */
  const nn = tcNgayNgan();
  set('coverDate', nn);
  set('cdWhen', (sk.thu || 'Chủ nhật') + ' · ' + nn);
  set('footerDate', nn);

  /* 2. Ngày đầy đủ (hero + trang đầu) — có cả dòng dương + âm lịch. */
  set('heroDate', sk.ngayChu);
  set('openDate', sk.ngayChu);
  const cdEl = _tcGet('openDate');
  if (cdEl && sk.ngayAm) {
    /* Thêm dòng âm lịch dưới ngày dương (nếu #6 chưa tự thêm) */
    let amEl = _tcGet('openDateAm');
    if (!amEl) {
      amEl = document.createElement('p');
      amEl.id = 'openDateAm';
      amEl.style.cssText = 'margin-top:4px;font-size:.85em;opacity:.9;';
      cdEl.insertAdjacentElement('afterend', amEl);
    }
    amEl.textContent = sk.ngayAm + ' Âm lịch';
  }

  /* 3. Thời gian 2 sự kiện: "Chủ nhật, 10:00 · 22 · 11 · 2026" + dòng âm lịch.
   * main.js set "Thứ Bảy, 10:00 · 16 · 01 · 2027" (hardcode thứ+ngày cũ) → ghi đè. */
  const tg1 = tcChuoiThoiGian(sk.leThanhHon);
  const tg2 = tcChuoiThoiGian(sk.tiecTaiNha);
  set('evtTime1', tg1);
  set('evtTime2', tg2);
  if (sk.ngayAm) {
    [['evtTime1', tg1], ['evtTime2', tg2]].forEach(pair => {
      const el = _tcGet(pair[0]);
      if (el) el.title = pair[1] + ' — tức ' + sk.ngayAm + ' Âm lịch';
    });
  }

  /* 4. Địa chỉ + chủ nhà đã do main.js set từ THIEP_CUOI.maps (không đổi);
   * nhưng main.js set evtAddr theo key cũ — đảm bảo chuỗi mới nhất (idempotent). */
  set('evtAddr1', (M.nhaGai || {}).diaChi);
  set('evtHost1', 'Chủ nhà: ' + ((M.nhaGai || {}).chuNha || ''));
  set('evtAddr2', (M.nhaTrai || {}).diaChi);
  set('evtHost2', 'Chủ nhà: ' + ((M.nhaTrai || {}).chuNha || ''));
  set('openVenue', (M.nhaTrai || {}).diaChi);
  /* kh139: trang đầu có 2 khối NHÀ TRAI + NHÀ GÁI — đồng bộ cả nhà gái */
  set('openVenue2', (M.nhaGai || {}).diaChi);

  /* 5. Năm sinh khu cặp đôi (index hardcode "Sinh năm 1996/1998").
   * #6 chưa gắn id → tìm theo class couple-birth theo thứ tự DOM. */
  const births = document.querySelectorAll('.couple-birth');
  if (births.length >= 2 && C.ck && C.vk) {
    births[0].textContent = 'Sinh ngày ' + C.ck.namSinh;
    births[1].textContent = 'Sinh ngày ' + C.vk.namSinh;
  }

  /* 6. Lịch trình rước dâu (mục a2 mới) — chèn vào cuối section sự kiện
   * (id tc-lich-trinh riêng của #5, không đụng DOM #6). */
  const secSuKien = _tcGet('events');
  if (secSuKien && sk.lichTrinh && sk.lichTrinh.length && !_tcGet('tc-lich-trinh')) {
    const box = document.createElement('div');
    box.id = 'tc-lich-trinh';
    box.style.cssText = 'grid-column:1/-1;padding:18px 22px;margin-top:10px;' +
      'background:rgba(255,255,255,.55);border:1px dashed var(--gold,#c5a572);' +
      'border-radius:14px;text-align:center;';
    box.innerHTML = '<div class="tc-lt-tieu-de" style="font-weight:700;letter-spacing:2px;' +
      'margin-bottom:10px;color:var(--pink-deep,#d98a8a);">LỊCH TRÌNH</div>' +
      sk.lichTrinh.map(t =>
        '<div class="tc-lt-dong" style="margin:6px 0;"><b>' + t.gio + '</b> — ' + t.viec + '</div>'
      ).join('');
    secSuKien.appendChild(box);
  }

  /* (6b: thanh đếm ngược rìa #edgeDaysText — kh140 mục 8 Đại Ka yêu cầu BỎ dòng
   * "Còn N ngày..." → #6 đã XOÁ HẲN thanh rìa khỏi index; observer này không còn
   * element theo dõi nên đã dỡ — giữ chỗ ghi chú tránh ai tưởng thiếu.) */

  /* 7. Lời ngỏ — kh139 (#6) đã đặt LỜI NGỎ nguyên văn ngay trong TRANG ĐẦU
   * (khối TRÂN TRỌNG KÍNH MỜI, đúng vị trí Đại Ka yêu cầu) → KHÔNG chèn
   * khối riêng #tc-loi-ngo sau events nữa (tránh hiển thị TRÙNG 2 lần).
   * Chỉ đồng bộ text vào element sẵn #loiNgoText nếu có. */
  if (sk.loiNgo) {
    const lnEl = _tcGet('loiNgoText');
    if (lnEl && lnEl.textContent.trim() !== sk.loiNgo) lnEl.textContent = sk.loiNgo;
  }
}

/* Tự chạy sau khi DOM sẵn sàng — nạp sau main.js qua sự kiện (qr.js nạp
 * trước main.js nhưng listener DOMContentLoaded thêm sau vẫn chạy sau). */
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(tcDongBoData, 0));
  } else {
    setTimeout(tcDongBoData, 0);
  }
}
