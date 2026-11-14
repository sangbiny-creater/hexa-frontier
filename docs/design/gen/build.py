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
sections.append(("howto", "사용법", """**모든 캐릭터는 게임 전용 스프라이트로 새로 그립니다.** 기존 S0x 시트는 바닥에 헥사가 붙어 있어 이동할 때 헥사 모양이 바뀌고 깨지므로 **하나도 쓰지 않고, 레퍼런스로도 첨부하지 않습니다.**

- **스프라이트 규칙**: 투명 배경, 받침·헥사·그림자·글자 없음, 모든 칸 같은 카메라·같은 바닥선(칸 높이 88%). 헥사 바닥과 그림자는 게임이 그립니다. 그래서 어떤 지형 위에서도, 이동 중에도 모양이 변하지 않습니다.
- **일관성 순서**: ① 속성 라인업 1장(예: 물)을 먼저 받아 화풍·비율을 정함 → ② 마음에 드는 라인업과 **처음 승인한 스프라이트 시트 1장**을 이후 모든 생성에 첨부("첨부 이미지와 같은 화풍·같은 크기·같은 바닥선").
- **초상**: 스프라이트 시트가 확정되면 그 시트를 첨부하고 '초상 세트' 프롬프트(하나로 공용)를 붙여 넣으면 됩니다.
- **주인공**: `C01.png`(아렌), `C02.png`(리아)는 얼굴·옷·색만 참고하고 받침 없이 다시 그립니다.
- **UI 단계**: 앞 단계에서 고른 이미지를 다음 단계에 첨부하고, 프롬프트의 `{choice}` 자리에 고른 안(예: "B 헥사 대륙 지도")을 적어 주세요.
- 모든 프롬프트 맨 위의 **[STYLE BIBLE]** 블록은 지우지 말고 그대로 두세요.
- 글자: 게임 안의 버튼·패널·배너 원본은 **글자 없이**, 화면 시안(UI 1~11단계)만 한글을 넣어 받습니다.
- 투명 배경이 안 나오면 GPT에 "배경을 투명하게(PNG 알파) 다시"라고 한 번 더 요청하세요. 그래도 안 되면 단색 배경(#FF00FF)으로 받아도 제가 지웁니다.

**받은 파일 이름 (이렇게 저장해 주시면 바로 잘라서 넣습니다)**

| 종류 | 이름 규칙 | 예 |
|---|---|---|
| 속성 라인업 | `LINEUP-속성코드` | `LINEUP-W.png` |
| 스피릿 스프라이트 / 초상 | `코드` / `코드-P` | `F-T1.png`, `F-T1-P.png` |
| 주인공 | `C01`, `C02` (+`-P`) | `C01.png`, `C02-P.png` |
| 몬스터 | `MON-속성코드-번호` (+`-P`) | `MON-F-1.png` |
| 중간보스 / 보스 | `MID-판`, `BOSS-판` (+`-P`) | `MID-25.png`, `BOSS-100-P.png` |
| 기술 이펙트 | `FX-이름(-속성)` | `FX-whirl.png`, `FX-blast-fire.png` |
| 지형 타일 | `TILE-장` | `TILE-ch3.png` |
| 전투 요소 | 표의 제목 | `UI-overlay.png` |
| UI 시안 | `UIx-안` | `UI2-A.png` |
""", []))

sections.append(("style", "스타일 바이블", "모든 프롬프트 맨 위에 들어가는 공통 블록입니다. 화풍·빛·카메라·**받침 없는 투명 스프라이트 규칙**을 고정해서 60종 스피릿, 몬스터, 보스, UI가 한 게임처럼 보이게 합니다.", [
    dict(title="공통 STYLE BIBLE", note="모든 프롬프트에 이미 포함되어 있어요. 따로 쓸 때만 복사.", prompt=STYLE),
    dict(title="초상 세트 (공용) — 스피릿 Lv.1/10/25", note="확정된 스프라이트 시트를 첨부하고 그대로 붙여 넣기 → `코드-P.png`", prompt=P(PORTRAIT.format(a="Lv.1 form", b="Lv.10 form", c="Lv.25 form"))),
    dict(title="초상 세트 (공용) — 몬스터·보스·주인공", note="몬스터: 일반/정예/정예 화남 · 보스·주인공: 평소/화남(진지)/웃음", prompt=P(PORTRAIT.format(a="calm / normal", b="angry or serious (elite version for monsters)", c="happy or enraged (pick what fits the character)"))),
]))

