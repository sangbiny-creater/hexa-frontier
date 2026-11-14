# HEXA FRONTIER 디자인 · GPT 이미지 프롬프트 (D127)

content.py에서 만들어짐 — 고칠 때는 `docs/design/gen/content.py`를 고치고 `python3 docs/design/gen/build.py`.

## 사용법

**모든 캐릭터는 게임 전용 스프라이트로 새로 그립니다.** 기존 S0x 시트는 바닥에 헥사가 붙어 있어 이동할 때 헥사 모양이 바뀌고 깨지므로 **하나도 쓰지 않고, 레퍼런스로도 첨부하지 않습니다.**

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


## 스타일 바이블

모든 프롬프트 맨 위에 들어가는 공통 블록입니다. 화풍·빛·카메라·**받침 없는 투명 스프라이트 규칙**을 고정해서 60종 스피릿, 몬스터, 보스, UI가 한 게임처럼 보이게 합니다.

### 공통 STYLE BIBLE

> 모든 프롬프트에 이미 포함되어 있어요. 따로 쓸 때만 복사.

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.
```

### 초상 세트 (공용) — 스피릿 Lv.1/10/25

> 확정된 스프라이트 시트를 첨부하고 그대로 붙여 넣기 → `코드-P.png`

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the PORTRAIT SET for the HEXA FRONTIER character shown in the ATTACHED SPRITE SHEET (same character, same colors, same design — copy it exactly).
- Canvas 1536x1024, TRANSPARENT background, three head-and-shoulders portraits side by side in an invisible 3-column grid: left = Lv.1 form, center = Lv.10 form, right = Lv.25 form.
- Each portrait fits a 460x460 square area, same framing for all three: top of head (ears/horns included) at 8% of the square, chest cut at the bottom edge, face turned slightly to the viewer's left, lively expression.
- No background color, no frame, no circle, no text — the game adds frames. Nothing touches another portrait.
```

### 초상 세트 (공용) — 몬스터·보스·주인공

> 몬스터: 일반/정예/정예 화남 · 보스·주인공: 평소/화남(진지)/웃음

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the PORTRAIT SET for the HEXA FRONTIER character shown in the ATTACHED SPRITE SHEET (same character, same colors, same design — copy it exactly).
- Canvas 1536x1024, TRANSPARENT background, three head-and-shoulders portraits side by side in an invisible 3-column grid: left = calm / normal, center = angry or serious (elite version for monsters), right = happy or enraged (pick what fits the character).
- Each portrait fits a 460x460 square area, same framing for all three: top of head (ears/horns included) at 8% of the square, chest cut at the bottom edge, face turned slightly to the viewer's left, lively expression.
- No background color, no frame, no circle, no text — the game adds frames. Nothing touches another portrait.
```

## 스피릿 60종 (전부 새로)

속성마다 **탱커 3 · 근딜 3 · 원딜 3 · 힐러 1 · 서포터 2 = 12종**, 5속성 × 12 = **60종 모두 새 디자인**입니다. 기존 시트는 재사용하지 않습니다.
모두 동물·짐승·원소 생물이고 마법사형은 없습니다. 한 장 = **스프라이트 시트**(진화 3단계 × 대기·공격·피격·쓰러짐 4동작, 투명 배경, 받침 없음). 초상은 확정된 시트를 첨부해 '초상 세트' 공용 프롬프트로 받습니다.
**순서**: 속성 라인업 5장 → 마음에 들면 개별 시트 60장.

| 코드 | 속성 | 역할 | 이름 | 모습 (기본형) |
|---|---|---|---|---|
| F-T1 | 숲 | 탱커 | 모스백 (Mossback) | a sturdy mossy tortoise with a tiny sapling and mushrooms on its domed shell |
| F-T2 | 숲 | 탱커 | 스텀프배저 (Stumpbadger) | a chubby badger with bark-plated shoulders and a leafy tuft, standing on its hind legs |
| F-T3 | 숲 | 탱커 | 루트라이노 (Rootrhino) | a baby rhino whose hide is woven from living roots, with a smooth wooden horn |
| F-M1 | 숲 | 근딜(물리) | 리프링스 (Leaflynx) | a lynx kitten whose ear tufts and tail tip are sharp leaf blades |
| F-M2 | 숲 | 근딜(물리) | 브램블울프 (Bramblewolf) | a wolf pup with a bramble-thorn mane and green eyes |
| F-M3 | 숲 | 근딜(마법) | 바인폭스 (Vinefox) | a fox kit with two tails made of glowing green vines that whip with nature magic |
| F-R1 | 숲 | 원딜(물리) | 시드샷 (Seedshot) | a fluffy squirrel with an acorn-cap helmet that flings exploding seed pods from a little vine slingshot |
| F-R2 | 숲 | 원딜(마법) | 글로우프로그 (Glowfrog) | a round tree frog with a glowing green throat sac and leaf-pad hands |
| F-R3 | 숲 | 원딜(물리) | 쏜비틀 (Thornbeetle) | a round rhinoceros beetle whose back opens like a turret to shoot thorn spikes |
| F-H1 | 숲 | 힐러 | 블룸디어 (Bloomdeer) | a gentle spotted fawn with small flower-bud antlers |
| F-S1 | 숲 | 서포터 | 페탈모스 (Petalmoth) | a round fuzzy moth with flower-petal wings scattering glowing pollen |
| F-S2 | 숲 | 서포터 | 모스로스 (Mossloth) | a sleepy baby sloth with mossy fur and tiny sprouting leaves |
| Fi-T1 | 불 | 탱커 | 마그마크랩 (Magmacrab) | a hermit crab carrying a volcanic rock shell with glowing lava cracks and one oversized shield claw |
| Fi-T2 | 불 | 탱커 | 신더록스 (Cinderox) | a stocky ox calf with basalt-plated horns and a smoldering mane |
| Fi-T3 | 불 | 탱커 | 킬른골렘 (Kilngolem) | a small round clay-kiln golem with a cozy fire glowing through a window in its belly |
| Fi-M1 | 불 | 근딜(물리) | 신더팽 (Cinderfang) | a bipedal salamander kid with ember-tipped claws and a burning tail tip |
| Fi-M2 | 불 | 근딜(물리) | 차르보어 (Charboar) | a piglet boar with glowing molten tusks and a soot-black bristle crest |
| Fi-M3 | 불 | 근딜(마법) | 파이로타이거 (Pyrotiger) | a tiger cub whose stripes burn like living flame |
| Fi-R1 | 불 | 원딜(물리) | 스파크호그 (Sparkhog) | a hedgehog whose quills are flaming spikes it fires at enemies |
| Fi-R2 | 불 | 원딜(마법) | 애쉬드레이크 (Ashdrake) | a small round dragon with ash-grey scales and a glowing magma belly |
| Fi-R3 | 불 | 원딜(물리) | 플레어카멜레온 (Flarechameleon) | a chameleon with a curled flame tail that spits ember darts |
| Fi-H1 | 불 | 힐러 | 엠버판다 (Emberpanda) | a red panda with a softly glowing warm tail like a hearth |
| Fi-S1 | 불 | 서포터 | 하스펍 (Hearthpup) | a chubby puppy carrying a glowing hearth-lantern on its back |
| Fi-S2 | 불 | 서포터 | 킨들핀치 (Kindlefinch) | a bright songbird with ember feathers |
| W-T1 | 물 | 탱커 | 터스크월러스 (Tuskwalrus) | a chubby walrus pup with pearl-white tusks and shell pauldrons |
| W-T2 | 물 | 탱커 | 클램가드 (Clamguard) | a big clam creature with stubby legs and curious eyes peeking from its shell |
| W-T3 | 물 | 탱커 | 하이드로히포 (Hydrohippo) | a baby hippo with a water-sheened hide and lily pads on its back |
| W-M1 | 물 | 근딜(물리) | 오르카 (Orcablade) | a bipedal baby orca with fin-shaped forearm blades |
| W-M2 | 물 | 근딜(물리) | 클로스터 (Clawster) | a bright blue lobster with oversized pincers |
| W-M3 | 물 | 근딜(마법) | 타이드아홀로틀 (Tidelotl) | an axolotl with glowing frilly gills and a water-ribbon tail |
| W-R1 | 물 | 원딜(물리) | 퍼퍼샷 (Puffershot) | a pufferfish floating inside a water bubble that shoots water spikes |
| W-R2 | 물 | 원딜(마법) | 나르왈 (Narwhorn) | a floating narwhal calf with a spiral crystal horn |
| W-R3 | 물 | 원딜(물리) | 스냅쉬림프 (Snapshrimp) | a pistol shrimp with one oversized snapping claw |
| W-H1 | 물 | 힐러 | 타이드포니 (Tidepony) | a seahorse with a pearl on its forehead floating in a small water swirl |
| W-S1 | 물 | 서포터 | 버블롯 (Bubblot) | a sea otter holding a shell that blows protective bubble shields |
| W-S2 | 물 | 서포터 | 펭드럼 (Pengdrum) | a round penguin chick that drums on its belly |
| Wi-T1 | 바람 | 탱커 | 님버스램 (Nimbusram) | a ram whose wool is a thick storm cloud and whose curled horns crackle with tiny sparks |
| Wi-T2 | 바람 | 탱커 | 스카이웨일 (Skywhale) | a floating baby whale with cloud-puff fins |
| Wi-T3 | 바람 | 탱커 | 게일베어 (Galebear) | a fluffy white bear cub with a feathered mantle around its shoulders |
| Wi-M1 | 바람 | 근딜(물리) | 게일헤어 (Galehare) | a rabbit with sickle-shaped ears that kicks wind blades |
| Wi-M2 | 바람 | 근딜(물리) | 블레이드크레인 (Bladecrane) | a crane chick with sword-like wing feathers |
| Wi-M3 | 바람 | 근딜(마법) | 볼트펍 (Voltpup) | a weasel-dog pup crackling with tiny lightning |
| Wi-R1 | 바람 | 원딜(물리) | 페더스위프트 (Featherswift) | a swallow that shoots sharp feather darts |
| Wi-R2 | 바람 | 원딜(마법) | 스톰카이트 (Stormkite) | a kite-shaped flying sky ray |
| Wi-R3 | 바람 | 원딜(물리) | 게일플라이 (Galefly) | a big-eyed dragonfly with crystal wings that fires compressed air bolts |
| Wi-H1 | 바람 | 힐러 | 클라우드파카 (Cloudpaca) | an alpaca with fluffy cloud wool |
| Wi-S1 | 바람 | 서포터 | 윈드차임 (Windchime) | a small round owl whose tail feathers are wind chimes |
| Wi-S2 | 바람 | 서포터 | 브리즈글라이더 (Breezeglider) | a sugar glider with mint gliding membranes trailing breezes |
| E-T1 | 대지 | 탱커 | 아이언딜로 (Irondillo) | an armadillo with iron-ore plated shell that curls into a rolling fortress |
| E-T2 | 대지 | 탱커 | 스톤펀트 (Stonephant) | a baby elephant with stone plating on its back and forehead |
| E-T3 | 대지 | 탱커 | 안킬로 (Ankylo) | a little ankylosaur with a crystal club tail |
| E-M1 | 대지 | 근딜(물리) | 볼더에이프 (Boulderape) | a bipedal gorilla kid with stone fists |
| E-M2 | 대지 | 근딜(물리) | 락조 (Rockjaw) | a small crocodile with stone back plates and a big grin |
| E-M3 | 대지 | 근딜(마법) | 쿼츠맨티스 (Quartzmantis) | a praying mantis with quartz-crystal scythe arms |
| E-R1 | 대지 | 원딜(물리) | 볼더몰 (Bouldermole) | a mole wearing a little mining helmet who hurls boulders |
| E-R2 | 대지 | 원딜(마법) | 지오드스콜피온 (Geodescorp) | a scorpion whose tail tip is a cracked geode |
| E-R3 | 대지 | 원딜(물리) | 샌드카멜 (Sandcamel) | a baby camel that spits hardened sand balls |
| E-H1 | 대지 | 힐러 | 클레이바라 (Claybara) | a calm capybara with a little mud-spa bowl and a pebble on its head |
| E-S1 | 대지 | 서포터 | 듄페넥 (Dunefennec) | a fennec fox with a sand drum strapped to its back |
| E-S2 | 대지 | 서포터 | 쿼츠햄 (Quartzham) | a hamster that builds tiny crystal shields with its paws |

### LINEUP-W · 물 속성 12종 라인업

> 물 라인업부터 받아서 화풍·비율을 먼저 확정하세요

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a DESIGN LINEUP of all 12 WATER spirits of HEXA FRONTIER in their Lv.1 baby forms, to lock the designs and the relative scale before making individual sprite sheets.
- Canvas 1536x1024, TRANSPARENT background, two rows of 6 creatures, all standing on the same invisible baseline per row, all at the same scale (tanks slightly bigger, supporters slightly smaller), plenty of space between them.
- Under each creature a small plain label with its code only (e.g. "W-T1").
- No ground, no tiles, no shadows.
Creatures in order (row 1 then row 2):
1. W-T1 Tuskwalrus (탱커): a chubby walrus pup with pearl-white tusks and shell pauldrons
2. W-T2 Clamguard (탱커): a big clam creature with stubby legs and curious eyes peeking from its shell
3. W-T3 Hydrohippo (탱커): a baby hippo with a water-sheened hide and lily pads on its back
4. W-M1 Orcablade (근딜): a bipedal baby orca with fin-shaped forearm blades
5. W-M2 Clawster (근딜): a bright blue lobster with oversized pincers
6. W-M3 Tidelotl (근딜): an axolotl with glowing frilly gills and a water-ribbon tail
7. W-R1 Puffershot (원딜): a pufferfish floating inside a water bubble that shoots water spikes
8. W-R2 Narwhorn (원딜): a floating narwhal calf with a spiral crystal horn
9. W-R3 Snapshrimp (원딜): a pistol shrimp with one oversized snapping claw
10. W-H1 Tidepony (힐러): a seahorse with a pearl on its forehead floating in a small water swirl
11. W-S1 Bubblot (서포터): a sea otter holding a shell that blows protective bubble shields
12. W-S2 Pengdrum (서포터): a round penguin chick that drums on its belly
```

### LINEUP-Fi · 불 속성 12종 라인업

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a DESIGN LINEUP of all 12 FIRE spirits of HEXA FRONTIER in their Lv.1 baby forms, to lock the designs and the relative scale before making individual sprite sheets.
- Canvas 1536x1024, TRANSPARENT background, two rows of 6 creatures, all standing on the same invisible baseline per row, all at the same scale (tanks slightly bigger, supporters slightly smaller), plenty of space between them.
- Under each creature a small plain label with its code only (e.g. "Fi-T1").
- No ground, no tiles, no shadows.
Creatures in order (row 1 then row 2):
1. Fi-T1 Magmacrab (탱커): a hermit crab carrying a volcanic rock shell with glowing lava cracks and one oversized shield claw
2. Fi-T2 Cinderox (탱커): a stocky ox calf with basalt-plated horns and a smoldering mane
3. Fi-T3 Kilngolem (탱커): a small round clay-kiln golem with a cozy fire glowing through a window in its belly
4. Fi-M1 Cinderfang (근딜): a bipedal salamander kid with ember-tipped claws and a burning tail tip
5. Fi-M2 Charboar (근딜): a piglet boar with glowing molten tusks and a soot-black bristle crest
6. Fi-M3 Pyrotiger (근딜): a tiger cub whose stripes burn like living flame
7. Fi-R1 Sparkhog (원딜): a hedgehog whose quills are flaming spikes it fires at enemies
8. Fi-R2 Ashdrake (원딜): a small round dragon with ash-grey scales and a glowing magma belly
9. Fi-R3 Flarechameleon (원딜): a chameleon with a curled flame tail that spits ember darts
10. Fi-H1 Emberpanda (힐러): a red panda with a softly glowing warm tail like a hearth
11. Fi-S1 Hearthpup (서포터): a chubby puppy carrying a glowing hearth-lantern on its back
12. Fi-S2 Kindlefinch (서포터): a bright songbird with ember feathers
```

### LINEUP-F · 숲 속성 12종 라인업

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a DESIGN LINEUP of all 12 FOREST spirits of HEXA FRONTIER in their Lv.1 baby forms, to lock the designs and the relative scale before making individual sprite sheets.
- Canvas 1536x1024, TRANSPARENT background, two rows of 6 creatures, all standing on the same invisible baseline per row, all at the same scale (tanks slightly bigger, supporters slightly smaller), plenty of space between them.
- Under each creature a small plain label with its code only (e.g. "F-T1").
- No ground, no tiles, no shadows.
Creatures in order (row 1 then row 2):
1. F-T1 Mossback (탱커): a sturdy mossy tortoise with a tiny sapling and mushrooms on its domed shell
2. F-T2 Stumpbadger (탱커): a chubby badger with bark-plated shoulders and a leafy tuft, standing on its hind legs
3. F-T3 Rootrhino (탱커): a baby rhino whose hide is woven from living roots, with a smooth wooden horn
4. F-M1 Leaflynx (근딜): a lynx kitten whose ear tufts and tail tip are sharp leaf blades
5. F-M2 Bramblewolf (근딜): a wolf pup with a bramble-thorn mane and green eyes
6. F-M3 Vinefox (근딜): a fox kit with two tails made of glowing green vines that whip with nature magic
7. F-R1 Seedshot (원딜): a fluffy squirrel with an acorn-cap helmet that flings exploding seed pods from a little vine slingshot
8. F-R2 Glowfrog (원딜): a round tree frog with a glowing green throat sac and leaf-pad hands
9. F-R3 Thornbeetle (원딜): a round rhinoceros beetle whose back opens like a turret to shoot thorn spikes
10. F-H1 Bloomdeer (힐러): a gentle spotted fawn with small flower-bud antlers
11. F-S1 Petalmoth (서포터): a round fuzzy moth with flower-petal wings scattering glowing pollen
12. F-S2 Mossloth (서포터): a sleepy baby sloth with mossy fur and tiny sprouting leaves
```

