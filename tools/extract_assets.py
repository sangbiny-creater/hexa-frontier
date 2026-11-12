"""원본 캐릭터 시트(PNG)에서 초상화·헥스 타일 스프라이트를 잘라 public/assets 로 저장한다.
원본 폴더는 읽기만 한다. 실행: python3 tools/extract_assets.py <원본 폴더>
"""
import sys, os
from collections import Counter, deque
from PIL import Image, ImageDraw

SRC = sys.argv[1] if len(sys.argv) > 1 else '/Users/choisangbin/Documents/hexafrontier'
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'assets')
os.makedirs(OUT, exist_ok=True)

def mode_color(im, box):
    px = im.crop(box).resize((60, 30)).getdata()
    c = Counter((r // 12, g // 12, b // 12) for r, g, b in px).most_common(1)[0][0]
    return tuple(v * 12 + 6 for v in c)

def components(im, box, bg, tol=48, step=3):
    x0, y0, x1, y1 = box
    w, h = (x1 - x0) // step, (y1 - y0) // step
    px = im.load()
    def fg(i, j):
        r, g, b = px[x0 + i * step, y0 + j * step][:3]
        return abs(r - bg[0]) + abs(g - bg[1]) + abs(b - bg[2]) > tol
    seen = [[False] * w for _ in range(h)]
    comps = []
    for j in range(h):
        for i in range(w):
            if seen[j][i] or not fg(i, j):
                continue
            q = deque([(i, j)]); seen[j][i] = True
            mnx = mxx = i; mny = mxy = j; n = 0
            while q:
                a, b = q.popleft(); n += 1
                mnx, mxx, mny, mxy = min(mnx, a), max(mxx, a), min(mny, b), max(mxy, b)
                for da, db in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    c, d = a + da, b + db
                    if 0 <= c < w and 0 <= d < h and not seen[d][c] and fg(c, d):
                        seen[d][c] = True; q.append((c, d))
            comps.append((x0 + mnx * step, y0 + mny * step, x0 + (mxx + 1) * step, y0 + (mxy + 1) * step, n))
    return comps

def merge_x(comps):
    comps = sorted(comps, key=lambda c: c[0])
    out = []
    for c in comps:
        if out and c[0] < out[-1][2] - 5:
            p = out[-1]
            out[-1] = (min(p[0], c[0]), min(p[1], c[1]), max(p[2], c[2]), max(p[3], c[3]), p[4] + c[4])
        else:
            out.append(c)
    return out

def find_three(im, band, min_w, min_h, square=False):
    bg = mode_color(im, band)
    cs = [c for c in components(im, band, bg) if c[2] - c[0] >= min_w and c[3] - c[1] >= min_h]
    if square:
        cs = [c for c in cs if 0.7 < (c[2] - c[0]) / (c[3] - c[1]) < 1.45]
    cs = merge_x(cs)
    return sorted(cs, key=lambda c: c[0])[:3], bg

def cut_sprite(im, box, bg, pad=4, tol=60):
    x0, y0, x1, y1 = box[0] - pad, box[1] - pad, box[2] + pad, box[3] + pad
    sp = im.crop((x0, y0, x1, y1)).convert('RGBA')
    # 테두리에서 배경색과 비슷한 영역을 지워 투명하게
    w, h = sp.size
    px = sp.load()
    def near(p):
        return abs(p[0] - bg[0]) + abs(p[1] - bg[1]) + abs(p[2] - bg[2]) < tol
    q = deque([(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)] + [(i, 0) for i in range(w)] + [(i, h - 1) for i in range(w)] + [(0, j) for j in range(h)] + [(w - 1, j) for j in range(h)])
    seen = set()
    while q:
        a, b = q.popleft()
        if (a, b) in seen or not (0 <= a < w and 0 <= b < h):
            continue
        seen.add((a, b))
        if not near(px[a, b]):
            continue
        px[a, b] = (0, 0, 0, 0)
        q.extend(((a + 1, b), (a - 1, b), (a, b + 1), (a, b - 1)))
    bbox = sp.getbbox()
    return sp.crop(bbox) if bbox else sp

# (출력 이름, 시트, 초상 영역, 타일 영역)
SHEETS = [
    ('shellknight', 'S03-T01.png'),
    ('emberwing', 'S02-R01.png'),
    ('bloomel', 'S01-H01.png'),
    ('leafpup', 'S01-M01.png'),
    ('leafkit', 'S01-R01.png'),
    ('rocktusk', 'S05-M01.png'),
    ('tidekit', 'S03-R01.png'),
    ('galewing', 'S04-R01.png'),
    ('grovegolem', 'S01-T01.png'),
    ('terrastone', 'S05-T01.png'),
    ('skywarden', 'S04-M02.png'),
]
PORTRAIT_BAND = (900, 95, 1470, 285)
TILE_BAND = (900, 285, 1440, 470)
# 시트마다 배치가 조금씩 달라 영역을 따로 지정
OVERRIDE = {
    'shellknight': ((1000, 95, 1520, 285), (1000, 285, 1400, 470)),
    'bloomel': (None, (990, 285, 1440, 470)),
    'grovegolem': (None, (1015, 312, 1400, 452)),
    'terrastone': ((1060, 95, 1370, 200), (1095, 292, 1522, 402)),
    'rocktusk': (None, (995, 250, 1520, 382)),
    'skywarden': (None, (972, 305, 1325, 452)),
}

report = []
for name, f in SHEETS:
    im = Image.open(os.path.join(SRC, f)).convert('RGB')
    pb, tb = OVERRIDE.get(name, (None, None))
    ports, _ = find_three(im, pb or PORTRAIT_BAND, 60, 60, square=True)
    tiles, tbg = find_three(im, tb or TILE_BAND, 60, 60)
    for k, c in enumerate(ports):
        p = im.crop(c[:4]).resize((192, int(192 * (c[3] - c[1]) / (c[2] - c[0]))))
        p.save(os.path.join(OUT, f'{name}-p{k + 1}.webp'), quality=82)
    for k, c in enumerate(tiles):
        s = cut_sprite(im, c[:4], tbg)
        s.thumbnail((200, 200))
        s.save(os.path.join(OUT, f'{name}-t{k + 1}.webp'), quality=85)
    report.append((name, len(ports), len(tiles)))
print(report)

# ── 주인공(C01) ──
im = Image.open(os.path.join(SRC, 'C01.png')).convert('RGB')
im.crop((1265, 52, 1402, 209)).resize((192, 220)).save(os.path.join(OUT, 'hero-p.webp'), quality=82)
hero, hbg = find_three(im, (1290, 270, 1460, 432), 60, 60)
s = cut_sprite(im, hero[0][:4], hbg); s.thumbnail((200, 200)); s.save(os.path.join(OUT, 'hero-t.webp'), quality=85)

# ── 타일 세트: 특수 타일 + 숲 지형 ──
ts = Image.open(os.path.join(SRC, 'Tile_Set.png')).convert('RGB')
special_names = ['treasure', 'battle', 'shop', 'heal', 'healused', 'elite', 'boss', 'locked']
bg = mode_color(ts, (10, 825, 690, 925))
sp = merge_x([c for c in components(ts, (10, 825, 690, 925), bg) if c[2] - c[0] >= 40 and c[3] - c[1] >= 40])
for n, c in zip(special_names, sorted(sp, key=lambda c: c[0])):
    t = cut_sprite(ts, c[:4], bg, tol=50); t.thumbnail((160, 160)); t.save(os.path.join(OUT, f'tile-{n}.webp'), quality=85)
deco_names = ['ruins', 'statue', 'signpost', 'camp', 'event', 'event2', 'portal', 'deadtree', 'crystal', 'log', 'flowers', 'mushroom', 'bones']
bg2 = mode_color(ts, (690, 825, 1536, 925))
dc = merge_x([c for c in components(ts, (690, 825, 1536, 925), bg2) if c[2] - c[0] >= 40 and c[3] - c[1] >= 40])
for n, c in zip(deco_names, sorted(dc, key=lambda c: c[0])):
    t = cut_sprite(ts, c[:4], bg2, tol=50); t.thumbnail((160, 160)); t.save(os.path.join(OUT, f'tile-{n}.webp'), quality=85)
bg3 = mode_color(ts, (85, 190, 255, 470))
fr = [c for c in components(ts, (85, 190, 255, 470), bg3) if c[2] - c[0] >= 40 and c[3] - c[1] >= 40]
fr.sort(key=lambda c: (round(c[1] / 40), c[0]))
for k, c in enumerate(fr[:9]):
    t = cut_sprite(ts, c[:4], bg3, tol=50); t.thumbnail((160, 160)); t.save(os.path.join(OUT, f'forest-{k + 1}.webp'), quality=85)
print('special', len(sp), 'deco', len(dc), 'forest', len(fr))