# 2 스피릿
ROLE_KIND = {("근딜", "p"): "PHYSICAL MELEE DEALER", ("근딜", "m"): "MAGIC MELEE DEALER", ("원딜", "p"): "PHYSICAL RANGED DEALER", ("원딜", "m"): "MAGIC RANGED DEALER"}
KIND_KO = {"p": "물리", "m": "마법"}
rows = ["| 코드 | 속성 | 역할 | 이름 | 모습 (기본형) |", "|---|---|---|---|---|"]
for el, role, code, ko, en, kind, atk, desc in SPIRITS:
    r = f"{role}({KIND_KO[kind]})" if role in ("근딜", "원딜") else role
    rows.append(f"| {code} | {el} | {r} | {ko} ({en}) | {desc.split(';')[0]} |")
lineups, sp_items = [], []
for el in ["물", "불", "숲", "대지", "바람"]:
    lst = [s for s in SPIRITS if s[0] == el]
    text = "\n".join(f"{i + 1}. {s[2]} {s[4]} ({s[1]}): {s[7].split(';')[0]}" for i, s in enumerate(lst))
    lineups.append(dict(title=f"LINEUP-{EL_CODE[el]} · {el} 속성 12종 라인업", note="물 라인업부터 받아서 화풍·비율을 먼저 확정하세요" if el == "물" else "", prompt=P(ELEMENT_LINEUP.format(el_en=EL_EN[el], sample=lst[0][2], lst=text))))
for el, role, code, ko, en, kind, atk, desc in SPIRITS:
    role_en = ROLE_KIND.get((role, kind), ROLE_EN[role])
    sp_items.append(dict(title=f"{code} · {ko} ({en}) — {el} {role}", note="", prompt=P(SPIRIT_SHEET.format(attack=atk, role_hint=ROLE_HINT[role], code=code, en=en, ko=ko, el=EL_EN[el], role_en=role_en, desc=desc))))
sections.append(("spirits", "스피릿 60종 (전부 새로)", """속성마다 **탱커 3 · 근딜 3 · 원딜 3 · 힐러 1 · 서포터 2 = 12종**, 5속성 × 12 = **60종 모두 새 디자인**입니다. 기존 시트는 재사용하지 않습니다.
모두 동물·짐승·원소 생물이고 마법사형은 없습니다. 한 장 = **스프라이트 시트**(진화 3단계 × 대기·공격·피격·쓰러짐 4동작, 투명 배경, 받침 없음). 초상은 확정된 시트를 첨부해 '초상 세트' 공용 프롬프트로 받습니다.
**순서**: 속성 라인업 5장 → 마음에 들면 개별 시트 60장.

""" + "\n".join(rows), lineups + sp_items))

# 2-1 주인공
hero_items = [dict(title=f"{c} · {ko} ({en}) — 주인공", note=f"`{ref}`를 첨부하세요 (얼굴·옷·색만 참고)", prompt=P(HERO_SHEET.format(en=en, ko=ko, ref=ref, attack=atk, skill=sk, desc=d))) for c, ko, en, ref, atk, sk, d in HEROES]
sections.append(("heroes", "주인공 2명", "아렌·리아도 스피릿과 같은 규칙(투명 배경·받침 없음·같은 바닥선)으로 게임 전용 스프라이트를 새로 받습니다.", hero_items))

# 3 몬스터
mon_items = []
for el, lst in MONSTERS.items():
    for i, (ko, en, desc) in enumerate(lst):
        mon_items.append(dict(title=f"MON-{EL_CODE[el]}-{i + 1} · {ko} ({en}) — {el} {MON_ROLES[i]}", note="", prompt=P(MONSTER_SHEET.format(en=en, ko=ko, el=EL_EN[el], role=MON_ROLES[i], desc=desc))))
sections.append(("monsters", "몬스터 30종", """스피릿과 헷갈리지 않게 **'균열체'**로 통일: 몸에 보라색 육각 균열과 균열 수정, 붉은보라 눈빛. 비율은 스피릿과 같은 SD.
속성마다 6역할 — **근접 졸개 · 돌격대 · 방패 · 사수 · 치유체 · 저주체**. 한 장 = 일반·정예 × 대기·공격·피격·쓰러짐 (투명 배경, 받침 없음).""", mon_items))

