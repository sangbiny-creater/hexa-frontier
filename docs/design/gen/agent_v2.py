# -*- coding: utf-8 -*-
"""작업 목록 v2 (D134): 초상 다시 그리기 + 기존(old) 스피릿 37종 게임 스프라이트 + UI 2~12단계(1안 '탐험의 숲' 적용)."""
import os
from content import STYLE, SPRITE_GRID, ROLE_HINT, EL_EN
from agent import _fix, KEY

# ── 1. 초상 다시 그리기 ──
PORTRAIT_FIX = """Redo the PORTRAIT SET for the HEXA FRONTIER {kind} shown in the ATTACHED SPRITE SHEET ({file}). The previous portrait was WRONG: {problem}
ANATOMY LOCK (most important): copy the body plan exactly from the sprite sheet — {anatomy}. Do NOT give it a human-like chest, shoulders, neck, arms or bust pose. Do NOT add a nose, ears, hair, fur, feathers or limbs that the sprite does not have.
- Framing: a close-up of the creature's own IDLE pose from the sprite sheet, same body angle (three-quarter, facing the viewer's left), {crop}. Same colors, markings, spikes and rift crystal position as the sprite.
- Canvas 1536x1024, """ + KEY + """, three portraits side by side in an invisible 3-column grid, each inside a 460x460 square: left = {a}, center = {b}, right = {c}.
- No frame, no circle, no text. Nothing touches another portrait."""
MON3 = ("NORMAL version, calm-menacing", "ELITE version, serious", "ELITE version, enraged with open mouth")
BOSS3 = ("calm", "serious", "enraged with open mouth")
QUAD = "head and the front of the horizontal body with both front legs visible, the body continuing out of the frame behind"
FIXES = [
    ("Fi-R1", "spirit", "it does not look like a hedgehog (lynx-like face, pointed ears) and differs from the sprite",
     "a small round HEDGEHOG: short pointed snout with a black button nose, small round eyes, tiny rounded ears half hidden in the quills, a cream round face, flaming quills starting right above the eyes and sweeping backwards, short legs, low round body",
     QUAD, ("Lv.1 form", "Lv.10 form", "Lv.25 form")),
    ("MID-5", "mid-boss", "it was drawn as a human-style bust with an upright chest", "a FOUR-LEGGED boar: long horizontal body, big head with tusks held low and forward, bark-and-thorn mane on the back", QUAD, BOSS3),
    ("MON-E-5", "monster", "it was drawn as a human-style bust with an upright chest", "a FOUR-LEGGED newt: low flat lizard-like body close to the ground, wide flat head, short splayed legs, long tail", QUAD, MON3),
    ("MON-F-2", "monster", "it was drawn as a human-style bust with an upright chest", "a FOUR-LEGGED boar covered in bramble spikes, horizontal body, head low with tusks", QUAD, MON3),
    ("MON-Fi-1", "monster", "it was drawn as a human-style bust with an upright chest", "a FOUR-LEGGED little skink lizard: low horizontal body, short legs, spark tail", QUAD, MON3),
    ("MON-Fi-2", "monster", "it was drawn as a human-style bust with an upright chest", "a FOUR-LEGGED stocky rhino with a flaming horn, horizontal body, head low", QUAD, MON3),
    ("MON-Wi-1", "monster", "it was drawn as a human-style bust with an upright chest", "a FOUR-LEGGED ferret/weasel with sickle tail blades, long low body", QUAD, MON3),
    ("MON-Wi-6", "monster", "it looked like a bird (feathered chest)", "a FOUR-LEGGED fox with FUR (no feathers at all), pointed ears, tornado tail, front legs on the ground", QUAD, MON3),
    ("MID-65", "mid-boss", "it got a mammal nose and a furry chest", "a huge EEL / sea serpent: smooth scaled skin, fish-like snout with NO nose and NO ears, fins and lava spikes along the back, the serpentine body coiling below the head", "head and the first coil of the serpentine body", BOSS3),
    ("MON-W-1", "monster", "it got a separate torso, but this piranha's round fish body IS its head", "a round PIRANHA: one round fish body with the face on the front and stubby legs attached directly under it — no neck, no torso, no arms", "the whole round fish body with the stubby legs at the bottom edge", MON3),
    ("MON-W-2", "monster", "it was drawn as a humanoid", "a small SHARK: horizontal fish body, harpoon-shaped snout, side fins and dorsal fin, no neck, no arms, no chest", "head and the front half of the horizontal fish body with the side fin", MON3),
    ("MON-W-6", "monster", "it was drawn as a humanoid", "an EEL: smooth scaled S-shaped body with fins, no neck, no shoulders, no arms", "head and the upper S-curve of the eel body", MON3),
    ("MON-Wi-4", "monster", "the lower part looked wrong (a fur collar / chest)", "a WASP insect: head with antennae and big eyes, a small hard thorax with thin insect legs and transparent wings, a black-and-teal striped abdomen ending in a stinger — no fur collar, no chest", "head, thorax and the start of the striped abdomen, wings visible", MON3),
]

