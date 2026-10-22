/* ═══════════ THIỆP CƯỚI — KHÁNH & THƯ ═══════════
   Mở thiệp · Countdown · Reveal · RSVP lời chúc · Guest name từ URL (?ten=...)
   — tích hợp data + module của #5 (kh108): js/noi-dung.js (THIEP_CUOI) + js/qr.js */

(function () {
  'use strict';

  /* ─────── Ngày cưới: đọc từ THIEP_CUOI của #5 (js/noi-dung.js) — nạp trước file này ─────── */
  var WEDDING_DATE = (typeof THIEP_CUOI !== 'undefined' && THIEP_CUOI.suKien && THIEP_CUOI.suKien.ngayIso)
    ? new Date(THIEP_CUOI.suKien.ngayIso).getTime()
    : new Date('2026-11-22T10:00:00+07:00').getTime();   // fallback nếu thiếu module (kh138: 22/11/2026)

  /* ─────── 1. MỞ THIỆP (kh118: hiệu ứng mở nắp phong bì) ─────── */
  var cover = document.getElementById('cover');
  var content = document.getElementById('content');
  var btnOpen = document.getElementById('btnOpen');
  var opened = false;

  function openInvite() {
    if (opened) return;              // chống double-fire (kh112-2 giữ nguyên)
    opened = true;
    // Hiệu ứng mở nắp phong bì trước, rồi ẩn cover.
    // kh152: class hiệu ứng đổi tên 'opening' → 'env-opening' — tên cũ trùng class
    // .opening của section TRANG ĐẦU (#opening) → khi #cover thêm 'opening', rule
    // .opening { padding: 48px 20px; display:flex } cũng áp vào #cover → co inner
    // 40px → envelope tràn khung DỊCH PHẢI khi bấm mở (Đại Ka: "thiếp khi bấm mở
    // nó lại tự dịch sang phải"). Tên riêng 'env-opening' không còn va chạm.
    cover.classList.add('env-opening');
    setTimeout(function () {
      cover.style.opacity = '0';
      cover.style.visibility = 'hidden';
      content.classList.remove('hidden');
      content.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = '';
      startCountdown();
      requestAnimationFrame(checkReveal);
      // (kh140 mục 8: thanh đếm ngược rìa #edgeCountdown đã BỎ theo yêu cầu Đại Ka)
    }, 700);   // khớp transition mở nắp 1s (mở 0.7s là nắp đã lật rõ)
  }

  btnOpen.addEventListener('click', openInvite);

  /* kh144(5): bấm TOÀN BỘ khu vực phong bì đều MỞ được thiệp
     (Đại Ka: "khu vực mở thiệp rộng hơn, bấm vào toàn bộ khu vực thiệp đều mở được")
     — listener trên .envelope: bấm tim con búp bê bubble lên đây, openInvite có cờ
     `opened` chống chạy 2 lần nên không double-fire. */
  var envEl = document.getElementById('envEl');
  if (envEl) envEl.addEventListener('click', openInvite);

  // Enter trên cover cũng mở thiệp (button tự nhận Enter → chống chạy 2 lần)
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && cover.style.visibility !== 'hidden') {
      e.preventDefault();
      openInvite();
    }
  });

  /* ─────── 2. TÊN KHÁCH từ URL ?ten=... (mặc định "Bạn thân mến") ─────── */
  try {
    var ten = new URLSearchParams(location.search).get('ten');
    if (ten) {
      var el = document.getElementById('guestName');
      // URLSearchParams.get() ĐÃ tự decode sẵn — KHÔNG decodeURIComponent lần 2
      // (tên chứa ký tự % literal sẽ ném URIError nếu decode lại)
      if (el) el.textContent = ten;
      // kh139: tên khách cũng hiện ở trang đầu — dòng "xxx" dưới TRÂN TRỌNG KÍNH MỜI
      var og = document.getElementById('openGuest');
      if (og) og.textContent = ten;
    }
  } catch (e) { /* URLSearchParams không hỗ trợ — bỏ qua */ }

  /* ─────── 3. COUNTDOWN ─────── */
  var cd = {
    d: document.getElementById('cdDays'),
    h: document.getElementById('cdHours'),
    m: document.getElementById('cdMins'),
    s: document.getElementById('cdSecs')
  };
  var cdTimer = null;

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function tick() {
    var diff = WEDDING_DATE - Date.now();
    if (diff <= 0) diff = 0;
    cd.d.textContent = pad(Math.floor(diff / 864e5));
    cd.h.textContent = pad(Math.floor(diff % 864e5 / 36e5));
    cd.m.textContent = pad(Math.floor(diff % 36e5 / 6e4));
    cd.s.textContent = pad(Math.floor(diff % 6e4 / 1e3));
    // (kh140 mục 8: dòng "Còn N ngày đến ngày cưới..." đã BỎ — thanh rìa xoá hẳn)
  }

  function startCountdown() {
    tick();
    cdTimer = setInterval(tick, 1000);
  }

  /* ─────── 4. REVEAL khi cuộn ─────── */
  var revealEls = document.querySelectorAll('.reveal');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.15 });

  function checkReveal() {
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ─────── 4b. LỊCH THÁNG CƯỚI (kh119) — dương + âm, trái tim đỏ ô ngày cưới ─────── */
  var calGrid = document.getElementById('calGrid');
  if (calGrid && typeof AmLich !== 'undefined') {
    var CAL_TEN_THANG_AM = ['Giêng', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'Mười Một', 'Chạp'];
    var calY = 2026, calM = 11;   // mặc định = tháng cưới (kh138: 22/11/2026)
    var WED_Y = 2026, WED_M = 11, WED_D = 22;   // ngày cưới — dùng nhận diện ô cưới (kh138)
    try {
      var _iso = (typeof THIEP_CUOI !== 'undefined' && THIEP_CUOI.suKien && THIEP_CUOI.suKien.ngayIso) || null;
      if (_iso) {
        var _d = new Date(_iso);
        calY = _d.getFullYear(); calM = _d.getMonth() + 1;
        WED_Y = _d.getFullYear(); WED_M = _d.getMonth() + 1; WED_D = _d.getDate();
      }
    } catch (e) { /* giữ mặc định */ }

    function lunarLabel(d, m, y) {
      // nhãn âm dưới mỗi ô: mùng 1 + rằm hiện "1/<tháng>", "15/<tháng>"; ngày thường → chỉ ngày âm
      var r = AmLich.sangAm(y, m, d);
      if (!r) return '';
      var ten = CAL_TEN_THANG_AM[r.thang - 1] !== undefined ? CAL_TEN_THANG_AM[r.thang - 1] : r.thang;
      if (r.ngay === 1) return '1/' + (r.nhuan ? ten + 'N' : ten);
      if (r.ngay === 15) return '15/' + (r.nhuan ? ten + 'N' : ten);
      return '' + r.ngay;
    }

    function renderCal() {
      // tiêu đề tháng
      var first = new Date(calY, calM - 1, 1);
      var mid = new Date(calY, calM - 1, 15);
      var amMid = AmLich.sangAm(mid.getFullYear(), mid.getMonth() + 1, mid.getDate());
      var calDuong = document.getElementById('calDuong');
      var calAm = document.getElementById('calAm');
      if (calDuong) calDuong.textContent = 'Tháng ' + calM + ' · ' + calY;
      if (calAm && amMid) {
        var tenM = CAL_TEN_THANG_AM[amMid.thang - 1] !== undefined ? CAL_TEN_THANG_AM[amMid.thang - 1] : amMid.thang;
        calAm.textContent = '(Tháng ' + tenM + (amMid.nhuan ? ' nhuận' : '') + ' · ' + AmLich.canChiNam(amMid.nam) + ')';
      }
      // lưới ngày
      var startDow = (first.getDay() + 6) % 7;    // Thứ Hai = 0
      var daysInMonth = new Date(calY, calM, 0).getDate();
      var html = '';
      for (var i = 0; i < startDow; i++) html += '<div class="cal-cell blank"></div>';
      var today = new Date();
      for (var d = 1; d <= daysInMonth; d++) {
        var dow = new Date(calY, calM - 1, d).getDay();
        var cls = 'cal-cell';
        if (dow === 0) cls += ' sun';
        else if (dow === 6) cls += ' sat';
        var isToday = today.getFullYear() === calY && (today.getMonth() + 1) === calM && today.getDate() === d;
        if (isToday) cls += ' today';
        var isWedding = calY === WED_Y && calM === WED_M && d === WED_D;
        if (isWedding) cls += ' wedding';
        html += '<div class="' + cls + '" data-d="' + d + '"><span class="dnum">' + d + '</span>' +
                '<span class="lunar">' + lunarLabel(d, calM, calY) + '</span></div>';
      }
      calGrid.innerHTML = html;
    }

    var prev = document.getElementById('calPrev');
    var next = document.getElementById('calNext');
    if (prev) prev.addEventListener('click', function () {
      calM--; if (calM < 1) { calM = 12; calY--; } renderCal();
    });
    if (next) next.addEventListener('click', function () {
      calM++; if (calM > 12) { calM = 1; calY++; } renderCal();
    });
    renderCal();
  }

  /* ─────── 5. RSVP + LỜI CHÚC (localStorage — bản tĩnh, chưa backend) ─────── */
  var WISH_KEY = 'tc_wishes_khanh_thu';

  function loadWishes() {
    try { return JSON.parse(localStorage.getItem(WISH_KEY)) || []; }
    catch (e) { return []; }
  }

  function saveWish(w) {
    var arr = loadWishes();
    arr.push(w);
    try { localStorage.setItem(WISH_KEY, JSON.stringify(arr)); } catch (e) {}
    renderWishes();
  }

  function renderWishes() {
    var list = document.getElementById('wishList');
    if (!list) return;
    var arr = loadWishes();
    list.innerHTML = '';
    // kh140 mục 9: chỉ hiển thị tối đa 3 LỜI CHÚC GẦN NHẤT (mới nhất trước);
    // còn lại ẩn sau nút "Xem thêm lời chúc"
    var WISH_MAX = 3;
    var showAll = renderWishes._all || false;
    var shown = showAll ? arr.slice().reverse() : arr.slice(-WISH_MAX).reverse();
    shown.forEach(function (w) {
      var div = document.createElement('div');
      div.className = 'wish-item';
      var b = document.createElement('b');
      b.textContent = w.name + (w.attend === 'yes' ? ' · tham dự' : ' · không tham dự');
      div.appendChild(b);
      // kh120: dòng "khách mời của ..." HIỆN DƯỚI TÊN người xác nhận
      if (w.side) {
        var side = document.createElement('span');
        side.className = 'wish-side';
        side.textContent = 'Khách mời của: ' + w.side;
        div.appendChild(side);
      }
      var p = document.createElement('p');
      p.textContent = w.msg || '';
      if (w.msg) div.appendChild(p);
      list.appendChild(div);
    });
    // nút "Xem thêm lời chúc" — chỉ hiện khi còn lời chúc ẩn
    var wrap = document.getElementById('wishMoreWrap');
    var btn = document.getElementById('btnMoreWishes');
    if (wrap && btn) {
      var hasMore = !showAll && arr.length > WISH_MAX;
      wrap.hidden = !hasMore;
      if (hasMore) btn.textContent = '💌 Xem thêm lời chúc (+' + (arr.length - WISH_MAX) + ')';
    }
  }

  var form = document.getElementById('rsvpForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('rsvpName').value.trim();
      var msg = document.getElementById('rsvpMsg').value.trim();
      var attend = (form.querySelector('input[name="attend"]:checked') || {}).value;
      var side = (form.querySelector('input[name="side"]:checked') || {}).value || 'Cả 2';
      if (!name) return;
      saveWish({ name: name, msg: msg, attend: attend, side: side });
      form.reset();
      // reset radio về mặc định sau form.reset()
      var sideDef = form.querySelector('input[name="side"][value="Cô dâu"]');
      if (sideDef) sideDef.checked = true;
      var attendDef = form.querySelector('input[name="attend"][value="yes"]');
      if (attendDef) attendDef.checked = true;
    });
    renderWishes();
  }

  /* kh140 mục 9: nút "Xem thêm lời chúc" — bấm hiện TOÀN BỘ, bấm lần nữa thu về 3 */
  var btnMoreWishes = document.getElementById('btnMoreWishes');
  if (btnMoreWishes) {
    btnMoreWishes.addEventListener('click', function () {
      renderWishes._all = !renderWishes._all;
      if (renderWishes._all) {
        btnMoreWishes.textContent = '📤 Ẩn bớt lời chúc';
      }
      renderWishes();
    });
  }

  /* ─────── 5b. GALLERY XEM THÊM + LIGHTBOX (kh120) ─────── */
  var btnMore = document.getElementById('btnMorePhotos');
  var galleryMore = document.getElementById('galleryMore');
  if (btnMore && galleryMore) {
    var moreShown = false;
    btnMore.addEventListener('click', function () {
      moreShown = !moreShown;
      galleryMore.classList.toggle('hidden', !moreShown);
      btnMore.textContent = moreShown ? '📤 Ẩn bớt khoảnh khắc' : '📷 Xem thêm khoảnh khắc';
    });
  }

  var lightbox = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbClose = document.getElementById('lbClose');
  if (lightbox && lbImg) {
    var lbScrollY = 0;

    function lbOpen(src) {
      lbScrollY = window.scrollY;          // nhớ vị trí cuộn — đóng quay lại đúng chỗ
      lbImg.src = src;
      lbImg.classList.remove('zoomed');
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
    }

    function lbCloseFn() {
      lightbox.hidden = true;
      lbImg.src = '';
      document.body.style.overflow = '';
      window.scrollTo(0, lbScrollY);        // quay ra ngoài khu vực thiệp như cũ
    }

    // Mọi ảnh gallery (cả 2 lưới) mở lightbox
    document.querySelectorAll('.gallery-grid img').forEach(function (img) {
      img.addEventListener('click', function () { lbOpen(img.src); });
    });
    // chạm ảnh → zoom; chạm lần nữa → thu nhỏ
    lbImg.addEventListener('click', function () { lbImg.classList.toggle('zoomed'); });
    // ✕ + bấm nền đều đóng
    if (lbClose) lbClose.addEventListener('click', lbCloseFn);
    lightbox.querySelector('.lb-backdrop').addEventListener('click', lbCloseFn);
    // Esc đóng
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) lbCloseFn();
    });
  }

  /* ─────── 6. TÍCH HỢP MODULE #5 (kh108): sự kiện + Maps + QR từ THIEP_CUOI ───────
     Chỉ chạy khi có data #5 (js/noi-dung.js) — thiếu module thì giữ HTML tĩnh sẵn. */
  if (typeof THIEP_CUOI !== 'undefined') {
    var M = THIEP_CUOI.maps || {};
    var Q = THIEP_CUOI.qr || {};

    function setTxt(id, v) {
      var el = document.getElementById(id);
      if (el && v) el.textContent = v;
    }
    var nhaGai = M.nhaGai || {}, nhaTrai = M.nhaTrai || {};

    /* 6a-2. Sự kiện: địa chỉ + chủ nhà theo data #5 (thời gian chuyển xuống 6d-2 kèm âm lịch) */
    setTxt('evtAddr1', nhaGai.diaChi);
    setTxt('evtHost1', 'Chủ nhà: ' + (nhaGai.chuNha || ''));
    setTxt('evtAddr2', nhaTrai.diaChi);
    setTxt('evtHost2', 'Chủ nhà: ' + (nhaTrai.chuNha || ''));

    /* 6b. Maps iframe embed (không API key) + 2 nút mỗi card — dùng hàm #5 (js/qr.js) */
    if (typeof tcGoogleMapsEmbedUrl === 'function') {
      var m1 = document.getElementById('evtMap1');
      if (m1 && nhaGai.lat) {
        m1.src = tcGoogleMapsEmbedUrl(nhaGai);
        var p1 = document.getElementById('evtPin1');
        var d1 = document.getElementById('evtDir1');
        if (p1) p1.href = tcGoogleMapsPinUrl(nhaGai);
        if (d1) d1.href = tcGoogleMapsUrl(nhaGai);
      }
      var m2 = document.getElementById('evtMap2');
      if (m2 && nhaTrai.lat) {
        m2.src = tcGoogleMapsEmbedUrl(nhaTrai);
        var p2 = document.getElementById('evtPin2');
        var d2 = document.getElementById('evtDir2');
        if (p2) p2.href = tcGoogleMapsPinUrl(nhaTrai);
        if (d2) d2.href = tcGoogleMapsUrl(nhaTrai);
      }
    }

    /* 6c. QR: ảnh VietQR + fallback 2 tầng + text + nút sao chép STK — dùng hàm #5 */
    function setQrCard(imgId, copyId, nhId, stkId, ctkId, cfg, tenQr) {
      var img = document.getElementById(imgId);
      if (img && cfg && cfg.bin && typeof tcVietQrUrl === 'function') {
        img.onerror = function () {
          img.onerror = function () { img.onerror = null; img.src = tcQrPlaceholder(cfg); };
          img.src = tcVietQrUrlShort(cfg);
        };
        img.src = tcVietQrUrl(cfg);
      }
      setTxt(nhId, cfg && cfg.nh);
      setTxt(stkId, cfg && cfg.stk);
      setTxt(ctkId, cfg && cfg.chuTk);
      var btn = document.getElementById(copyId);
      if (btn && typeof tcSaoChep === 'function') {
        btn.addEventListener('click', function () {
          tcSaoChep(cfg.stk, cfg.chuTk, btn);
        });
      }
    }
    setQrCard('qrGroom', 'qrCopy1', 'qrNh1', 'qrStk1', 'qrCtk1', Q.ck);
    setQrCard('qrBride', 'qrCopy2', 'qrNh2', 'qrStk2', 'qrCtk2', Q.vk);

    /* 6d. Ngày cưới các vị trí khác (cover/hero/countdown/footer/trang đầu) đồng bộ THIEP_CUOI.suKien
       (kh138: kèm dòng "14.10.2026 Âm lịch" — hiển thị dưới ngày dương, khớp "22.11.2026 Dương lịch") */
    var sk = THIEP_CUOI.suKien || {};
    if (sk.ngayIso) {
      var dt = new Date(sk.ngayIso);
      var dd = ('0' + dt.getDate()).slice(-2);
      var mm = ('0' + (dt.getMonth() + 1)).slice(-2);
      var yyyy = dt.getFullYear();
      var shortDate = dd + ' · ' + mm + ' · ' + yyyy;
      setTxt('coverDate', shortDate);
      setTxt('cdWhen', (sk.thu || 'Chủ nhật') + ' · ' + shortDate);
      setTxt('footerDate', shortDate);
      if (sk.ngayChu) setTxt('heroDate', sk.ngayChu);
      setTxt('openDate', sk.ngayChu || ('Chủ nhật, ngày ' + dd + ' tháng ' + mm + ' năm ' + yyyy));
      if (sk.ngayAm) setTxt('openDateAm', sk.ngayAm + ' Âm lịch');
    }
    /* 6d-2. Chuỗi sự kiện kèm âm lịch: "Chủ nhật, 10:00 · 22 · 11 · 2026 Dương lịch tức 14.10.2026 Âm lịch"
       (kh138 mục 4 — ghi đè chuỗi evtTime1/2 đã set ở 6a) */
    if (sk.ngayDu && sk.ngayAm) {
      setTxt('evtTime1', 'Chủ nhật, ' + (sk.leThanhHon || '10:00') + ' · ' + sk.ngayDu + ' Dương lịch tức ' + sk.ngayAm + ' Âm lịch');
      setTxt('evtTime2', 'Chủ nhật, ' + (sk.tiecTaiNha || '10:00') + ' · ' + sk.ngayDu + ' Dương lịch tức ' + sk.ngayAm + ' Âm lịch');
    }
    /* 6e. Trang đầu (kh118 + kh139): 2 địa điểm nhà trai + nhà gái theo data #5 */
    if (nhaTrai && nhaTrai.diaChi) setTxt('openVenue', nhaTrai.diaChi);
    if (nhaGai && nhaGai.diaChi) setTxt('openVenue2', nhaGai.diaChi);
  }

})();