# 4 보스
boss_items = []
for st, el, ko, en, desc in MIDBOSSES:
    boss_items.append(dict(title=f"MID-{st} · {ko} ({en}) — {st}판 중간보스 · {el}", note="", prompt=P(BOSS_SHEET.format(kind="ELITE MID-BOSS", en=en, ko=ko, stage=st, el=el, desc=desc, extra="ENRAGED IDLE (glowing eyes, aura flaring)"))))
for st, el, ko, en, desc, phase in BOSSES:
    extra = "PHASE 2 IDLE (rift armor broken, crystals blazing)" if st == 100 else "ENRAGED IDLE (glowing eyes, aura flaring)"
    boss_items.append(dict(title=f"BOSS-{st} · {ko} ({en}) — {st}판 {'최종 보스' if st == 100 else '장 보스'} · {el}", note="", prompt=P(BOSS_SHEET.format(kind="FINAL BOSS" if st == 100 else "CHAPTER BOSS", en=en, ko=ko, stage=st, el=el, desc=desc, extra=extra))))
sections.append(("bosses", "중간보스 10 · 보스 10", "5판마다 중간보스(대장), 10판마다 장 보스, 100판은 최종 보스(2단계 모습 포함). 한 장 = 대기·공격·기술·피격·쓰러짐·분노(최종 보스는 2단계). 게임에서는 한 칸을 차지하지만 1.5배 크게 그립니다.", boss_items))

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
sections.append(("battle", "전투 화면 요소 · 헥사", """**헥사**: 캐릭터에서 받침을 없앴으니 바닥은 게임이 그립니다. 장(지역)마다 **살짝 기울어진 2.5D 헥사 타일 세트**(지역 6종 × 지형 8종)로 바닥을 새로 만들고, 캐릭터는 그 위에 발판 링·그림자와 함께 올라갑니다. 그래서 이동해도 헥사 모양이 변하지 않습니다.
그 밖에 범위 표시, 발판 링, 체력 막대, 상태·속성·역할·행동 아이콘, 차례 배너, 숫자 글꼴, 카드·미리보기 틀 — 모두 **글자 없이** 받아 게임이 한글을 얹습니다.""", battle_items))

# 7 UI 단계
ui_items = []
for st in UI_STEPS:
    body = st["body"]
    ui_items.append(dict(title=st["title"], note="결정할 것: " + " · ".join(st["decide"]), prompt=P(UI.format(body=body))))
sections.append(("uiux", "UI·UX 단계별", """한 단계씩 이미지를 받아 보고 결정한 뒤 다음 단계로 갑니다. 앞 단계에서 고른 이미지를 다음 단계에 **첨부**하고 `{choice}`에 고른 안을 적어 주세요.
특히 **2~3단계(원정 = 실제 접속 화면)**는 지금의 100판 목록을 완전히 대체합니다. 하단 탭은 **원정 · 부대 · 도감 · 상점 · 더보기** 5개로 제안합니다.""", ui_items))

# 8 Copilot 에이전트 키트 (D133)
import agent as AG
def _sp(s):
    el, role, code, ko, en, kind, atk, desc = s
    return SPIRIT_SHEET.format(attack=atk, role_hint=ROLE_HINT[role], code=code, en=en, ko=ko, el=EL_EN[el], role_en=ROLE_KIND.get((role, kind), ROLE_EN[role]), desc=desc)
def _lu(el):
    lst = [s for s in SPIRITS if s[0] == el]
    return ELEMENT_LINEUP.format(el_en=EL_EN[el], sample=lst[0][2], lst="\n".join(f"{i + 1}. {s[2]} {s[4]} ({s[1]}): {s[7].split(';')[0]}" for i, s in enumerate(lst)))
def _boss(b, chap):
    if not chap:
        st, el, ko, en, desc = b
        return BOSS_SHEET.format(kind="ELITE MID-BOSS", en=en, ko=ko, stage=st, el=el, desc=desc, extra="ENRAGED IDLE (glowing eyes, aura flaring)")
    st, el, ko, en, desc, ph = b
    return BOSS_SHEET.format(kind="FINAL BOSS" if st == 100 else "CHAPTER BOSS", en=en, ko=ko, stage=st, el=el, desc=desc, extra="PHASE 2 IDLE (rift armor broken, crystals blazing)" if st == 100 else "ENRAGED IDLE (glowing eyes, aura flaring)")