# ── 2. 기존 스피릿 37종 (사용자가 고른 old 시트 그대로 게임 스프라이트로) ──
OLD_SHEET = """Create the GAME SPRITE SHEET for the HEXA FRONTIER spirit "{en}" shown in the ATTACHED OLD COLLECTION SHEET ({src}). This design is already approved: keep it EXACTLY — same species, face, colors, markings, ornaments{extra}, and the same three evolution forms shown left-to-right in the sheet's EVOLUTION panel. Only the presentation changes.
Ignore everything else on the old sheet: no hex tiles, no ground, no panels, no labels, no text, no skill effects.
""" + _fix(SPRITE_GRID.format(cols=4, rows=3)) + """
- Rows = evolution: row 1 Lv.1 form, row 2 Lv.10 form, row 3 Lv.25 form (exactly as in the old sheet).
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Same size in every column of the row.
- Columns = poses: 1 IDLE, 2 ATTACK ({attack}), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying down, eyes as swirls).
- {role_hint}
Spirit {code} "{en}" ({ko}) — {el} element, {role_en}. Look: {desc}"""
# (old 시트, 새 코드, 속성, 역할, 물리/마법, 한글, 영문, 공격, 모습, 덧붙임)
OLD = [
    ("S01-T01", "F-T2", "숲", "탱커", "p", "그로브골렘", "Ancient Grove Golem", "heavy stone-fist slam", "a mossy rock golem with a small tree growing on its back", ""),
    ("S01-T02", "F-T3", "숲", "탱커", "p", "쏜쉘 가디언", "Thornshell Guardian", "thorn-shell body bash", "a sturdy beast with a leafy thorn shell", ""),
    ("S01-M01", "F-M1", "숲", "근딜", "p", "블레이드워든", "Bladewarden", "leaf-blade slash", "a leaf pup that grows into a wolf-like beast of sharp leaves", ""),
    ("S01-M02", "F-M2", "숲", "근딜", "p", "레이저보어", "Razorboar", "tusk charge", "a sprout boar that grows into a mossy wood-armored boar with big tusks", ""),
    ("S01-M03", "F-M3", "숲", "근딜", "p", "쏜클로", "Thornclaw", "wooden claw swipe", "a bark-and-branch beast with wooden claws", ""),
    ("S01-H01", "F-H1", "숲", "힐러", "m", "블루멜", "Bloomel", "flower blessing (healing)", "a small white-green leaf-eared sprite with flowers that grows into a blossoming deer-like guardian", ""),
    ("S02-T01", "Fi-T2", "불", "탱커", "p", "이그나골렘", "Igna Golem", "lava fist pound", "a volcanic rock golem with glowing lava cracks", ""),
    ("S02-T02", "Fi-T3", "불", "탱커", "p", "플레임벌워크", "Flamebulwark", "flame shield bash", "a fiery armored beast with blazing shield plates", ""),
    ("S02-M01", "Fi-M1", "불", "근딜", "p", "플레임클로", "Flameclaw", "flame claw slash", "a fire kit that grows into a blazing clawed beast", ""),
    ("S02-M02", "Fi-M2", "불", "근딜", "p", "블레이즈혼", "Blazehorn", "blazing horn charge", "an ember calf that grows into a flaming horned warrior beast", ""),
    ("S02-R01", "Fi-R3", "불", "원딜", "p", "엠버윙", "Emberwing", "flame arrow shot", "an ember chick that grows into a phoenix archer bird", ", including its bow if it has one"),
    ("S03-T01", "W-T2", "물", "탱커", "p", "쉘나이트", "Shellknight", "shell bash", "a blue turtle with a coral-crowned shell", ""),
    ("S03-T02", "W-T3", "물", "탱커", "p", "쉘가드", "Shellguard", "claw crush", "a mighty blue crab with a shell like armor", ""),
    ("S03-M01", "W-M1", "물", "근딜", "p", "웨이브팽", "Wavefang", "wave-fin slash", "a swift water beast with blade-like fins", ""),
    ("S03-M02", "W-M2", "물", "근딜", "p", "마리실", "Marisyl", "trident thrust", "a graceful merfolk lancer with a trident", ", including the trident (this humanoid design is approved as-is)"),
    ("S03-M03", "W-M3", "물", "근딜", "p", "코랄스트라이크", "Coralstrike", "coral spear strike", "a reef warrior turtle-beast with coral armor and a spear", ", including its weapon"),
    ("S03-R02", "W-R2", "물", "원딜", "m", "네리타", "Neritha", "bubble burst shot", "a jellyfish creature weaving bubbles", " (approved as-is)"),
    ("S03-H01", "W-H1", "물", "힐러", "m", "아쿠아린", "Aqualyn", "healing water wave", "a gentle water spirit creature that grows into a graceful tide guardian", ""),
    ("S03-R03", "W-S1", "물", "서포터", "m", "아쿠아룬", "Aqualune", "tide song (ally buff)", "a playful water creature conducting currents", ""),
    ("S03-S01", "W-S2", "물", "서포터", "m", "아쿠아드론", "Aquadron", "current blessing (ally buff)", "a mystical manta ray of ocean currents", ""),
    ("S04-T01", "Wi-T2", "바람", "탱커", "p", "클라우드터스크", "Cloudtusk", "tusk slam", "a woolly mammoth calf with cloud fur that grows into a tempest lord", ""),
    ("S04-T02", "Wi-T3", "바람", "탱커", "p", "템페스트터틀", "Tempest Turtle", "spiked shell slam", "a turtle with a wind-spiked shell (named Skywarden on the old sheet; renamed to avoid a duplicate)", ""),
    ("S04-M01", "Wi-M1", "바람", "근딜", "p", "에어로리스", "Aerolith", "wind horn ram", "a white winged ram-like wind beast", ""),
    ("S04-M02", "Wi-M2", "바람", "근딜", "p", "스카이워든", "Skywarden", "storm claw strike", "a white wind beast with feathered wings", ""),
    ("S04-M03", "Wi-M3", "바람", "근딜", "p", "스카이블레이드", "Skyblade", "blade-wing slash", "a swift blue bird-beast with sword-like wings", ""),
    ("S04-R01", "Wi-R2", "바람", "원딜", "p", "에어랄리스", "Aeralis", "wind arrow shot", "a graceful avian archer", ", including its bow"),
    ("S04-R02", "Wi-R3", "바람", "원딜", "m", "에어로라이라", "Aerolyra", "wind song blast", "a singing wind bird", ""),
    ("S04-H01", "Wi-H1", "바람", "힐러", "m", "실피아", "Sylphia", "healing wind", "a gentle fairy sylph", " (this humanoid design is approved as-is)"),
    ("S04-S01", "Wi-S2", "바람", "서포터", "m", "클라우디언", "Cloudavian", "cloud blessing (ally buff)", "a mystical cloud bird", ""),
    ("S05-T01", "E-T2", "대지", "탱커", "p", "테라스톤", "Terrastone", "rock fist slam", "a rock golem bastion", ""),
    ("S05-T02", "E-T3", "대지", "탱커", "p", "듄실드", "Duneshield", "shell bash", "an armored rock-plated tortoise-like beast", ""),
    ("S05-M01", "E-M1", "대지", "근딜", "p", "락터스크", "Rocktusk", "tusk smash", "a rock-plated boar-like beast with tusks", ""),
    ("S05-M02", "E-M2", "대지", "근딜", "p", "듄울프", "Dunewolf", "sand fang slash", "a desert sand wolf", ""),
    ("S05-R01", "E-R3", "대지", "원딜", "p", "페블린", "Pebblin", "rock toss", "a pebble creature with a sprout that grows into a boulder giant", ""),
    ("S05-H01", "E-H1", "대지", "힐러", "m", "테라위스프", "Terrawisp", "earth healing glow", "a round rock sprite with glowing amber light", ""),
    ("S05-S01", "E-S1", "대지", "서포터", "m", "지오맨서", "Geomancer", "floating stone ward (ally buff)", "a small hooded earth creature with floating rocks", " (approved as-is)"),
    ("S05-S02", "E-S2", "대지", "서포터", "m", "테라미믹", "Terramimic", "earth resonance (ally buff)", "a rock creature with crystals", ""),
]
ROLE_EN = {"탱커": "TANKER", "근딜": "MELEE DEALER", "원딜": "RANGED DEALER", "힐러": "HEALER", "서포터": "SUPPORTER"}

