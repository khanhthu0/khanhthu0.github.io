# -*- coding: utf-8 -*-
"""
build-dong-goi.py — Sinh file thiệp TỰ CHỨA (1 file .html duy nhất) cho từng tông màu.

Nguyên tắc: 4 file trong dong-goi/ của tác giả chỉ khác nhau ở ĐÚNG 3 chỗ:
   1) thẻ <title>
   2) khối :root trong <style>   (bảng màu của tông)
   3) hex màu tim trong url SVG   (stroke='%23xxxxxx' = --pink-deep của tông)
   (+ đổ bóng tim rgba() đi kèm --pink-deep)
Nên script này sinh tông MỚI bằng cách "hoán đổi màu" trên một file base đã build
sẵn → kết quả luôn đồng nhất 100% với các tông cũ.

CHẾ ĐỘ:
  --base      (mặc định) Hoán đổi màu trên file base có sẵn (dong-goi/thiep-pastel.html)
              → dùng để THÊM tông mới mà không đụng các tông cũ.
  --from-source
              Dựng lại từ index.html + assets/css + js/ (pipeline đầy đủ) — dùng khi
              muốn đồng bộ lại toàn bộ tông sau khi sửa nội dung.

Dùng:
    python tools/build-dong-goi.py                    # build tat ca tung (base mode)
    python tools/build-dong-goi.py hong               # chi build tung hong
    python tools/build-dong-goi.py --from-source      # dung pipeline day du
    python tools/build-dong-goi.py --check            # chi kiem tra, khong ghi file
"""
import sys, os, re, io, base64, json, argparse

sys.stdout.reconfigure(encoding='utf-8')

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, 'dong-goi')
CACHE = os.path.join(ROOT, 'tools', 'img-cache.json')
BASE_FILE = 'thiep-pastel.html'          # file base cho che do --base