### LINEUP-E · 대지 속성 12종 라인업

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a DESIGN LINEUP of all 12 EARTH spirits of HEXA FRONTIER in their Lv.1 baby forms, to lock the designs and the relative scale before making individual sprite sheets.
- Canvas 1536x1024, TRANSPARENT background, two rows of 6 creatures, all standing on the same invisible baseline per row, all at the same scale (tanks slightly bigger, supporters slightly smaller), plenty of space between them.
- Under each creature a small plain label with its code only (e.g. "E-T1").
- No ground, no tiles, no shadows.
Creatures in order (row 1 then row 2):
1. E-T1 Irondillo (탱커): an armadillo with iron-ore plated shell that curls into a rolling fortress
2. E-T2 Stonephant (탱커): a baby elephant with stone plating on its back and forehead
3. E-T3 Ankylo (탱커): a little ankylosaur with a crystal club tail
4. E-M1 Boulderape (근딜): a bipedal gorilla kid with stone fists
5. E-M2 Rockjaw (근딜): a small crocodile with stone back plates and a big grin
6. E-M3 Quartzmantis (근딜): a praying mantis with quartz-crystal scythe arms
7. E-R1 Bouldermole (원딜): a mole wearing a little mining helmet who hurls boulders
8. E-R2 Geodescorp (원딜): a scorpion whose tail tip is a cracked geode
9. E-R3 Sandcamel (원딜): a baby camel that spits hardened sand balls
10. E-H1 Claybara (힐러): a calm capybara with a little mud-spa bowl and a pebble on its head
11. E-S1 Dunefennec (서포터): a fennec fox with a sand drum strapped to its back
12. E-S2 Quartzham (서포터): a hamster that builds tiny crystal shields with its paws
```

### LINEUP-Wi · 바람 속성 12종 라인업

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a DESIGN LINEUP of all 12 WIND spirits of HEXA FRONTIER in their Lv.1 baby forms, to lock the designs and the relative scale before making individual sprite sheets.
- Canvas 1536x1024, TRANSPARENT background, two rows of 6 creatures, all standing on the same invisible baseline per row, all at the same scale (tanks slightly bigger, supporters slightly smaller), plenty of space between them.
- Under each creature a small plain label with its code only (e.g. "Wi-T1").
- No ground, no tiles, no shadows.
Creatures in order (row 1 then row 2):
1. Wi-T1 Nimbusram (탱커): a ram whose wool is a thick storm cloud and whose curled horns crackle with tiny sparks
2. Wi-T2 Skywhale (탱커): a floating baby whale with cloud-puff fins
3. Wi-T3 Galebear (탱커): a fluffy white bear cub with a feathered mantle around its shoulders
4. Wi-M1 Galehare (근딜): a rabbit with sickle-shaped ears that kicks wind blades
5. Wi-M2 Bladecrane (근딜): a crane chick with sword-like wing feathers
6. Wi-M3 Voltpup (근딜): a weasel-dog pup crackling with tiny lightning
7. Wi-R1 Featherswift (원딜): a swallow that shoots sharp feather darts
8. Wi-R2 Stormkite (원딜): a kite-shaped flying sky ray
9. Wi-R3 Galefly (원딜): a big-eyed dragonfly with crystal wings that fires compressed air bolts
10. Wi-H1 Cloudpaca (힐러): an alpaca with fluffy cloud wool
11. Wi-S1 Windchime (서포터): a small round owl whose tail feathers are wind chimes
12. Wi-S2 Breezeglider (서포터): a sugar glider with mint gliding membranes trailing breezes
```

