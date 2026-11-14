# -*- coding: utf-8 -*-
"""content.py → docs/design/GPT_프롬프트.md + docs/design/gpt-prompts.html"""
import html, json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from content import *  # noqa

OUT = os.path.join(os.path.dirname(__file__), '..')
EL_CODE = {"숲": "F", "불": "Fi", "물": "W", "바람": "Wi", "대지": "E"}
ROLE_CODE = {"탱커": "T", "근딜": "M", "원딜": "R", "힐러": "H", "서포터": "S"}

sections = []  # (id, title, intro_md, [items]) item = dict(title, note, prompt) or dict(table=...)

def P(spec):
    return STYLE + "\n\n" + spec

# 0 사용법
sections.append(("howto", "사용법", """GPT(이미지 생성)에 **프롬프트를 그대로 붙여 넣기 전에 레퍼런스를 함께 첨부**하세요. 일관성은 레퍼런스가 거의 다 정합니다.

- **스피릿·몬스터·보스**: 기존 시트 2~3장(예: `S03-T01.png`, `S02-M01.png`, `S04-R01.png`)을 함께 첨부 → "첨부 시트와 같은 화풍·같은 배치로".
- **주인공이 나오는 화면**: `C01.png`(아렌), `C02.png`(리아) 첨부.
- **UI 단계**: 앞 단계에서 고른 이미지를 다음 단계에 첨부하고, 프롬프트의 `{choice}` 자리에 고른 안(예: "B 헥사 대륙 지도")을 적어 주세요.
- 모든 프롬프트 맨 위의 **[STYLE BIBLE]** 블록은 지우지 말고 그대로 두세요 (같은 대화 안에서도 매번 넣는 게 일관성에 좋습니다).
- 글자: 게임 안의 버튼·패널·배너 원본은 **글자 없이** 받고(게임이 한글을 얹음), 화면 시안(UI 1~11단계)만 한글을 넣어 받습니다. GPT가 한글을 틀리게 쓰면 시안 판단용으로만 보시면 됩니다.
- 크기: 시트·세트는 1536×1024(가로), 화면 시안은 1024×1536(세로). 투명 배경은 "TRANSPARENT background"가 들어간 것만.

**받은 파일 이름 (이렇게 저장해 주시면 바로 잘라서 넣습니다)**

| 종류 | 이름 규칙 | 예 |
|---|---|---|
| 새 스피릿 시트 | 표의 코드 | `F-T3.png`, `Fi-S1.png` |
| 몬스터 시트 | `MON-속성코드-번호` | `MON-F-1.png` (숲 1번) |
| 중간보스 / 보스 | `MID-판`, `BOSS-판` | `MID-25.png`, `BOSS-100.png` |
| 기술 이펙트 | `FX-이름(-속성)` | `FX-whirl.png`, `FX-blast-fire.png` |
| 지형 타일 | `TILE-장` | `TILE-ch3.png` |
| 전투 요소 | 표의 제목 | `UI-overlay.png` |
| UI 시안 | `UIx-안` | `UI2-A.png` |
""", []))

sections.append(("style", "스타일 바이블", "모든 프롬프트 맨 위에 들어가는 공통 블록입니다. 색·빛·비율·배경을 고정해서 60종 스피릿, 몬스터, UI가 한 게임처럼 보이게 합니다.", [dict(title="공통 STYLE BIBLE", note="모든 프롬프트에 이미 포함되어 있어요. 따로 쓸 때만 복사.", prompt=STYLE)]))

# 2 스피릿
rows = ["| 코드 | 속성 | 역할 | 이름 | 그림 |", "|---|---|---|---|---|"]
for el, role, code, ko, en, src, new in SPIRITS:
    rows.append(f"| {code} | {el} | {role} | {ko} ({en}) | {'🆕 새로 만들기' if new else '기존 ' + src.split(' ')[0]}{' · 확인 필요' if 'check' in src else ''} |")