# ══════════════════════════════════════════════════════════════════
#  BẢNG MÀU CÁC TÔNG
# ══════════════════════════════════════════════════════════════════
THEMES = {
    # ── tông chính: xanh non + trắng ────────────────────────────
    'pastel': {
        'file': 'thiep-pastel.html',
        'title': 'Thiệp mời cưới — Tông Xanh non + trắng (bản hiện hành)',
        'root': [
            ('--cream', '#f4f9f0', 'nền kem → trắng xanh non rất nhạt'),
            ('--pink', '#b9ddab', 'accent hồng pastel → XANH NON nhạt (viền, nền nhấn)'),
            ('--pink-deep', '#5c9e46', 'hồng đậm → XANH LÁ NON đậm (tiêu đề, nút, tim)'),
            ('--green', '#7a9e7e', 'xanh phụ (âm lịch) — giữ tông lá'),
            ('--text', '#3d4a35', 'nâu chữ → XANH RÊU ĐẬM dễ đọc trên nền trắng xanh'),
            ('--gold', '#a8c286', 'vàng đồng → XANH NON-vàng nhẹ (chữ kiểu, viền)'),
            ('--white', '#ffffff', ''),
            ('--envelope-grad', '#d8eecb', 'gradient đuôi nắp phong bì — nhạt hơn --pink 1 tông'),
            ('--cal-sunday', '#4f8a3d', 'chữ Chủ Nhật lịch — xanh non đậm'),
            ('--wedding-lunar', '#eaf5df', 'nhãn âm ô ngày cưới — nền xanh non nhạt'),
            ('--btn-hover', '#4a8039', 'hover nút RSVP — đậm hơn --pink-deep'),
            ('--card-bg', 'rgba(255, 255, 255, .92)', 'nền card kính mờ (trang đầu)'),
            ('--map-bg', '#eef5e6', 'nền khung bản đồ sự kiện — xanh non rất nhạt'),
        ],
    },
    # ── tông trung tính kem/be ───────────────────────────────────
    'trung-tinh': {
        'file': 'thiep-trung-tinh.html',
        'title': 'Thiệp mời cưới — Tông Trung tính — kem/be',
        'root': [
            ('--cream', '#faf6f0', 'nền kem trung tính'),
            ('--pink', '#e8e0d4', 'accent be nhạt (viền, nền nhấn)'),
            ('--pink-deep', '#b0956f', 'màu chính — nâu vàng nhạt (tiêu đề, nút, tim)'),
            ('--green', '#8a8778', 'xám phụ (âm lịch)'),
            ('--text', '#4a4238', 'nâu chữ trung tính'),
            ('--gold', '#a88b5f', 'vàng đồng (chữ kiểu, viền)'),
            ('--white', '#ffffff', ''),
            ('--envelope-grad', '#efe7da', 'gradient đuôi nắp phong bì'),
            ('--cal-sunday', '#b0906f', 'chữ Chủ Nhật lịch'),
            ('--wedding-lunar', '#f5efe2', 'nhãn âm ô ngày cưới'),
            ('--btn-hover', '#9c8260', 'hover nút RSVP'),
            ('--card-bg', 'rgba(255, 255, 255, .92)', 'nền card kính mờ'),
            ('--map-bg', '#eef5e6', 'nền khung bản đồ sự kiện'),
        ],
    },
    # ── tông truyền thống đỏ + vàng ─────────────────────────────
    'truyen-thong': {
        'file': 'thiep-truyen-thong.html',
        'title': 'Thiệp mời cưới — Tông Truyền thống — đỏ + vàng',
        'root': [
            ('--cream', '#fdf3ec', 'nền kem ấm'),
            ('--pink', '#f3c9c2', 'hồng đào nhạt (viền, nền nhấn)'),
            ('--pink-deep', '#c8382e', 'đỏ son đậm (tiêu đề, nút, tim)'),
            ('--green', '#9a7a4f', 'nâu vàng phụ (âm lịch)'),
            ('--text', '#5a2c22', 'nâu đỏ chữ'),
            ('--gold', '#d4a017', 'vàng kim (chữ kiểu, viền)'),
            ('--white', '#ffffff', ''),
            ('--envelope-grad', '#f0b5ac', 'gradient đuôi nắp phong bì'),
            ('--cal-sunday', '#d4a017', 'chữ Chủ Nhật lịch — vàng kim'),
            ('--wedding-lunar', '#ffe9c9', 'nhãn âm ô ngày cưới — vàng nhạt'),
            ('--btn-hover', '#b32e24', 'hover nút RSVP — đỏ đậm hơn'),
            ('--card-bg', 'rgba(255, 255, 255, .92)', 'nền card kính mờ'),
            ('--map-bg', '#eef5e6', 'nền khung bản đồ sự kiện'),
        ],
    },
    # ── tông mộc rustic nâu đất ─────────────────────────────────
    'moc-rustic': {
        'file': 'thiep-moc-rustic.html',
        'title': 'Thiệp mời cưới — Tông Mộc Rustic — nâu đất',
        'root': [
            ('--cream', '#f3ece2', 'nền kem nâu'),
            ('--pink', '#e3d3c0', 'be mộc (viền, nền nhấn)'),
            ('--pink-deep', '#a5714f', 'nâu đất đậm (tiêu đề, nút, tim)'),
            ('--green', '#7d8471', 'xám rêu phụ (âm lịch)'),
            ('--text', '#4d3a2a', 'nâu chữ'),
            ('--gold', '#9c6f3e', 'đồng thau (chữ kiểu, viền)'),
            ('--white', '#ffffff', ''),
            ('--envelope-grad', '#dcc9b0', 'gradient đuôi nắp phong bì'),
            ('--cal-sunday', '#a5714f', 'chữ Chủ Nhật lịch'),
            ('--wedding-lunar', '#f6e8d8', 'nhãn âm ô ngày cưới'),
            ('--btn-hover', '#8f5f40', 'hover nút RSVP'),
            ('--card-bg', 'rgba(255, 255, 255, .92)', 'nền card kính mờ'),
            ('--map-bg', '#eef5e6', 'nền khung bản đồ sự kiện'),
        ],
    },
    # ── TÔNG MỚI: hồng pastel + kem ──────────────────────────────
    'hong': {
        'file': 'thiep-hong.html',
        'title': 'Thiệp mời cưới — Tông Hồng pastel + kem',
        'root': [
            ('--cream', '#fdf7f5', 'nền kem hồng rất nhạt'),
            ('--pink', '#f5dcd8', 'hồng pastel nhạt (viền, nền nhấn)'),
            ('--pink-deep', '#c1626e', 'hồng đậm (tiêu đề, nút, tim)'),
            ('--green', '#b08884', 'hồng xám phụ (âm lịch)'),
            ('--text', '#5b4043', 'nâu chữ hồng đậm'),
            ('--gold', '#c9a86b', 'vàng champagne (chữ kiểu, viền)'),
            ('--white', '#ffffff', ''),
            ('--envelope-grad', '#f9e5e1', 'gradient đuôi nắp phong bì'),
            ('--cal-sunday', '#c1626e', 'chữ Chủ Nhật lịch — hồng đậm'),
            ('--wedding-lunar', '#fdeeea', 'nhãn âm ô ngày cưới — hồng siêu nhạt'),
            ('--btn-hover', '#a84a55', 'hover nút RSVP — hồng đậm hơn'),
            ('--card-bg', 'rgba(255, 255, 255, .92)', 'nền card kính mờ'),
            ('--map-bg', '#f9efee', 'nền khung bản đồ sự kiện — hồng rất nhạt'),
        ],
    },
}