# 60종 v2 = old 37 + 이미 만든 새 스피릿 23 (D134)
KEEP_NEW = ["F-T1", "F-R1", "F-R2", "F-R3", "F-S1", "F-S2", "Fi-T1", "Fi-M3", "Fi-R1", "Fi-R2", "Fi-H1", "Fi-S1", "Fi-S2",
            "W-T1", "W-R1", "W-R3", "Wi-T1", "Wi-R1", "Wi-S1", "E-T1", "E-M3", "E-R1", "E-R2"]

# ── 3. UI (1안 '탐험의 숲') ──
UI_STYLE = """[HEXA FRONTIER UI STYLE v2 "탐험의 숲" — the user chose option 01 of UI1. This OVERRIDES the "UI chrome language" line of the STYLE BIBLE: do NOT use deep navy panels.]
Match the attached reference UI-STYLE-01.png exactly:
- The screen is a bright, lush, daylight painted ISOMETRIC DIORAMA world (grassy hex tiles on small cliffs, waterfall, round trees, river) — the world itself is the background, UI floats on top with minimal chrome.
- Top-left: round character portrait in a thin gold ring + "헥사 프론티어" in a heavy rounded Korean game font, white with a dark outline, on a soft dark-green translucent pill.
- Top-right: currency capsules (dark charcoal-green translucent rounded pills, white numbers, gem and coin icons, small "+").
- Right edge: a vertical stack of round dark-green icon buttons with cream line icons (gift with a red dot, mail, calendar).
- Bottom-left: a cream/parchment rounded card with a thin gold border (e.g. "원정 3-12 >").
- Bottom-right: a big glossy golden pill button with a crossed-swords icon and dark-brown text "출전".
- Bottom tab bar: a dark forest-green rounded bar, 5 tabs with cream icons and white labels: 원정, 부대, 스피릿, 도감, 상점. The selected tab has a gold glowing icon on a slightly lighter rounded backing.
- Map nodes: hex tiles with a glowing gold outline, a red flag on the current goal, treasure chests on reward tiles, cute chibi spirits standing on tiles.
- Palette: fresh grass green, deep forest green #2F4A2E for chrome, cream #FFF4D6 cards, gold gradient #F2C14E -> #D9922E buttons, white text with dark outline. Soft and friendly, not dark.
- Popups / sheets: cream parchment cards with a gold border and a dark-green header ribbon, over the dimmed world.
Mobile game UI, KOREAN (Hangul) text only, short and legible, generous touch targets (min 44 px). Realistic content, no lorem ipsum."""
UI2 = [
    ("UI2", "2단계 · 원정 메인 화면 완성 (1안 적용)", ["장마다 바뀌는 디오라마", "노드 상태 표현", "전체 지도 열기 방식"],
     """THREE phone screens (each 9:19.5 portrait) side by side in one 1536x1024 landscape image, all in the "탐험의 숲" style:
(1) Chapter 1 "1장 햇살 숲" main screen exactly like the reference: forest diorama with 10 hex stage nodes along a path (1-1 ~ 1-10), cleared nodes with 3 small stars, the current node 1-7 with a red flag and a chibi spirit, 1-10 boss node bigger with a skull-crown marker, a treasure chest tile.
(2) The same layout for chapter 3 "3장 불꽃 화산": the diorama becomes a volcanic island (ash ground, lava streams, obsidian rocks) while all UI elements stay identical in position and style.
(3) The world map opened from the "원정 3-12 >" card: 10 small floating diorama islands (one per chapter: 숲, 해안, 화산, 고원, 협곡, then 균열의 땅 5), locked ones greyed with a lock, the current one glowing, a cream "닫기" button."""),
    ("UI3", "3단계 · 스테이지 정보 팝업", ["팝업 정보 순서", "상성 경고 표현", "보상 표시"],
     """TWO phone screens side by side (1536x1024 landscape): (1) the chapter-3 main screen with node 3-7 tapped (gold pulse), (2) a cream parchment bottom sheet over the dimmed world: title "3-7 · 마그마 굴", element warning chip "🔥 불 속성 적이 많아요 → 💧 물 스피릿 추천", a row of 6 small enemy portraits with element dots and levels, win condition "적 전멸 · 28턴", first-clear rewards (coins, an item, a growth crystal), and a big golden button "출전 준비"."""),
    ("UI4", "4단계 · 하단 탭 + 아이콘", ["탭 5개 이름·순서", "선택 표현", "알림 점"],
     """A UI sheet (1536x1024 landscape, """ + KEY + """, no phone frame): the dark forest-green bottom tab bar shown 5 times stacked, each with a different tab selected (원정, 부대, 스피릿, 도감, 상점), plus the 10 tab icons (cream inactive / gold active) large on the right, and a red notification dot example on 부대 ("3"). Same style as the reference tab bar."""),
    ("UI5", "5단계 · 부대(출전 준비) 화면", ["출전 6칸 표현", "▲유리/▼불리 표시", "상성 추천 버튼"],
     """One phone screen: the party setup for stage 3-7 (enemies mostly fire) over a softly blurred forest diorama. Top: stage name and win condition on a cream card. Middle: 6 party slots as a small hex formation on grass tiles (front 3, back 3), the leader hero slot with a crown. Below: a cream panel with a scrollable grid of owned spirit cards (portrait, level, element dot, role icon), each marked "▲유리" (orange) or "▼불리" (grey); water spirits are ▲. Buttons: "✨ 상성 추천 편성" (cream), "장비" (cream), "⚔️ 전투 시작" (big gold). Bottom tab bar with 부대 selected."""),
    ("UI6", "6단계 · 전투 화면 HUD", ["위/아래 패널 높이", "자동 버튼 4단계", "공격 미리보기 위치"],
     """One phone screen: the battle on a bright isometric hex battlefield diorama (6 hexes wide visible, map continues off-screen), allies at the bottom, rift monsters at the top, blue move-range hexes around a selected ally, a red target hex on an enemy. Top: small dark-green translucent pills "3-7 · 마그마 굴", "⏳ 3/28턴", "⚔️ 남은 적 5", help and pause round buttons. A thin ribbon "아군 차례 · 행동 남은 4/6". Bottom: a cream parchment unit card (portrait, name 웨이브팽, level, element, HP/SP bars, stats), forecast "플레임클로에게 42 · 유리! · 반격 없음" with a gold "공격!" button, round action buttons (공격, 기술 2개, 아이템, 대기), an auto button showing "🤖 자동 2배속" and a gold "턴 종료 ▶". No bottom tab bar in battle."""),
    ("UI7", "7단계 · 결과 화면 (승리·합류·패배)", ["승리 연출", "보상 순서", "합류 연출"],
     """THREE phone screens side by side (1536x1024 landscape) over the dimmed diorama: (1) VICTORY — gold ribbon "승리!", "3-7 · 마그마 굴", 3 stars, rewards (coins +276, an item, a growth crystal), level-up rows with portraits ("웨이브팽 21 → 22"), gold "다음" button. (2) NEW SPIRIT JOINS — a sparkling light burst revealing a new spirit "퍼퍼샷 합류!" with element and role chips, cream "스피릿 보기" button. (3) DEFEAT — muted grey ribbon "패배…", reason line, helpful cream buttons "앞 판에서 경험치 벌기", "상성 추천 편성", "장비 바꾸기", gold "다시 도전"."""),
    ("UI8", "8단계 · 스피릿 탭 (목록 + 상세)", ["정렬·필터", "진화 단계 표시", "장비·성장의 결정 위치"],
     """TWO phone screens side by side (1536x1024 landscape): (1) 스피릿 list — element filter chips (💧🔥🌿⛰️🌪️) and role chips (탱커/근딜/원딜/힐러/서포터) on a cream bar, a 4-column grid of spirit cards (portrait, level, element dot, role icon, small "출전" badge), tab bar with 스피릿 selected. (2) Spirit detail for "쉘나이트" — large full-body art standing on a small grass hex island, evolution track Lv.1 → Lv.10 → Lv.25 with the current form highlighted, stats on a cream card (체력, 공격, 방어, 마법방어, 이동력, 사거리, SP), two skills (one locked until Lv.5), equipment slots (무기/갑옷/장신구), XP bar, gold button "🔶 성장의 결정 쓰기"."""),
    ("UI9", "9단계 · 도감 탭 (스피릿 60종)", ["미발견 표시", "속성별 페이지", "수집 보상"],
     """One phone screen: a cream parchment book page over the forest diorama, header "스피릿 도감 23/60", element tabs (💧 물 12, 🔥 불 12, 🌿 숲 12, ⛰️ 대지 12, 🌪️ 바람 12), a grid of 12 slots arranged by role rows (탱커 3, 근딜 3, 원딜 3, 힐러 1, 서포터 2): met spirits in color with names, unmet ones as dark silhouettes with "?" and "34판에서 만나요". A collection reward track at the bottom (10 / 20 / 40 / 60). Tab bar with 도감 selected."""),
    ("UI10", "10단계 · 상점 탭", ["탭 구성", "가격·보유 표시", "팔기 흐름"],
     """One phone screen: a cozy forest market stall diorama at the top (a wooden stall with a striped awning on a grass hex), below a cream panel with tabs "소모품 / 장비 / 특별", coin balance capsule, a 2-column grid of item cards (icon, name, short effect, gold price button "🪙 120", owned count), one card with a "새 물건!" ribbon, a "팔기" toggle and a note "스테이지를 깰수록 물건이 늘어나요". Tab bar with 상점 selected."""),
    ("UI11", "11단계 · 타이틀 + 주인공 선택", ["타이틀 연출", "주인공 카드", "안내 문구"],
     """TWO phone screens side by side (1536x1024 landscape): (1) Title — a grand bright isometric hex-world diorama key art with spirits, the logo "헥사 프론티어" with a compass-star emblem, gold "모험 시작" and cream "이어서 하기" buttons. (2) Hero select "누구와 떠날까요?" — two large cream cards: 아렌 (boy adventurer with sword, "물리 근접 딜러") and 리아 (girl adventurer with staff, "마법 원거리 딜러") using the attached C01 and C02 references, a line "고르지 않은 주인공은 먼 훗날 동료로 만나요", gold "이 주인공으로 시작" button."""),
    ("UI12", "12단계 · 공통 컴포넌트 키트", ["버튼 상태", "패널·팝업 틀", "토스트·배지"],
     """A UI component kit sheet (1536x1024 landscape, """ + KEY + """, NO TEXT inside components) in the "탐험의 숲" style: gold pill primary button (normal/pressed/disabled), cream secondary button (3 states), round dark-green icon button, currency capsule, dark-green tab bar background, cream parchment panel frame (9-slice friendly corners), popup frame with dark-green header ribbon, bottom sheet with grab handle, toast bubble, red notification badge, gold-outlined hex stage node (locked/open/cleared/current/boss/elite), progress bar frame, stars (empty/full), small leaf divider ornament."""),
]


