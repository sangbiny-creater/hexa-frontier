# -*- coding: utf-8 -*-
"""Copilot 에이전트 키트 (D133): 지침 + 작업 목록(지식 파일) 생성. build.py가 불러 씀."""
import os
from content import *  # noqa

EL_CODE = {"숲": "F", "불": "Fi", "물": "W", "바람": "Wi", "대지": "E"}
KEY = "solid flat pure magenta #FF00FF background (chroma key, no gradient, no checkerboard)"


def _fix(spec):
    # 생성기가 투명을 못 하면 체크무늬를 그려 버리므로 마젠타 단색으로 받는다 (제가 지움)
    return spec.replace("fully TRANSPARENT background", KEY).replace("TRANSPARENT background", KEY)


def build_jobs(spirit_sheet_fn, hero_fn, mon_fn, boss_fn, lineup_fn, portrait_spirit, portrait_other, fx_fn, tile_fn, ui_fn):
    J = []
    add = lambda phase, name, file, refs, prompt: J.append(dict(phase=phase, name=name, file=file, refs=refs, prompt=_fix(prompt)))
    # 1 라인업
    for el in ["물", "불", "숲", "대지", "바람"]:
        add("1 속성 라인업", f"{el} 속성 12종 라인업", f"LINEUP-{EL_CODE[el]}.png", "C01.png, Tile_Set.png (화풍·색감만)" if el == "물" else "승인된 LINEUP-W.png", lineup_fn(el))
    # 2 주인공
    for h in HEROES:
        add("2 주인공", f"{h[1]} 스프라이트", f"{h[0]}.png", f"{h[3]} (얼굴·머리·옷·색만, 받침 무시)", hero_fn(h))
        add("2 주인공", f"{h[1]} 초상", f"{h[0]}-P.png", f"방금 승인한 {h[0]}.png", portrait_other)
    # 3 스피릿
    for s in SPIRITS:
        el, role, code, ko, en = s[:5]
        add("3 스피릿 60", f"{code} {ko} 스프라이트 ({el} {role})", f"{code}.png", f"승인된 LINEUP-{EL_CODE[el]}.png + 처음 승인한 스피릿 시트", spirit_sheet_fn(s))
        add("3 스피릿 60", f"{code} {ko} 초상", f"{code}-P.png", f"방금 승인한 {code}.png", portrait_spirit)
    # 4 몬스터
    for el, lst in MONSTERS.items():
        for i, m in enumerate(lst):
            code = f"MON-{EL_CODE[el]}-{i + 1}"
            add("4 몬스터 30", f"{code} {m[0]} ({el} {MON_ROLES[i]})", f"{code}.png", "처음 승인한 스피릿 시트 (화풍·크기)", mon_fn(el, i, m))
            add("4 몬스터 30", f"{code} {m[0]} 초상", f"{code}-P.png", f"방금 승인한 {code}.png", portrait_other)
    # 5 보스
    for b in MIDBOSSES:
        add("5 보스 20", f"MID-{b[0]} {b[2]} (중간보스)", f"MID-{b[0]}.png", "승인된 몬스터 시트 1장", boss_fn(b, False))
        add("5 보스 20", f"MID-{b[0]} {b[2]} 초상", f"MID-{b[0]}-P.png", f"방금 승인한 MID-{b[0]}.png", portrait_other)
    for b in BOSSES:
        add("5 보스 20", f"BOSS-{b[0]} {b[2]}", f"BOSS-{b[0]}.png", "승인된 몬스터 시트 1장", boss_fn(b, True))
        add("5 보스 20", f"BOSS-{b[0]} {b[2]} 초상", f"BOSS-{b[0]}-P.png", f"방금 승인한 BOSS-{b[0]}.png", portrait_other)
    # 6 지형 타일
    for i, bm in enumerate(BIOMES):
        add("6 지형 타일", f"타일 · {bm[0]}", f"TILE-{i + 1}.png", "Tile_Set.png (질감·색감만, 배치는 프롬프트대로)", tile_fn(bm))
    # 7 전투 요소
    for i, (name, desc) in enumerate(BATTLE_ELEMENTS):
        add("7 전투 UI 요소", name, f"UI-{i + 1:02d}.png", "승인된 TILE 1장", desc)
    # 8 이펙트
    for ko, key, desc, color in SKILLS:
        add("8 기술 이펙트", f"{ko} ({key})", f"FX-{key}.png" + (" (속성별 -water/-fire/-forest/-earth/-wind 5장)" if "×5" in ko else ""), "없음", fx_fn(desc, color))
    # 9 UI 단계
    for i, st in enumerate(UI_STEPS):
        add("9 UI·UX 단계 (결정 필요)", st["title"], f"UI{i + 1}.png", "앞 단계에서 고른 시안" + (", C01.png, C02.png" if st["id"] == "ui11" else ""), ui_fn(st) + "\n결정할 것: " + " · ".join(st["decide"]))
    for n, j in enumerate(J, 1):
        j["id"] = f"JOB-{n:03d}"
    return J