def root_block(theme):
    """Dựng khối :root theo đúng format của tác giả (có comment tiếng Việt)."""
    lines = [':root {']
    for k, v, c in theme['root']:
        if c:
            lines.append('  %s: %s;%s/* %s */' % (k, v, ' ' * max(1, 26 - len(k) - len(v) - 2), c))
        else:
            lines.append('  %s: %s;' % (k, v))
    lines.append('}')
    return '\n'.join(lines)


def deep_hex(theme):
    """--pink-deep của tông (dùng cho tim SVG + đổ bóng)."""
    for k, v, _ in theme['root']:
        if k == '--pink-deep':
            return v.lstrip('#')
    raise KeyError('--pink-deep')


def rgba_of(hex_color, alpha):
    h = hex_color.lstrip('#')
    r, g, b = (int(h[i:i + 2], 16) for i in (0, 2, 4))
    return 'rgba(%d, %d, %d, %s)' % (r, g, b, alpha)


# ══════════════════════════════════════════════════════════════════
#  CHẾ ĐỘ 1 — HOÁN ĐỔI MÀU TRÊN FILE BASE (dùng để thêm tông mới)
# ══════════════════════════════════════════════════════════════════
def build_from_base(theme, base_html):
    """Chỉ thay: title + :root + hex tim SVG + đổ bóng tim. Mọi thứ khác giữ nguyên."""
    html = base_html
    deep = deep_hex(theme)

    # 1) title
    html = re.sub(r'<title>.*?</title>',
                   '<title>%s</title>' % theme['title'], html, count=1, flags=re.S)

    # 2) khối :root
    html = re.sub(r':root\s*\{.*?\}', lambda m: root_block(theme), html, count=1, flags=re.S)

    # 3) hex tim trong url SVG (mọi tông đều dùng chung 1 mẫu, đổi hex là đủ)
    html = re.sub(r"(stroke='%23)[0-9a-fA-F]{6}(')", r'\g<1>%s\g<2>' % deep, html)

    # 4) đổ bóng tim — theo đúng --pink-deep của tông
    html = re.sub(r'rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*\.45\s*\)\s*(/\*[^*]*\*/)?',
                  lambda m: rgba_of(deep, '.45') + (m.group(1) or ''), html, count=1)

    return html


# ══════════════════════════════════════════════════════════════════
#  CHẾ ĐỘ 2 — DỰNG LẠI TỪ NGUỒN (index.html + assets + js)
# ══════════════════════════════════════════════════════════════════
def build_cache():
    """Trích payload base64 ảnh từ bản build sẵn có (ảnh đã nén của tác giả)."""
    cache = {}
    ref = os.path.join(OUT_DIR, BASE_FILE)
    if not os.path.exists(ref):
        return cache
    pg = open(ref, encoding='utf-8', errors='replace').read()
    css_src = open(os.path.join(ROOT, 'assets', 'css', 'style.css'), encoding='utf-8', errors='replace').read()
    idx = open(os.path.join(ROOT, 'index.html'), encoding='utf-8', errors='replace').read()

    # ảnh trong CSS
    css_refs = re.findall(r"url\('\.\./\.\./(images/[^']+)'\)", css_src)
    style_blk = pg[pg.index('<style>'):pg.index('</style>')]
    css_blobs = re.findall(r"url\('data:image/(?:jpeg|png|webp);base64,([A-Za-z0-9+/=]+)'\)", style_blk)
    for rel, b64 in zip(css_refs, css_blobs):
        cache[rel] = b64

    # ảnh trong BODY — ghép theo thứ tự thẻ <img> giữa index.html và bản build
    body_pg = pg[pg.index('<body>'):]
    body_idx = idx[idx.index('<body>'):]
    pg_imgs = re.findall(r'<img[^>]*src="data:image/(?:jpeg|png|webp|gif);base64,([A-Za-z0-9+/=]+)"', body_pg)
    idx_imgs = re.findall(r'<img[^>]*src="([^"]+)"', body_idx)
    for src, b64 in zip(idx_imgs, pg_imgs):
        if src.startswith('images/'):
            cache[src] = b64
    return cache


