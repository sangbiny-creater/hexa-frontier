"""D119: 원본 시트에서 스피릿 25종(속성 5 × 역할 5)과 여자 주인공(C02)을 잘라 public/assets 로 저장.
원본 폴더는 읽기만 한다. 실행: python3 tools/extract_spirits.py <원본 폴더>
"""
import sys, os
sys.argv = sys.argv[:2]
here = os.path.dirname(__file__)
# 기존 도구의 함수들을 그대로 쓴다 (실행 부분은 건너뛰도록 소스에서 함수만 가져옴)
src = open(os.path.join(here, 'extract_assets.py'), encoding='utf-8').read().split('# (출력 이름, 시트')[0]
exec(src)

NEW = [
    ('willowisp', 'S01-S01'), ('ignagolem', 'S02-T01'), ('flameclaw', 'S02-M01'), ('flamora', 'S02-H01'), ('pyronomad', 'S02-S01'),
    ('wavefang', 'S03-M01'), ('neritha', 'S03-R02'), ('aqualyn', 'S03-H01'), ('aquadron', 'S03-S01'),
    ('cloudtusk', 'S04-T01'), ('sylphia', 'S04-H01'), ('cloudavian', 'S04-S01'),
    ('pebblin', 'S05-R01'), ('terrawisp', 'S05-H01'), ('geomancer', 'S05-S01'),
]
PORTRAIT_BAND = (900, 95, 1470, 285)
TILE_BAND = (900, 285, 1440, 470)
OV = {}  # 이름: (초상 영역, 타일 영역) — 시트마다 다르면 여기서 지정
if os.path.exists(os.path.join(here, 'spirit_bands.py')):
    exec(open(os.path.join(here, 'spirit_bands.py'), encoding='utf-8').read())

import glob
rep = []
for name, sheet in NEW:
    f = glob.glob(os.path.join(SRC, sheet + '.*'))[0]
    im = Image.open(f).convert('RGB')
    pb, tb = OV.get(name, (None, None))
    ports, _ = find_three(im, pb or PORTRAIT_BAND, 50, 50, square=True)
    tiles, tbg = find_three(im, tb or TILE_BAND, 50, 50)
    for k, c in enumerate(ports):
        p = im.crop(c[:4]).resize((192, int(192 * (c[3] - c[1]) / (c[2] - c[0]))))
        p.save(os.path.join(OUT, f'{name}-p{k + 1}.webp'), quality=82)
    for k, c in enumerate(tiles):
        s = cut_sprite(im, c[:4], tbg)
        s.thumbnail((200, 200))
        s.save(os.path.join(OUT, f'{name}-t{k + 1}.webp'), quality=85)
    rep.append((name, len(ports), len(tiles), [c[:4] for c in tiles]))
for r in rep:
    print(r)

# 여자 주인공 (C02): 초상 + 대기 타일
im = Image.open(os.path.join(SRC, 'C02.png')).convert('RGB')
im.crop((1265, 55, 1393, 212)).resize((192, 236)).save(os.path.join(OUT, 'heroine-p.webp'), quality=82)
h, hbg = find_three(im, (1290, 268, 1470, 440), 60, 60)
s = cut_sprite(im, h[0][:4], hbg); s.thumbnail((200, 200)); s.save(os.path.join(OUT, 'heroine-t.webp'), quality=85)
print('heroine', h[0][:4])
