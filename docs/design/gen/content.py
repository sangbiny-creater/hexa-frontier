# -*- coding: utf-8 -*-
"""HEXA FRONTIER 디자인용 GPT 이미지 프롬프트 묶음 (D127).
여기를 고치고 `python3 docs/design/gen/build.py` 를 실행하면 마크다운과 HTML이 함께 만들어진다."""

STYLE = """[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it."""

SPIRIT_SHEET = """Create one HEXA FRONTIER MONSTER COLLECTION character sheet, 1536x1024 landscape, matching the layout of the attached reference sheet (for example S03-T01 Shellknight) panel for panel:
- TOP LEFT header: element emblem, role badge "{badge}", large name "{en}", small epithet "{epithet}", element + role tags, a 2-line flavor description.
- TOP CENTER "EVOLUTION": three full-body poses side by side labeled "Lv.1", "Lv.10", "Lv.25" (small and cute -> grown -> majestic with more armor and ornaments; same species and color identity at every stage).
- TOP RIGHT "PORTRAIT & ICON": three rounded-square face portraits (Lv.1 / Lv.10 / Lv.25) on element-colored backgrounds, then a round element icon, then a character icon.
- Under the portraits "IN-GAME HEX TILE (IDLE)": the three evolution stages each standing on its own isometric hex tile, evenly spaced, nothing overlapping.
- BOTTOM "ANIMATION POSES & IN-GAME TILES": a grid with rows Lv.1 / Lv.10 / Lv.25 and columns IDLE, SKILL, WALK, HURT, KO/DEFEATED, every cell a small hex-tile sprite.
- Keep generous empty space between every panel item (they will be cut out automatically). Plain flat panel backgrounds.
Creature ({ko}): {desc}
It is a creature companion (an animal / beast / elemental being). It is NOT a wizard or mage: no robes, no pointed hats, no staffs, no spell books."""

MONSTER_SHEET = """Create one HEXA FRONTIER RIFT MONSTER sheet, 1536x1024 landscape, same rendering style as the attached spirit reference sheets but clearly an ENEMY:
- Design language for all Rift monsters: the creature has been corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, slightly menacing eyes (red-violet glow), but still the same cute SD proportions as the spirits. Never a copy of any spirit.
- LEFT header: role badge "{badge}", name "{en}", epithet, element tag.
- CENTER: two full-body poses side by side: "NORMAL" and "ELITE" (elite = bigger horns/spikes, gold-violet trim, small crown of rift crystals).
- RIGHT TOP: two rounded-square face portraits (NORMAL / ELITE).
- RIGHT MIDDLE "IN-GAME HEX TILE (IDLE)": NORMAL and ELITE each standing on an isometric hex tile with a dark violet rim.
- BOTTOM: row of hex-tile sprites: IDLE, ATTACK, WALK, HURT, KO (normal version only).
- Generous empty space between items, plain flat panel backgrounds.
Monster ({ko}, element {el}, role {role}): {desc}"""

BOSS_SHEET = """Create one HEXA FRONTIER {kind} sheet, 1536x1024 landscape, same rendering style as the attached reference sheets, epic and readable:
- LEFT: header with a crown/skull boss badge "{badge}", name "{en}", epithet, element tags.
- CENTER: one large full-body key art of the boss in a dynamic pose (about 45% of the sheet width).
- RIGHT TOP: two rounded-square face portraits (calm / enraged).
- RIGHT MIDDLE "IN-GAME HEX TILE": the boss standing on ONE isometric hex tile but drawn 1.5x larger than a normal unit, with a glowing gold-violet boss rim on the tile.
- BOTTOM: hex-tile sprites: IDLE, ATTACK, SKILL, HURT, KO{phase}.
- Same rift corruption language as the Rift monsters (violet hex cracks, rift crystals) plus a boss aura.
- Generous empty space between items, plain flat panel backgrounds.
Boss ({ko}, stage {stage}, element {el}): {desc}"""

EFFECT = """Create a game skill effect sprite sheet, 1536x1024, TRANSPARENT background, a 4 x 2 grid of 8 animation frames read left-to-right, top-to-bottom (each frame 384x512), effect centered in every frame and the same scale in every frame.
Style: HEXA FRONTIER painterly anime VFX — soft glow, crisp stylized shapes, small sparkle particles, no characters, no text. The effect must read on top of a small hex-tile unit (unit occupies the lower-middle of the frame).
Effect: {desc}
Colors: {color}"""

TILESET = """Create a HEXA FRONTIER battle terrain tile set, 1536x1024, TRANSPARENT background.
Arrange {n} separate pointy-top hexagon tiles in a neat grid with lots of empty space between them, each tile the same size (about 300 px wide) and the same 2.5D angle: a mostly top-down view tilted slightly so a thin side edge (earth/stone thickness) shows at the bottom.
The tiles must tile seamlessly when placed edge to edge in a hex grid, and units will stand in the middle, so keep the center of each tile calm and readable (no tall objects in the middle; trees/rocks lean to the edges or stay low).
Biome: {biome}
Tiles (in order, left-to-right, top-to-bottom): {tiles}"""