def load_cache():
    if os.path.exists(CACHE):
        with open(CACHE, encoding='utf-8') as f:
            return json.load(f)
    cache = build_cache()
    os.makedirs(os.path.dirname(CACHE), exist_ok=True)
    with open(CACHE, 'w', encoding='utf-8') as f:
        json.dump(cache, f, ensure_ascii=False)
    return cache


def encode_image(rel, max_w=None, max_h=None, quality=80):
    try:
        from PIL import Image
    except ImportError:
        return None
    p = os.path.join(ROOT, rel.replace('/', os.sep))
    if not os.path.exists(p):
        return None
    im = Image.open(p).convert('RGB')
    w, h = im.size
    if max_w and w > max_w:
        h = round(h * max_w / w); w = max_w
    if max_h and h > max_h:
        w = round(w * max_h / h); h = max_h
    if (w, h) != im.size:
        im = im.resize((w, h), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, 'JPEG', quality=quality, optimize=True)
    return base64.b64encode(buf.getvalue()).decode('ascii')


def build_from_source(theme, cache):
    html = open(os.path.join(ROOT, 'index.html'), encoding='utf-8', errors='replace').read()
    css = open(os.path.join(ROOT, 'assets', 'css', 'style.css'), encoding='utf-8', errors='replace').read()

    # CSS: :root + ảnh + tim
    css = re.sub(r':root\s*\{.*?\}', lambda m: root_block(theme), css, count=1, flags=re.S)

    def css_url(m):
        rel = m.group(1)
        b64 = cache.get(rel) or encode_image(rel, max_w=1500, quality=80)
        return "url('data:image/jpeg;base64,%s')" % b64 if b64 else m.group(0)
    css = re.sub(r"url\('\.\./\.\./(images/[^']+)'\)", css_url, css)

    deep = deep_hex(theme)
    css = re.sub(r"(stroke='%23)[0-9a-fA-F]{6}(')", r'\g<1>%s\g<2>' % deep, css)
    css = re.sub(r'rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*\.45\s*\)',
                 rgba_of(deep, '.45'), css, count=1)

    html = html.replace('<link rel="stylesheet" href="assets/css/style.css">',
                         '<style>\n%s\n</style>' % css)

    # JS
    for jf in ['js/noi-dung.js', 'js/am-lich.js', 'js/qr.js', 'assets/js/main.js']:
        src = open(os.path.join(ROOT, jf.replace('/', os.sep)), encoding='utf-8', errors='replace').read()
        src = src.replace('</script>', '<\\/script>')
        html = html.replace('<script src="%s"></script>' % jf,
                             '<script>\n%s\n</script>' % src)

    # ảnh trong body
    def body_img(m):
        rel = m.group(1)
        b64 = cache.get(rel) or encode_image(rel, max_h=760, quality=80)
        return 'src="data:image/jpeg;base64,%s"' % b64 if b64 else m.group(0)
    html = re.sub(r'src="(images/[^"]+)"', body_img, html)

    html = re.sub(r'<title>.*?</title>', '<title>%s</title>' % theme['title'], html, count=1, flags=re.S)
    return html


# ══════════════════════════════════════════════════════════════════
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('themes', nargs='*', help='slug các tông (mặc định: tất cả)')
    ap.add_argument('--from-source', action='store_true', help='dựng lại từ index.html + assets')
    ap.add_argument('--check', action='store_true', help='chỉ kiểm tra, không ghi file')
    args = ap.parse_args()

    slugs = args.themes or list(THEMES.keys())
    cache = load_cache()
    base_html = None
    base_path = os.path.join(OUT_DIR, BASE_FILE)
    if os.path.exists(base_path):
        base_html = open(base_path, encoding='utf-8', errors='replace').read()

    for slug in slugs:
        if slug not in THEMES:
            print('!! Khong co tung "%s"' % slug); continue
        theme = THEMES[slug]

        if args.from_source:
            html = build_from_source(theme, cache)
        else:
            if base_html is None:
                print('!! Thieu file base %s — dung --from-source' % BASE_FILE); continue
            html = build_from_base(theme, base_html)

        out = os.path.join(OUT_DIR, theme['file'])
        if not args.check:
            os.makedirs(OUT_DIR, exist_ok=True)
            with open(out, 'w', encoding='utf-8', newline='\n') as f:
                f.write(html)
        size = os.path.getsize(out) if os.path.exists(out) else len(html.encode('utf-8'))
        print('  %-14s -> %-24s %6.2f MB%s'
              % (slug, theme['file'], size / 1048576, '  (check)' if args.check else ''))


if __name__ == '__main__':
    main()