### F-T1 · 모스백 (Mossback) — 숲 탱커

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its shell bash), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Tank: sturdy, wide, heavy silhouette, protective shell/plates.
Spirit F-T1 "Mossback" (모스백) — FOREST element, TANKER.
Design: a sturdy mossy tortoise with a tiny sapling and mushrooms on its domed shell; Lv.10 the shell becomes layered bark armor; Lv.25 an ancient guardian tortoise whose tree crown blossoms with glowing green runes
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### F-T2 · 스텀프배저 (Stumpbadger) — 숲 탱커

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its shoulder charge), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Tank: sturdy, wide, heavy silhouette, protective shell/plates.
Spirit F-T2 "Stumpbadger" (스텀프배저) — FOREST element, TANKER.
Design: a chubby badger with bark-plated shoulders and a leafy tuft, standing on its hind legs; Lv.10 thick log pauldrons and moss cloak; Lv.25 broad bark-armored badger chief with a ring of mushrooms on its back
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### F-T3 · 루트라이노 (Rootrhino) — 숲 탱커

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its horn ram), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Tank: sturdy, wide, heavy silhouette, protective shell/plates.
Spirit F-T3 "Rootrhino" (루트라이노) — FOREST element, TANKER.
Design: a baby rhino whose hide is woven from living roots, with a smooth wooden horn; Lv.10 vine-wrapped armor and a sprouting horn; Lv.25 massive rhino with a blooming tree-horn and root greaves
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### F-M1 · 리프링스 (Leaflynx) — 숲 근딜

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its leaf-blade claw swipe), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Melee dealer: agile, aggressive stance, claws/horns/blade-like body parts.
Spirit F-M1 "Leaflynx" (리프링스) — FOREST element, PHYSICAL MELEE DEALER.
Design: a lynx kitten whose ear tufts and tail tip are sharp leaf blades; Lv.10 leaf-blade forearms; Lv.25 sleek forest lynx with a mane of razor leaves
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### F-M2 · 브램블울프 (Bramblewolf) — 숲 근딜

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its thorn bite lunge), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Melee dealer: agile, aggressive stance, claws/horns/blade-like body parts.
Spirit F-M2 "Bramblewolf" (브램블울프) — FOREST element, PHYSICAL MELEE DEALER.
Design: a wolf pup with a bramble-thorn mane and green eyes; Lv.10 thorn spikes along the spine; Lv.25 proud alpha wolf with a crown of blooming thorns
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### F-M3 · 바인폭스 (Vinefox) — 숲 근딜

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its glowing vine-tail whip), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Melee dealer: agile, aggressive stance, claws/horns/blade-like body parts.
Spirit F-M3 "Vinefox" (바인폭스) — FOREST element, MAGIC MELEE DEALER.
Design: a fox kit with two tails made of glowing green vines that whip with nature magic; Lv.10 three vine tails with flower buds; Lv.25 elegant fox with five luminous vine tails blooming at the tips
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### F-R1 · 시드샷 (Seedshot) — 숲 원딜

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its seed-pod sling shot), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Ranged dealer: keeps distance, shoots from its own body parts (no man-made guns or bows unless the design says so).
Spirit F-R1 "Seedshot" (시드샷) — FOREST element, PHYSICAL RANGED DEALER.
Design: a fluffy squirrel with an acorn-cap helmet that flings exploding seed pods from a little vine slingshot; Lv.10 leaf bandolier of seed pods; Lv.25 forest ranger squirrel with a living-vine slingshot
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### F-R2 · 글로우프로그 (Glowfrog) — 숲 원딜

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its green energy bubble blast from its throat sac), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Ranged dealer: keeps distance, shoots from its own body parts (no man-made guns or bows unless the design says so).
Spirit F-R2 "Glowfrog" (글로우프로그) — FOREST element, MAGIC RANGED DEALER.
Design: a round tree frog with a glowing green throat sac and leaf-pad hands; Lv.10 glowing spots along its back; Lv.25 large crowned frog with a lotus on its head and radiant markings
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### F-R3 · 쏜비틀 (Thornbeetle) — 숲 원딜

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its thorn spike volley from its opened back), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Ranged dealer: keeps distance, shoots from its own body parts (no man-made guns or bows unless the design says so).
Spirit F-R3 "Thornbeetle" (쏜비틀) — FOREST element, PHYSICAL RANGED DEALER.
Design: a round rhinoceros beetle whose back opens like a turret to shoot thorn spikes; Lv.10 armored with mossy plates; Lv.25 heavy stag beetle with a thorn-cannon horn
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### F-H1 · 블룸디어 (Bloomdeer) — 숲 힐러

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its petal shower (healing)), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Healer: soft round silhouette, gentle face, glowing healing motif.
Spirit F-H1 "Bloomdeer" (블룸디어) — FOREST element, HEALER.
Design: a gentle spotted fawn with small flower-bud antlers; Lv.10 antlers in full bloom with hanging petals; Lv.25 graceful white-green deer with glowing blossom antlers and a flower garland
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### F-S1 · 페탈모스 (Petalmoth) — 숲 서포터

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its glowing pollen burst (ally buff)), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Supporter: charming, expressive, carries a natural buff/debuff motif (song, pollen, drum, bubbles).
Spirit F-S1 "Petalmoth" (페탈모스) — FOREST element, SUPPORTER.
Design: a round fuzzy moth with flower-petal wings scattering glowing pollen; Lv.10 larger patterned wings; Lv.25 majestic luna-moth with a flower crown and trailing pollen ribbons
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### F-S2 · 모스로스 (Mossloth) — 숲 서포터

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its sleepy pollen yawn (enemy debuff)), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Supporter: charming, expressive, carries a natural buff/debuff motif (song, pollen, drum, bubbles).
Spirit F-S2 "Mossloth" (모스로스) — FOREST element, SUPPORTER.
Design: a sleepy baby sloth with mossy fur and tiny sprouting leaves; Lv.10 hanging flower vines on its arms; Lv.25 serene sloth with a small garden growing on its back
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### Fi-T1 · 마그마크랩 (Magmacrab) — 불 탱커

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its big-claw slam), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Tank: sturdy, wide, heavy silhouette, protective shell/plates.
Spirit Fi-T1 "Magmacrab" (마그마크랩) — FIRE element, TANKER.
Design: a hermit crab carrying a volcanic rock shell with glowing lava cracks and one oversized shield claw; Lv.10 obsidian plating; Lv.25 fortress crab whose shell is a small erupting volcano
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### Fi-T2 · 신더록스 (Cinderox) — 불 탱커

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its horn charge), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Tank: sturdy, wide, heavy silhouette, protective shell/plates.
Spirit Fi-T2 "Cinderox" (신더록스) — FIRE element, TANKER.
Design: a stocky ox calf with basalt-plated horns and a smoldering mane; Lv.10 obsidian shoulder plates; Lv.25 huge ox with molten-cracked armor and flaming horn tips
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### Fi-T3 · 킬른골렘 (Kilngolem) — 불 탱커

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its heavy fist pound), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Tank: sturdy, wide, heavy silhouette, protective shell/plates.
Spirit Fi-T3 "Kilngolem" (킬른골렘) — FIRE element, TANKER.
Design: a small round clay-kiln golem with a cozy fire glowing through a window in its belly; Lv.10 iron bands and a little chimney; Lv.25 massive forge golem with chimney shoulders and a roaring furnace core
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### Fi-M1 · 신더팽 (Cinderfang) — 불 근딜

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its ember-claw slash), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Melee dealer: agile, aggressive stance, claws/horns/blade-like body parts.
Spirit Fi-M1 "Cinderfang" (신더팽) — FIRE element, PHYSICAL MELEE DEALER.
Design: a bipedal salamander kid with ember-tipped claws and a burning tail tip; Lv.10 scale armor; Lv.25 dragon-like salamander warrior with obsidian plates and twin flame claws
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### Fi-M2 · 차르보어 (Charboar) — 불 근딜

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its molten tusk gore), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Melee dealer: agile, aggressive stance, claws/horns/blade-like body parts.
Spirit Fi-M2 "Charboar" (차르보어) — FIRE element, PHYSICAL MELEE DEALER.
Design: a piglet boar with glowing molten tusks and a soot-black bristle crest; Lv.10 longer tusks and ember back spikes; Lv.25 giant war boar with magma-veined tusks
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### Fi-M3 · 파이로타이거 (Pyrotiger) — 불 근딜

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its fire-magic claw combo), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Melee dealer: agile, aggressive stance, claws/horns/blade-like body parts.
Spirit Fi-M3 "Pyrotiger" (파이로타이거) — FIRE element, MAGIC MELEE DEALER.
Design: a tiger cub whose stripes burn like living flame; Lv.10 fiery mane and flame paws; Lv.25 majestic blazing tiger with a halo of fire stripes
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### Fi-R1 · 스파크호그 (Sparkhog) — 불 원딜

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its flaming quill shot), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Ranged dealer: keeps distance, shoots from its own body parts (no man-made guns or bows unless the design says so).
Spirit Fi-R1 "Sparkhog" (스파크호그) — FIRE element, PHYSICAL RANGED DEALER.
Design: a hedgehog whose quills are flaming spikes it fires at enemies; Lv.10 longer glowing quills; Lv.25 porcupine with a blazing quill crown
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### Fi-R2 · 애쉬드레이크 (Ashdrake) — 불 원딜

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its fireball breath), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Ranged dealer: keeps distance, shoots from its own body parts (no man-made guns or bows unless the design says so).
Spirit Fi-R2 "Ashdrake" (애쉬드레이크) — FIRE element, MAGIC RANGED DEALER.
Design: a small round dragon with ash-grey scales and a glowing magma belly; Lv.10 bigger wings; Lv.25 proud drake with a molten horn crest
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### Fi-R3 · 플레어카멜레온 (Flarechameleon) — 불 원딜

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its ember dart spit), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Ranged dealer: keeps distance, shoots from its own body parts (no man-made guns or bows unless the design says so).
Spirit Fi-R3 "Flarechameleon" (플레어카멜레온) — FIRE element, PHYSICAL RANGED DEALER.
Design: a chameleon with a curled flame tail that spits ember darts; Lv.10 glowing color-shifting scales; Lv.25 regal chameleon with a frill of flames
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### Fi-H1 · 엠버판다 (Emberpanda) — 불 힐러

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its warm tail glow (healing)), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Healer: soft round silhouette, gentle face, glowing healing motif.
Spirit Fi-H1 "Emberpanda" (엠버판다) — FIRE element, HEALER.
Design: a red panda with a softly glowing warm tail like a hearth; Lv.10 lantern-like tail rings; Lv.25 serene red panda with a phoenix-flame tail
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### Fi-S1 · 하스펍 (Hearthpup) — 불 서포터

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its warm howl (ally buff)), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Supporter: charming, expressive, carries a natural buff/debuff motif (song, pollen, drum, bubbles).
Spirit Fi-S1 "Hearthpup" (하스펍) — FIRE element, SUPPORTER.
Design: a chubby puppy carrying a glowing hearth-lantern on its back; Lv.10 the lantern becomes a small brazier saddle; Lv.25 noble hound with a phoenix-shaped hearth
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### Fi-S2 · 킨들핀치 (Kindlefinch) — 불 서포터

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its rallying song), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Supporter: charming, expressive, carries a natural buff/debuff motif (song, pollen, drum, bubbles).
Spirit Fi-S2 "Kindlefinch" (킨들핀치) — FIRE element, SUPPORTER.
Design: a bright songbird with ember feathers; Lv.10 longer flame tail; Lv.25 phoenix-like songbird with flaming tail ribbons
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### W-T1 · 터스크월러스 (Tuskwalrus) — 물 탱커

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its tusk slam), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Tank: sturdy, wide, heavy silhouette, protective shell/plates.
Spirit W-T1 "Tuskwalrus" (터스크월러스) — WATER element, TANKER.
Design: a chubby walrus pup with pearl-white tusks and shell pauldrons; Lv.10 coral armor plates; Lv.25 mighty walrus with ice-coral tusks and a barnacle-shield back
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### W-T2 · 클램가드 (Clamguard) — 물 탱커

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its shell snap), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Tank: sturdy, wide, heavy silhouette, protective shell/plates.
Spirit W-T2 "Clamguard" (클램가드) — WATER element, TANKER.
Design: a big clam creature with stubby legs and curious eyes peeking from its shell; Lv.10 spiked shell edges; Lv.25 giant pearl-clam guardian with a glowing pearl core
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### W-T3 · 하이드로히포 (Hydrohippo) — 물 탱커

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its body splash slam), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Tank: sturdy, wide, heavy silhouette, protective shell/plates.
Spirit W-T3 "Hydrohippo" (하이드로히포) — WATER element, TANKER.
Design: a baby hippo with a water-sheened hide and lily pads on its back; Lv.10 water-armor plates; Lv.25 huge hippo wearing flowing tidal armor
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### W-M1 · 오르카 (Orcablade) — 물 근딜

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its fin-blade slash), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Melee dealer: agile, aggressive stance, claws/horns/blade-like body parts.
Spirit W-M1 "Orcablade" (오르카) — WATER element, PHYSICAL MELEE DEALER.
Design: a bipedal baby orca with fin-shaped forearm blades; Lv.10 coral gauntlets; Lv.25 orca champion with tidal fin blades and shell armor
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### W-M2 · 클로스터 (Clawster) — 물 근딜

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its pincer crush), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Melee dealer: agile, aggressive stance, claws/horns/blade-like body parts.
Spirit W-M2 "Clawster" (클로스터) — WATER element, PHYSICAL MELEE DEALER.
Design: a bright blue lobster with oversized pincers; Lv.10 spiked shell; Lv.25 armored lobster knight with huge crushing claws
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### W-M3 · 타이드아홀로틀 (Tidelotl) — 물 근딜

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its water-magic tail whip), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Melee dealer: agile, aggressive stance, claws/horns/blade-like body parts.
Spirit W-M3 "Tidelotl" (타이드아홀로틀) — WATER element, MAGIC MELEE DEALER.
Design: an axolotl with glowing frilly gills and a water-ribbon tail; Lv.10 longer luminous gills; Lv.25 graceful axolotl with flowing tide ribbons orbiting it
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### W-R1 · 퍼퍼샷 (Puffershot) — 물 원딜

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its water spike volley), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Ranged dealer: keeps distance, shoots from its own body parts (no man-made guns or bows unless the design says so).
Spirit W-R1 "Puffershot" (퍼퍼샷) — WATER element, PHYSICAL RANGED DEALER.
Design: a pufferfish floating inside a water bubble that shoots water spikes; Lv.10 coral armor spines; Lv.25 armored puffer with coral cannons
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### W-R2 · 나르왈 (Narwhorn) — 물 원딜

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its water beam from its horn), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Ranged dealer: keeps distance, shoots from its own body parts (no man-made guns or bows unless the design says so).
Spirit W-R2 "Narwhorn" (나르왈) — WATER element, MAGIC RANGED DEALER.
Design: a floating narwhal calf with a spiral crystal horn; Lv.10 glowing horn and fin rings; Lv.25 majestic narwhal with a radiant tidal horn
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### W-R3 · 스냅쉬림프 (Snapshrimp) — 물 원딜

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its snapping shockwave bubble), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Ranged dealer: keeps distance, shoots from its own body parts (no man-made guns or bows unless the design says so).
Spirit W-R3 "Snapshrimp" (스냅쉬림프) — WATER element, PHYSICAL RANGED DEALER.
Design: a pistol shrimp with one oversized snapping claw; Lv.10 armored carapace; Lv.25 heavy shrimp gunner with a glowing cannon claw
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### W-H1 · 타이드포니 (Tidepony) — 물 힐러

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its pearl bubble healing), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Healer: soft round silhouette, gentle face, glowing healing motif.
Spirit W-H1 "Tidepony" (타이드포니) — WATER element, HEALER.
Design: a seahorse with a pearl on its forehead floating in a small water swirl; Lv.10 flowing fins; Lv.25 elegant seahorse with a pearl crown and healing water ribbons
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### W-S1 · 버블롯 (Bubblot) — 물 서포터

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its protective bubble blow), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Supporter: charming, expressive, carries a natural buff/debuff motif (song, pollen, drum, bubbles).
Spirit W-S1 "Bubblot" (버블롯) — WATER element, SUPPORTER.
Design: a sea otter holding a shell that blows protective bubble shields; Lv.10 kelp scarf; Lv.25 otter with a glowing pearl and a bubble halo
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### W-S2 · 펭드럼 (Pengdrum) — 물 서포터

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its belly drum (enemy debuff)), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Supporter: charming, expressive, carries a natural buff/debuff motif (song, pollen, drum, bubbles).
Spirit W-S2 "Pengdrum" (펭드럼) — WATER element, SUPPORTER.
Design: a round penguin chick that drums on its belly; Lv.10 shell drum and scarf; Lv.25 proud emperor penguin with a frost-crystal drum
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### Wi-T1 · 님버스램 (Nimbusram) — 바람 탱커

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its horn ram), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Tank: sturdy, wide, heavy silhouette, protective shell/plates.
Spirit Wi-T1 "Nimbusram" (님버스램) — WIND element, TANKER.
Design: a ram whose wool is a thick storm cloud and whose curled horns crackle with tiny sparks; Lv.10 bigger cloud mane; Lv.25 thunderhead ram with lightning-etched horns
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### Wi-T2 · 스카이웨일 (Skywhale) — 바람 탱커

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its body slam), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Tank: sturdy, wide, heavy silhouette, protective shell/plates.
Spirit Wi-T2 "Skywhale" (스카이웨일) — WIND element, TANKER.
Design: a floating baby whale with cloud-puff fins; Lv.10 cloud armor on its back; Lv.25 huge sky whale with a cloud fortress on its back
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### Wi-T3 · 게일베어 (Galebear) — 바람 탱커

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its wind-guard paw slam), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Tank: sturdy, wide, heavy silhouette, protective shell/plates.
Spirit Wi-T3 "Galebear" (게일베어) — WIND element, TANKER.
Design: a fluffy white bear cub with a feathered mantle around its shoulders; Lv.10 feather pauldrons; Lv.25 great storm bear with wing-like feather armor
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### Wi-M1 · 게일헤어 (Galehare) — 바람 근딜

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its wind kick), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Melee dealer: agile, aggressive stance, claws/horns/blade-like body parts.
Spirit Wi-M1 "Galehare" (게일헤어) — WIND element, PHYSICAL MELEE DEALER.
Design: a rabbit with sickle-shaped ears that kicks wind blades; Lv.10 wind wraps on its legs; Lv.25 swift hare with crescent ears and a gale scarf
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### Wi-M2 · 블레이드크레인 (Bladecrane) — 바람 근딜

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its sword-wing strike), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Melee dealer: agile, aggressive stance, claws/horns/blade-like body parts.
Spirit Wi-M2 "Bladecrane" (블레이드크레인) — WIND element, PHYSICAL MELEE DEALER.
Design: a crane chick with sword-like wing feathers; Lv.10 longer steel-sheen feathers; Lv.25 elegant crane with blade wings and a red crest
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### Wi-M3 · 볼트펍 (Voltpup) — 바람 근딜

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its lightning-magic pounce), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Melee dealer: agile, aggressive stance, claws/horns/blade-like body parts.
Spirit Wi-M3 "Voltpup" (볼트펍) — WIND element, MAGIC MELEE DEALER.
Design: a weasel-dog pup crackling with tiny lightning; Lv.10 lightning-bolt tail; Lv.25 sleek thunder beast with a storm-cloud mane
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### Wi-R1 · 페더스위프트 (Featherswift) — 바람 원딜

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its feather dart shot), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Ranged dealer: keeps distance, shoots from its own body parts (no man-made guns or bows unless the design says so).
Spirit Wi-R1 "Featherswift" (페더스위프트) — WIND element, PHYSICAL RANGED DEALER.
Design: a swallow that shoots sharp feather darts; Lv.10 forked tail streamers; Lv.25 swift swallow with gleaming dart feathers
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### Wi-R2 · 스톰카이트 (Stormkite) — 바람 원딜

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its wind blade slice from its fins), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Ranged dealer: keeps distance, shoots from its own body parts (no man-made guns or bows unless the design says so).
Spirit Wi-R2 "Stormkite" (스톰카이트) — WIND element, MAGIC RANGED DEALER.
Design: a kite-shaped flying sky ray; Lv.10 longer tail ribbons; Lv.25 thunder-striped sky ray with glowing fin edges
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### Wi-R3 · 게일플라이 (Galefly) — 바람 원딜

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its air bolt shot), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Ranged dealer: keeps distance, shoots from its own body parts (no man-made guns or bows unless the design says so).
Spirit Wi-R3 "Galefly" (게일플라이) — WIND element, PHYSICAL RANGED DEALER.
Design: a big-eyed dragonfly with crystal wings that fires compressed air bolts; Lv.10 four glowing wings; Lv.25 royal dragonfly with jewel-like wings
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### Wi-H1 · 클라우드파카 (Cloudpaca) — 바람 힐러

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its soft healing mist), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Healer: soft round silhouette, gentle face, glowing healing motif.
Spirit Wi-H1 "Cloudpaca" (클라우드파카) — WIND element, HEALER.
Design: an alpaca with fluffy cloud wool; Lv.10 rainbow-tinted wool tufts; Lv.25 serene alpaca with a halo of drifting clouds
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### Wi-S1 · 윈드차임 (Windchime) — 바람 서포터

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its chime ring (ally buff)), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Supporter: charming, expressive, carries a natural buff/debuff motif (song, pollen, drum, bubbles).
Spirit Wi-S1 "Windchime" (윈드차임) — WIND element, SUPPORTER.
Design: a small round owl whose tail feathers are wind chimes; Lv.10 crystal chimes; Lv.25 great owl with a halo of floating chimes
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### Wi-S2 · 브리즈글라이더 (Breezeglider) — 바람 서포터

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its gust swirl (enemy debuff)), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Supporter: charming, expressive, carries a natural buff/debuff motif (song, pollen, drum, bubbles).
Spirit Wi-S2 "Breezeglider" (브리즈글라이더) — WIND element, SUPPORTER.
Design: a sugar glider with mint gliding membranes trailing breezes; Lv.10 wind-ribbon tail; Lv.25 graceful glider with shimmering wing membranes
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### E-T1 · 아이언딜로 (Irondillo) — 대지 탱커

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its rolling tackle), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Tank: sturdy, wide, heavy silhouette, protective shell/plates.
Spirit E-T1 "Irondillo" (아이언딜로) — EARTH element, TANKER.
Design: an armadillo with iron-ore plated shell that curls into a rolling fortress; Lv.10 studded plates; Lv.25 massive armadillo with amber crystal spikes
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### E-T2 · 스톤펀트 (Stonephant) — 대지 탱커

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its trunk-and-tusk stomp), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Tank: sturdy, wide, heavy silhouette, protective shell/plates.
Spirit E-T2 "Stonephant" (스톤펀트) — EARTH element, TANKER.
Design: a baby elephant with stone plating on its back and forehead; Lv.10 rock tusks; Lv.25 colossal stone elephant with amber-crystal armor
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### E-T3 · 안킬로 (Ankylo) — 대지 탱커

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its crystal club tail swing), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Tank: sturdy, wide, heavy silhouette, protective shell/plates.
Spirit E-T3 "Ankylo" (안킬로) — EARTH element, TANKER.
Design: a little ankylosaur with a crystal club tail; Lv.10 spiked rock plates; Lv.25 giant ankylosaur with an amber-crystal club
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### E-M1 · 볼더에이프 (Boulderape) — 대지 근딜

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its stone fist punch), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Melee dealer: agile, aggressive stance, claws/horns/blade-like body parts.
Spirit E-M1 "Boulderape" (볼더에이프) — EARTH element, PHYSICAL MELEE DEALER.
Design: a bipedal gorilla kid with stone fists; Lv.10 rock gauntlets and shoulder plates; Lv.25 mighty gorilla with boulder fists and a crystal crest
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### E-M2 · 락조 (Rockjaw) — 대지 근딜

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its chomping bite), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Melee dealer: agile, aggressive stance, claws/horns/blade-like body parts.
Spirit E-M2 "Rockjaw" (락조) — EARTH element, PHYSICAL MELEE DEALER.
Design: a small crocodile with stone back plates and a big grin; Lv.10 spiked stone armor; Lv.25 armored crocodile with a granite jaw
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### E-M3 · 쿼츠맨티스 (Quartzmantis) — 대지 근딜

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its crystal scythe slash), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Melee dealer: agile, aggressive stance, claws/horns/blade-like body parts.
Spirit E-M3 "Quartzmantis" (쿼츠맨티스) — EARTH element, MAGIC MELEE DEALER.
Design: a praying mantis with quartz-crystal scythe arms; Lv.10 crystal armor; Lv.25 amethyst-blade mantis master
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### E-R1 · 볼더몰 (Bouldermole) — 대지 원딜

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its boulder throw), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Ranged dealer: keeps distance, shoots from its own body parts (no man-made guns or bows unless the design says so).
Spirit E-R1 "Bouldermole" (볼더몰) — EARTH element, PHYSICAL RANGED DEALER.
Design: a mole wearing a little mining helmet who hurls boulders; Lv.10 rock gauntlets; Lv.25 drill-gauntlet mole with an ore backpack
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### E-R2 · 지오드스콜피온 (Geodescorp) — 대지 원딜

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its crystal shard shot from its tail), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Ranged dealer: keeps distance, shoots from its own body parts (no man-made guns or bows unless the design says so).
Spirit E-R2 "Geodescorp" (지오드스콜피온) — EARTH element, MAGIC RANGED DEALER.
Design: a scorpion whose tail tip is a cracked geode; Lv.10 crystal plating; Lv.25 amber-crystal scorpion
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### E-R3 · 샌드카멜 (Sandcamel) — 대지 원딜

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its sand ball spit), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Ranged dealer: keeps distance, shoots from its own body parts (no man-made guns or bows unless the design says so).
Spirit E-R3 "Sandcamel" (샌드카멜) — EARTH element, PHYSICAL RANGED DEALER.
Design: a baby camel that spits hardened sand balls; Lv.10 woven saddle with rock pouches; Lv.25 sturdy desert camel with crystal-studded humps
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### E-H1 · 클레이바라 (Claybara) — 대지 힐러

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its warm clay healing), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Healer: soft round silhouette, gentle face, glowing healing motif.
Spirit E-H1 "Claybara" (클레이바라) — EARTH element, HEALER.
Design: a calm capybara with a little mud-spa bowl and a pebble on its head; Lv.10 amber pebbles on its back; Lv.25 serene capybara with a glowing amber hot-spring halo
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### E-S1 · 듄페넥 (Dunefennec) — 대지 서포터

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its sand drum rhythm (enemy debuff)), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Supporter: charming, expressive, carries a natural buff/debuff motif (song, pollen, drum, bubbles).
Spirit E-S1 "Dunefennec" (듄페넥) — EARTH element, SUPPORTER.
Design: a fennec fox with a sand drum strapped to its back; Lv.10 bigger drum with charms; Lv.25 desert fennec with a golden sun-drum
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