UI = """Create a mobile game UI mockup, 1024x1536 portrait (phone screen 9:19.5 safe area), for HEXA FRONTIER, a hex-grid turn-based tactics RPG with cute elemental spirit creatures.
Use the HEXA FRONTIER UI chrome language: deep navy panels, warm gold trim, parchment cream cards, compass-star emblem, rounded corners, generous touch targets (min 44 px).
All visible UI text must be KOREAN (Hangul), short and legible. Show realistic content, not lorem ipsum.
{body}"""

# ───────────────────────── 스피릿 60 ─────────────────────────
# (속성, 역할, 코드, 한글, 영문, 출처/설명, 새로 만들기?)
SPIRITS = [
    # 숲
    ("숲", "탱커", "F-T1", "그로브골렘", "Ancient Grove Golem", "S01-T01", False),
    ("숲", "탱커", "F-T2", "쏜쉘 가디언", "Thornshell Guardian", "S01-T02", False),
    ("숲", "탱커", "F-T3", "모스백", "Mossback", "a sturdy mossy tortoise with a small living tree and mushrooms on its domed shell; Lv.10 the shell becomes layered bark armor; Lv.25 an ancient guardian whose tree crown blossoms with glowing green runes. Quadruped tank.", True),
    ("숲", "근딜", "F-M1", "블레이드워든", "Bladewarden", "S01-M01", False),
    ("숲", "근딜", "F-M2", "레이저보어", "Razorboar", "S01-M02", False),
    ("숲", "근딜", "F-M3", "쏜클로", "Thornclaw", "S01-M03", False),
    ("숲", "원딜", "F-R1", "실반 아처", "Sylvan Archer", "S01-R01", False),
    ("숲", "원딜", "F-R2", "시드샷", "Seedshot", "a fluffy squirrel with an acorn-cap helmet that flings exploding seed pods from a vine slingshot held in its paws; Lv.10 leaf bandolier of seed pods; Lv.25 sleek forest ranger squirrel with a living-vine slingshot. (Replaces Mossmage.)", True),
    ("숲", "원딜", "F-R3", "쏜비틀", "Thornbeetle", "a round rhinoceros beetle whose back opens like a turret and shoots thorn spikes; Lv.10 armored stag beetle; Lv.25 heavy stag beetle with a thorn-cannon horn and moss armor.", True),
    ("숲", "힐러", "F-H1", "블루멜", "Bloomel", "S01-H01", False),
    ("숲", "서포터", "F-S1", "윌로위스프", "Willowisp", "S01-S01", False),
    ("숲", "서포터", "F-S2", "페탈모스", "Petalmoth", "a round fuzzy moth with flower-petal wings that scatters glowing pollen to empower allies; Lv.10 larger patterned wings; Lv.25 majestic luna-moth with a flower crown and trailing pollen ribbons.", True),
    # 불
    ("불", "탱커", "Fi-T1", "이그나골렘", "Igna Golem", "S02-T01", False),
    ("불", "탱커", "Fi-T2", "플레임벌워크", "Flamebulwark", "S02-T02", False),
    ("불", "탱커", "Fi-T3", "마그마크랩", "Magmacrab", "a hermit crab carrying a volcanic rock shell with glowing lava cracks and one oversized claw used as a shield; Lv.10 obsidian plating; Lv.25 fortress crab whose shell is a small erupting volcano.", True),
    ("불", "근딜", "Fi-M1", "플레임클로", "Flameclaw", "S02-M01", False),
    ("불", "근딜", "Fi-M2", "블레이즈혼", "Blazehorn", "S02-M02", False),
    ("불", "근딜", "Fi-M3", "신더팽", "Cinderfang", "a bipedal salamander lizard warrior with ember-tipped claws and a burning tail; Lv.10 scale armor; Lv.25 dragon-like salamander with obsidian armor plates and twin flame claws.", True),
    ("불", "원딜", "Fi-R1", "엠버윙", "Emberwing", "S02-R01", False),
    ("불", "원딜", "Fi-R2", "스파크호그", "Sparkhog", "a hedgehog whose quills are flaming spikes it fires at enemies; Lv.10 longer glowing quills; Lv.25 porcupine with a blazing quill crown. (Replaces Cinder Mage.)", True),
    ("불", "원딜", "Fi-R3", "애쉬드레이크", "Ashdrake", "a small round dragon with ash-grey scales and a glowing magma belly that spits fireballs; Lv.10 bigger wings; Lv.25 proud drake with molten horn crest.", True),
    ("불", "힐러", "Fi-H1", "플라모라", "Flamora", "S02-H01", False),
    ("불", "서포터", "Fi-S1", "하스펍", "Hearthpup", "a chubby puppy carrying a glowing hearth-lantern on its back whose warmth boosts allies; Lv.10 lantern becomes a small brazier saddle; Lv.25 noble hound with a phoenix-shaped hearth. (Replaces Pyronomad.)", True),
    ("불", "서포터", "Fi-S2", "킨들핀치", "Kindlefinch", "a bright songbird with ember feathers whose song raises morale; Lv.10 longer flame tail; Lv.25 phoenix-like songbird with flaming tail ribbons.", True),
    # 물
    ("물", "탱커", "W-T1", "쉘나이트", "Shellknight", "S03-T01", False),
    ("물", "탱커", "W-T2", "타이드가드", "Tide Guard", "S03-T02", False),
    ("물", "탱커", "W-T3", "아쿠아골렘", "Aqua Golem", "S03-T03", False),
    ("물", "근딜", "W-M1", "웨이브팽", "Wavefang", "S03-M01", False),
    ("물", "근딜", "W-M2", "마리실", "Marisyl", "S03-M02", False),
    ("물", "근딜", "W-M3", "코랄스트라이크", "Coralstrike", "S03-M03", False),
    ("물", "원딜", "W-R1", "타이드킷", "Tidekit", "S03-R01", False),
    ("물", "원딜", "W-R2", "퍼퍼샷", "Puffershot", "a pufferfish floating inside a water bubble that shoots water spikes; Lv.10 coral armor spines; Lv.25 armored puffer with coral cannons. (Replaces Neritha.)", True),
    ("물", "원딜", "W-R3", "아쿠아룬", "Aqualune", "S03-R03 (check: keep only if it is a creature, not a mage)", False),
    ("물", "힐러", "W-H1", "아쿠아린", "Aqualyn", "S03-H01", False),
    ("물", "서포터", "W-S1", "아쿠아드론", "Aquadron", "S03-S01", False),
    ("물", "서포터", "W-S2", "버블롯", "Bubblot", "a sea otter holding a shell that blows protective bubble shields over allies; Lv.10 kelp scarf; Lv.25 otter with a glowing pearl and a bubble halo.", True),
    # 바람
    ("바람", "탱커", "Wi-T1", "클라우드터스크", "Cloudtusk", "S04-T01", False),
    ("바람", "탱커", "Wi-T2", "템페스트가드", "Tempest Guard", "S04-T02", False),
    ("바람", "탱커", "Wi-T3", "님버스램", "Nimbusram", "a ram whose wool is a thick storm cloud and whose curled horns crackle with tiny sparks; Lv.10 bigger cloud mane; Lv.25 thunderhead ram with lightning-etched horns.", True),
    ("바람", "근딜", "Wi-M1", "에어로리스", "Aerolith", "S04-M01", False),
    ("바람", "근딜", "Wi-M2", "스카이워든", "Skywarden", "S04-M02", False),
    ("바람", "근딜", "Wi-M3", "스카이블레이드", "Skyblade", "S04-M03", False),
    ("바람", "원딜", "Wi-R1", "에어랄리스", "Aeralis", "S04-R01", False),
    ("바람", "원딜", "Wi-R2", "제피라", "Zephyra", "S04-R02 (check: keep only if it is a creature, not a mage)", False),
    ("바람", "원딜", "Wi-R3", "스톰카이트", "Stormkite", "a kite-shaped flying sky ray that slices wind blades from its fins; Lv.10 longer tail ribbons; Lv.25 thunder-striped sky ray with glowing fin edges.", True),
    ("바람", "힐러", "Wi-H1", "실피아", "Sylphia", "S04-H01", False),
    ("바람", "서포터", "Wi-S1", "클라우디언", "Cloudavian", "S04-S01", False),
    ("바람", "서포터", "Wi-S2", "윈드차임", "Windchime", "a small round owl whose tail feathers are wind chimes that ring to cheer allies; Lv.10 crystal chimes; Lv.25 great owl with a halo of floating chimes.", True),
    # 대지
    ("대지", "탱커", "E-T1", "테라스톤", "Terrastone", "S05-T01", False),
    ("대지", "탱커", "E-T2", "테라벌워크", "Terra Bulwark", "S05-T02", False),
    ("대지", "탱커", "E-T3", "아이언딜로", "Irondillo", "an armadillo with iron-ore plated shell that curls into a rolling fortress; Lv.10 studded plates; Lv.25 massive armadillo with amber crystal spikes.", True),
    ("대지", "근딜", "E-M1", "락터스크", "Rocktusk", "S05-M01", False),
    ("대지", "근딜", "E-M2", "시로코 알파", "Sirocco Alpha", "S05-M02", False),
    ("대지", "근딜", "E-M3", "쿼츠맨티스", "Quartzmantis", "a praying mantis with quartz-crystal scythe arms; Lv.10 crystal armor; Lv.25 amethyst-blade mantis master.", True),
    ("대지", "원딜", "E-R1", "페블린", "Pebblin", "S05-R01", False),
    ("대지", "원딜", "E-R2", "볼더몰", "Bouldermole", "a mole wearing a little mining helmet who hurls boulders; Lv.10 rock gauntlets; Lv.25 drill-gauntlet mole with an ore backpack. (Replaces Sandseer.)", True),
    ("대지", "원딜", "E-R3", "지오드스콜피온", "Geodescorp", "a scorpion whose tail tip is a cracked geode that fires crystal shards; Lv.10 crystal plating; Lv.25 amber-crystal scorpion.", True),
    ("대지", "힐러", "E-H1", "테라위스프", "Terrawisp", "S05-H01", False),
    ("대지", "서포터", "E-S1", "럼블렛", "Rumblet", "S05-S02", False),
    ("대지", "서포터", "E-S2", "듄페넥", "Dunefennec", "a fennec fox with a sand drum strapped to its back whose rhythm weakens enemies; Lv.10 bigger drum with charms; Lv.25 desert fennec with a golden sun-drum. (Replaces Geomancer.)", True),
]
REMOVED = [
    ("S01-R02", "Mossmage", "숲 원딜 → 시드샷"),
    ("S02-R02", "Cinder Mage", "불 원딜 → 스파크호그"),
    ("S02-S01", "Pyronomad", "불 서포터 → 하스펍"),
    ("S03-R02", "Neritha", "물 원딜 → 퍼퍼샷"),
    ("S05-R02", "Sandseer", "대지 원딜 → 볼더몰"),
    ("S05-S01", "Geomancer", "대지 서포터 → 듄페넥"),
]
EL_EN = {"숲": "FOREST", "불": "FIRE", "물": "WATER", "바람": "WIND", "대지": "EARTH"}
ROLE_EN = {"탱커": "TANKER", "근딜": "MELEE DEALER", "원딜": "RANGED DEALER", "힐러": "HEALER", "서포터": "SUPPORTER"}