JOBS = AG.build_jobs(
    _sp,
    lambda h: HERO_SHEET.format(en=h[2], ko=h[1], ref=h[3], attack=h[4], skill=h[5], desc=h[6]),
    lambda el, i, m: MONSTER_SHEET.format(en=m[1], ko=m[0], el=EL_EN[el], role=MON_ROLES[i], desc=m[2]),
    _boss, _lu,
    PORTRAIT.format(a="Lv.1 form", b="Lv.10 form", c="Lv.25 form"),
    PORTRAIT.format(a="calm / normal", b="angry or serious (elite version for monsters)", c="happy or enraged (pick what fits the character)"),
    lambda d, c: EFFECT.format(desc=d, color=c),
    lambda bm: TILESET.format(n=bm[2].count(",") + 1, biome=bm[1], tiles=bm[2]),
    lambda st: UI.format(body=st["body"]),
)
KIT = os.path.join(OUT, "copilot-agent")
os.makedirs(KIT, exist_ok=True)
INSTR = AG.instructions(JOBS)
open(os.path.join(KIT, "HEXA_작업목록.txt"), "w", encoding="utf-8").write(AG.queue_text(JOBS))
open(os.path.join(KIT, "지침.txt"), "w", encoding="utf-8").write(INSTR)
open(os.path.join(KIT, "이름_설명_시작문구.txt"), "w", encoding="utf-8").write(f"이름: {AG.NAME}\n\n설명: {AG.DESC}\n\n시작 문구:\n" + "\n".join(f"- {t}: {m}" for t, m in AG.STARTERS))
assert len(INSTR) <= 8000, len(INSTR)
summ = "\n".join(f"| {p} | {a} ~ {b} | {n} |" for p, a, b, n in AG.phase_summary(JOBS))
sections.append(("agent", "Copilot 에이전트", f"""프롬프트를 하나씩 붙여 넣지 않고, **Copilot 에이전트에게 '다음'만 누르면** 작업 목록 순서대로 한 장씩 만들게 하는 방법입니다. 작업 {len(JOBS)}개(초상 포함)가 지식 파일 하나에 들어 있습니다.

**만드는 법 (Microsoft 365 Copilot → 에이전트 만들기 → 구성)**
- **이름·설명**: 아래 첫 카드 복사.
- **지침**: 아래 '지침' 카드 복사해서 붙여 넣기.
- **지식**: `hexa-frontier-v2/docs/design/copilot-agent/HEXA_작업목록.txt` 업로드. 그림 파일도 받아 주면 `C01.png`, `C02.png`, `Tile_Set.png`, `S0x-xxx.png`도 같이 올리기(안 받으면 대화창에 첨부).
- **기능**: '이미지 생성' 켜기.
- **시작 문구**: 아래 카드의 6개.
- 대화에서 **'시작' → '처음부터'**, 그다음은 마음에 들면 **'다음'**, 아니면 **'다시'** 또는 **'수정: …'**.
- 이미지는 답 첫 줄의 **저장 이름**으로 받아서 한 폴더에 모아 주세요. 제가 마젠타 배경을 지우고 잘라서 게임에 넣습니다.

| 단계 | 작업 | 개수 |
|---|---|---|
{summ}""", [
    dict(title="이름 · 설명", note="에이전트 만들기 화면의 이름/설명 칸", prompt=f"이름: {AG.NAME}\n\n설명: {AG.DESC}"),
    dict(title=f"지침 ({len(INSTR)}자)", note="지침 칸에 통째로 붙여 넣기 (8,000자 이하)", prompt=INSTR),
    dict(title="시작 문구 6개", note="제목 / 메시지", prompt="\n".join(f"{t} / {m}" for t, m in AG.STARTERS)),
]))

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
    <p>GPT 이미지용 프롬프트 <span class="count">{total}</span>개 — 스피릿 60종 전부 새로, 주인공 2, 몬스터 30, 보스 20, 이펙트, 전투 요소, UI·UX 12단계, Copilot 에이전트 키트. 각 카드의 [복사]를 눌러 그대로 붙여 넣으세요.</p>
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