### E-S2 · 쿼츠햄 (Quartzham) — 대지 서포터

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER spirit (a game-ready asset, not a presentation sheet).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 3 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows = evolution: row 1 "Lv.1" (small, cute baby form), row 2 "Lv.10" (grown, more confident, some armor/ornaments), row 3 "Lv.25" (majestic final form, strongest ornaments). Same species, same colors, same signature features in all three rows.
- Size by row (relative to the cell height): Lv.1 about 50%, Lv.10 about 68%, Lv.25 about 86%. Keep these sizes identical in every column of the row.
- Columns = poses: 1 IDLE (neutral ready stance), 2 ATTACK (strongest moment of its crystal shield raise (ally buff)), 3 HURT (flinching back, eyes squeezed), 4 KO (collapsed lying on its side, eyes as swirls).
- Supporter: charming, expressive, carries a natural buff/debuff motif (song, pollen, drum, bubbles).
Spirit E-S2 "Quartzham" (쿼츠햄) — EARTH element, SUPPORTER.
Design: a hamster that builds tiny crystal shields with its paws; Lv.10 crystal cheek pouches; Lv.25 proud hamster with a floating ring of crystal shields
It is a creature companion (animal / beast / elemental being). NOT a wizard or mage: no robes, no pointed hats, no staffs, no wands, no spell books, no humans.
```

## 주인공 2명

아렌·리아도 스피릿과 같은 규칙(투명 배경·받침 없음·같은 바닥선)으로 게임 전용 스프라이트를 새로 받습니다.

### C01 · 아렌 (Aren) — 주인공

> `C01.png`를 첨부하세요 (얼굴·옷·색만 참고)

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for the HEXA FRONTIER main hero "Aren" (아렌). Use the attached character reference (C01.png) ONLY for the face, hair, outfit and colors — redraw the character as a clean game sprite in the STYLE BIBLE, without any base, tile or background from the reference.
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Character about 80% of the cell height in every cell, SD proportions matching the spirits (head 1:2).
- Row 1: IDLE, WALK (mid-step), ATTACK (sword slash), SKILL (a rising sword strike with a golden arc). Row 2: HURT, KO (kneeling down, exhausted), VICTORY (cheerful pose), COMMAND (raising a hand/weapon to rally allies, small golden glow).
Hero: a young boy adventurer with a sword, physical melee dealer, brave and cheerful
```

### C02 · 리아 (Lia) — 주인공

> `C02.png`를 첨부하세요 (얼굴·옷·색만 참고)

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for the HEXA FRONTIER main hero "Lia" (리아). Use the attached character reference (C02.png) ONLY for the face, hair, outfit and colors — redraw the character as a clean game sprite in the STYLE BIBLE, without any base, tile or background from the reference.
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Character about 80% of the cell height in every cell, SD proportions matching the spirits (head 1:2).
- Row 1: IDLE, WALK (mid-step), ATTACK (star-orb throw), SKILL (a shooting-star spell from her staff tip). Row 2: HURT, KO (kneeling down, exhausted), VICTORY (cheerful pose), COMMAND (raising a hand/weapon to rally allies, small golden glow).
Hero: a young girl adventurer with a staff, magic ranged dealer, bright and kind
```

## 몬스터 30종

스피릿과 헷갈리지 않게 **'균열체'**로 통일: 몸에 보라색 육각 균열과 균열 수정, 붉은보라 눈빛. 비율은 스피릿과 같은 SD.
속성마다 6역할 — **근접 졸개 · 돌격대 · 방패 · 사수 · 치유체 · 저주체**. 한 장 = 일반·정예 × 대기·공격·피격·쓰러짐 (투명 배경, 받침 없음).

### MON-F-1 · 균열 덩굴뱀 (Riftvine Viper) — 숲 근접 졸개

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER RIFT MONSTER (enemy unit, game-ready asset).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows: row 1 "NORMAL", row 2 "ELITE" (bigger horns/spikes, gold-violet trim, small crown of rift crystals). NORMAL about 65% of the cell height, ELITE about 85%.
- Columns: 1 IDLE, 2 ATTACK, 3 HURT, 4 KO (collapsed, rift crystal dimmed).
- Rift monster design language: corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, menacing red-violet glowing eyes, but the same cute SD proportions and rendering as the spirits. Never a copy of a spirit.
Monster "Riftvine Viper" (균열 덩굴뱀) — FOREST element, role 근접 졸개: a coiling vine snake with thorn fangs and leaf frills
```

### MON-F-2 · 가시멧돼지 (Brambleboar) — 숲 돌격대

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER RIFT MONSTER (enemy unit, game-ready asset).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows: row 1 "NORMAL", row 2 "ELITE" (bigger horns/spikes, gold-violet trim, small crown of rift crystals). NORMAL about 65% of the cell height, ELITE about 85%.
- Columns: 1 IDLE, 2 ATTACK, 3 HURT, 4 KO (collapsed, rift crystal dimmed).
- Rift monster design language: corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, menacing red-violet glowing eyes, but the same cute SD proportions and rendering as the spirits. Never a copy of a spirit.
Monster "Brambleboar" (가시멧돼지) — FOREST element, role 돌격대: a charging boar covered in bramble spikes, charges in straight lines
```

### MON-F-3 · 썩은 그루터기 (Rotstump) — 숲 방패

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER RIFT MONSTER (enemy unit, game-ready asset).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows: row 1 "NORMAL", row 2 "ELITE" (bigger horns/spikes, gold-violet trim, small crown of rift crystals). NORMAL about 65% of the cell height, ELITE about 85%.
- Columns: 1 IDLE, 2 ATTACK, 3 HURT, 4 KO (collapsed, rift crystal dimmed).
- Rift monster design language: corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, menacing red-violet glowing eyes, but the same cute SD proportions and rendering as the spirits. Never a copy of a spirit.
Monster "Rotstump" (썩은 그루터기) — FOREST element, role 방패: a walking rotten tree stump with a bark face, very sturdy
```

### MON-F-4 · 포자두꺼비 (Sporetoad) — 숲 사수

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER RIFT MONSTER (enemy unit, game-ready asset).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows: row 1 "NORMAL", row 2 "ELITE" (bigger horns/spikes, gold-violet trim, small crown of rift crystals). NORMAL about 65% of the cell height, ELITE about 85%.
- Columns: 1 IDLE, 2 ATTACK, 3 HURT, 4 KO (collapsed, rift crystal dimmed).
- Rift monster design language: corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, menacing red-violet glowing eyes, but the same cute SD proportions and rendering as the spirits. Never a copy of a spirit.
Monster "Sporetoad" (포자두꺼비) — FOREST element, role 사수: a fat toad that spits glowing spore balls from a distance
```

### MON-F-5 · 이끼달팽이 (Mossnail) — 숲 치유체

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER RIFT MONSTER (enemy unit, game-ready asset).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows: row 1 "NORMAL", row 2 "ELITE" (bigger horns/spikes, gold-violet trim, small crown of rift crystals). NORMAL about 65% of the cell height, ELITE about 85%.
- Columns: 1 IDLE, 2 ATTACK, 3 HURT, 4 KO (collapsed, rift crystal dimmed).
- Rift monster design language: corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, menacing red-violet glowing eyes, but the same cute SD proportions and rendering as the spirits. Never a copy of a spirit.
Monster "Mossnail" (이끼달팽이) — FOREST element, role 치유체: a big snail with a mossy shell that oozes healing sap onto allies
```

### MON-F-6 · 저주버섯 (Hexshroom) — 숲 저주체

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER RIFT MONSTER (enemy unit, game-ready asset).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows: row 1 "NORMAL", row 2 "ELITE" (bigger horns/spikes, gold-violet trim, small crown of rift crystals). NORMAL about 65% of the cell height, ELITE about 85%.
- Columns: 1 IDLE, 2 ATTACK, 3 HURT, 4 KO (collapsed, rift crystal dimmed).
- Rift monster design language: corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, menacing red-violet glowing eyes, but the same cute SD proportions and rendering as the spirits. Never a copy of a spirit.
Monster "Hexshroom" (저주버섯) — FOREST element, role 저주체: a hopping mushroom whose purple spores weaken enemies
```

### MON-W-1 · 균열 피라냐 (Riftpiranha) — 물 근접 졸개

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER RIFT MONSTER (enemy unit, game-ready asset).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows: row 1 "NORMAL", row 2 "ELITE" (bigger horns/spikes, gold-violet trim, small crown of rift crystals). NORMAL about 65% of the cell height, ELITE about 85%.
- Columns: 1 IDLE, 2 ATTACK, 3 HURT, 4 KO (collapsed, rift crystal dimmed).
- Rift monster design language: corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, menacing red-violet glowing eyes, but the same cute SD proportions and rendering as the spirits. Never a copy of a spirit.
Monster "Riftpiranha" (균열 피라냐) — WATER element, role 근접 졸개: a piranha with stubby legs that walks on land, big teeth
```

### MON-W-2 · 작살상어 (Harpoon Shark) — 물 돌격대

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER RIFT MONSTER (enemy unit, game-ready asset).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows: row 1 "NORMAL", row 2 "ELITE" (bigger horns/spikes, gold-violet trim, small crown of rift crystals). NORMAL about 65% of the cell height, ELITE about 85%.
- Columns: 1 IDLE, 2 ATTACK, 3 HURT, 4 KO (collapsed, rift crystal dimmed).
- Rift monster design language: corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, menacing red-violet glowing eyes, but the same cute SD proportions and rendering as the spirits. Never a copy of a spirit.
Monster "Harpoon Shark" (작살상어) — WATER element, role 돌격대: a small shark with a harpoon-shaped snout that dashes forward
```

### MON-W-3 · 따개비거북 (Barnacle Turtle) — 물 방패

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER RIFT MONSTER (enemy unit, game-ready asset).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows: row 1 "NORMAL", row 2 "ELITE" (bigger horns/spikes, gold-violet trim, small crown of rift crystals). NORMAL about 65% of the cell height, ELITE about 85%.
- Columns: 1 IDLE, 2 ATTACK, 3 HURT, 4 KO (collapsed, rift crystal dimmed).
- Rift monster design language: corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, menacing red-violet glowing eyes, but the same cute SD proportions and rendering as the spirits. Never a copy of a spirit.
Monster "Barnacle Turtle" (따개비거북) — WATER element, role 방패: a turtle crusted with barnacles, a slow wall
```

### MON-W-4 · 먹물문어 (Inkpus) — 물 사수

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER RIFT MONSTER (enemy unit, game-ready asset).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows: row 1 "NORMAL", row 2 "ELITE" (bigger horns/spikes, gold-violet trim, small crown of rift crystals). NORMAL about 65% of the cell height, ELITE about 85%.
- Columns: 1 IDLE, 2 ATTACK, 3 HURT, 4 KO (collapsed, rift crystal dimmed).
- Rift monster design language: corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, menacing red-violet glowing eyes, but the same cute SD proportions and rendering as the spirits. Never a copy of a spirit.
Monster "Inkpus" (먹물문어) — WATER element, role 사수: a small octopus that shoots ink blobs from range
```

### MON-W-5 · 물방울해파리 (Dew Jelly) — 물 치유체

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER RIFT MONSTER (enemy unit, game-ready asset).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows: row 1 "NORMAL", row 2 "ELITE" (bigger horns/spikes, gold-violet trim, small crown of rift crystals). NORMAL about 65% of the cell height, ELITE about 85%.
- Columns: 1 IDLE, 2 ATTACK, 3 HURT, 4 KO (collapsed, rift crystal dimmed).
- Rift monster design language: corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, menacing red-violet glowing eyes, but the same cute SD proportions and rendering as the spirits. Never a copy of a spirit.
Monster "Dew Jelly" (물방울해파리) — WATER element, role 치유체: a floating jellyfish whose glowing drops heal monsters
```

### MON-W-6 · 소용돌이장어 (Whirl Eel) — 물 저주체

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER RIFT MONSTER (enemy unit, game-ready asset).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows: row 1 "NORMAL", row 2 "ELITE" (bigger horns/spikes, gold-violet trim, small crown of rift crystals). NORMAL about 65% of the cell height, ELITE about 85%.
- Columns: 1 IDLE, 2 ATTACK, 3 HURT, 4 KO (collapsed, rift crystal dimmed).
- Rift monster design language: corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, menacing red-violet glowing eyes, but the same cute SD proportions and rendering as the spirits. Never a copy of a spirit.
Monster "Whirl Eel" (소용돌이장어) — WATER element, role 저주체: an eel that spins small whirlpools to weaken defense
```

### MON-Fi-1 · 불똥도마뱀 (Emberskink) — 불 근접 졸개

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER RIFT MONSTER (enemy unit, game-ready asset).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows: row 1 "NORMAL", row 2 "ELITE" (bigger horns/spikes, gold-violet trim, small crown of rift crystals). NORMAL about 65% of the cell height, ELITE about 85%.
- Columns: 1 IDLE, 2 ATTACK, 3 HURT, 4 KO (collapsed, rift crystal dimmed).
- Rift monster design language: corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, menacing red-violet glowing eyes, but the same cute SD proportions and rendering as the spirits. Never a copy of a spirit.
Monster "Emberskink" (불똥도마뱀) — FIRE element, role 근접 졸개: a quick little lizard with a spark tail
```

### MON-Fi-2 · 화염코뿔소 (Blaze Rhino) — 불 돌격대

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER RIFT MONSTER (enemy unit, game-ready asset).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows: row 1 "NORMAL", row 2 "ELITE" (bigger horns/spikes, gold-violet trim, small crown of rift crystals). NORMAL about 65% of the cell height, ELITE about 85%.
- Columns: 1 IDLE, 2 ATTACK, 3 HURT, 4 KO (collapsed, rift crystal dimmed).
- Rift monster design language: corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, menacing red-violet glowing eyes, but the same cute SD proportions and rendering as the spirits. Never a copy of a spirit.
Monster "Blaze Rhino" (화염코뿔소) — FIRE element, role 돌격대: a stocky rhino with a flaming horn that charges
```

### MON-Fi-3 · 용암덩이 (Magma Chunk) — 불 방패

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER RIFT MONSTER (enemy unit, game-ready asset).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows: row 1 "NORMAL", row 2 "ELITE" (bigger horns/spikes, gold-violet trim, small crown of rift crystals). NORMAL about 65% of the cell height, ELITE about 85%.
- Columns: 1 IDLE, 2 ATTACK, 3 HURT, 4 KO (collapsed, rift crystal dimmed).
- Rift monster design language: corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, menacing red-violet glowing eyes, but the same cute SD proportions and rendering as the spirits. Never a copy of a spirit.
Monster "Magma Chunk" (용암덩이) — FIRE element, role 방패: a living lump of cooled lava with a molten core, very tough
```

### MON-Fi-4 · 화산박쥐 (Lava Bat) — 불 사수

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER RIFT MONSTER (enemy unit, game-ready asset).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows: row 1 "NORMAL", row 2 "ELITE" (bigger horns/spikes, gold-violet trim, small crown of rift crystals). NORMAL about 65% of the cell height, ELITE about 85%.
- Columns: 1 IDLE, 2 ATTACK, 3 HURT, 4 KO (collapsed, rift crystal dimmed).
- Rift monster design language: corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, menacing red-violet glowing eyes, but the same cute SD proportions and rendering as the spirits. Never a copy of a spirit.
Monster "Lava Bat" (화산박쥐) — FIRE element, role 사수: a bat with magma-veined wings that drops fireballs
```

### MON-Fi-5 · 재부엉이 (Ash Owl) — 불 치유체

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER RIFT MONSTER (enemy unit, game-ready asset).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows: row 1 "NORMAL", row 2 "ELITE" (bigger horns/spikes, gold-violet trim, small crown of rift crystals). NORMAL about 65% of the cell height, ELITE about 85%.
- Columns: 1 IDLE, 2 ATTACK, 3 HURT, 4 KO (collapsed, rift crystal dimmed).
- Rift monster design language: corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, menacing red-violet glowing eyes, but the same cute SD proportions and rendering as the spirits. Never a copy of a spirit.
Monster "Ash Owl" (재부엉이) — FIRE element, role 치유체: a sooty owl that fans warm embers to mend monsters
```