# ───────────────────────── 몬스터 30 ─────────────────────────
MON_ROLES = ["근접 졸개", "돌격대", "방패", "사수", "치유체", "저주체"]
MONSTERS = {
    "숲": [
        ("균열 덩굴뱀", "Riftvine Viper", "a coiling vine snake with thorn fangs and leaf frills"),
        ("가시멧돼지", "Brambleboar", "a charging boar covered in bramble spikes, charges in straight lines"),
        ("썩은 그루터기", "Rotstump", "a walking rotten tree stump with a bark face, very sturdy"),
        ("포자두꺼비", "Sporetoad", "a fat toad that spits glowing spore balls from a distance"),
        ("이끼달팽이", "Mossnail", "a big snail with a mossy shell that oozes healing sap onto allies"),
        ("저주버섯", "Hexshroom", "a hopping mushroom whose purple spores weaken enemies"),
    ],
    "물": [
        ("균열 피라냐", "Riftpiranha", "a piranha with stubby legs that walks on land, big teeth"),
        ("작살상어", "Harpoon Shark", "a small shark with a harpoon-shaped snout that dashes forward"),
        ("따개비거북", "Barnacle Turtle", "a turtle crusted with barnacles, a slow wall"),
        ("먹물문어", "Inkpus", "a small octopus that shoots ink blobs from range"),
        ("물방울해파리", "Dew Jelly", "a floating jellyfish whose glowing drops heal monsters"),
        ("소용돌이장어", "Whirl Eel", "an eel that spins small whirlpools to weaken defense"),
    ],
    "불": [
        ("불똥도마뱀", "Emberskink", "a quick little lizard with a spark tail"),
        ("화염코뿔소", "Blaze Rhino", "a stocky rhino with a flaming horn that charges"),
        ("용암덩이", "Magma Chunk", "a living lump of cooled lava with a molten core, very tough"),
        ("화산박쥐", "Lava Bat", "a bat with magma-veined wings that drops fireballs"),
        ("재부엉이", "Ash Owl", "a sooty owl that fans warm embers to mend monsters"),
        ("그을음 정령", "Soot Wisp", "a smoky blob with ember eyes whose smoke lowers enemy defense"),
    ],
    "바람": [
        ("칼바람족제비", "Gale Weasel", "a ferret with sickle-shaped tail blades"),
        ("번개매", "Bolt Falcon", "a falcon wrapped in tiny lightning that dives fast"),
        ("구름거북", "Cloud Turtle", "a turtle floating on a thick cloud, a sturdy blocker"),
        ("돌풍벌", "Gust Wasp", "a wasp that shoots compressed air stingers from range"),
        ("깃털박새", "Plume Tit", "a fluffy bird whose feather down heals monsters"),
        ("회오리여우", "Whirl Fox", "a fox with a tornado tail that confuses and weakens"),
    ],
    "대지": [
        ("자갈딱정벌레", "Gravel Beetle", "a small beetle with a pebble shell"),
        ("암석들소", "Boulder Bison", "a bison with rock horns and a stone hump that charges"),
        ("바위게", "Rock Crab", "a crab with a boulder shell, a solid wall"),
        ("모래거미", "Sand Spider", "a spider that flings sand balls and webs from range"),
        ("진흙도롱뇽", "Mud Newt", "a newt that coats monsters in healing mud"),
        ("균열 수정벌레", "Shard Mite", "a mite with violet crystal shards whose hum weakens enemies"),
    ],
}