removed = "\n".join(f"- ~~{c} {n}~~ → {r}" for c, n, r in REMOVED)
new_items = []
for el, role, code, ko, en, src, new in SPIRITS:
    if not new:
        continue
    n = {"F-T3": 3, "F-R2": 2, "F-R3": 3, "F-S2": 2}.get(code, int(code[-1]))
    badge = f"{EL_EN[el]} {ROLE_EN[role]} {n}"
    new_items.append(dict(title=f"{code} · {ko} ({en}) — {el} {role}", note="", prompt=P(SPIRIT_SHEET.format(badge=badge, en=en, epithet="(invent a short epithet)", ko=ko, desc=src))))
cnt_new = sum(1 for s in SPIRITS if s[6])
sections.append(("spirits", "스피릿 60종", f"""속성마다 **탱커 3 · 근딜 3 · 원딜 3 · 힐러 1 · 서포터 2 = 12종**, 5속성 × 12 = **60종**.
기존 레퍼런스 시트 중 생물 디자인은 그대로 쓰고({60 - cnt_new}종), 마법사처럼 보이는 캐릭터는 모두 빼고 동물·짐승형으로 새로 만듭니다(**새로 만들 {cnt_new}종**).

**뺀 마법사형 (다시 만듦)**
{removed}

'확인 필요'는 시트를 다시 보고 마법사 느낌이면 같은 방식으로 새로 만들 후보입니다.

""" + "\n".join(rows), new_items))

# 3 몬스터
mon_items = []
for el, lst in MONSTERS.items():
    for i, (ko, en, desc) in enumerate(lst):
        mon_items.append(dict(title=f"MON-{EL_CODE[el]}-{i + 1} · {ko} ({en}) — {el} {MON_ROLES[i]}", note="", prompt=P(MONSTER_SHEET.format(badge=f"RIFT {EL_EN[el]} {i + 1}", en=en, ko=ko, el=EL_EN[el], role=MON_ROLES[i], desc=desc))))
sections.append(("monsters", "몬스터 30종", """스피릿과 헷갈리지 않게 **'균열체'**로 통일: 몸에 보라색 육각 균열과 균열 수정, 붉은보라 눈빛. 비율은 스피릿과 같은 SD.
속성마다 6역할 — **근접 졸개 · 돌격대 · 방패 · 사수 · 치유체 · 저주체**. 시트에 일반·정예(대장) 두 모습을 함께 받습니다.""", mon_items))

# 4 보스
boss_items = []
for st, el, ko, en, desc in MIDBOSSES:
    boss_items.append(dict(title=f"MID-{st} · {ko} ({en}) — {st}판 중간보스 · {el}", note="", prompt=P(BOSS_SHEET.format(kind="ELITE (MID-BOSS)", badge=f"ELITE · STAGE {st}", en=en, ko=ko, stage=st, el=el, desc=desc, phase=""))))
for st, el, ko, en, desc, phase in BOSSES:
    boss_items.append(dict(title=f"BOSS-{st} · {ko} ({en}) — {st}판 {'최종 보스' if st == 100 else '장 보스'} · {el}", note="", prompt=P(BOSS_SHEET.format(kind="FINAL BOSS" if st == 100 else "CHAPTER BOSS", badge=f"{'FINAL' if st == 100 else 'BOSS'} · STAGE {st}", en=en, ko=ko, stage=st, el=el, desc=desc, phase=phase))))
sections.append(("bosses", "중간보스 10 · 보스 10", "5판마다 중간보스(대장), 10판마다 장 보스, 100판은 최종 보스(2단계 모습 포함). 게임에서는 한 칸을 차지하지만 1.5배 크게 그립니다.", boss_items))

# 5 이펙트
fx_items = []
for ko, key, desc, color in SKILLS:
    fx_items.append(dict(title=f"FX-{key} · {ko}", note="속성별 5장은 같은 프롬프트에서 속성만 바꿔 5번 생성" if "×5" in ko else "", prompt=P(EFFECT.format(desc=desc, color=color))))