def build_jobs():
    J = []
    add = lambda phase, name, file, refs, prompt: J.append(dict(phase=phase, name=name, file=file, refs=refs, prompt=prompt))
    for code, kind, problem, anatomy, crop, abc in FIXES:
        add("A 초상 다시 그리기", f"{code} 초상 다시", f"{code}-P.png (덮어쓰기)", f"{code}.png (그 캐릭터의 스프라이트 시트)",
            STYLE_FIXED + "\n\n" + PORTRAIT_FIX.format(kind=kind, file=f"{code}.png", problem=problem, anatomy=anatomy, crop=f"cropped to show {crop}", a=abc[0], b=abc[1], c=abc[2]))
    for src, code, el, role, k, ko, en, atk, desc, extra in OLD:
        rk = {("근딜", "p"): "PHYSICAL MELEE DEALER", ("원딜", "p"): "PHYSICAL RANGED DEALER", ("원딜", "m"): "MAGIC RANGED DEALER"}.get((role, k), ROLE_EN[role])
        add("B 기존 스피릿 37 (최우선)", f"{code} {ko} 스프라이트 ({src})", f"{code}.png (덮어쓰기)", f"old/{src}.png (기존 시트) + 승인된 같은 속성 스피릿 시트 1장",
            STYLE_FIXED + "\n\n" + OLD_SHEET.format(en=en, src=f"old/{src}.png", extra=extra, attack=atk, role_hint=ROLE_HINT[role], code=code, ko=ko, el=EL_EN[el], role_en=rk, desc=desc))
        add("B 기존 스피릿 37 (최우선)", f"{code} {ko} 초상", f"{code}-P.png (덮어쓰기)", f"방금 승인한 {code}.png",
            STYLE_FIXED + "\n\n" + PORTRAIT_FIX.format(kind="spirit", file=f"{code}.png", problem="(new portrait, not a redo)", anatomy="keep exactly the anatomy of the sprite (four-legged creatures stay four-legged, fish stay fish; only humanoid designs get a bust)", crop="cropped to show the head and the front of the body as the anatomy allows", a="Lv.1 form", b="Lv.10 form", c="Lv.25 form").replace("The previous portrait was WRONG: (new portrait, not a redo)\n", "\n"))
    for code, title, decide, body in UI2:
        refs = "ref/UI-STYLE-01.png (필수) + 앞 단계에서 승인한 UI" + (" + C01.png, C02.png" if code == "UI11" else "")
        add("C UI 2~12단계 (탐험의 숲)", title, f"{code}.png (덮어쓰기)", refs, UI_STYLE + "\n\n" + body + "\n결정할 것: " + " · ".join(decide))
    for n, j in enumerate(J, 1):
        j["id"] = f"V2-{n:03d}"
    return J