MIDBOSSES = [
    (5, "숲", "가시멧돼지 대장", "Thornback Alpha", "a huge bramble boar alpha with a bark-and-thorn mane"),
    (15, "물", "따개비 대왕거북", "Barnacle King", "an enormous barnacle turtle with a sunken-ship-wood shell"),
    (25, "불", "화염코뿔소 대장", "Inferno Rhino", "a giant rhino with a burning crown horn and magma armor"),
    (35, "바람", "번개매 여왕", "Storm Falcon Queen", "a great falcon with a crest of lightning feathers"),
    (45, "대지", "암석들소 대장", "Granite Bison Chief", "a colossal bison with granite horns and crystal hump"),
    (55, "숲", "독포자 두꺼비왕", "Spore Toad King", "a giant toad crowned with poisonous mushrooms"),
    (65, "물·불", "증기 장어", "Steam Eel", "a huge eel half water half lava, breathing steam"),
    (75, "바람·대지", "모래폭풍 전갈", "Duststorm Scorpion", "a giant scorpion trailing a small sandstorm"),
    (85, "숲·물·불", "균열 키메라 새끼", "Chimera Whelp", "a young chimera with leaf, water and fire features"),
    (95, "모든 속성", "균열 사냥개", "Rift Warhound", "a large armored hound made of rift crystal with five element gems"),
]
BOSSES = [
    (10, "숲", "고목 수호수", "Rift Treant", "a colossal corrupted tree beast with root claws and a hollow glowing face", ""),
    (20, "물", "심해 레비아탄", "Abyss Leviathan", "a sea serpent rising from a whirlpool, pearl horns, rift cracks along its fins", ""),
    (30, "불", "화산 와이번", "Volcano Wyvern", "a wyvern with obsidian scales and a lava-filled chest, wings dripping embers", ""),
    (40, "바람", "뇌운 그리폰", "Thunder Griffin", "a griffin made of storm clouds and feathers, lightning mane", ""),
    (50, "대지", "거신 장수풍뎅이", "Colossus Beetle", "a gigantic rhinoceros beetle with a mountain-like shell and crystal horn", ""),
    (60, "숲", "가시 여왕 사마귀", "Thornqueen Mantis", "a regal mantis with rose-thorn scythes and a flower crown", ""),
    (70, "물·불", "증기 크라켄", "Steam Kraken", "a kraken whose tentacles are half water half magma, wreathed in steam", ""),
    (80, "바람·대지", "모래폭풍 로크", "Sandstorm Roc", "a giant roc bird with stone-plated wings carrying a sandstorm", ""),
    (90, "숲·물·불", "혼돈 키메라", "Chaos Chimera", "a three-headed chimera (forest stag, water serpent, fire lion) fused by rift cracks", ""),
    (100, "모든 속성", "헥사 포식자 · 균열의 군주", "Hexa Devourer, Lord of the Rift", "a colossal rift dragon made of shattered hex tiles, five element crystals orbiting it", ", PHASE 2 (rift armor broken, crystals blazing)"),
]