### MON-Fi-6 · 그을음 정령 (Soot Wisp) — 불 저주체

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER RIFT MONSTER (enemy unit, game-ready asset).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows: row 1 "NORMAL", row 2 "ELITE" (bigger horns/spikes, gold-violet trim, small crown of rift crystals). NORMAL about 65% of the cell height, ELITE about 85%.
- Columns: 1 IDLE, 2 ATTACK, 3 HURT, 4 KO (collapsed, rift crystal dimmed).
- Rift monster design language: corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, menacing red-violet glowing eyes, but the same cute SD proportions and rendering as the spirits. Never a copy of a spirit.
Monster "Soot Wisp" (그을음 정령) — FIRE element, role 저주체: a smoky blob with ember eyes whose smoke lowers enemy defense
```

### MON-Wi-1 · 칼바람족제비 (Gale Weasel) — 바람 근접 졸개

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER RIFT MONSTER (enemy unit, game-ready asset).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows: row 1 "NORMAL", row 2 "ELITE" (bigger horns/spikes, gold-violet trim, small crown of rift crystals). NORMAL about 65% of the cell height, ELITE about 85%.
- Columns: 1 IDLE, 2 ATTACK, 3 HURT, 4 KO (collapsed, rift crystal dimmed).
- Rift monster design language: corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, menacing red-violet glowing eyes, but the same cute SD proportions and rendering as the spirits. Never a copy of a spirit.
Monster "Gale Weasel" (칼바람족제비) — WIND element, role 근접 졸개: a ferret with sickle-shaped tail blades
```

### MON-Wi-2 · 번개매 (Bolt Falcon) — 바람 돌격대

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER RIFT MONSTER (enemy unit, game-ready asset).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows: row 1 "NORMAL", row 2 "ELITE" (bigger horns/spikes, gold-violet trim, small crown of rift crystals). NORMAL about 65% of the cell height, ELITE about 85%.
- Columns: 1 IDLE, 2 ATTACK, 3 HURT, 4 KO (collapsed, rift crystal dimmed).
- Rift monster design language: corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, menacing red-violet glowing eyes, but the same cute SD proportions and rendering as the spirits. Never a copy of a spirit.
Monster "Bolt Falcon" (번개매) — WIND element, role 돌격대: a falcon wrapped in tiny lightning that dives fast
```

### MON-Wi-3 · 구름거북 (Cloud Turtle) — 바람 방패

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER RIFT MONSTER (enemy unit, game-ready asset).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows: row 1 "NORMAL", row 2 "ELITE" (bigger horns/spikes, gold-violet trim, small crown of rift crystals). NORMAL about 65% of the cell height, ELITE about 85%.
- Columns: 1 IDLE, 2 ATTACK, 3 HURT, 4 KO (collapsed, rift crystal dimmed).
- Rift monster design language: corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, menacing red-violet glowing eyes, but the same cute SD proportions and rendering as the spirits. Never a copy of a spirit.
Monster "Cloud Turtle" (구름거북) — WIND element, role 방패: a turtle floating on a thick cloud, a sturdy blocker
```

### MON-Wi-4 · 돌풍벌 (Gust Wasp) — 바람 사수

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER RIFT MONSTER (enemy unit, game-ready asset).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows: row 1 "NORMAL", row 2 "ELITE" (bigger horns/spikes, gold-violet trim, small crown of rift crystals). NORMAL about 65% of the cell height, ELITE about 85%.
- Columns: 1 IDLE, 2 ATTACK, 3 HURT, 4 KO (collapsed, rift crystal dimmed).
- Rift monster design language: corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, menacing red-violet glowing eyes, but the same cute SD proportions and rendering as the spirits. Never a copy of a spirit.
Monster "Gust Wasp" (돌풍벌) — WIND element, role 사수: a wasp that shoots compressed air stingers from range
```

### MON-Wi-5 · 깃털박새 (Plume Tit) — 바람 치유체

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER RIFT MONSTER (enemy unit, game-ready asset).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows: row 1 "NORMAL", row 2 "ELITE" (bigger horns/spikes, gold-violet trim, small crown of rift crystals). NORMAL about 65% of the cell height, ELITE about 85%.
- Columns: 1 IDLE, 2 ATTACK, 3 HURT, 4 KO (collapsed, rift crystal dimmed).
- Rift monster design language: corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, menacing red-violet glowing eyes, but the same cute SD proportions and rendering as the spirits. Never a copy of a spirit.
Monster "Plume Tit" (깃털박새) — WIND element, role 치유체: a fluffy bird whose feather down heals monsters
```

### MON-Wi-6 · 회오리여우 (Whirl Fox) — 바람 저주체

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER RIFT MONSTER (enemy unit, game-ready asset).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows: row 1 "NORMAL", row 2 "ELITE" (bigger horns/spikes, gold-violet trim, small crown of rift crystals). NORMAL about 65% of the cell height, ELITE about 85%.
- Columns: 1 IDLE, 2 ATTACK, 3 HURT, 4 KO (collapsed, rift crystal dimmed).
- Rift monster design language: corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, menacing red-violet glowing eyes, but the same cute SD proportions and rendering as the spirits. Never a copy of a spirit.
Monster "Whirl Fox" (회오리여우) — WIND element, role 저주체: a fox with a tornado tail that confuses and weakens
```

### MON-E-1 · 자갈딱정벌레 (Gravel Beetle) — 대지 근접 졸개

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER RIFT MONSTER (enemy unit, game-ready asset).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows: row 1 "NORMAL", row 2 "ELITE" (bigger horns/spikes, gold-violet trim, small crown of rift crystals). NORMAL about 65% of the cell height, ELITE about 85%.
- Columns: 1 IDLE, 2 ATTACK, 3 HURT, 4 KO (collapsed, rift crystal dimmed).
- Rift monster design language: corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, menacing red-violet glowing eyes, but the same cute SD proportions and rendering as the spirits. Never a copy of a spirit.
Monster "Gravel Beetle" (자갈딱정벌레) — EARTH element, role 근접 졸개: a small beetle with a pebble shell
```

### MON-E-2 · 암석들소 (Boulder Bison) — 대지 돌격대

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER RIFT MONSTER (enemy unit, game-ready asset).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows: row 1 "NORMAL", row 2 "ELITE" (bigger horns/spikes, gold-violet trim, small crown of rift crystals). NORMAL about 65% of the cell height, ELITE about 85%.
- Columns: 1 IDLE, 2 ATTACK, 3 HURT, 4 KO (collapsed, rift crystal dimmed).
- Rift monster design language: corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, menacing red-violet glowing eyes, but the same cute SD proportions and rendering as the spirits. Never a copy of a spirit.
Monster "Boulder Bison" (암석들소) — EARTH element, role 돌격대: a bison with rock horns and a stone hump that charges
```

### MON-E-3 · 바위게 (Rock Crab) — 대지 방패

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER RIFT MONSTER (enemy unit, game-ready asset).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows: row 1 "NORMAL", row 2 "ELITE" (bigger horns/spikes, gold-violet trim, small crown of rift crystals). NORMAL about 65% of the cell height, ELITE about 85%.
- Columns: 1 IDLE, 2 ATTACK, 3 HURT, 4 KO (collapsed, rift crystal dimmed).
- Rift monster design language: corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, menacing red-violet glowing eyes, but the same cute SD proportions and rendering as the spirits. Never a copy of a spirit.
Monster "Rock Crab" (바위게) — EARTH element, role 방패: a crab with a boulder shell, a solid wall
```

### MON-E-4 · 모래거미 (Sand Spider) — 대지 사수

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER RIFT MONSTER (enemy unit, game-ready asset).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows: row 1 "NORMAL", row 2 "ELITE" (bigger horns/spikes, gold-violet trim, small crown of rift crystals). NORMAL about 65% of the cell height, ELITE about 85%.
- Columns: 1 IDLE, 2 ATTACK, 3 HURT, 4 KO (collapsed, rift crystal dimmed).
- Rift monster design language: corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, menacing red-violet glowing eyes, but the same cute SD proportions and rendering as the spirits. Never a copy of a spirit.
Monster "Sand Spider" (모래거미) — EARTH element, role 사수: a spider that flings sand balls and webs from range
```

### MON-E-5 · 진흙도롱뇽 (Mud Newt) — 대지 치유체

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER RIFT MONSTER (enemy unit, game-ready asset).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows: row 1 "NORMAL", row 2 "ELITE" (bigger horns/spikes, gold-violet trim, small crown of rift crystals). NORMAL about 65% of the cell height, ELITE about 85%.
- Columns: 1 IDLE, 2 ATTACK, 3 HURT, 4 KO (collapsed, rift crystal dimmed).
- Rift monster design language: corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, menacing red-violet glowing eyes, but the same cute SD proportions and rendering as the spirits. Never a copy of a spirit.
Monster "Mud Newt" (진흙도롱뇽) — EARTH element, role 치유체: a newt that coats monsters in healing mud
```

### MON-E-6 · 균열 수정벌레 (Shard Mite) — 대지 저주체

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER RIFT MONSTER (enemy unit, game-ready asset).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 4 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Rows: row 1 "NORMAL", row 2 "ELITE" (bigger horns/spikes, gold-violet trim, small crown of rift crystals). NORMAL about 65% of the cell height, ELITE about 85%.
- Columns: 1 IDLE, 2 ATTACK, 3 HURT, 4 KO (collapsed, rift crystal dimmed).
- Rift monster design language: corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, menacing red-violet glowing eyes, but the same cute SD proportions and rendering as the spirits. Never a copy of a spirit.
Monster "Shard Mite" (균열 수정벌레) — EARTH element, role 저주체: a mite with violet crystal shards whose hum weakens enemies
```

## 중간보스 10 · 보스 10

5판마다 중간보스(대장), 10판마다 장 보스, 100판은 최종 보스(2단계 모습 포함). 한 장 = 대기·공격·기술·피격·쓰러짐·분노(최종 보스는 2단계). 게임에서는 한 칸을 차지하지만 1.5배 크게 그립니다.

### MID-5 · 가시멧돼지 대장 (Thornback Alpha) — 5판 중간보스 · 숲

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER ELITE MID-BOSS (game-ready asset, epic but readable).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 3 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Cells: row 1 = IDLE, ATTACK, SKILL (signature move, strongest pose); row 2 = HURT, KO, ENRAGED IDLE (glowing eyes, aura flaring).
- The boss fills about 88% of the cell height in every cell (it is shown 1.5x larger than normal units in the game).
- Same rift corruption language as the Rift monsters (violet hex cracks, rift crystals) plus a subtle boss aura that stays close to the body (no aura filling the cell).
Boss "Thornback Alpha" (가시멧돼지 대장) — stage 5, element 숲: a huge bramble boar alpha with a bark-and-thorn mane
```

### MID-15 · 따개비 대왕거북 (Barnacle King) — 15판 중간보스 · 물

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER ELITE MID-BOSS (game-ready asset, epic but readable).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 3 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Cells: row 1 = IDLE, ATTACK, SKILL (signature move, strongest pose); row 2 = HURT, KO, ENRAGED IDLE (glowing eyes, aura flaring).
- The boss fills about 88% of the cell height in every cell (it is shown 1.5x larger than normal units in the game).
- Same rift corruption language as the Rift monsters (violet hex cracks, rift crystals) plus a subtle boss aura that stays close to the body (no aura filling the cell).
Boss "Barnacle King" (따개비 대왕거북) — stage 15, element 물: an enormous barnacle turtle with a sunken-ship-wood shell
```

### MID-25 · 화염코뿔소 대장 (Inferno Rhino) — 25판 중간보스 · 불

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER ELITE MID-BOSS (game-ready asset, epic but readable).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 3 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Cells: row 1 = IDLE, ATTACK, SKILL (signature move, strongest pose); row 2 = HURT, KO, ENRAGED IDLE (glowing eyes, aura flaring).
- The boss fills about 88% of the cell height in every cell (it is shown 1.5x larger than normal units in the game).
- Same rift corruption language as the Rift monsters (violet hex cracks, rift crystals) plus a subtle boss aura that stays close to the body (no aura filling the cell).
Boss "Inferno Rhino" (화염코뿔소 대장) — stage 25, element 불: a giant rhino with a burning crown horn and magma armor
```

### MID-35 · 번개매 여왕 (Storm Falcon Queen) — 35판 중간보스 · 바람

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER ELITE MID-BOSS (game-ready asset, epic but readable).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 3 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Cells: row 1 = IDLE, ATTACK, SKILL (signature move, strongest pose); row 2 = HURT, KO, ENRAGED IDLE (glowing eyes, aura flaring).
- The boss fills about 88% of the cell height in every cell (it is shown 1.5x larger than normal units in the game).
- Same rift corruption language as the Rift monsters (violet hex cracks, rift crystals) plus a subtle boss aura that stays close to the body (no aura filling the cell).
Boss "Storm Falcon Queen" (번개매 여왕) — stage 35, element 바람: a great falcon with a crest of lightning feathers
```

### MID-45 · 암석들소 대장 (Granite Bison Chief) — 45판 중간보스 · 대지

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER ELITE MID-BOSS (game-ready asset, epic but readable).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 3 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Cells: row 1 = IDLE, ATTACK, SKILL (signature move, strongest pose); row 2 = HURT, KO, ENRAGED IDLE (glowing eyes, aura flaring).
- The boss fills about 88% of the cell height in every cell (it is shown 1.5x larger than normal units in the game).
- Same rift corruption language as the Rift monsters (violet hex cracks, rift crystals) plus a subtle boss aura that stays close to the body (no aura filling the cell).
Boss "Granite Bison Chief" (암석들소 대장) — stage 45, element 대지: a colossal bison with granite horns and crystal hump
```

### MID-55 · 독포자 두꺼비왕 (Spore Toad King) — 55판 중간보스 · 숲

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER ELITE MID-BOSS (game-ready asset, epic but readable).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 3 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Cells: row 1 = IDLE, ATTACK, SKILL (signature move, strongest pose); row 2 = HURT, KO, ENRAGED IDLE (glowing eyes, aura flaring).
- The boss fills about 88% of the cell height in every cell (it is shown 1.5x larger than normal units in the game).
- Same rift corruption language as the Rift monsters (violet hex cracks, rift crystals) plus a subtle boss aura that stays close to the body (no aura filling the cell).
Boss "Spore Toad King" (독포자 두꺼비왕) — stage 55, element 숲: a giant toad crowned with poisonous mushrooms
```

### MID-65 · 증기 장어 (Steam Eel) — 65판 중간보스 · 물·불

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER ELITE MID-BOSS (game-ready asset, epic but readable).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 3 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Cells: row 1 = IDLE, ATTACK, SKILL (signature move, strongest pose); row 2 = HURT, KO, ENRAGED IDLE (glowing eyes, aura flaring).
- The boss fills about 88% of the cell height in every cell (it is shown 1.5x larger than normal units in the game).
- Same rift corruption language as the Rift monsters (violet hex cracks, rift crystals) plus a subtle boss aura that stays close to the body (no aura filling the cell).
Boss "Steam Eel" (증기 장어) — stage 65, element 물·불: a huge eel half water half lava, breathing steam
```

### MID-75 · 모래폭풍 전갈 (Duststorm Scorpion) — 75판 중간보스 · 바람·대지

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER ELITE MID-BOSS (game-ready asset, epic but readable).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 3 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Cells: row 1 = IDLE, ATTACK, SKILL (signature move, strongest pose); row 2 = HURT, KO, ENRAGED IDLE (glowing eyes, aura flaring).
- The boss fills about 88% of the cell height in every cell (it is shown 1.5x larger than normal units in the game).
- Same rift corruption language as the Rift monsters (violet hex cracks, rift crystals) plus a subtle boss aura that stays close to the body (no aura filling the cell).
Boss "Duststorm Scorpion" (모래폭풍 전갈) — stage 75, element 바람·대지: a giant scorpion trailing a small sandstorm
```

### MID-85 · 균열 키메라 새끼 (Chimera Whelp) — 85판 중간보스 · 숲·물·불

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER ELITE MID-BOSS (game-ready asset, epic but readable).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 3 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Cells: row 1 = IDLE, ATTACK, SKILL (signature move, strongest pose); row 2 = HURT, KO, ENRAGED IDLE (glowing eyes, aura flaring).
- The boss fills about 88% of the cell height in every cell (it is shown 1.5x larger than normal units in the game).
- Same rift corruption language as the Rift monsters (violet hex cracks, rift crystals) plus a subtle boss aura that stays close to the body (no aura filling the cell).
Boss "Chimera Whelp" (균열 키메라 새끼) — stage 85, element 숲·물·불: a young chimera with leaf, water and fire features
```