def queue_text(jobs):
    out = ["HEXA FRONTIER 이미지 작업 목록 (에이전트 지식 파일)",
           f"총 {len(jobs)}개 작업. 순서대로 진행. 각 작업 = JOB 번호, 단계, 이름, 저장 파일 이름, 첨부할 레퍼런스, 프롬프트.",
           "모든 작업의 프롬프트 앞에는 아래 STYLE BIBLE을 그대로 붙여서 이미지를 만든다.", "",
           "===== STYLE BIBLE =====", _fix(STYLE), "",
           "===== 배경 규칙 (STYLE BIBLE보다 우선) =====",
           f"UI 화면 시안(9단계)을 뺀 모든 작업은 투명 대신 {KEY}으로 만든다. 마젠타는 캐릭터·이펙트에 쓰지 않는다. 체크무늬(가짜 투명)를 그리지 않는다.", ""]
    phase = None
    for j in jobs:
        if j["phase"] != phase:
            phase = j["phase"]
            out += [f"########## 단계 {phase} ##########", ""]
        out += [f"===== {j['id']} =====", f"{j['id']} | 단계: {j['phase']} | 이름: {j['name']}", f"저장 파일 이름: {j['file']}", f"첨부 레퍼런스: {j['refs']}", f"{j['id']} 프롬프트:", j["prompt"], f"===== {j['id']} 끝 =====", ""]
    return "\n".join(out)


def phase_summary(jobs):
    rows, cur = [], None
    for j in jobs:
        if j["phase"] != cur:
            cur = j["phase"]
            rows.append([cur, j["id"], j["id"], 0])
        rows[-1][2] = j["id"]
        rows[-1][3] += 1
    return rows


NAME = "헥사 프론티어 아트 공방"
DESC = "HEXA FRONTIER(헥사 타일 턴제 전술 RPG)의 캐릭터·몬스터·보스·타일·이펙트·UI 이미지를 작업 목록 순서대로 한 장씩 만들어 주는 에이전트. '다음'만 누르면 다음 이미지를 만든다."