SKILLS = [
    ("기본 타격", "hit_basic", "a quick white slash spark impact with small star sparks (generic basic attack hit)", "white and warm gold"),
    ("치명타", "hit_crit", "a big starburst impact with radial speed lines and a gold flash (critical hit)", "gold and white"),
    ("도발", "taunt", "a red shout shockwave ring expanding from the unit with an angry vein icon shape", "red and orange"),
    ("방패 강타", "shieldbash", "a heavy shield slam: stone-colored impact crater ring plus spinning dizzy stars", "steel grey, gold stars"),
    ("강타", "power", "a powerful single downward slash leaving a thick bright arc and a ground crack", "white-gold"),
    ("회오리 베기", "whirl", "a 360-degree spinning blade wind ring around the unit (covers the 6 surrounding hexes)", "pale cyan and white"),
    ("흡수", "drain", "dark red life-wisps flowing from the target back to the attacker", "crimson and pink"),
    ("저격", "snipe", "a single glowing arrow streak with a target reticle flash at impact", "gold and white"),
    ("화살비", "volley", "many small arrows falling in a circle area with dust puffs", "brown wood and silver"),
    ("치유", "heal", "soft green rising leaves and sparkles with a plus-shaped glow", "green and white"),
    ("치유의 비", "massheal", "a gentle rain of glowing droplets and petals over an area", "green, aqua and white"),
    ("격려", "cheer", "rising golden musical notes and an upward arrow aura", "gold and orange"),
    ("약화", "weaken", "a sinking violet mist with a broken-shield silhouette", "violet and grey"),
    ("지휘", "command", "a waving banner flash and a golden ring pulse spreading out", "gold and navy"),
    ("별빛탄", "starbolt", "a small shooting star projectile with a sparkling trail and star burst", "white, pale gold and lilac"),
    ("속성 일격 ×5", "elstrike", "an element-infused claw/blade strike on one target. Generate one image per element (5 images, same layout): water splash slash / fire flame slash / forest leaf slash / earth rock slash / wind gale slash", "use the element palette of the version"),
    ("원소탄 ×5", "elbolt", "an element projectile flying with a trail, then bursting on impact. Generate one image per element (5 images, same layout): water orb, fire ball, leaf-seed bolt, rock shard, wind blade", "use the element palette of the version"),
    ("원소 폭발 ×5", "blast", "an area explosion covering a target hex and its 6 neighbors. Generate one image per element (5 images, same layout): tidal splash, firestorm, thorn bloom, earth spikes, cyclone", "use the element palette of the version"),
    ("기절 별", "status_stun", "looping 3 small dizzy stars circling above a head (8-frame loop)", "yellow"),
    ("레벨 업", "levelup", "a golden pillar of light with rising sparkles and an upward chevron", "gold and white"),
    ("쓰러짐", "ko_poof", "a soft cartoon smoke poof with small stars fading out", "grey-white"),
    ("진화", "evolve", "a swirling cocoon of light that bursts into sparkles", "element-neutral white with rainbow sparkles"),
]

