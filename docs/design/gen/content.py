# -*- coding: utf-8 -*-
"""HEXA FRONTIER 디자인용 GPT 이미지 프롬프트 묶음 (D127, D132 전면 신규).
여기를 고치고 `python3 docs/design/gen/build.py` 를 실행하면 마크다운과 HTML이 함께 만들어진다."""

STYLE = """[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it."""

SPRITE_GRID = """- Canvas 1536x1024, TRANSPARENT background, an invisible grid of {cols} columns x {rows} rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell."""

SPIRIT_SHEET = """Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
""" + SPRITE_GRID.format(cols=4, rows=3) + """
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its {attack}), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- {role_hint}
Spirit {code} "{en}" ({ko}) — {el} element, {role_en}.
Design: {desc}
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans."""

ROLE_HINT = {
    "탱커": "Tank: sturdy, wide, heavy silhouette, protective shell/plates.",
    "근딜": "Melee dealer: agile, aggressive stance, claws/horns/blade-like body parts.",
    "원딜": "Ranged dealer: keeps distance, shoots from its own body parts (no man-made guns or bows unless the design says so).",
    "힐러": "Healer: soft round silhouette, gentle face, glowing healing motif.",
    "서포터": "Supporter: charming, expressive, carries a natural buff/debuff motif (song, pollen, drum, bubbles).",
}

PORTRAIT = """Create the PORTRAIT SET for the HEXA FRONTIER character shown in the ATTACHED SPRITE SHEET (same character, same colors, same design — copy it exactly).
- Canvas 1536x1024, TRANSPARENT background, three head-and-shoulders portraits side by side in an invisible 3-column grid: left = {a}, center = {b}, right = {c}.
- Each portrait fits a 460x460 square area, same framing for all three: top of head (ears/horns included) at 8% of the square, chest cut at the bottom edge, face turned slightly to the viewer's left, lively expression.
- No background color, no frame, no circle, no text — the game adds frames. Nothing touches another portrait."""

ELEMENT_LINEUP = """Create a DESIGN LINEUP of all 12 {el_en} spirits of HEXA FRONTIER in their Lv.1 baby forms, to lock the designs and the relative scale before making individual sprite sheets.
- Canvas 1536x1024, TRANSPARENT background, two rows of 6 creatures, all standing on the same invisible baseline per row, all at the same scale (tanks slightly bigger, supporters slightly smaller), plenty of space between them.
- Under each creature a small plain label with its code only (e.g. "{sample}").
- No ground, no tiles, no shadows.
Creatures in order (row 1 then row 2):
{lst}"""

MONSTER_SHEET = """Create the GAME SPRITE SHEET for one HEXA FRONTIER RIFT MONSTER (enemy unit, game-ready asset).
""" + SPRITE_GRID.format(cols=4, rows=2) + """
- Rows: row 1 "NORMAL", row 2 "ELITE" (bigger horns/spikes, gold-violet trim, small crown of rift crystals). NORMAL about 65% of the cell height, ELITE about 85%.
- Columns: 1 IDLE, 2 ATTACK, 3 HURT, 4 KO (collapsed, rift crystal dimmed).
- Rift monster design language: corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, menacing red-violet glowing eyes, but the same cute SD proportions and rendering as the spirits. Never a copy of a spirit.
Monster "{en}" ({ko}) — {el} element, role {role}: {desc}"""

BOSS_SHEET = """Create the GAME SPRITE SHEET for one HEXA FRONTIER {kind} (game-ready asset, epic but readable).
""" + SPRITE_GRID.format(cols=3, rows=2) + """
- Cells: row 1 = IDLE, ATTACK, SKILL (signature move, strongest pose); row 2 = HURT, KO, {extra}.
- The boss fills about 88% of the cell height in every cell (it is shown 1.5x larger than normal units in the game).
- Same rift corruption language as the Rift monsters (violet hex cracks, rift crystals) plus a subtle boss aura that stays close to the body (no aura filling the cell).
Boss "{en}" ({ko}) — stage {stage}, element {el}: {desc}"""