sections.append(("effects", "기술 이펙트", "8프레임(4×2) 스프라이트 시트, 투명 배경. 기술 16종 + 공통 효과(타격·치명타·기절·레벨업·쓰러짐·진화). 속성 기술 3종은 속성마다 한 장씩.", fx_items))

# 6 전투 요소
battle_items = []
for i, (name, look, tiles) in enumerate(BIOMES):
    n = tiles.count(",") + 1
    battle_items.append(dict(title=f"TILE · {name}", note="", prompt=P(TILESET.format(n=n, biome=look, tiles=tiles))))
for name, desc in BATTLE_ELEMENTS:
    battle_items.append(dict(title=f"UI · {name}", note="", prompt=P(desc)))
sections.append(("battle", "전투 화면 요소 · 헥사", """**헥사 제안**: 지금 전장 바닥은 평평한 단색 육각형이고, 스피릿은 자기 시트의 입체(아이소메트릭) 헥사 위에 서 있어서 바닥과 유닛 받침의 시점이 다릅니다. 장(지역)마다 **살짝 기울어진 2.5D 헥사 타일 세트**를 새로 만들어 바닥을 바꾸는 것을 추천합니다(유닛 받침과 같은 질감·두께). 지역 6종 × 지형 8종.
그 밖에 범위 표시, 발판 링, 체력 막대, 상태·속성·역할·행동 아이콘, 차례 배너, 숫자 글꼴, 카드·미리보기 틀 — 모두 **글자 없이** 받아 게임이 한글을 얹습니다.""", battle_items))

# 7 UI 단계
ui_items = []
for st in UI_STEPS:
    body = st["body"]
    ui_items.append(dict(title=st["title"], note="결정할 것: " + " · ".join(st["decide"]), prompt=P(UI.format(body=body))))
sections.append(("uiux", "UI·UX 단계별", """한 단계씩 이미지를 받아 보고 결정한 뒤 다음 단계로 갑니다. 앞 단계에서 고른 이미지를 다음 단계에 **첨부**하고 `{choice}`에 고른 안을 적어 주세요.
특히 **2~3단계(원정 = 실제 접속 화면)**는 지금의 100판 목록을 완전히 대체합니다. 하단 탭은 **원정 · 부대 · 도감 · 상점 · 더보기** 5개로 제안합니다.""", ui_items))

# ── 마크다운 ──
md = ["# HEXA FRONTIER 디자인 · GPT 이미지 프롬프트 (D127)", "", "content.py에서 만들어짐 — 고칠 때는 `docs/design/gen/content.py`를 고치고 `python3 docs/design/gen/build.py`.", ""]
for sid, title, intro, items in sections:
    md += [f"## {title}", "", intro, ""]
    for it in items:
        md += [f"### {it['title']}", ""]
        if it.get("note"):
            md += [f"> {it['note']}", ""]
        md += ["```", it["prompt"], "```", ""]
open(os.path.join(OUT, "GPT_프롬프트.md"), "w", encoding="utf-8").write("\n".join(md))

# ── HTML ──
def md_inline(s):
    import re
    s = html.escape(s)
    s = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", s)
    s = re.sub(r"~~(.+?)~~", r"<del>\1</del>", s)
    s = re.sub(r"`(.+?)`", r"<code>\1</code>", s)
    return s

def md_block(text):
    out, table, lst = [], [], []
    def flush():
        nonlocal table, lst
        if table:
            head = [c.strip() for c in table[0].strip('|').split('|')]
            body = [[c.strip() for c in r.strip('|').split('|')] for r in table[2:]]
            out.append('<div class="tbl"><table><thead><tr>' + ''.join(f'<th>{md_inline(h)}</th>' for h in head) + '</tr></thead><tbody>' + ''.join('<tr>' + ''.join(f'<td>{md_inline(c)}</td>' for c in r) + '</tr>' for r in body) + '</tbody></table></div>')
            table = []
        if lst:
            out.append('<ul>' + ''.join(f'<li>{md_inline(x)}</li>' for x in lst) + '</ul>')
            lst = []
    for line in text.split("\n"):
        if line.startswith("|"):
            if lst: flush()
            table.append(line)
        elif line.startswith("- "):
            if table: flush()
            lst.append(line[2:])
        else:
            flush()
            if line.strip():
                out.append(f"<p>{md_inline(line)}</p>")
    flush()
    return "\n".join(out)

