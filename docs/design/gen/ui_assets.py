# UI 목업(image/UI*.PNG)에서 게임에 쓸 UI 조각을 잘라 public/ui/에 저장 (D136)
# 마젠타(#FF00FF) 배경은 투명으로 바꾼다.
from PIL import Image, ImageFilter
import os
SRC = 'image'
OUT = 'public/ui'
os.makedirs(OUT, exist_ok=True)

def key_magenta(im):
    im = im.convert('RGBA')
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            m = min(r, b) - g  # 마젠타 정도
            if m > 120:
                px[x, y] = (0, 0, 0, 0)
            elif m > 40:
                t = (m - 40) / 80
                na = int(255 * (1 - t))
                # 번짐 제거: r, b를 g 쪽으로
                r2 = int(r - (r - g) * t * 0.8)
                b2 = int(b - (b - g) * t * 0.8)
                px[x, y] = (r2, g, b2, na)
    return im

def trim(im):
    bb = im.getbbox()
    return im.crop(bb) if bb else im

def save(im, name, q=90):
    im.save(f'{OUT}/{name}.webp', 'WEBP', quality=q, method=6)

ui4 = Image.open(f'{SRC}/UI4.PNG')
ui12 = Image.open(f'{SRC}/UI12.PNG')
# 탭 아이콘 (보통 / 빛남) — 아이콘만, 글자는 게임이 쓴다
TABS = ['expedition', 'party', 'spirit', 'dex', 'shop']
XS = [(872, 985), (1000, 1118), (1128, 1252), (1262, 1378), (1395, 1505)]
for i, n in enumerate(TABS):
    x0, x1 = XS[i]
    save(trim(key_magenta(ui4.crop((x0, 188, x1, 283)))), f'tab-{n}')
    save(trim(key_magenta(ui4.crop((x0, 390, x1, 488)))), f'tab-{n}-on')
# 보석·동전, 별, 헥사 칸 6종, 잎 장식
def key_dark(im):
    # 진녹색 알약 바탕을 투명으로 (보석·동전)
    im = im.convert('RGBA'); px = im.load()
    for y in range(im.size[1]):
        for x in range(im.size[0]):
            r, g, b, a = px[x, y]
            if a and max(r, g, b) < 95 and g >= r and g >= b - 10:
                px[x, y] = (0, 0, 0, 0)
    return im
save(trim(key_dark(key_magenta(ui12.crop((186, 190, 250, 248))))), 'gem')
from PIL import ImageDraw
coin = ui12.crop((449, 190, 515, 250)).convert('RGBA')
mask = Image.new('L', coin.size, 0); ImageDraw.Draw(mask).ellipse((3, 1, 63, 59), fill=255)
coin.putalpha(mask); save(coin, 'coin')
save(trim(key_magenta(ui12.crop((626, 876, 698, 948)))), 'star-off')
save(trim(key_magenta(ui12.crop((700, 876, 774, 948)))), 'star')
for n, box in [('node-open', (472, 660, 626, 832)), ('node-lock', (636, 660, 790, 832)), ('node-done', (800, 660, 952, 832)),
               ('node-now', (960, 630, 1126, 832)), ('node-elite', (1142, 655, 1306, 835)), ('node-boss', (1314, 640, 1512, 835))]:
    save(trim(key_magenta(ui12.crop(box))), n)
save(trim(key_magenta(ui12.crop((960, 862, 1504, 946)))), 'divider')
save(trim(key_magenta(ui12.crop((550, 292, 1020, 384)))), 'ribbon')

# 월드맵 섬 10개 (크림 바탕 그대로)
ui2 = Image.open(f'{SRC}/UI2.PNG')
ISL = [(1068, 176, 1216, 290), (1222, 184, 1358, 284), (1362, 176, 1506, 284), (1118, 334, 1282, 446), (1298, 334, 1468, 444),
       (1062, 492, 1212, 600), (1214, 492, 1362, 600), (1368, 492, 1508, 600), (1128, 642, 1282, 752), (1292, 642, 1446, 752)]
for i, box in enumerate(ISL):
    save(ui2.crop(box), f'island-{i + 1}')
# 장 지도 배경 (숲·화산) — 칸 글자는 흐리게
for n, box in [('map-forest', (8, 160, 500, 770)), ('map-volcano', (522, 160, 1014, 770))]:
    save(ui2.crop(box).filter(ImageFilter.GaussianBlur(3)), n, 82)
save(ui2.crop((8, 160, 500, 770)).filter(ImageFilter.GaussianBlur(16)), 'bg-forest', 70)

# 처음 화면 그림, 주인공 카드 그림
ui11 = Image.open(f'{SRC}/UI11.PNG')
save(ui11.crop((0, 0, 760, 760)), 'title-art', 86)
save(ui11.crop((844, 238, 1138, 536)), 'hero-aren', 88)
save(ui11.crop((1180, 238, 1474, 536)), 'hero-lia', 88)
save(ui11.crop((905, 262, 1065, 422)), 'face-aren', 88)
save(ui11.crop((1255, 262, 1415, 422)), 'face-lia', 88)
# 메뉴 배경: 숲을 흐리게
ui7 = Image.open(f'{SRC}/UI7.PNG')
# 상점 노점
ui10 = Image.open(f'{SRC}/UI10.PNG')
save(ui10.crop((150, 80, 880, 395)), 'shop-stall', 86)
# 패배 스피릿
ui7b = ui7.crop((1165, 285, 1400, 445))
save(ui7b, 'lose-spirit', 86)
print('ok', len(os.listdir(OUT)))
