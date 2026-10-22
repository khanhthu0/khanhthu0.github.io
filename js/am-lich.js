/* ═══════════ js/am-lich.js — âm lịch Việt Nam (kh119) ═══════════
   Thuật toán Meeus (New Moon ch.49 + Sun Longitude ch.25) — tự viết, KHÔNG CDN
   (file thiệp cuối phải self-contained — kh122).
   Verify mốc: Tết Bính Ngọ 2026 = 17/02/2026, Tết Đinh Mùi 2027 = 06/02/2027,
   ngày cưới 16/01/2027 = 9 tháng Chạp (12) năm Bính Ngọ. */

var AmLich = (function () {
  'use strict';

  var RAD = Math.PI / 180;

  /* JD từ ngày dương lịch (Gregorian) */
  function jdTuNgay(y, m, d) {
    var a = Math.floor((14 - m) / 12);
    var yy = y + 4800 - a;
    var mm = m + 12 * a - 3;
    return d + Math.floor((153 * mm + 2) / 5) + 365 * yy
      + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
  }

  /* Ngày dương từ JD */
  function jdSangYmd(jd) {
    var z = Math.floor(jd + 0.5), f = jd + 0.5 - z, A, alpha;
    if (z < 2299161) A = z;
    else {
      alpha = Math.floor((z - 1867216.25) / 36524.25);
      A = z + 1 + alpha - Math.floor(alpha / 4);
    }
    var B = A + 1524;
    var C = Math.floor((B - 122.1) / 365.25);
    var D = Math.floor(365.25 * C);
    var E = Math.floor((B - D) / 30.6001);
    var day = B - D - Math.floor(30.6001 * E) + f;
    var month = E < 14 ? E - 1 : E - 13;
    var year = month > 2 ? C - 4716 : C - 4715;
    return { y: year, m: month, d: Math.floor(day) };
  }

  /* New Moon (Meeus ch.49) — JDE của sóc thứ k */
  function socJDE(k) {
    var T = k / 1236.85, T2 = T * T, T3 = T2 * T, T4 = T3 * T;
    var JDE = 2451550.09766 + 29.530588861 * k
      + 0.00015437 * T2 - 0.00000015 * T3 + 0.00000000073 * T4;
    var E = 1 - 0.002516 * T - 0.0000074 * T2;
    var M = 2.5534 + 29.1053567 * k - 0.0000014 * T2 - 0.00000011 * T3;
    var Mp = 201.5643 + 385.81693528 * k + 0.0107582 * T2
      + 0.00001238 * T3 - 0.000000058 * T4;
    var F = 160.7108 + 390.67050284 * k - 0.0016118 * T2
      - 0.00000227 * T3 + 0.000000011 * T4;
    var Om = 124.7746 - 1.56375588 * k + 0.0020672 * T2 + 0.00000215 * T3;
    function sin(x) { return Math.sin(x * RAD); }
    var c = 0;
    c += -0.40720 * sin(Mp);
    c += -0.17241 * E * sin(M);
    c += 0.01608 * sin(2 * Mp);
    c += 0.01041 * sin(2 * F);
    c += 0.00739 * E * sin(Mp - M);
    c += -0.00514 * E * sin(Mp + M);
    c += 0.00208 * E * E * sin(2 * M);
    c += -0.00111 * sin(Mp - 2 * F);
    c += -0.00057 * sin(Mp + 2 * F);
    c += 0.00056 * E * sin(2 * Mp + M);
    c += -0.00042 * sin(3 * Mp);
    c += 0.00042 * E * sin(M + 2 * F);
    c += 0.00038 * E * sin(M - 2 * F);
    c += -0.00024 * E * sin(2 * Mp - M);
    c += -0.00017 * sin(Om);
    c += -0.00007 * sin(Mp + 2 * M);
    c += 0.00004 * sin(2 * Mp - 2 * F);
    c += 0.00004 * sin(3 * M);
    c += 0.00003 * sin(Mp + M - 2 * F);
    c += 0.03e-3 * sin(Mp + M + 2 * F);
    c += 0.00003 * sin(Mp - M + 2 * F);
    c += -0.00003 * sin(Mp - M - 2 * F);
    c += -0.00003 * sin(3 * Mp + M);
    c += 0.00002 * sin(4 * Mp);
    return JDE + c;
  }

  /* Kinh độ mặt trời (Meeus ch.25) — độ */
  function kinhDoMatTroi(jd) {
    var T = (jd - 2451545.0) / 36525;
    var L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
    var M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
    var C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * sin_(M)
      + (0.019993 - 0.000101 * T) * sin_(2 * M)
      + 0.000289 * sin_(3 * M);
    return (L0 + C) % 360;
    function sin_(x) { return Math.sin(x * RAD); }
  }

  /* Trung khí gắn với tháng âm (mỗi 30°): 270°=tháng 11 … 330°=tháng 1, 0°=tháng 2 … */
  var TRUNG_KHI = { 270: 11, 300: 12, 330: 1, 0: 2, 30: 3, 60: 4, 90: 5, 120: 6,
                    150: 7, 180: 8, 210: 9, 240: 10 };

  /* Danh sách ngày 1 âm (local VN, múi +7) giữa 2 JD */
  function cacNgaySoc(jdFrom, jdTo) {
    var tz = 7 / 24;
    var k = Math.floor((jdFrom - 2451550.09766) / 29.530588861) - 1;
    var out = [];
    for (;;) {
      var nm = socJDE(k);
      var local = Math.floor(nm + tz + 0.5); // sóc về VN (JD trưa → cộng 0.5 lấy ngày dân sự)
      if (local > jdTo) break;
      if (local >= jdFrom) out.push(local);
      k++;
    }
    return out;
  }

  /* Trung khí (Meeus ch.25 + lặp Newton) — JD mà kinh độ mặt trời ≡ góc (mod 360),
     gần jdRef. Kinh độ tăng ~0.98565°/ngày nên lặp 3 vòng hội tụ < 0.001°. */
  function jdTrungKhi(goc, jdRef) {
    var lam = kinhDoMatTroi(jdRef);
    var kien = ((goc - lam) % 360 + 360) % 360;      // khoảng cách tiến tới mốc
    if (kien > 180) kien -= 360;                      // mốc nằm PHÍA TRƯỚC → lùi (gần nhất)
    var jd = jdRef + kien / 0.98565;                  // phỏng đoán ban đầu (có dấu)
    for (var i = 0; i < 4; i++) {
      var l2 = kinhDoMatTroi(jd);
      var d = ((goc - l2) % 360 + 360) % 360;
      if (d > 180) d -= 360;                          // lùi nếu đang vượt mốc
      jd += d / 0.98565;
      if (Math.abs(d) < 0.001) break;
    }
    return jd;
  }

  /* Trung khí thuộc tháng âm [jd1, jd2) → số tháng gắn, KHÔNG thì null.
     So theo NGÀY local VN (múi +7) của trung khí. Lưu ý jd1 là SỐ NGUYÊN (ngày dân sự):
     kinh độ tại trưa UT jd1 có thể ĐÃ VƯỢT mốc nào đó rơi đầu ngày jd1 (sáng VN)
     → duyệt từ mốc floor(lam/30) để không bỏ sót trung khí của chính ngày đầu tháng. */
  function trungKhiThang(jd1, jd2) {
    var tz = 7 / 24;
    var lam1 = kinhDoMatTroi(jd1);
    var mocDau = 30 * Math.floor(lam1 / 30);           // mốc có thể nằm trong ngày đầu
    for (var i = 0; i < 3; i++) {
      var goc = ((mocDau + 30 * i) % 360 + 360) % 360;
      var jdTK = jdTrungKhi(goc, jd1);
      var ngayVN = Math.floor(jdTK + tz + 0.5);       // JD trưa → +0.5 lấy ngày dân sự VN
      if (ngayVN >= jd1 && ngayVN < jd2) return TRUNG_KHI[goc] !== undefined ? TRUNG_KHI[goc] : null;
      if (ngayVN >= jd2) return null;                 // mốc kế đã ngoài tháng → tháng không trung khí
    }
    return null;
  }

  /* Chuỗi tháng âm từ jdFrom đến jdTo: [{jd1, jd2, thang}] */
  function chuoiThangAm(jdFrom, jdTo) {
    var socs = cacNgaySoc(jdFrom, jdTo);
    var months = [];
    for (var i = 0; i < socs.length - 1; i++) {
      months.push({ jd1: socs[i], jd2: socs[i + 1], thang: trungKhiThang(socs[i], socs[i + 1]) });
    }
    return months;
  }

  /* ═══════════ API chính: chuyển dương → âm (múi +7) ═══════════
     Trả {ngay, thang, nam, nhuan:false} — tháng âm 1→12.
     Năm âm theo quy ước VN: = năm DL của TẾT LIỀN TRƯỚC ngày
     (16/01/2027 nằm giữa Tết Bính Ngọ 17/02/2026 → 9/12 năm Bính Ngọ 2026;
     Tết gần như luôn rơi tháng 1-2 nên năm DL của Tết = năm can chi). */
  function sangAm(y, m, d) {
    var jd = jdTuNgay(y, m, d);
    // cửa sổ phủ đủ về TRƯỚC tới Tết liền trước (≤ 13 tháng) + 2 tháng sau
    var months = chuoiThangAm(jd - 420, jd + 62);
    if (!months.length) return null;

    // Tìm tháng chứa ngày
    var idx = -1;
    for (var i = 0; i < months.length; i++) {
      if (months[i].jd1 <= jd && jd < months[i].jd2) { idx = i; break; }
    }
    if (idx < 0) return null;
    var ngay = jd - months[idx].jd1 + 1;

    // Tên tháng: tháng có trung khí mang số trung khí (330°→1 … 270°→11),
    // tháng KHÔNG trung khí = nhuận của tháng liền trước.
    var ten = months[idx].thang;
    var nhuan = false;
    if (ten === null || ten === undefined) {
      nhuan = true;
      for (var j = idx - 1; j >= 0; j--) {
        if (months[j].thang !== null && months[j].thang !== undefined) { ten = months[j].thang; break; }
      }
    }

    // Năm âm = năm DL của sóc TẾT (tháng 1) liền TRƯỚC tháng chứa ngày.
    // Ngày trùng đúng Tết → chính tháng 1 đó.
    var tetJd = null;
    if (ten === 1 && !nhuan && months[idx].jd1 <= jd) {
      tetJd = months[idx].jd1;
    } else {
      for (var j2 = idx - 1; j2 >= 0; j2--) {
        if (months[j2].thang === 1) { tetJd = months[j2].jd1; break; }
      }
    }
    var namAm = tetJd !== null ? jdSangYmd(tetJd).y : jdSangYmd(months[idx].jd1).y;
    return { ngay: ngay, thang: ten, nam: namAm, nhuan: nhuan };
  }

  /* Can chi năm âm (Bính Ngọ 2026, Đinh Mùi 2027…): năm-4 → can/chi */
  function canChiNam(namAm) {
    var CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
    var CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
    var n = namAm - 4;
    return CAN[((n % 10) + 10) % 10] + ' ' + CHI[((n % 12) + 12) % 12];
  }

  return {
    sangAm: sangAm,
    canChiNam: canChiNam,
    jdTuNgay: jdTuNgay,
    jdSangYmd: jdSangYmd,
    chuoiThangAm: chuoiThangAm
  };
})();

/* Node test — chạy: node js/am-lich.js */
if (typeof module !== 'undefined' && module.exports && typeof require === 'function' && require.main === module) {
  var t = [
    [2027, 1, 16, 'ngày cưới'], [2026, 2, 17, 'Tết Bính Ngọ 2026'], [2027, 2, 6, 'Tết Đinh Mùi 2027'],
    [2026, 4, 1, 'sau tháng nhuận'], [2025, 1, 1, 'Tết 2025'], [2027, 1, 8, '1 Chạp 2026']
  ];
  t.forEach(function (x) {
    var r = AmLich.sangAm(x[0], x[1], x[2]);
    console.log(x[2] + '/' + x[1] + '/' + x[0] + ' → ' + r.ngay + '/' + r.thang + '/' + r.nam +
      (r.nhuan ? ' (nhuận)' : '') + '  — ' + x[3]);
  });
}