### MID-95 · 균열 사냥개 (Rift Warhound) — 95판 중간보스 · 모든 속성

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER ELITE MID-BOSS (game-ready asset, epic but readable).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 3 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Cells: row 1 = IDLE, ATTACK, SKILL (signature move, strongest pose); row 2 = HURT, KO, ENRAGED IDLE (glowing eyes, aura flaring).
- The boss fills about 88% of the cell height in every cell (it is shown 1.5x larger than normal units in the game).
- Same rift corruption language as the Rift monsters (violet hex cracks, rift crystals) plus a subtle boss aura that stays close to the body (no aura filling the cell).
Boss "Rift Warhound" (균열 사냥개) — stage 95, element 모든 속성: a large armored hound made of rift crystal with five element gems
```

### BOSS-10 · 고목 수호수 (Rift Treant) — 10판 장 보스 · 숲

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER CHAPTER BOSS (game-ready asset, epic but readable).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 3 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Cells: row 1 = IDLE, ATTACK, SKILL (signature move, strongest pose); row 2 = HURT, KO, ENRAGED IDLE (glowing eyes, aura flaring).
- The boss fills about 88% of the cell height in every cell (it is shown 1.5x larger than normal units in the game).
- Same rift corruption language as the Rift monsters (violet hex cracks, rift crystals) plus a subtle boss aura that stays close to the body (no aura filling the cell).
Boss "Rift Treant" (고목 수호수) — stage 10, element 숲: a colossal corrupted tree beast with root claws and a hollow glowing face
```

### BOSS-20 · 심해 레비아탄 (Abyss Leviathan) — 20판 장 보스 · 물

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER CHAPTER BOSS (game-ready asset, epic but readable).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 3 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Cells: row 1 = IDLE, ATTACK, SKILL (signature move, strongest pose); row 2 = HURT, KO, ENRAGED IDLE (glowing eyes, aura flaring).
- The boss fills about 88% of the cell height in every cell (it is shown 1.5x larger than normal units in the game).
- Same rift corruption language as the Rift monsters (violet hex cracks, rift crystals) plus a subtle boss aura that stays close to the body (no aura filling the cell).
Boss "Abyss Leviathan" (심해 레비아탄) — stage 20, element 물: a sea serpent rising from a whirlpool, pearl horns, rift cracks along its fins
```

### BOSS-30 · 화산 와이번 (Volcano Wyvern) — 30판 장 보스 · 불

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER CHAPTER BOSS (game-ready asset, epic but readable).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 3 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Cells: row 1 = IDLE, ATTACK, SKILL (signature move, strongest pose); row 2 = HURT, KO, ENRAGED IDLE (glowing eyes, aura flaring).
- The boss fills about 88% of the cell height in every cell (it is shown 1.5x larger than normal units in the game).
- Same rift corruption language as the Rift monsters (violet hex cracks, rift crystals) plus a subtle boss aura that stays close to the body (no aura filling the cell).
Boss "Volcano Wyvern" (화산 와이번) — stage 30, element 불: a wyvern with obsidian scales and a lava-filled chest, wings dripping embers
```

### BOSS-40 · 뇌운 그리폰 (Thunder Griffin) — 40판 장 보스 · 바람

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER CHAPTER BOSS (game-ready asset, epic but readable).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 3 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Cells: row 1 = IDLE, ATTACK, SKILL (signature move, strongest pose); row 2 = HURT, KO, ENRAGED IDLE (glowing eyes, aura flaring).
- The boss fills about 88% of the cell height in every cell (it is shown 1.5x larger than normal units in the game).
- Same rift corruption language as the Rift monsters (violet hex cracks, rift crystals) plus a subtle boss aura that stays close to the body (no aura filling the cell).
Boss "Thunder Griffin" (뇌운 그리폰) — stage 40, element 바람: a griffin made of storm clouds and feathers, lightning mane
```

### BOSS-50 · 거신 장수풍뎅이 (Colossus Beetle) — 50판 장 보스 · 대지

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER CHAPTER BOSS (game-ready asset, epic but readable).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 3 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Cells: row 1 = IDLE, ATTACK, SKILL (signature move, strongest pose); row 2 = HURT, KO, ENRAGED IDLE (glowing eyes, aura flaring).
- The boss fills about 88% of the cell height in every cell (it is shown 1.5x larger than normal units in the game).
- Same rift corruption language as the Rift monsters (violet hex cracks, rift crystals) plus a subtle boss aura that stays close to the body (no aura filling the cell).
Boss "Colossus Beetle" (거신 장수풍뎅이) — stage 50, element 대지: a gigantic rhinoceros beetle with a mountain-like shell and crystal horn
```

### BOSS-60 · 가시 여왕 사마귀 (Thornqueen Mantis) — 60판 장 보스 · 숲

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER CHAPTER BOSS (game-ready asset, epic but readable).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 3 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Cells: row 1 = IDLE, ATTACK, SKILL (signature move, strongest pose); row 2 = HURT, KO, ENRAGED IDLE (glowing eyes, aura flaring).
- The boss fills about 88% of the cell height in every cell (it is shown 1.5x larger than normal units in the game).
- Same rift corruption language as the Rift monsters (violet hex cracks, rift crystals) plus a subtle boss aura that stays close to the body (no aura filling the cell).
Boss "Thornqueen Mantis" (가시 여왕 사마귀) — stage 60, element 숲: a regal mantis with rose-thorn scythes and a flower crown
```

### BOSS-70 · 증기 크라켄 (Steam Kraken) — 70판 장 보스 · 물·불

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER CHAPTER BOSS (game-ready asset, epic but readable).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 3 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Cells: row 1 = IDLE, ATTACK, SKILL (signature move, strongest pose); row 2 = HURT, KO, ENRAGED IDLE (glowing eyes, aura flaring).
- The boss fills about 88% of the cell height in every cell (it is shown 1.5x larger than normal units in the game).
- Same rift corruption language as the Rift monsters (violet hex cracks, rift crystals) plus a subtle boss aura that stays close to the body (no aura filling the cell).
Boss "Steam Kraken" (증기 크라켄) — stage 70, element 물·불: a kraken whose tentacles are half water half magma, wreathed in steam
```

### BOSS-80 · 모래폭풍 로크 (Sandstorm Roc) — 80판 장 보스 · 바람·대지

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER CHAPTER BOSS (game-ready asset, epic but readable).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 3 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Cells: row 1 = IDLE, ATTACK, SKILL (signature move, strongest pose); row 2 = HURT, KO, ENRAGED IDLE (glowing eyes, aura flaring).
- The boss fills about 88% of the cell height in every cell (it is shown 1.5x larger than normal units in the game).
- Same rift corruption language as the Rift monsters (violet hex cracks, rift crystals) plus a subtle boss aura that stays close to the body (no aura filling the cell).
Boss "Sandstorm Roc" (모래폭풍 로크) — stage 80, element 바람·대지: a giant roc bird with stone-plated wings carrying a sandstorm
```

### BOSS-90 · 혼돈 키메라 (Chaos Chimera) — 90판 장 보스 · 숲·물·불

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER CHAPTER BOSS (game-ready asset, epic but readable).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 3 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Cells: row 1 = IDLE, ATTACK, SKILL (signature move, strongest pose); row 2 = HURT, KO, ENRAGED IDLE (glowing eyes, aura flaring).
- The boss fills about 88% of the cell height in every cell (it is shown 1.5x larger than normal units in the game).
- Same rift corruption language as the Rift monsters (violet hex cracks, rift crystals) plus a subtle boss aura that stays close to the body (no aura filling the cell).
Boss "Chaos Chimera" (혼돈 키메라) — stage 90, element 숲·물·불: a three-headed chimera (forest stag, water serpent, fire lion) fused by rift cracks
```

### BOSS-100 · 헥사 포식자 · 균열의 군주 (Hexa Devourer, Lord of the Rift) — 100판 최종 보스 · 모든 속성

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create the GAME SPRITE SHEET for one HEXA FRONTIER FINAL BOSS (game-ready asset, epic but readable).
- Canvas 1536x1024, TRANSPARENT background, an invisible grid of 3 columns x 2 rows of equal cells (do NOT draw grid lines or cell borders).
- Exactly one sprite per cell, horizontally centered, every sprite at least 24 px away from its cell edges; nothing touches or overlaps another cell.
- Common baseline: in every cell the feet (or the lowest point of a floating creature, hovering slightly) sit on the same invisible line at 88% of the cell height.
- Same camera, same light, same outline weight in every cell.
- Cells: row 1 = IDLE, ATTACK, SKILL (signature move, strongest pose); row 2 = HURT, KO, PHASE 2 IDLE (rift armor broken, crystals blazing).
- The boss fills about 88% of the cell height in every cell (it is shown 1.5x larger than normal units in the game).
- Same rift corruption language as the Rift monsters (violet hex cracks, rift crystals) plus a subtle boss aura that stays close to the body (no aura filling the cell).
Boss "Hexa Devourer, Lord of the Rift" (헥사 포식자 · 균열의 군주) — stage 100, element 모든 속성: a colossal rift dragon made of shattered hex tiles, five element crystals orbiting it
```

## 기술 이펙트

8프레임(4×2) 스프라이트 시트, 투명 배경. 기술 16종 + 공통 효과(타격·치명타·기절·레벨업·쓰러짐·진화). 속성 기술 3종은 속성마다 한 장씩.

### FX-hit_basic · 기본 타격

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a game skill effect sprite sheet, 1536x1024, TRANSPARENT background, a 4 x 2 grid of 8 animation frames read left-to-right, top-to-bottom (each frame 384x512), effect centered in every frame and the same scale in every frame.
Style: HEXA FRONTIER painterly anime VFX — soft glow, crisp stylized shapes, small sparkle particles, no characters, no text. The effect must read on top of a small chibi unit standing on a hex (the unit occupies the lower-middle of the frame).
Effect: a quick white slash spark impact with small star sparks (generic basic attack hit)
Colors: white and warm gold
```

### FX-hit_crit · 치명타

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a game skill effect sprite sheet, 1536x1024, TRANSPARENT background, a 4 x 2 grid of 8 animation frames read left-to-right, top-to-bottom (each frame 384x512), effect centered in every frame and the same scale in every frame.
Style: HEXA FRONTIER painterly anime VFX — soft glow, crisp stylized shapes, small sparkle particles, no characters, no text. The effect must read on top of a small chibi unit standing on a hex (the unit occupies the lower-middle of the frame).
Effect: a big starburst impact with radial speed lines and a gold flash (critical hit)
Colors: gold and white
```

### FX-taunt · 도발

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a game skill effect sprite sheet, 1536x1024, TRANSPARENT background, a 4 x 2 grid of 8 animation frames read left-to-right, top-to-bottom (each frame 384x512), effect centered in every frame and the same scale in every frame.
Style: HEXA FRONTIER painterly anime VFX — soft glow, crisp stylized shapes, small sparkle particles, no characters, no text. The effect must read on top of a small chibi unit standing on a hex (the unit occupies the lower-middle of the frame).
Effect: a red shout shockwave ring expanding from the unit with an angry vein icon shape
Colors: red and orange
```

### FX-shieldbash · 방패 강타

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a game skill effect sprite sheet, 1536x1024, TRANSPARENT background, a 4 x 2 grid of 8 animation frames read left-to-right, top-to-bottom (each frame 384x512), effect centered in every frame and the same scale in every frame.
Style: HEXA FRONTIER painterly anime VFX — soft glow, crisp stylized shapes, small sparkle particles, no characters, no text. The effect must read on top of a small chibi unit standing on a hex (the unit occupies the lower-middle of the frame).
Effect: a heavy shield slam: stone-colored impact crater ring plus spinning dizzy stars
Colors: steel grey, gold stars
```

### FX-power · 강타

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a game skill effect sprite sheet, 1536x1024, TRANSPARENT background, a 4 x 2 grid of 8 animation frames read left-to-right, top-to-bottom (each frame 384x512), effect centered in every frame and the same scale in every frame.
Style: HEXA FRONTIER painterly anime VFX — soft glow, crisp stylized shapes, small sparkle particles, no characters, no text. The effect must read on top of a small chibi unit standing on a hex (the unit occupies the lower-middle of the frame).
Effect: a powerful single downward slash leaving a thick bright arc and a ground crack
Colors: white-gold
```

### FX-whirl · 회오리 베기

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a game skill effect sprite sheet, 1536x1024, TRANSPARENT background, a 4 x 2 grid of 8 animation frames read left-to-right, top-to-bottom (each frame 384x512), effect centered in every frame and the same scale in every frame.
Style: HEXA FRONTIER painterly anime VFX — soft glow, crisp stylized shapes, small sparkle particles, no characters, no text. The effect must read on top of a small chibi unit standing on a hex (the unit occupies the lower-middle of the frame).
Effect: a 360-degree spinning blade wind ring around the unit (covers the 6 surrounding hexes)
Colors: pale cyan and white
```

### FX-drain · 흡수

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a game skill effect sprite sheet, 1536x1024, TRANSPARENT background, a 4 x 2 grid of 8 animation frames read left-to-right, top-to-bottom (each frame 384x512), effect centered in every frame and the same scale in every frame.
Style: HEXA FRONTIER painterly anime VFX — soft glow, crisp stylized shapes, small sparkle particles, no characters, no text. The effect must read on top of a small chibi unit standing on a hex (the unit occupies the lower-middle of the frame).
Effect: dark red life-wisps flowing from the target back to the attacker
Colors: crimson and pink
```

### FX-snipe · 저격

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a game skill effect sprite sheet, 1536x1024, TRANSPARENT background, a 4 x 2 grid of 8 animation frames read left-to-right, top-to-bottom (each frame 384x512), effect centered in every frame and the same scale in every frame.
Style: HEXA FRONTIER painterly anime VFX — soft glow, crisp stylized shapes, small sparkle particles, no characters, no text. The effect must read on top of a small chibi unit standing on a hex (the unit occupies the lower-middle of the frame).
Effect: a single glowing arrow streak with a target reticle flash at impact
Colors: gold and white
```

### FX-volley · 화살비

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a game skill effect sprite sheet, 1536x1024, TRANSPARENT background, a 4 x 2 grid of 8 animation frames read left-to-right, top-to-bottom (each frame 384x512), effect centered in every frame and the same scale in every frame.
Style: HEXA FRONTIER painterly anime VFX — soft glow, crisp stylized shapes, small sparkle particles, no characters, no text. The effect must read on top of a small chibi unit standing on a hex (the unit occupies the lower-middle of the frame).
Effect: many small arrows falling in a circle area with dust puffs
Colors: brown wood and silver
```

### FX-heal · 치유

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a game skill effect sprite sheet, 1536x1024, TRANSPARENT background, a 4 x 2 grid of 8 animation frames read left-to-right, top-to-bottom (each frame 384x512), effect centered in every frame and the same scale in every frame.
Style: HEXA FRONTIER painterly anime VFX — soft glow, crisp stylized shapes, small sparkle particles, no characters, no text. The effect must read on top of a small chibi unit standing on a hex (the unit occupies the lower-middle of the frame).
Effect: soft green rising leaves and sparkles with a plus-shaped glow
Colors: green and white
```

### FX-massheal · 치유의 비

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a game skill effect sprite sheet, 1536x1024, TRANSPARENT background, a 4 x 2 grid of 8 animation frames read left-to-right, top-to-bottom (each frame 384x512), effect centered in every frame and the same scale in every frame.
Style: HEXA FRONTIER painterly anime VFX — soft glow, crisp stylized shapes, small sparkle particles, no characters, no text. The effect must read on top of a small chibi unit standing on a hex (the unit occupies the lower-middle of the frame).
Effect: a gentle rain of glowing droplets and petals over an area
Colors: green, aqua and white
```

### FX-cheer · 격려

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a game skill effect sprite sheet, 1536x1024, TRANSPARENT background, a 4 x 2 grid of 8 animation frames read left-to-right, top-to-bottom (each frame 384x512), effect centered in every frame and the same scale in every frame.
Style: HEXA FRONTIER painterly anime VFX — soft glow, crisp stylized shapes, small sparkle particles, no characters, no text. The effect must read on top of a small chibi unit standing on a hex (the unit occupies the lower-middle of the frame).
Effect: rising golden musical notes and an upward arrow aura
Colors: gold and orange
```

### FX-weaken · 약화

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a game skill effect sprite sheet, 1536x1024, TRANSPARENT background, a 4 x 2 grid of 8 animation frames read left-to-right, top-to-bottom (each frame 384x512), effect centered in every frame and the same scale in every frame.
Style: HEXA FRONTIER painterly anime VFX — soft glow, crisp stylized shapes, small sparkle particles, no characters, no text. The effect must read on top of a small chibi unit standing on a hex (the unit occupies the lower-middle of the frame).
Effect: a sinking violet mist with a broken-shield silhouette
Colors: violet and grey
```