HERO_SHEET = """Create the GAME SPRITE SHEET for the HEXA FRONTIER main hero "{en}" ({ko}). Use the attached character reference ({ref}) ONLY for the face, hair, outfit and colors — redraw the character as a clean game sprite in the STYLE BIBLE, without any base, tile or background from the reference.
""" + SPRITE_GRID.format(cols=4, rows=2) + """
- Character about 80% of the cell height in every cell, SD proportions matching the spirits (head 1:2).
- Row 1: IDLE, WALK (mid-step), ATTACK ({attack}), SKILL ({skill}). Row 2: HURT, KO (kneeling down, exhausted), VICTORY (cheerful pose), COMMAND (raising a hand/weapon to rally allies, small golden glow).
Hero: {desc}"""

EFFECT = """Create a game skill effect sprite sheet, 1536x1024, TRANSPARENT background, a 4 x 2 grid of 8 animation frames read left-to-right, top-to-bottom (each frame 384x512), effect centered in every frame and the same scale in every frame.
Style: HEXA FRONTIER painterly anime VFX — soft glow, crisp stylized shapes, small sparkle particles, no characters, no text. The effect must read on top of a small chibi unit standing on a hex (the unit occupies the lower-middle of the frame).
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

# ───────────────────────── 스피릿 60 (D132: 전부 새로 그림, 기존 시트 재사용 없음) ─────────────────────────
# (속성, 역할, 코드, 한글, 영문, 물리/마법 p|m, 공격 동작, 디자인: "기본형; Lv.10; Lv.25")
SPIRITS = [
    # 숲
    ("숲", "탱커", "F-T1", "모스백", "Mossback", "p", "shell bash", "a sturdy mossy tortoise with a tiny sapling and mushrooms on its domed shell; Lv.10 the shell becomes layered bark armor; Lv.25 an ancient guardian tortoise whose tree crown blossoms with glowing green runes"),
    ("숲", "탱커", "F-T2", "스텀프배저", "Stumpbadger", "p", "shoulder charge", "a chubby badger with bark-plated shoulders and a leafy tuft, standing on its hind legs; Lv.10 thick log pauldrons and moss cloak; Lv.25 broad bark-armored badger chief with a ring of mushrooms on its back"),
    ("숲", "탱커", "F-T3", "루트라이노", "Rootrhino", "p", "horn ram", "a baby rhino whose hide is woven from living roots, with a smooth wooden horn; Lv.10 vine-wrapped armor and a sprouting horn; Lv.25 massive rhino with a blooming tree-horn and root greaves"),
    ("숲", "근딜", "F-M1", "리프링스", "Leaflynx", "p", "leaf-blade claw swipe", "a lynx kitten whose ear tufts and tail tip are sharp leaf blades; Lv.10 leaf-blade forearms; Lv.25 sleek forest lynx with a mane of razor leaves"),
    ("숲", "근딜", "F-M2", "브램블울프", "Bramblewolf", "p", "thorn bite lunge", "a wolf pup with a bramble-thorn mane and green eyes; Lv.10 thorn spikes along the spine; Lv.25 proud alpha wolf with a crown of blooming thorns"),
    ("숲", "근딜", "F-M3", "바인폭스", "Vinefox", "m", "glowing vine-tail whip", "a fox kit with two tails made of glowing green vines that whip with nature magic; Lv.10 three vine tails with flower buds; Lv.25 elegant fox with five luminous vine tails blooming at the tips"),
    ("숲", "원딜", "F-R1", "시드샷", "Seedshot", "p", "seed-pod sling shot", "a fluffy squirrel with an acorn-cap helmet that flings exploding seed pods from a little vine slingshot; Lv.10 leaf bandolier of seed pods; Lv.25 forest ranger squirrel with a living-vine slingshot"),
    ("숲", "원딜", "F-R2", "글로우프로그", "Glowfrog", "m", "green energy bubble blast from its throat sac", "a round tree frog with a glowing green throat sac and leaf-pad hands; Lv.10 glowing spots along its back; Lv.25 large crowned frog with a lotus on its head and radiant markings"),
    ("숲", "원딜", "F-R3", "쏜비틀", "Thornbeetle", "p", "thorn spike volley from its opened back", "a round rhinoceros beetle whose back opens like a turret to shoot thorn spikes; Lv.10 armored with mossy plates; Lv.25 heavy stag beetle with a thorn-cannon horn"),
    ("숲", "힐러", "F-H1", "블룸디어", "Bloomdeer", "m", "petal shower (healing)", "a gentle spotted fawn with small flower-bud antlers; Lv.10 antlers in full bloom with hanging petals; Lv.25 graceful white-green deer with glowing blossom antlers and a flower garland"),
    ("숲", "서포터", "F-S1", "페탈모스", "Petalmoth", "m", "glowing pollen burst (ally buff)", "a round fuzzy moth with flower-petal wings scattering glowing pollen; Lv.10 larger patterned wings; Lv.25 majestic luna-moth with a flower crown and trailing pollen ribbons"),
    ("숲", "서포터", "F-S2", "모스로스", "Mossloth", "m", "sleepy pollen yawn (enemy debuff)", "a sleepy baby sloth with mossy fur and tiny sprouting leaves; Lv.10 hanging flower vines on its arms; Lv.25 serene sloth with a small garden growing on its back"),
    # 불
    ("불", "탱커", "Fi-T1", "마그마크랩", "Magmacrab", "p", "big-claw slam", "a hermit crab carrying a volcanic rock shell with glowing lava cracks and one oversized shield claw; Lv.10 obsidian plating; Lv.25 fortress crab whose shell is a small erupting volcano"),
    ("불", "탱커", "Fi-T2", "신더록스", "Cinderox", "p", "horn charge", "a stocky ox calf with basalt-plated horns and a smoldering mane; Lv.10 obsidian shoulder plates; Lv.25 huge ox with molten-cracked armor and flaming horn tips"),
    ("불", "탱커", "Fi-T3", "킬른골렘", "Kilngolem", "p", "heavy fist pound", "a small round clay-kiln golem with a cozy fire glowing through a window in its belly; Lv.10 iron bands and a little chimney; Lv.25 massive forge golem with chimney shoulders and a roaring furnace core"),
    ("불", "근딜", "Fi-M1", "신더팽", "Cinderfang", "p", "ember-claw slash", "a bipedal salamander kid with ember-tipped claws and a burning tail tip; Lv.10 scale armor; Lv.25 dragon-like salamander warrior with obsidian plates and twin flame claws"),
    ("불", "근딜", "Fi-M2", "차르보어", "Charboar", "p", "molten tusk gore", "a piglet boar with glowing molten tusks and a soot-black bristle crest; Lv.10 longer tusks and ember back spikes; Lv.25 giant war boar with magma-veined tusks"),
    ("불", "근딜", "Fi-M3", "파이로타이거", "Pyrotiger", "m", "fire-magic claw combo", "a tiger cub whose stripes burn like living flame; Lv.10 fiery mane and flame paws; Lv.25 majestic blazing tiger with a halo of fire stripes"),
    ("불", "원딜", "Fi-R1", "스파크호그", "Sparkhog", "p", "flaming quill shot", "a hedgehog whose quills are flaming spikes it fires at enemies; Lv.10 longer glowing quills; Lv.25 porcupine with a blazing quill crown"),
    ("불", "원딜", "Fi-R2", "애쉬드레이크", "Ashdrake", "m", "fireball breath", "a small round dragon with ash-grey scales and a glowing magma belly; Lv.10 bigger wings; Lv.25 proud drake with a molten horn crest"),
    ("불", "원딜", "Fi-R3", "플레어카멜레온", "Flarechameleon", "p", "ember dart spit", "a chameleon with a curled flame tail that spits ember darts; Lv.10 glowing color-shifting scales; Lv.25 regal chameleon with a frill of flames"),
    ("불", "힐러", "Fi-H1", "엠버판다", "Emberpanda", "m", "warm tail glow (healing)", "a red panda with a softly glowing warm tail like a hearth; Lv.10 lantern-like tail rings; Lv.25 serene red panda with a phoenix-flame tail"),
    ("불", "서포터", "Fi-S1", "하스펍", "Hearthpup", "m", "warm howl (ally buff)", "a chubby puppy carrying a glowing hearth-lantern on its back; Lv.10 the lantern becomes a small brazier saddle; Lv.25 noble hound with a phoenix-shaped hearth"),
    ("불", "서포터", "Fi-S2", "킨들핀치", "Kindlefinch", "m", "rallying song", "a bright songbird with ember feathers; Lv.10 longer flame tail; Lv.25 phoenix-like songbird with flaming tail ribbons"),
    # 물
    ("물", "탱커", "W-T1", "터스크월러스", "Tuskwalrus", "p", "tusk slam", "a chubby walrus pup with pearl-white tusks and shell pauldrons; Lv.10 coral armor plates; Lv.25 mighty walrus with ice-coral tusks and a barnacle-shield back"),
    ("물", "탱커", "W-T2", "클램가드", "Clamguard", "p", "shell snap", "a big clam creature with stubby legs and curious eyes peeking from its shell; Lv.10 spiked shell edges; Lv.25 giant pearl-clam guardian with a glowing pearl core"),
    ("물", "탱커", "W-T3", "하이드로히포", "Hydrohippo", "p", "body splash slam", "a baby hippo with a water-sheened hide and lily pads on its back; Lv.10 water-armor plates; Lv.25 huge hippo wearing flowing tidal armor"),
    ("물", "근딜", "W-M1", "오르카", "Orcablade", "p", "fin-blade slash", "a bipedal baby orca with fin-shaped forearm blades; Lv.10 coral gauntlets; Lv.25 orca champion with tidal fin blades and shell armor"),
    ("물", "근딜", "W-M2", "클로스터", "Clawster", "p", "pincer crush", "a bright blue lobster with oversized pincers; Lv.10 spiked shell; Lv.25 armored lobster knight with huge crushing claws"),
    ("물", "근딜", "W-M3", "타이드아홀로틀", "Tidelotl", "m", "water-magic tail whip", "an axolotl with glowing frilly gills and a water-ribbon tail; Lv.10 longer luminous gills; Lv.25 graceful axolotl with flowing tide ribbons orbiting it"),
    ("물", "원딜", "W-R1", "퍼퍼샷", "Puffershot", "p", "water spike volley", "a pufferfish floating inside a water bubble that shoots water spikes; Lv.10 coral armor spines; Lv.25 armored puffer with coral cannons"),
    ("물", "원딜", "W-R2", "나르왈", "Narwhorn", "m", "water beam from its horn", "a floating narwhal calf with a spiral crystal horn; Lv.10 glowing horn and fin rings; Lv.25 majestic narwhal with a radiant tidal horn"),
    ("물", "원딜", "W-R3", "스냅쉬림프", "Snapshrimp", "p", "snapping shockwave bubble", "a pistol shrimp with one oversized snapping claw; Lv.10 armored carapace; Lv.25 heavy shrimp gunner with a glowing cannon claw"),
    ("물", "힐러", "W-H1", "타이드포니", "Tidepony", "m", "pearl bubble healing", "a seahorse with a pearl on its forehead floating in a small water swirl; Lv.10 flowing fins; Lv.25 elegant seahorse with a pearl crown and healing water ribbons"),
    ("물", "서포터", "W-S1", "버블롯", "Bubblot", "m", "protective bubble blow", "a sea otter holding a shell that blows protective bubble shields; Lv.10 kelp scarf; Lv.25 otter with a glowing pearl and a bubble halo"),
    ("물", "서포터", "W-S2", "펭드럼", "Pengdrum", "m", "belly drum (enemy debuff)", "a round penguin chick that drums on its belly; Lv.10 shell drum and scarf; Lv.25 proud emperor penguin with a frost-crystal drum"),
    # 바람
    ("바람", "탱커", "Wi-T1", "님버스램", "Nimbusram", "p", "horn ram", "a ram whose wool is a thick storm cloud and whose curled horns crackle with tiny sparks; Lv.10 bigger cloud mane; Lv.25 thunderhead ram with lightning-etched horns"),
    ("바람", "탱커", "Wi-T2", "스카이웨일", "Skywhale", "p", "body slam", "a floating baby whale with cloud-puff fins; Lv.10 cloud armor on its back; Lv.25 huge sky whale with a cloud fortress on its back"),
    ("바람", "탱커", "Wi-T3", "게일베어", "Galebear", "p", "wind-guard paw slam", "a fluffy white bear cub with a feathered mantle around its shoulders; Lv.10 feather pauldrons; Lv.25 great storm bear with wing-like feather armor"),
    ("바람", "근딜", "Wi-M1", "게일헤어", "Galehare", "p", "wind kick", "a rabbit with sickle-shaped ears that kicks wind blades; Lv.10 wind wraps on its legs; Lv.25 swift hare with crescent ears and a gale scarf"),
    ("바람", "근딜", "Wi-M2", "블레이드크레인", "Bladecrane", "p", "sword-wing strike", "a crane chick with sword-like wing feathers; Lv.10 longer steel-sheen feathers; Lv.25 elegant crane with blade wings and a red crest"),
    ("바람", "근딜", "Wi-M3", "볼트펍", "Voltpup", "m", "lightning-magic pounce", "a weasel-dog pup crackling with tiny lightning; Lv.10 lightning-bolt tail; Lv.25 sleek thunder beast with a storm-cloud mane"),
    ("바람", "원딜", "Wi-R1", "페더스위프트", "Featherswift", "p", "feather dart shot", "a swallow that shoots sharp feather darts; Lv.10 forked tail streamers; Lv.25 swift swallow with gleaming dart feathers"),
    ("바람", "원딜", "Wi-R2", "스톰카이트", "Stormkite", "m", "wind blade slice from its fins", "a kite-shaped flying sky ray; Lv.10 longer tail ribbons; Lv.25 thunder-striped sky ray with glowing fin edges"),
    ("바람", "원딜", "Wi-R3", "게일플라이", "Galefly", "p", "air bolt shot", "a big-eyed dragonfly with crystal wings that fires compressed air bolts; Lv.10 four glowing wings; Lv.25 royal dragonfly with jewel-like wings"),
    ("바람", "힐러", "Wi-H1", "클라우드파카", "Cloudpaca", "m", "soft healing mist", "an alpaca with fluffy cloud wool; Lv.10 rainbow-tinted wool tufts; Lv.25 serene alpaca with a halo of drifting clouds"),
    ("바람", "서포터", "Wi-S1", "윈드차임", "Windchime", "m", "chime ring (ally buff)", "a small round owl whose tail feathers are wind chimes; Lv.10 crystal chimes; Lv.25 great owl with a halo of floating chimes"),
    ("바람", "서포터", "Wi-S2", "브리즈글라이더", "Breezeglider", "m", "gust swirl (enemy debuff)", "a sugar glider with mint gliding membranes trailing breezes; Lv.10 wind-ribbon tail; Lv.25 graceful glider with shimmering wing membranes"),
    # 대지
    ("대지", "탱커", "E-T1", "아이언딜로", "Irondillo", "p", "rolling tackle", "an armadillo with iron-ore plated shell that curls into a rolling fortress; Lv.10 studded plates; Lv.25 massive armadillo with amber crystal spikes"),
    ("대지", "탱커", "E-T2", "스톤펀트", "Stonephant", "p", "trunk-and-tusk stomp", "a baby elephant with stone plating on its back and forehead; Lv.10 rock tusks; Lv.25 colossal stone elephant with amber-crystal armor"),
    ("대지", "탱커", "E-T3", "안킬로", "Ankylo", "p", "crystal club tail swing", "a little ankylosaur with a crystal club tail; Lv.10 spiked rock plates; Lv.25 giant ankylosaur with an amber-crystal club"),
    ("대지", "근딜", "E-M1", "볼더에이프", "Boulderape", "p", "stone fist punch", "a bipedal gorilla kid with stone fists; Lv.10 rock gauntlets and shoulder plates; Lv.25 mighty gorilla with boulder fists and a crystal crest"),
    ("대지", "근딜", "E-M2", "락조", "Rockjaw", "p", "chomping bite", "a small crocodile with stone back plates and a big grin; Lv.10 spiked stone armor; Lv.25 armored crocodile with a granite jaw"),
    ("대지", "근딜", "E-M3", "쿼츠맨티스", "Quartzmantis", "m", "crystal scythe slash", "a praying mantis with quartz-crystal scythe arms; Lv.10 crystal armor; Lv.25 amethyst-blade mantis master"),
    ("대지", "원딜", "E-R1", "볼더몰", "Bouldermole", "p", "boulder throw", "a mole wearing a little mining helmet who hurls boulders; Lv.10 rock gauntlets; Lv.25 drill-gauntlet mole with an ore backpack"),
    ("대지", "원딜", "E-R2", "지오드스콜피온", "Geodescorp", "m", "crystal shard shot from its tail", "a scorpion whose tail tip is a cracked geode; Lv.10 crystal plating; Lv.25 amber-crystal scorpion"),
    ("대지", "원딜", "E-R3", "샌드카멜", "Sandcamel", "p", "sand ball spit", "a baby camel that spits hardened sand balls; Lv.10 woven saddle with rock pouches; Lv.25 sturdy desert camel with crystal-studded humps"),
    ("대지", "힐러", "E-H1", "클레이바라", "Claybara", "m", "warm clay healing", "a calm capybara with a little mud-spa bowl and a pebble on its head; Lv.10 amber pebbles on its back; Lv.25 serene capybara with a glowing amber hot-spring halo"),
    ("대지", "서포터", "E-S1", "듄페넥", "Dunefennec", "m", "sand drum rhythm (enemy debuff)", "a fennec fox with a sand drum strapped to its back; Lv.10 bigger drum with charms; Lv.25 desert fennec with a golden sun-drum"),
    ("대지", "서포터", "E-S2", "쿼츠햄", "Quartzham", "m", "crystal shield raise (ally buff)", "a hamster that builds tiny crystal shields with its paws; Lv.10 crystal cheek pouches; Lv.25 proud hamster with a floating ring of crystal shields"),
]
HEROES = [
    ("C01", "아렌", "Aren", "C01.png", "sword slash", "a rising sword strike with a golden arc", "a young boy adventurer with a sword, physical melee dealer, brave and cheerful"),
    ("C02", "리아", "Lia", "C02.png", "star-orb throw", "a shooting-star spell from her staff tip", "a young girl adventurer with a staff, magic ranged dealer, bright and kind"),
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
(2) NEW SPIRIT JOINS: a dramatic reveal of a new spirit "퍼퍼샷 합류!" with its full art standing in a burst of light, element and role tags, button "부대에서 보기".
(3) DEFEAT: muted banner "패배…", reason line, and helpful next-step buttons: "앞 판에서 경험치 벌기", "편성 바꾸기 (▲상성 추천)", "장비 바꾸기", "다시 도전".""",
    },
    {
        "id": "ui8", "title": "8단계 · 부대 탭 (목록 + 스피릿 상세)",
        "decide": ["목록 정렬·필터(속성/역할)", "진화 단계 보여 주기", "장비 3칸·성장의 결정 위치"],
        "body": """Draw TWO phone screens side by side (1536x1024 landscape):
(1) 부대 list: filter chips by element (💧🔥🌿⛰️🌪️) and role (탱커/근딜/원딜/힐러/서포터), a 4-column grid of spirit cards (portrait, level, element dot, role icon, small "출전" badge on party members).
(2) Spirit detail for "터스크월러스": large full-body art on a soft light circle with evolution track (Lv.1 → Lv.10 → Lv.25, current stage highlighted), stats (체력, 공격, 방어, 마법방어, 이동력, 사거리, SP), two skills (one locked until Lv.5), equipment slots (무기/갑옷/장신구), XP bar, button "🔶 성장의 결정 쓰기".""",
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