def instructions(jobs):
    summ = "\n".join(f"- {p}: {a} ~ {b} ({n}개)" for p, a, b, n in phase_summary(jobs))
    return f"""너는 "헥사 프론티어 아트 공방"이다. 모바일 헥사 턴제 전술 RPG "HEXA FRONTIER"의 게임 이미지를 작업 목록 순서대로 한 장씩 만든다. 사용자와는 항상 짧은 한국어로 말한다.

# 자료
- 지식 파일 "HEXA_작업목록.txt"에 STYLE BIBLE, 배경 규칙, JOB-001 ~ JOB-{len(jobs):03d} 작업이 있다. 각 작업에 저장 파일 이름, 첨부 레퍼런스, 프롬프트가 있다. 작업 내용은 반드시 이 파일에서 "JOB-번호"로 찾아서 쓰고, 지어내지 않는다.
- 레퍼런스 그림(사용자가 올림): C01.png(남자 주인공 아렌), C02.png(여자 주인공 리아), Tile_Set.png(지형 타일 색감), S0x-xxx.png(예전 스피릿 시트).
- 단계:
{summ}

# 이미지 만들 때 규칙 (가장 중요)
1. 프롬프트 = STYLE BIBLE + 배경 규칙 + 그 JOB의 프롬프트를 그대로. 요약하거나 빼먹지 않는다. 사용자가 "수정:"으로 준 내용만 덧붙인다.
2. 캐릭터는 게임 전용 스프라이트다: 받침·헥사 타일·땅·풀밭·그림자·글자·칸 테두리 없음. 배경은 마젠타 #FF00FF 단색(UI 화면 시안만 예외). 체크무늬를 그리지 않는다.
3. 예전 S0x 시트와 C01/C02에는 캐릭터 발밑에 헥사 타일이 있다. 그것은 절대 따라 그리지 않는다. S0x는 화풍·선·색감 참고용일 뿐이고, 생물 디자인을 베끼지 않는다(스피릿 60종은 전부 새 디자인). C01/C02는 얼굴·머리·옷·색만 참고한다.
4. 일관성: 같은 대화에서 이미 승인된 이미지(특히 LINEUP과 처음 승인한 스피릿 시트)와 같은 화풍·같은 선 굵기·같은 크기·같은 바닥선으로 그린다. 첨부 레퍼런스 칸에 적힌 그림이 대화에 없으면 사용자에게 올려 달라고 한 줄로 부탁한다.
5. 한 번 답할 때 이미지 한 장(한 JOB)만 만든다. "속성별 5장" 작업은 water부터 한 장씩, "다음"마다 다음 속성으로 간다.

# 대화 흐름
- "시작": 단계 목록을 짧게 보여 주고 "어디서부터 할까요? (처음부터 = JOB-001)"라고 묻는다. 사용자가 "처음부터"나 JOB 번호·코드(예: W-T1, MON-F-3, UI2)·단계 이름을 말하면 그 작업부터 한다.
- 이미지를 만든 답의 형식(항상 이대로):
  첫 줄: "JOB-012/{len(jobs)} · 3 스피릿 60 · W-T1 터스크월러스 스프라이트"
  둘째 줄: "저장 이름: W-T1.png"
  (이미지)
  마지막 줄: "승인하면 '다음', 다시 그리면 '다시', 고칠 점은 '수정: …'"
- "다음" 또는 "승인": 현재 작업을 끝난 것으로 보고 바로 다음 JOB 이미지를 만든다(되묻지 않는다).
- "다시": 같은 JOB을 조금 다른 구도로 다시 만든다.
- "수정: …": 같은 JOB을 그 요청만 반영해 다시 만든다.
- "건너뛰기": 이미지 없이 다음 JOB으로 간다.
- "JOB-050" 또는 코드: 그 작업으로 이동해 만든다.
- "진행": 지금 JOB 번호, 단계별 남은 개수를 보여 준다.
- 9단계(UI)는 시안을 보고 사용자가 고르는 단계다. 이미지 뒤에 그 JOB의 "결정할 것"을 보여 주고, 다음 UI 작업 프롬프트의 {{choice}}에 사용자가 고른 안을 넣는다.
- 새 대화에서 시작하면 이전 진행을 모르므로 "마지막으로 승인한 JOB 번호나 코드를 알려 주세요"라고 묻는다.

# 금지
- 사람 마법사형 캐릭터(로브, 고깔모자, 지팡이 든 생물)를 스피릿으로 그리지 않는다.
- 다른 게임의 캐릭터·로고를 따라 그리지 않는다. 워터마크 금지.
- 이미지 안 글자는 UI 시안(9단계)만 한글로 넣고, 나머지는 넣지 않는다(라인업의 작은 코드 표기는 허용)."""


STARTERS = [
    ("시작", "시작"),
    ("처음부터", "처음부터 해 줘 (JOB-001 물 속성 라인업)"),
    ("다음", "다음"),
    ("스피릿부터", "3 스피릿 60 단계의 첫 작업부터 해 줘"),
    ("UI 시안부터", "9 UI·UX 단계의 첫 작업(비주얼 방향 3안)부터 해 줘"),
    ("진행 상황", "진행"),
]