### FX-command · 지휘

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a game skill effect sprite sheet, 1536x1024, TRANSPARENT background, a 4 x 2 grid of 8 animation frames read left-to-right, top-to-bottom (each frame 384x512), effect centered in every frame and the same scale in every frame.
Style: HEXA FRONTIER painterly anime VFX — soft glow, crisp stylized shapes, small sparkle particles, no characters, no text. The effect must read on top of a small chibi unit standing on a hex (the unit occupies the lower-middle of the frame).
Effect: a waving banner flash and a golden ring pulse spreading out
Colors: gold and navy
```

### FX-starbolt · 별빛탄

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a game skill effect sprite sheet, 1536x1024, TRANSPARENT background, a 4 x 2 grid of 8 animation frames read left-to-right, top-to-bottom (each frame 384x512), effect centered in every frame and the same scale in every frame.
Style: HEXA FRONTIER painterly anime VFX — soft glow, crisp stylized shapes, small sparkle particles, no characters, no text. The effect must read on top of a small chibi unit standing on a hex (the unit occupies the lower-middle of the frame).
Effect: a small shooting star projectile with a sparkling trail and star burst
Colors: white, pale gold and lilac
```

### FX-elstrike · 속성 일격 ×5

> 속성별 5장은 같은 프롬프트에서 속성만 바꿔 5번 생성

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a game skill effect sprite sheet, 1536x1024, TRANSPARENT background, a 4 x 2 grid of 8 animation frames read left-to-right, top-to-bottom (each frame 384x512), effect centered in every frame and the same scale in every frame.
Style: HEXA FRONTIER painterly anime VFX — soft glow, crisp stylized shapes, small sparkle particles, no characters, no text. The effect must read on top of a small chibi unit standing on a hex (the unit occupies the lower-middle of the frame).
Effect: an element-infused claw/blade strike on one target. Generate one image per element (5 images, same layout): water splash slash / fire flame slash / forest leaf slash / earth rock slash / wind gale slash
Colors: use the element palette of the version
```

### FX-elbolt · 원소탄 ×5

> 속성별 5장은 같은 프롬프트에서 속성만 바꿔 5번 생성

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a game skill effect sprite sheet, 1536x1024, TRANSPARENT background, a 4 x 2 grid of 8 animation frames read left-to-right, top-to-bottom (each frame 384x512), effect centered in every frame and the same scale in every frame.
Style: HEXA FRONTIER painterly anime VFX — soft glow, crisp stylized shapes, small sparkle particles, no characters, no text. The effect must read on top of a small chibi unit standing on a hex (the unit occupies the lower-middle of the frame).
Effect: an element projectile flying with a trail, then bursting on impact. Generate one image per element (5 images, same layout): water orb, fire ball, leaf-seed bolt, rock shard, wind blade
Colors: use the element palette of the version
```

### FX-blast · 원소 폭발 ×5

> 속성별 5장은 같은 프롬프트에서 속성만 바꿔 5번 생성

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a game skill effect sprite sheet, 1536x1024, TRANSPARENT background, a 4 x 2 grid of 8 animation frames read left-to-right, top-to-bottom (each frame 384x512), effect centered in every frame and the same scale in every frame.
Style: HEXA FRONTIER painterly anime VFX — soft glow, crisp stylized shapes, small sparkle particles, no characters, no text. The effect must read on top of a small chibi unit standing on a hex (the unit occupies the lower-middle of the frame).
Effect: an area explosion covering a target hex and its 6 neighbors. Generate one image per element (5 images, same layout): tidal splash, firestorm, thorn bloom, earth spikes, cyclone
Colors: use the element palette of the version
```

### FX-status_stun · 기절 별

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a game skill effect sprite sheet, 1536x1024, TRANSPARENT background, a 4 x 2 grid of 8 animation frames read left-to-right, top-to-bottom (each frame 384x512), effect centered in every frame and the same scale in every frame.
Style: HEXA FRONTIER painterly anime VFX — soft glow, crisp stylized shapes, small sparkle particles, no characters, no text. The effect must read on top of a small chibi unit standing on a hex (the unit occupies the lower-middle of the frame).
Effect: looping 3 small dizzy stars circling above a head (8-frame loop)
Colors: yellow
```

### FX-levelup · 레벨 업

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a game skill effect sprite sheet, 1536x1024, TRANSPARENT background, a 4 x 2 grid of 8 animation frames read left-to-right, top-to-bottom (each frame 384x512), effect centered in every frame and the same scale in every frame.
Style: HEXA FRONTIER painterly anime VFX — soft glow, crisp stylized shapes, small sparkle particles, no characters, no text. The effect must read on top of a small chibi unit standing on a hex (the unit occupies the lower-middle of the frame).
Effect: a golden pillar of light with rising sparkles and an upward chevron
Colors: gold and white
```

### FX-ko_poof · 쓰러짐

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a game skill effect sprite sheet, 1536x1024, TRANSPARENT background, a 4 x 2 grid of 8 animation frames read left-to-right, top-to-bottom (each frame 384x512), effect centered in every frame and the same scale in every frame.
Style: HEXA FRONTIER painterly anime VFX — soft glow, crisp stylized shapes, small sparkle particles, no characters, no text. The effect must read on top of a small chibi unit standing on a hex (the unit occupies the lower-middle of the frame).
Effect: a soft cartoon smoke poof with small stars fading out
Colors: grey-white
```

### FX-evolve · 진화

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a game skill effect sprite sheet, 1536x1024, TRANSPARENT background, a 4 x 2 grid of 8 animation frames read left-to-right, top-to-bottom (each frame 384x512), effect centered in every frame and the same scale in every frame.
Style: HEXA FRONTIER painterly anime VFX — soft glow, crisp stylized shapes, small sparkle particles, no characters, no text. The effect must read on top of a small chibi unit standing on a hex (the unit occupies the lower-middle of the frame).
Effect: a swirling cocoon of light that bursts into sparkles
Colors: element-neutral white with rainbow sparkles
```

## 전투 화면 요소 · 헥사

**헥사**: 캐릭터에서 받침을 없앴으니 바닥은 게임이 그립니다. 장(지역)마다 **살짝 기울어진 2.5D 헥사 타일 세트**(지역 6종 × 지형 8종)로 바닥을 새로 만들고, 캐릭터는 그 위에 발판 링·그림자와 함께 올라갑니다. 그래서 이동해도 헥사 모양이 변하지 않습니다.
그 밖에 범위 표시, 발판 링, 체력 막대, 상태·속성·역할·행동 아이콘, 차례 배너, 숫자 글꼴, 카드·미리보기 틀 — 모두 **글자 없이** 받아 게임이 한글을 얹습니다.

### TILE · 숲 들판 (1장·6장)

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a HEXA FRONTIER battle terrain tile set, 1536x1024, TRANSPARENT background.
Arrange 9 separate pointy-top hexagon tiles in a neat grid with lots of empty space between them, each tile the same size (about 300 px wide) and the same 2.5D angle: a mostly top-down view tilted slightly so a thin side edge (earth/stone thickness) shows at the bottom.
The tiles must tile seamlessly when placed edge to edge in a hex grid, and units will stand in the middle, so keep the center of each tile calm and readable (no tall objects in the middle; trees/rocks lean to the edges or stay low).
Biome: fresh meadow forest with flowers and moss
Tiles (in order, left-to-right, top-to-bottom): plain grass, grass with flowers, forest (low bushes + small trees at tile edges), hill (grassy mound), shallow water pond, rock (mossy boulder pile, impassable), camp (campfire with logs), path dirt
```

### TILE · 물안개 해안 (2장)

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a HEXA FRONTIER battle terrain tile set, 1536x1024, TRANSPARENT background.
Arrange 8 separate pointy-top hexagon tiles in a neat grid with lots of empty space between them, each tile the same size (about 300 px wide) and the same 2.5D angle: a mostly top-down view tilted slightly so a thin side edge (earth/stone thickness) shows at the bottom.
The tiles must tile seamlessly when placed edge to edge in a hex grid, and units will stand in the middle, so keep the center of each tile calm and readable (no tall objects in the middle; trees/rocks lean to the edges or stay low).
Biome: misty coast, sand and tide pools
Tiles (in order, left-to-right, top-to-bottom): sand, wet sand with shells, forest (palm/kelp brush), hill (dune), sea water, rock (sea stack), camp (beach bonfire), coral reef shallow
```

### TILE · 불꽃 화산 (3장)

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a HEXA FRONTIER battle terrain tile set, 1536x1024, TRANSPARENT background.
Arrange 9 separate pointy-top hexagon tiles in a neat grid with lots of empty space between them, each tile the same size (about 300 px wide) and the same 2.5D angle: a mostly top-down view tilted slightly so a thin side edge (earth/stone thickness) shows at the bottom.
The tiles must tile seamlessly when placed edge to edge in a hex grid, and units will stand in the middle, so keep the center of each tile calm and readable (no tall objects in the middle; trees/rocks lean to the edges or stay low).
Biome: volcanic ash fields with lava veins
Tiles (in order, left-to-right, top-to-bottom): ash ground, cracked basalt, forest (charred trees with ember leaves), hill (cinder cone), water (hot spring), rock (obsidian spire), camp (stone brazier), lava (glowing, impassable look)
```

### TILE · 바람 고원 (4장)

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a HEXA FRONTIER battle terrain tile set, 1536x1024, TRANSPARENT background.
Arrange 8 separate pointy-top hexagon tiles in a neat grid with lots of empty space between them, each tile the same size (about 300 px wide) and the same 2.5D angle: a mostly top-down view tilted slightly so a thin side edge (earth/stone thickness) shows at the bottom.
The tiles must tile seamlessly when placed edge to edge in a hex grid, and units will stand in the middle, so keep the center of each tile calm and readable (no tall objects in the middle; trees/rocks lean to the edges or stay low).
Biome: windy highland plateau with clouds
Tiles (in order, left-to-right, top-to-bottom): short grass, windswept stone, forest (bent wind trees), hill (rocky rise), water (cloud lake), rock (floating rock pillar), camp (windmill campfire), cloud bridge
```

### TILE · 대지 협곡 (5장)

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a HEXA FRONTIER battle terrain tile set, 1536x1024, TRANSPARENT background.
Arrange 8 separate pointy-top hexagon tiles in a neat grid with lots of empty space between them, each tile the same size (about 300 px wide) and the same 2.5D angle: a mostly top-down view tilted slightly so a thin side edge (earth/stone thickness) shows at the bottom.
The tiles must tile seamlessly when placed edge to edge in a hex grid, and units will stand in the middle, so keep the center of each tile calm and readable (no tall objects in the middle; trees/rocks lean to the edges or stay low).
Biome: red-sand canyon with crystals
Tiles (in order, left-to-right, top-to-bottom): sandstone, gravel, forest (cactus/dry brush), hill (mesa step), water (oasis), rock (canyon pillar), camp (tent campfire), crystal outcrop
```

### TILE · 균열의 땅 (7~10장)

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a HEXA FRONTIER battle terrain tile set, 1536x1024, TRANSPARENT background.
Arrange 8 separate pointy-top hexagon tiles in a neat grid with lots of empty space between them, each tile the same size (about 300 px wide) and the same 2.5D angle: a mostly top-down view tilted slightly so a thin side edge (earth/stone thickness) shows at the bottom.
The tiles must tile seamlessly when placed edge to edge in a hex grid, and units will stand in the middle, so keep the center of each tile calm and readable (no tall objects in the middle; trees/rocks lean to the edges or stay low).
Biome: corrupted rift lands mixing all elements, violet hex cracks
Tiles (in order, left-to-right, top-to-bottom): rift-cracked stone, mixed grass-ash, forest (twisted crystal trees), hill (crystal mound), water (dark violet water), rock (rift monolith), camp (protected ward circle), rift crack (glowing violet)
```

### UI · 헥사 표시 오버레이

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

A set of flat semi-transparent pointy-top hexagon overlays (same size as the terrain tiles), TRANSPARENT background, arranged in a grid with space between them: (1) blue MOVE range, (2) red ATTACK target, (3) gold SKILL area, (4) faint red ENEMY THREAT, (5) bright gold SELECTED outline ring, (6) green HEAL target, (7) small gold path dot, (8) dashed gold destination marker. Soft inner glow, clean edges, no text.
```

### UI · 유닛 발판 링

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

A set of glowing oval base rings that sit under a unit standing on a hex, TRANSPARENT background: ally (blue), enemy (red), boss (gold-violet with small crown), selected (gold pulse), acted/exhausted (desaturated grey). Each ring as a separate item with space between.
```

### UI · 체력·SP 막대

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Small HP and SP bar frames for above unit heads and for the unit card, TRANSPARENT background: unit-head bar frame (thin, rounded, dark), HP fills (ally green, enemy red, boss gold), SP fill (blue), XP fill (violet), shield/armor overlay. Also a large unit-card bar frame version. No text, no numbers.
```

### UI · 상태 아이콘

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

A sheet of 12 small round status icons, 128x128 each, TRANSPARENT background, consistent style (gold rim, navy disc): stun (dizzy stars), attack up (sword up arrow), defense down (cracked shield), taunt (shout), guard (shield glow), poison (green drop), burn (flame), heal over time (leaf), speed up (wing), leader (crown), elite (rift crystal), boss (skull crown). No text.
```

### UI · 속성 아이콘

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Five round element icons, 256x256 each, TRANSPARENT background, matching the element icons on the HEXA FRONTIER reference sheets: water drop, fire flame, forest leaf, earth mountain, wind swirl — plus the advantage chart graphic: five icons in a pentagon with curved arrows water->fire->forest->earth->wind->water.
```

### UI · 역할 아이콘

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Seven role icons, 256x256, TRANSPARENT background, gold-on-navy emblem style: tank (shield), physical melee (sword), magic melee (glowing claw), physical ranged (bow), magic ranged (orb with sparkles, NOT a wizard hat), healer (leaf heart), supporter (horn/banner).
```

### UI · 행동 버튼 아이콘

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Action button icons for the battle bottom panel, 256x256, TRANSPARENT background, consistent gold-on-navy style: attack (crossed swords), skill (star burst), item (satchel), wait (hourglass), undo move (curved arrow), end turn (flag with arrow), auto-battle OFF (sleeping robot), auto ON (robot), auto 2x (robot with >>), auto 4x (robot with >>>>), surrender (white flag), help (question compass).
```

### UI · 차례 배너

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Wide ribbon banners for battle phase announcements, TRANSPARENT background, NO TEXT (text will be added by the game): ally phase banner (blue-gold ribbon with compass star), enemy phase banner (crimson-violet ribbon with rift crystal), victory banner (gold laurel ribbon with trophy), defeat banner (grey broken ribbon), boss warning banner (red-violet with skull crown).
```

### UI · 피해 숫자 글꼴

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

A bitmap number font sheet for floating damage numbers, TRANSPARENT background: digits 0-9, plus '+', '-', '!' in four color styles in rows: normal hit (white with dark outline), advantage hit (orange, bigger, slightly bouncy), weak hit (grey-blue, smaller), heal (green). Chunky, game-like, highly legible, each glyph separated with space.
```

### UI · 공격 미리보기·유닛 카드 틀

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