total = sum(len(s[3]) for s in sections)
nav = "".join(f'<a href="#{sid}" class="chip">{html.escape(t)}<span>{len(items) if items else ""}</span></a>' for sid, t, _, items in sections)
body = []
for sid, title, intro, items in sections:
    body.append(f'<section id="{sid}"><h2>{html.escape(title)}</h2><div class="intro">{md_block(intro)}</div>')
    for i, it in enumerate(items):
        pid = f"{sid}-{i}"
        note = f'<p class="note">{md_inline(it["note"])}</p>' if it.get("note") else ""
        body.append(f'''<article class="card" id="{pid}"><header><h3>{html.escape(it["title"])}</h3><button class="copy" data-target="t-{pid}" type="button">복사</button></header>{note}<details><summary>프롬프트 보기</summary><pre id="t-{pid}">{html.escape(it["prompt"])}</pre></details></article>''')
    body.append("</section>")

page = f'''<title>헥사 프론티어 프롬프트 북</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;600;700&family=IBM+Plex+Mono:wght@400&family=Gowun+Batang:wght@700&display=swap">
<style>
/* 레이아웃: 위에 장 이동 칩, 아래로 섹션별 프롬프트 카드(복사 버튼 + 펼치기) — 게임의 남색·금색·양피지 톤을 빌려 옴 */
:root {{
  --bg: #f4efe3; --panel: #fffaf0; --ink: #1d2433; --muted: #5f6577; --line: #e2d7bd;
  --navy: #16233b; --gold: #a8812f; --gold-soft: #f0e2bd; --code: #f7f1e2;
  --display: "Gowun Batang", "Nanum Myeongjo", serif;
  --body: "IBM Plex Sans KR", "Apple SD Gothic Neo", "Noto Sans KR", system-ui, sans-serif;
  --mono: "IBM Plex Mono", ui-monospace, Menlo, monospace;
}}
@media (prefers-color-scheme: dark) {{ :root:not([data-theme="light"]) {{ --bg: #0f1726; --panel: #16223a; --ink: #ece6d6; --muted: #a3a9b8; --line: #2a3a58; --navy: #0b1220; --gold: #d9b45c; --gold-soft: #2b2a24; --code: #0f1a2e; color-scheme: dark; }} }}
:root[data-theme="dark"] {{ --bg: #0f1726; --panel: #16223a; --ink: #ece6d6; --muted: #a3a9b8; --line: #2a3a58; --navy: #0b1220; --gold: #d9b45c; --gold-soft: #2b2a24; --code: #0f1a2e; color-scheme: dark; }}
body {{ background: var(--bg); color: var(--ink); font-family: var(--body); line-height: 1.6; }}
.wrap {{ max-width: 860px; margin: 0 auto; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); padding-block: 28px 64px; }}
.top {{ display: grid; gap: 6px; padding-block: 8px 18px; border-bottom: 2px solid var(--gold); }}
.eyebrow {{ font-size: 12px; letter-spacing: .12em; color: var(--gold); font-weight: 700; }}
h1 {{ font-family: var(--display); font-size: clamp(26px, 6vw, 38px); margin: 0; text-wrap: balance; }}
.top p {{ margin: 0; color: var(--muted); }}
nav {{ position: sticky; top: env(safe-area-inset-top, 0px); z-index: 5; background: var(--bg); display: flex; gap: 6px; overflow-x: auto; padding-block: 10px; margin-bottom: 8px; border-bottom: 1px solid var(--line); }}
body::before {{ content: ""; position: fixed; inset: 0 0 auto; height: env(safe-area-inset-top, 0px); z-index: 10; background: var(--bg); }}
.chip {{ flex: none; display: inline-flex; gap: 6px; align-items: center; padding: 6px 12px; border-radius: 999px; border: 1px solid var(--line); background: var(--panel); color: var(--ink); text-decoration: none; font-size: 13px; font-weight: 600; }}
.chip span {{ color: var(--gold); font-variant-numeric: tabular-nums; }}
.chip:focus-visible, .copy:focus-visible, summary:focus-visible {{ outline: 2px solid var(--gold); outline-offset: 2px; }}
section {{ padding-top: 22px; display: grid; gap: 10px; }}
h2 {{ font-family: var(--display); font-size: 24px; margin: 0; padding-bottom: 4px; border-bottom: 1px solid var(--line); }}
.intro {{ display: grid; gap: 6px; color: var(--ink); }}
.intro p {{ margin: 0; }}
.intro ul {{ margin: 0; padding-left: 20px; }}
.tbl {{ overflow-x: auto; border: 1px solid var(--line); border-radius: 10px; background: var(--panel); }}
table {{ border-collapse: collapse; width: 100%; font-size: 13px; }}
th, td {{ text-align: left; padding: 7px 10px; border-bottom: 1px solid var(--line); white-space: nowrap; }}
th {{ background: var(--gold-soft); font-weight: 700; }}
code {{ font-family: var(--mono); font-size: .9em; background: var(--code); padding: 1px 5px; border-radius: 4px; }}
.card {{ background: var(--panel); border: 1px solid var(--line); border-radius: 12px; padding: 12px 14px; display: grid; gap: 6px; min-width: 0; }}
.card header {{ display: flex; gap: 10px; align-items: flex-start; justify-content: space-between; }}
.card h3 {{ margin: 0; font-size: 15px; font-weight: 700; min-width: 0; }}
.note {{ margin: 0; font-size: 13px; color: var(--gold); font-weight: 600; }}
.copy {{ flex: none; border: 0; border-radius: 8px; padding: 7px 14px; font: 700 13px var(--body); background: var(--navy); color: #f7efd9; cursor: pointer; }}
.copy.done {{ background: var(--gold); color: var(--navy); }}
summary {{ cursor: pointer; font-size: 13px; color: var(--muted); }}
pre {{ margin: 8px 0 0; padding: 12px; border-radius: 8px; background: var(--code); font: 12.5px/1.55 var(--mono); white-space: pre-wrap; word-break: break-word; max-height: 420px; overflow: auto; }}
.count {{ font-variant-numeric: tabular-nums; }}
@media (prefers-reduced-motion: no-preference) {{ .copy {{ transition: background .15s; }} }}
</style>
<div class="wrap">
  <div class="top">
    <div class="eyebrow">HEXA FRONTIER · ART DIRECTION</div>
    <h1>헥사 프론티어 프롬프트 북</h1>
    <p>GPT 이미지용 프롬프트 <span class="count">{total}</span>개 — 스피릿 60종 계획, 몬스터 30, 보스 20, 이펙트, 전투 요소, UI·UX 12단계. 각 카드의 [복사]를 눌러 그대로 붙여 넣으세요.</p>
  </div>
  <nav aria-label="섹션">{nav}</nav>
  {"".join(body)}
</div>
<script>
document.addEventListener('click', async (e) => {{
  const b = e.target.closest('.copy');
  if (!b) return;
  const pre = document.getElementById(b.dataset.target);
  const text = pre.textContent;
  const done = () => {{ b.textContent = '복사됨'; b.classList.add('done'); setTimeout(() => {{ b.textContent = '복사'; b.classList.remove('done'); }}, 1400); }};
  try {{ await navigator.clipboard.writeText(text); done(); }}
  catch {{
    const d = pre.closest('details'); if (d) d.open = true;
    const r = document.createRange(); r.selectNodeContents(pre);
    const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
    b.textContent = '선택됨 · 길게 눌러 복사';
  }}
}});
</script>
'''
open(os.path.join(OUT, "gpt-prompts.html"), "w", encoding="utf-8").write(page)
print("sections", len(sections), "prompts", total)