STYLE_FIXED = _fix(STYLE)


def queue_text(jobs):
    out = ["HEXA FRONTIER 이미지 작업 목록 v2 (에이전트 지식 파일) — 이 파일이 예전 HEXA_작업목록.txt를 대신한다.",
           f"총 {len(jobs)}개 작업(V2-001 ~ V2-{len(jobs):03d}). 각 작업의 프롬프트는 그대로 완성본이다(STYLE이 이미 들어 있음).",
           "A 초상 다시 그리기 → B 기존 스피릿 37종(최우선) → C UI 2~12단계(1안 '탐험의 숲').", ""]
    phase = None
    for j in jobs:
        if j["phase"] != phase:
            phase = j["phase"]
            out += [f"########## 단계 {phase} ##########", ""]
        out += [f"===== {j['id']} =====", f"{j['id']} | 단계: {j['phase']} | 이름: {j['name']}", f"저장 파일 이름: {j['file']}", f"첨부 레퍼런스: {j['refs']}", f"{j['id']} 프롬프트:", j["prompt"], f"===== {j['id']} 끝 =====", ""]
    return "\n".join(out)


def instructions(jobs):
    from agent import phase_summary
    summ = "\n".join(f"- {p}: {a} ~ {b} ({n}개)" for p, a, b, n in phase_summary(jobs))
    return f"""너는 "헥사 프론티어 아트 공방"이다. 모바일 헥사 턴제 전술 RPG "HEXA FRONTIER"의 게임 이미지를 작업 목록 순서대로 한 장씩 만든다. 사용자와는 항상 짧은 한국어로 말한다.

# 자료
- 지식 파일 "HEXA_작업목록_v2.txt"에 V2-001 ~ V2-{len(jobs):03d} 작업이 있다. 각 작업에 저장 파일 이름, 첨부 레퍼런스, 완성된 프롬프트가 있다. 작업은 반드시 이 파일에서 "V2-번호"로 찾아 쓰고, 지어내지 않는다. 예전 파일(HEXA_작업목록.txt, JOB-번호)은 쓰지 않는다.
- 레퍼런스 그림: old/S0x-xxx.png(사용자가 고른 기존 스피릿 시트 — 디자인을 그대로 살린다), C01.png·C02.png(주인공), ref/UI-STYLE-01.png(사용자가 고른 UI 1안 '탐험의 숲'), 이미 만든 스프라이트 시트(예: MON-W-1.png).
- 단계:
{summ}

# 이미지 만들 때 규칙 (가장 중요)
1. 그 작업의 프롬프트를 처음부터 끝까지 그대로 쓴다. 요약하거나 빼먹지 않는다. 사용자가 "수정:"으로 준 내용만 덧붙인다.
2. "첨부 레퍼런스"에 적힌 그림을 반드시 함께 보고 그린다. 대화에 그 그림이 없으면 "○○ 그림을 첨부해 주세요" 한 줄로 부탁하고 기다린다.
3. 캐릭터 스프라이트·초상: 배경은 마젠타 #FF00FF 단색, 받침·헥사 타일·땅·그림자·글자·칸 테두리 없음, 체크무늬 금지.
4. 초상은 스프라이트의 몸 구조를 그대로 따른다. 네 발 짐승·물고기·장어·벌레를 사람처럼 가슴·어깨가 있는 흉상으로 그리지 않는다. 없는 코·귀·털·깃털을 더하지 않는다.
5. B단계(기존 스피릿): 첨부한 old 시트의 디자인(얼굴, 색, 무늬, 진화 3단계 모습)을 그대로 살린다. 시트의 헥사 타일·패널·글자만 버린다. 새 디자인을 지어내지 않는다.
6. C단계(UI): ref/UI-STYLE-01.png의 밝은 숲 디오라마 스타일을 그대로 따른다. 남색(네이비) 패널을 쓰지 않는다. 화면 글자는 한글.
7. 한 번 답할 때 이미지 한 장(한 작업)만 만든다.

# 대화 흐름
- "시작": 단계 목록을 짧게 보여 주고 "어디서부터 할까요? (처음부터 = V2-001)"라고 묻는다. 번호·코드(예: F-T2, MON-W-1, UI3)·단계 이름(A/B/C)을 말하면 거기서부터 한다.
- 이미지를 만든 답의 형식(항상 이대로):
  첫 줄: "V2-014/{len(jobs)} · B 기존 스피릿 · F-T2 그로브골렘 스프라이트"
  둘째 줄: "저장 이름: F-T2.png"
  (이미지)
  마지막 줄: "승인하면 '다음', 다시 그리면 '다시', 고칠 점은 '수정: …'"
- "다음"/"승인": 바로 다음 작업 이미지를 만든다(되묻지 않는다). "다시": 같은 작업을 다시. "수정: …": 그 요청만 반영해 다시. "건너뛰기": 이미지 없이 다음으로. "진행": 지금 번호와 단계별 남은 개수.
- C단계는 시안을 보고 사용자가 고르는 단계다. 이미지 뒤에 그 작업의 "결정할 것"을 보여 주고, 사용자가 고른 내용을 다음 UI 작업에 반영한다.
- 새 대화에서는 "마지막으로 승인한 V2 번호나 코드를 알려 주세요"라고 묻는다.

# 금지
- 다른 게임의 캐릭터·로고를 따라 그리지 않는다. 워터마크 금지.
- UI 시안(C단계) 말고는 이미지 안에 글자를 넣지 않는다."""