BIOMES = [
    ("숲 들판 (1장·6장)", "fresh meadow forest with flowers and moss", "plain grass, grass with flowers, forest (low bushes + small trees at tile edges), hill (grassy mound), shallow water pond, rock (mossy boulder pile, impassable), camp (campfire with logs), path dirt"),
    ("물안개 해안 (2장)", "misty coast, sand and tide pools", "sand, wet sand with shells, forest (palm/kelp brush), hill (dune), sea water, rock (sea stack), camp (beach bonfire), coral reef shallow"),
    ("불꽃 화산 (3장)", "volcanic ash fields with lava veins", "ash ground, cracked basalt, forest (charred trees with ember leaves), hill (cinder cone), water (hot spring), rock (obsidian spire), camp (stone brazier), lava (glowing, impassable look)"),
    ("바람 고원 (4장)", "windy highland plateau with clouds", "short grass, windswept stone, forest (bent wind trees), hill (rocky rise), water (cloud lake), rock (floating rock pillar), camp (windmill campfire), cloud bridge"),
    ("대지 협곡 (5장)", "red-sand canyon with crystals", "sandstone, gravel, forest (cactus/dry brush), hill (mesa step), water (oasis), rock (canyon pillar), camp (tent campfire), crystal outcrop"),
    ("균열의 땅 (7~10장)", "corrupted rift lands mixing all elements, violet hex cracks", "rift-cracked stone, mixed grass-ash, forest (twisted crystal trees), hill (crystal mound), water (dark violet water), rock (rift monolith), camp (protected ward circle), rift crack (glowing violet)"),
]

BATTLE_ELEMENTS = [
    ("헥사 표시 오버레이", "A set of flat semi-transparent pointy-top hexagon overlays (same size as the terrain tiles), TRANSPARENT background, arranged in a grid with space between them: (1) blue MOVE range, (2) red ATTACK target, (3) gold SKILL area, (4) faint red ENEMY THREAT, (5) bright gold SELECTED outline ring, (6) green HEAL target, (7) small gold path dot, (8) dashed gold destination marker. Soft inner glow, clean edges, no text."),
    ("유닛 발판 링", "A set of glowing oval base rings that sit under a unit standing on a hex, TRANSPARENT background: ally (blue), enemy (red), boss (gold-violet with small crown), selected (gold pulse), acted/exhausted (desaturated grey). Each ring as a separate item with space between."),
    ("체력·SP 막대", "Small HP and SP bar frames for above unit heads and for the unit card, TRANSPARENT background: unit-head bar frame (thin, rounded, dark), HP fills (ally green, enemy red, boss gold), SP fill (blue), XP fill (violet), shield/armor overlay. Also a large unit-card bar frame version. No text, no numbers."),
    ("상태 아이콘", "A sheet of 12 small round status icons, 128x128 each, TRANSPARENT background, consistent style (gold rim, navy disc): stun (dizzy stars), attack up (sword up arrow), defense down (cracked shield), taunt (shout), guard (shield glow), poison (green drop), burn (flame), heal over time (leaf), speed up (wing), leader (crown), elite (rift crystal), boss (skull crown). No text."),
    ("속성 아이콘", "Five round element icons, 256x256 each, TRANSPARENT background, matching the element icons on the HEXA FRONTIER reference sheets: water drop, fire flame, forest leaf, earth mountain, wind swirl — plus the advantage chart graphic: five icons in a pentagon with curved arrows water->fire->forest->earth->wind->water."),
    ("역할 아이콘", "Seven role icons, 256x256, TRANSPARENT background, gold-on-navy emblem style: tank (shield), physical melee (sword), magic melee (glowing claw), physical ranged (bow), magic ranged (orb with sparkles, NOT a wizard hat), healer (leaf heart), supporter (horn/banner)."),
    ("행동 버튼 아이콘", "Action button icons for the battle bottom panel, 256x256, TRANSPARENT background, consistent gold-on-navy style: attack (crossed swords), skill (star burst), item (satchel), wait (hourglass), undo move (curved arrow), end turn (flag with arrow), auto-battle OFF (sleeping robot), auto ON (robot), auto 2x (robot with >>), auto 4x (robot with >>>>), surrender (white flag), help (question compass)."),
    ("차례 배너", "Wide ribbon banners for battle phase announcements, TRANSPARENT background, NO TEXT (text will be added by the game): ally phase banner (blue-gold ribbon with compass star), enemy phase banner (crimson-violet ribbon with rift crystal), victory banner (gold laurel ribbon with trophy), defeat banner (grey broken ribbon), boss warning banner (red-violet with skull crown)."),
    ("피해 숫자 글꼴", "A bitmap number font sheet for floating damage numbers, TRANSPARENT background: digits 0-9, plus '+', '-', '!' in four color styles in rows: normal hit (white with dark outline), advantage hit (orange, bigger, slightly bouncy), weak hit (grey-blue, smaller), heal (green). Chunky, game-like, highly legible, each glyph separated with space."),
    ("공격 미리보기·유닛 카드 틀", "UI frames, TRANSPARENT background, NO TEXT: (1) battle bottom unit card frame (portrait slot on the left, two bar slots, stat row), (2) attack forecast panel frame with a small 'VS' divider between two portrait slots, (3) small tooltip bubble, (4) skill button frame in 4 states (normal, pressed, disabled, cooling down overlay), (5) end-turn primary button (normal/pressed)."),
]