UI frames, TRANSPARENT background, NO TEXT: (1) battle bottom unit card frame (portrait slot on the left, two bar slots, stat row), (2) attack forecast panel frame with a small 'VS' divider between two portrait slots, (3) small tooltip bubble, (4) skill button frame in 4 states (normal, pressed, disabled, cooling down overlay), (5) end-turn primary button (normal/pressed).
```

## UI·UX 단계별

한 단계씩 이미지를 받아 보고 결정한 뒤 다음 단계로 갑니다. 앞 단계에서 고른 이미지를 다음 단계에 **첨부**하고 `{choice}`에 고른 안을 적어 주세요.
특히 **2~3단계(원정 = 실제 접속 화면)**는 지금의 100판 목록을 완전히 대체합니다. 하단 탭은 **원정 · 부대 · 도감 · 상점 · 더보기** 5개로 제안합니다.

### 1단계 · 비주얼 방향 3안

> 결정할 것: 세 방향 중 하나(또는 섞기) · 메인 색·금색 트림 강도 · 글꼴 느낌(둥근/각진)

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a mobile game UI mockup, 1024x1536 portrait (phone screen 9:19.5 safe area), for HEXA FRONTIER, a hex-grid turn-based tactics RPG with cute elemental spirit creatures.
Use the HEXA FRONTIER UI chrome language: deep navy panels, warm gold trim, parchment cream cards, compass-star emblem, rounded corners, generous touch targets (min 44 px).
All visible UI text must be KOREAN (Hangul), short and legible. Show realistic content, not lorem ipsum.
Show THREE style direction boards side by side in one 1536x1024 landscape image (override the portrait size for this one), each board labeled A / B / C in large letters:
A "따뜻한 원정 지도": parchment, wood frames, hand-drawn map ink, warm brown + gold.
B "맑은 하늘 판타지": light sky blue glass panels, white and soft gold, airy and bright.
C "밤의 탐험대": deep navy panels, warm gold trim, cream cards, compass-star emblem (closest to the existing reference sheets).
Each board contains: color swatches, a primary button and a secondary button, a panel frame, a bottom tab bar with 5 tabs (원정 / 부대 / 도감 / 상점 / 더보기), a small stage node, an HP bar, sample Korean title text "헥사 프론티어" and body text "스피릿과 함께 원정을 떠나요".
```

### 2단계 · 원정(메인 접속 화면) 레이아웃 3안

> 결정할 것: A/B/C 중 메인 화면 구조 · 장(10판) 단위를 어떻게 보여 줄지 · 현재 위치·다음 판 강조 방식

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a mobile game UI mockup, 1024x1536 portrait (phone screen 9:19.5 safe area), for HEXA FRONTIER, a hex-grid turn-based tactics RPG with cute elemental spirit creatures.
Use the HEXA FRONTIER UI chrome language: deep navy panels, warm gold trim, parchment cream cards, compass-star emblem, rounded corners, generous touch targets (min 44 px).
All visible UI text must be KOREAN (Hangul), short and legible. Show realistic content, not lorem ipsum.
This is the main screen players see after logging in (replaces a plain list of 100 stages). Make THREE layout options as three phone screens side by side in one 1536x1024 landscape image, labeled A / B / C:
A "세로 원정길": a vertically scrolling illustrated world path for the current chapter — 10 hexagonal stage nodes connected by a winding road over a painted region background (e.g. 3장 불꽃 화산), boss node at the top is bigger with a skull-crown, cleared nodes show 3 small stars, the next node pulses, the hero chibi stands on the current node.
B "헥사 대륙 지도": a world overview made of 10 large hexagon islands (one per chapter, each with its element biome), tapping an island zooms into its 10 stage nodes; show the overview with locked islands greyed out and the current island glowing.
C "장 카드 넘기기": a horizontal carousel of big chapter cards (art + chapter name + element icons + progress 7/10), under it a compact node strip of the 10 stages.
All three share: top status bar (hero portrait with level, gold 🪙, growth crystals 🔶, settings), a big primary button "▶ 12판 출전", and a bottom tab bar with 5 tabs (원정 active, 부대, 도감, 상점, 더보기). Korean labels.
```

### 3단계 · 원정 화면 상세 + 스테이지 정보 팝업

> 결정할 것: 노드 상태 표현(잠김/도전/클리어/별) · 보스·대장 노드 · 팝업에 넣을 정보 순서

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a mobile game UI mockup, 1024x1536 portrait (phone screen 9:19.5 safe area), for HEXA FRONTIER, a hex-grid turn-based tactics RPG with cute elemental spirit creatures.
Use the HEXA FRONTIER UI chrome language: deep navy panels, warm gold trim, parchment cream cards, compass-star emblem, rounded corners, generous touch targets (min 44 px).
All visible UI text must be KOREAN (Hangul), short and legible. Show realistic content, not lorem ipsum.
Using the layout chosen in step 2 ({choice}), draw the finished main expedition screen for chapter 3 "불꽃 화산" with stages 21-30: nodes 21-26 cleared (stars), node 27 current (pulsing, hero standing there), 28-30 locked, node 25 is an ELITE node (rift crystal badge), node 30 is the BOSS node (화산 와이번 silhouette).
Also, as a second phone screen next to it (1536x1024 landscape, two phones side by side), draw the bottom sheet popup that opens when tapping node 27: title "27 · 마그마 굴", element warning chips "🔥 불 속성 적이 많아요 → 💧 물 스피릿 추천", enemy portraits row (6 small portraits with element dots and levels), win condition "적 전멸 · 28턴", first-clear rewards (gold, item icon, 🔶), recommended party chips, and a large button "출전 준비".
```

### 4단계 · 하단 탭 + 아이콘 세트

> 결정할 것: 탭 5개 구성·이름 · 선택/비선택 표현 · 알림 점 위치

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a mobile game UI mockup, 1024x1536 portrait (phone screen 9:19.5 safe area), for HEXA FRONTIER, a hex-grid turn-based tactics RPG with cute elemental spirit creatures.
Use the HEXA FRONTIER UI chrome language: deep navy panels, warm gold trim, parchment cream cards, compass-star emblem, rounded corners, generous touch targets (min 44 px).
All visible UI text must be KOREAN (Hangul), short and legible. Show realistic content, not lorem ipsum.
Design the bottom tab bar system: show the tab bar in 5 states (each tab selected once) stacked vertically, plus the 10 icons (5 active, 5 inactive) separately at large size on the right.
Tabs: 원정 (compass map), 부대 (shield with 3 creature silhouettes), 도감 (book with hex), 상점 (pouch with coins), 더보기 (gear). Selected tab: icon pops up slightly above the bar with a gold glow; red notification dot example on 부대 ("3").
```

### 5단계 · 출전 준비(편성) 화면

> 결정할 것: 출전 슬롯 표현(헥사 6칸 vs 카드 6장) · ▲유리/▼불리 표시 · 상성 추천 버튼 위치

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a mobile game UI mockup, 1024x1536 portrait (phone screen 9:19.5 safe area), for HEXA FRONTIER, a hex-grid turn-based tactics RPG with cute elemental spirit creatures.
Use the HEXA FRONTIER UI chrome language: deep navy panels, warm gold trim, parchment cream cards, compass-star emblem, rounded corners, generous touch targets (min 44 px).
All visible UI text must be KOREAN (Hangul), short and legible. Show realistic content, not lorem ipsum.
Draw the pre-battle party setup screen for stage 27 (enemies mostly 🔥 fire).
Top: stage name and win condition. Middle: 6 party slots shown as a small hex formation (front row 3, back row 3) with the leader hero fixed in one slot (crown badge). Below: scrollable grid of owned spirits (cards with portrait, level, element dot, role icon), each card marked "▲유리" (orange) or "▼불리" (grey) against this stage; water spirits are marked ▲.
Buttons: "✨ 상성 추천 편성", "장비", "⚔️ 전투 시작" (primary).
```

### 6단계 · 전투 화면 HUD

> 결정할 것: 위/아래 패널 높이 · 자동 버튼 4단계 표현 · 공격 미리보기 위치 · 헥사 바닥 2D vs 2.5D

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a mobile game UI mockup, 1024x1536 portrait (phone screen 9:19.5 safe area), for HEXA FRONTIER, a hex-grid turn-based tactics RPG with cute elemental spirit creatures.
Use the HEXA FRONTIER UI chrome language: deep navy panels, warm gold trim, parchment cream cards, compass-star emblem, rounded corners, generous touch targets (min 44 px).
All visible UI text must be KOREAN (Hangul), short and legible. Show realistic content, not lorem ipsum.
Draw the battle screen in portrait: a hex battlefield (6 hexes wide visible, map continues off-screen with a subtle edge fade) with 2.5D terrain tiles, 6 ally spirits on hexes at the bottom, enemies at the top, blue move-range hexes around a selected ally, red target hex on an enemy.
Top bar: "27 · 마그마 굴", turn "⏳ 3/28턴", objective "⚔️ 남은 적 5", help and surrender icons. A thin phase ribbon "아군 차례 · 행동 남은 4/6".
Bottom panel: selected unit card (portrait, name 웨이브팽, level, role, element, HP/SP bars, stats), attack forecast "플레임클로에게 42 유리! · 반격 없음" with button "공격!", action buttons grid (공격, 기술 2개, 아이템, 대기), and bottom row: auto button showing "🤖 자동 2배속" state and primary "턴 종료 ▶".
```

### 7단계 · 결과 화면 (승리·패배·합류)

> 결정할 것: 승리 연출 강도 · 보상 표시 순서 · 새 스피릿 합류 연출

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a mobile game UI mockup, 1024x1536 portrait (phone screen 9:19.5 safe area), for HEXA FRONTIER, a hex-grid turn-based tactics RPG with cute elemental spirit creatures.
Use the HEXA FRONTIER UI chrome language: deep navy panels, warm gold trim, parchment cream cards, compass-star emblem, rounded corners, generous touch targets (min 44 px).
All visible UI text must be KOREAN (Hangul), short and legible. Show realistic content, not lorem ipsum.
Draw THREE result screens side by side in one 1536x1024 landscape image:
(1) VICTORY: gold banner "승리!", stage "27 · 마그마 굴", stars 3/3, rewards (🪙 +276, item icon, 🔶 성장의 결정), level-up list with portraits ("웨이브팽 21 → 22").
(2) NEW SPIRIT JOINS: a dramatic reveal of a new spirit "퍼퍼샷 합류!" with its full art standing in a burst of light, element and role tags, button "부대에서 보기".
(3) DEFEAT: muted banner "패배…", reason line, and helpful next-step buttons: "앞 판에서 경험치 벌기", "편성 바꾸기 (▲상성 추천)", "장비 바꾸기", "다시 도전".
```

### 8단계 · 부대 탭 (목록 + 스피릿 상세)

> 결정할 것: 목록 정렬·필터(속성/역할) · 진화 단계 보여 주기 · 장비 3칸·성장의 결정 위치

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a mobile game UI mockup, 1024x1536 portrait (phone screen 9:19.5 safe area), for HEXA FRONTIER, a hex-grid turn-based tactics RPG with cute elemental spirit creatures.
Use the HEXA FRONTIER UI chrome language: deep navy panels, warm gold trim, parchment cream cards, compass-star emblem, rounded corners, generous touch targets (min 44 px).
All visible UI text must be KOREAN (Hangul), short and legible. Show realistic content, not lorem ipsum.
Draw TWO phone screens side by side (1536x1024 landscape):
(1) 부대 list: filter chips by element (💧🔥🌿⛰️🌪️) and role (탱커/근딜/원딜/힐러/서포터), a 4-column grid of spirit cards (portrait, level, element dot, role icon, small "출전" badge on party members).
(2) Spirit detail for "터스크월러스": large full-body art on a soft light circle with evolution track (Lv.1 → Lv.10 → Lv.25, current stage highlighted), stats (체력, 공격, 방어, 마법방어, 이동력, 사거리, SP), two skills (one locked until Lv.5), equipment slots (무기/갑옷/장신구), XP bar, button "🔶 성장의 결정 쓰기".
```

### 9단계 · 도감 탭 (스피릿 60종)

> 결정할 것: 미발견 표시(실루엣/물음표) · 속성별 페이지 vs 한 화면 · 수집률 보상

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a mobile game UI mockup, 1024x1536 portrait (phone screen 9:19.5 safe area), for HEXA FRONTIER, a hex-grid turn-based tactics RPG with cute elemental spirit creatures.
Use the HEXA FRONTIER UI chrome language: deep navy panels, warm gold trim, parchment cream cards, compass-star emblem, rounded corners, generous touch targets (min 44 px).
All visible UI text must be KOREAN (Hangul), short and legible. Show realistic content, not lorem ipsum.
Draw the spirit collection (도감) screen: header "스피릿 도감 23/60", element tabs (💧 물 12, 🔥 불 12, 🌿 숲 12, ⛰️ 대지 12, 🌪️ 바람 12), a grid of 12 slots for the selected element arranged by role rows (탱커 3, 근딜 3, 원딜 3, 힐러 1, 서포터 2): met spirits in color with names, unmet ones as dark silhouettes with "?" and the stage where they appear ("34판에서 만나요"). A collection reward track at the bottom (10 / 20 / 40 / 60).
```

### 10단계 · 상점 탭

> 결정할 것: 탭 구성(소모품/장비/결정) · 가격·보유 표시 · 판매 흐름

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a mobile game UI mockup, 1024x1536 portrait (phone screen 9:19.5 safe area), for HEXA FRONTIER, a hex-grid turn-based tactics RPG with cute elemental spirit creatures.
Use the HEXA FRONTIER UI chrome language: deep navy panels, warm gold trim, parchment cream cards, compass-star emblem, rounded corners, generous touch targets (min 44 px).
All visible UI text must be KOREAN (Hangul), short and legible. Show realistic content, not lorem ipsum.
Draw the shop (상점) screen: tabs "소모품 / 장비 / 특별", gold balance at top, item cards in a 2-column grid (icon, name, short effect, price button "🪙 120", owned count), one card highlighted "새 물건!", a sell toggle "팔기", and a small note "스테이지를 깰수록 물건이 늘어나요".
```

### 11단계 · 타이틀 + 주인공 선택

> 결정할 것: 타이틀 연출 · 주인공 카드 구성 · 고르지 않은 주인공 안내 문구

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a mobile game UI mockup, 1024x1536 portrait (phone screen 9:19.5 safe area), for HEXA FRONTIER, a hex-grid turn-based tactics RPG with cute elemental spirit creatures.
Use the HEXA FRONTIER UI chrome language: deep navy panels, warm gold trim, parchment cream cards, compass-star emblem, rounded corners, generous touch targets (min 44 px).
All visible UI text must be KOREAN (Hangul), short and legible. Show realistic content, not lorem ipsum.
Draw TWO phone screens side by side (1536x1024 landscape):
(1) Title: logo "헥사 프론티어" with the compass-star emblem, a painted key art of the hex frontier with spirits, buttons "모험 시작" / "이어서 하기".
(2) Hero select "누구와 떠날까요?": two large cards — 아렌 (boy adventurer with sword, role "물리 근접 딜러") and 리아 (girl adventurer with staff, role "마법 원거리 딜러") using the attached C01 and C02 character references, a line "고르지 않은 주인공은 먼 훗날 동료로 만나요", confirm button.
```

### 12단계 · 공통 컴포넌트 키트 (잘라 쓰는 원본)

> 결정할 것: 버튼 모양·상태 · 패널·팝업 틀 · 토스트·배지·뱃지

```
[HEXA FRONTIER STYLE BIBLE v2 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown outline (uniform ~3 px around the whole silhouette), soft cel shading with subtle painted texture, gentle rim light. High detail but a silhouette that reads clearly at 64 px.
- Proportions: big head, compact body (SD 1:2 to 1:2.5).
- Lighting: key light from upper-left, warm ambient fill. Identical lighting in every image.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- GAME SPRITE RULES (most important): every character is drawn ALONE on a fully TRANSPARENT background — NO ground, NO hex tile, NO base, NO pedestal, NO platform, NO grass patch, NO rock under the feet, NO cast shadow, NO frame, NO card, NO text or labels. The game draws the hex floor and the shadow itself. Do NOT imitate older HEXA FRONTIER collection sheets that show hex bases.
- Camera: three-quarter front view, body turned slightly to the viewer's left, eye level a little above the creature (same angle in every image so the game can mirror sprites).
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a mobile game UI mockup, 1024x1536 portrait (phone screen 9:19.5 safe area), for HEXA FRONTIER, a hex-grid turn-based tactics RPG with cute elemental spirit creatures.
Use the HEXA FRONTIER UI chrome language: deep navy panels, warm gold trim, parchment cream cards, compass-star emblem, rounded corners, generous touch targets (min 44 px).
All visible UI text must be KOREAN (Hangul), short and legible. Show realistic content, not lorem ipsum.
Create a UI component kit sheet (1536x1024 landscape, TRANSPARENT background, NO TEXT inside components — text is added by the game) in the chosen direction ({choice}):
primary button (normal/pressed/disabled), secondary button (3 states), small round icon button, tab bar background, top status bar background, panel frame (9-slice friendly: clear corners and straight edges), popup frame with header ribbon, bottom sheet frame with grab handle, toast bubble, red notification badge, gold stage-node hexagon (locked/open/cleared/current/boss/elite), progress bar frame, star (empty/full), divider ornament with compass star.
```