UI_STEPS = [
    {
        "id": "ui1", "title": "1단계 · 비주얼 방향 3안",
        "decide": ["세 방향 중 하나(또는 섞기)", "메인 색·금색 트림 강도", "글꼴 느낌(둥근/각진)"],
        "body": """Show THREE style direction boards side by side in one 1536x1024 landscape image (override the portrait size for this one), each board labeled A / B / C in large letters:
A "따뜻한 원정 지도": parchment, wood frames, hand-drawn map ink, warm brown + gold.
B "맑은 하늘 판타지": light sky blue glass panels, white and soft gold, airy and bright.
C "밤의 탐험대": deep navy panels, warm gold trim, cream cards, compass-star emblem (closest to the existing reference sheets).
Each board contains: color swatches, a primary button and a secondary button, a panel frame, a bottom tab bar with 5 tabs (원정 / 부대 / 도감 / 상점 / 더보기), a small stage node, an HP bar, sample Korean title text "헥사 프론티어" and body text "스피릿과 함께 원정을 떠나요".""",
    },
    {
        "id": "ui2", "title": "2단계 · 원정(메인 접속 화면) 레이아웃 3안",
        "decide": ["A/B/C 중 메인 화면 구조", "장(10판) 단위를 어떻게 보여 줄지", "현재 위치·다음 판 강조 방식"],
        "body": """This is the main screen players see after logging in (replaces a plain list of 100 stages). Make THREE layout options as three phone screens side by side in one 1536x1024 landscape image, labeled A / B / C:
A "세로 원정길": a vertically scrolling illustrated world path for the current chapter — 10 hexagonal stage nodes connected by a winding road over a painted region background (e.g. 3장 불꽃 화산), boss node at the top is bigger with a skull-crown, cleared nodes show 3 small stars, the next node pulses, the hero chibi stands on the current node.
B "헥사 대륙 지도": a world overview made of 10 large hexagon islands (one per chapter, each with its element biome), tapping an island zooms into its 10 stage nodes; show the overview with locked islands greyed out and the current island glowing.
C "장 카드 넘기기": a horizontal carousel of big chapter cards (art + chapter name + element icons + progress 7/10), under it a compact node strip of the 10 stages.
All three share: top status bar (hero portrait with level, gold 🪙, growth crystals 🔶, settings), a big primary button "▶ 12판 출전", and a bottom tab bar with 5 tabs (원정 active, 부대, 도감, 상점, 더보기). Korean labels.""",
    },
    {
        "id": "ui3", "title": "3단계 · 원정 화면 상세 + 스테이지 정보 팝업",
        "decide": ["노드 상태 표현(잠김/도전/클리어/별)", "보스·대장 노드", "팝업에 넣을 정보 순서"],
        "body": """Using the layout chosen in step 2 ({choice}), draw the finished main expedition screen for chapter 3 "불꽃 화산" with stages 21-30: nodes 21-26 cleared (stars), node 27 current (pulsing, hero standing there), 28-30 locked, node 25 is an ELITE node (rift crystal badge), node 30 is the BOSS node (화산 와이번 silhouette).
Also, as a second phone screen next to it (1536x1024 landscape, two phones side by side), draw the bottom sheet popup that opens when tapping node 27: title "27 · 마그마 굴", element warning chips "🔥 불 속성 적이 많아요 → 💧 물 스피릿 추천", enemy portraits row (6 small portraits with element dots and levels), win condition "적 전멸 · 28턴", first-clear rewards (gold, item icon, 🔶), recommended party chips, and a large button "출전 준비".""",
    },
    {
        "id": "ui4", "title": "4단계 · 하단 탭 + 아이콘 세트",
        "decide": ["탭 5개 구성·이름", "선택/비선택 표현", "알림 점 위치"],
        "body": """Design the bottom tab bar system: show the tab bar in 5 states (each tab selected once) stacked vertically, plus the 10 icons (5 active, 5 inactive) separately at large size on the right.
Tabs: 원정 (compass map), 부대 (shield with 3 creature silhouettes), 도감 (book with hex), 상점 (pouch with coins), 더보기 (gear). Selected tab: icon pops up slightly above the bar with a gold glow; red notification dot example on 부대 ("3").""",
    },
    {
        "id": "ui5", "title": "5단계 · 출전 준비(편성) 화면",
        "decide": ["출전 슬롯 표현(헥사 6칸 vs 카드 6장)", "▲유리/▼불리 표시", "상성 추천 버튼 위치"],
        "body": """Draw the pre-battle party setup screen for stage 27 (enemies mostly 🔥 fire).
Top: stage name and win condition. Middle: 6 party slots shown as a small hex formation (front row 3, back row 3) with the leader hero fixed in one slot (crown badge). Below: scrollable grid of owned spirits (cards with portrait, level, element dot, role icon), each card marked "▲유리" (orange) or "▼불리" (grey) against this stage; water spirits are marked ▲.
Buttons: "✨ 상성 추천 편성", "장비", "⚔️ 전투 시작" (primary).""",
    },
    {
        "id": "ui6", "title": "6단계 · 전투 화면 HUD",
        "decide": ["위/아래 패널 높이", "자동 버튼 4단계 표현", "공격 미리보기 위치", "헥사 바닥 2D vs 2.5D"],
        "body": """Draw the battle screen in portrait: a hex battlefield (6 hexes wide visible, map continues off-screen with a subtle edge fade) with 2.5D terrain tiles, 6 ally spirits on hexes at the bottom, enemies at the top, blue move-range hexes around a selected ally, red target hex on an enemy.
Top bar: "27 · 마그마 굴", turn "⏳ 3/28턴", objective "⚔️ 남은 적 5", help and surrender icons. A thin phase ribbon "아군 차례 · 행동 남은 4/6".
Bottom panel: selected unit card (portrait, name 웨이브팽, level, role, element, HP/SP bars, stats), attack forecast "플레임클로에게 42 유리! · 반격 없음" with button "공격!", action buttons grid (공격, 기술 2개, 아이템, 대기), and bottom row: auto button showing "🤖 자동 2배속" state and primary "턴 종료 ▶".""",
    },
    {
        "id": "ui7", "title": "7단계 · 결과 화면 (승리·패배·합류)",
        "decide": ["승리 연출 강도", "보상 표시 순서", "새 스피릿 합류 연출"],
        "body": """Draw THREE result screens side by side in one 1536x1024 landscape image:
(1) VICTORY: gold banner "승리!", stage "27 · 마그마 굴", stars 3/3, rewards (🪙 +276, item icon, 🔶 성장의 결정), level-up list with portraits ("웨이브팽 21 → 22").
(2) NEW SPIRIT JOINS: a dramatic reveal of a new spirit "퍼퍼샷 합류!" with its full art on a hex pedestal, element and role tags, button "부대에서 보기".
(3) DEFEAT: muted banner "패배…", reason line, and helpful next-step buttons: "앞 판에서 경험치 벌기", "편성 바꾸기 (▲상성 추천)", "장비 바꾸기", "다시 도전".""",
    },
    {
        "id": "ui8", "title": "8단계 · 부대 탭 (목록 + 스피릿 상세)",
        "decide": ["목록 정렬·필터(속성/역할)", "진화 단계 보여 주기", "장비 3칸·성장의 결정 위치"],
        "body": """Draw TWO phone screens side by side (1536x1024 landscape):
(1) 부대 list: filter chips by element (💧🔥🌿⛰️🌪️) and role (탱커/근딜/원딜/힐러/서포터), a 4-column grid of spirit cards (portrait, level, element dot, role icon, small "출전" badge on party members).
(2) Spirit detail for "쉘나이트": large art on a hex pedestal with evolution track (Lv.1 → Lv.10 → Lv.25, current stage highlighted), stats (체력, 공격, 방어, 마법방어, 이동력, 사거리, SP), two skills (one locked until Lv.5), equipment slots (무기/갑옷/장신구), XP bar, button "🔶 성장의 결정 쓰기".""",
    },
    {
        "id": "ui9", "title": "9단계 · 도감 탭 (스피릿 60종)",
        "decide": ["미발견 표시(실루엣/물음표)", "속성별 페이지 vs 한 화면", "수집률 보상"],
        "body": """Draw the spirit collection (도감) screen: header "스피릿 도감 23/60", element tabs (💧 물 12, 🔥 불 12, 🌿 숲 12, ⛰️ 대지 12, 🌪️ 바람 12), a grid of 12 slots for the selected element arranged by role rows (탱커 3, 근딜 3, 원딜 3, 힐러 1, 서포터 2): met spirits in color with names, unmet ones as dark silhouettes with "?" and the stage where they appear ("34판에서 만나요"). A collection reward track at the bottom (10 / 20 / 40 / 60).""",
    },
    {
        "id": "ui10", "title": "10단계 · 상점 탭",
        "decide": ["탭 구성(소모품/장비/결정)", "가격·보유 표시", "판매 흐름"],
        "body": """Draw the shop (상점) screen: tabs "소모품 / 장비 / 특별", gold balance at top, item cards in a 2-column grid (icon, name, short effect, price button "🪙 120", owned count), one card highlighted "새 물건!", a sell toggle "팔기", and a small note "스테이지를 깰수록 물건이 늘어나요".""",
    },
    {
        "id": "ui11", "title": "11단계 · 타이틀 + 주인공 선택",
        "decide": ["타이틀 연출", "주인공 카드 구성", "고르지 않은 주인공 안내 문구"],
        "body": """Draw TWO phone screens side by side (1536x1024 landscape):
(1) Title: logo "헥사 프론티어" with the compass-star emblem, a painted key art of the hex frontier with spirits, buttons "모험 시작" / "이어서 하기".
(2) Hero select "누구와 떠날까요?": two large cards — 아렌 (boy adventurer with sword, role "물리 근접 딜러") and 리아 (girl adventurer with staff, role "마법 원거리 딜러") using the attached C01 and C02 character references, a line "고르지 않은 주인공은 먼 훗날 동료로 만나요", confirm button.""",
    },
    {
        "id": "ui12", "title": "12단계 · 공통 컴포넌트 키트 (잘라 쓰는 원본)",
        "decide": ["버튼 모양·상태", "패널·팝업 틀", "토스트·배지·뱃지"],
        "body": """Create a UI component kit sheet (1536x1024 landscape, TRANSPARENT background, NO TEXT inside components — text is added by the game) in the chosen direction ({choice}):
primary button (normal/pressed/disabled), secondary button (3 states), small round icon button, tab bar background, top status bar background, panel frame (9-slice friendly: clear corners and straight edges), popup frame with header ribbon, bottom sheet frame with grab handle, toast bubble, red notification badge, gold stage-node hexagon (locked/open/cleared/current/boss/elite), progress bar frame, star (empty/full), divider ornament with compass star.""",
    },
]
