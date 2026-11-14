# HEXA FRONTIER 디자인 · GPT 이미지 프롬프트 (D127)

content.py에서 만들어짐 — 고칠 때는 `docs/design/gen/content.py`를 고치고 `python3 docs/design/gen/build.py`.

## 사용법

GPT(이미지 생성)에 **프롬프트를 그대로 붙여 넣기 전에 레퍼런스를 함께 첨부**하세요. 일관성은 레퍼런스가 거의 다 정합니다.

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


## 스타일 바이블

모든 프롬프트 맨 위에 들어가는 공통 블록입니다. 색·빛·비율·배경을 고정해서 60종 스피릿, 몬스터, UI가 한 게임처럼 보이게 합니다.

### 공통 STYLE BIBLE

> 모든 프롬프트에 이미 포함되어 있어요. 따로 쓸 때만 복사.

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.
```

## 스피릿 60종

속성마다 **탱커 3 · 근딜 3 · 원딜 3 · 힐러 1 · 서포터 2 = 12종**, 5속성 × 12 = **60종**.
기존 레퍼런스 시트 중 생물 디자인은 그대로 쓰고(40종), 마법사처럼 보이는 캐릭터는 모두 빼고 동물·짐승형으로 새로 만듭니다(**새로 만들 20종**).

**뺀 마법사형 (다시 만듦)**
- ~~S01-R02 Mossmage~~ → 숲 원딜 → 시드샷
- ~~S02-R02 Cinder Mage~~ → 불 원딜 → 스파크호그
- ~~S02-S01 Pyronomad~~ → 불 서포터 → 하스펍
- ~~S03-R02 Neritha~~ → 물 원딜 → 퍼퍼샷
- ~~S05-R02 Sandseer~~ → 대지 원딜 → 볼더몰
- ~~S05-S01 Geomancer~~ → 대지 서포터 → 듄페넥

'확인 필요'는 시트를 다시 보고 마법사 느낌이면 같은 방식으로 새로 만들 후보입니다.

| 코드 | 속성 | 역할 | 이름 | 그림 |
|---|---|---|---|---|
| F-T1 | 숲 | 탱커 | 그로브골렘 (Ancient Grove Golem) | 기존 S01-T01 |
| F-T2 | 숲 | 탱커 | 쏜쉘 가디언 (Thornshell Guardian) | 기존 S01-T02 |
| F-T3 | 숲 | 탱커 | 모스백 (Mossback) | 🆕 새로 만들기 |
| F-M1 | 숲 | 근딜 | 블레이드워든 (Bladewarden) | 기존 S01-M01 |
| F-M2 | 숲 | 근딜 | 레이저보어 (Razorboar) | 기존 S01-M02 |
| F-M3 | 숲 | 근딜 | 쏜클로 (Thornclaw) | 기존 S01-M03 |
| F-R1 | 숲 | 원딜 | 실반 아처 (Sylvan Archer) | 기존 S01-R01 |
| F-R2 | 숲 | 원딜 | 시드샷 (Seedshot) | 🆕 새로 만들기 |
| F-R3 | 숲 | 원딜 | 쏜비틀 (Thornbeetle) | 🆕 새로 만들기 |
| F-H1 | 숲 | 힐러 | 블루멜 (Bloomel) | 기존 S01-H01 |
| F-S1 | 숲 | 서포터 | 윌로위스프 (Willowisp) | 기존 S01-S01 |
| F-S2 | 숲 | 서포터 | 페탈모스 (Petalmoth) | 🆕 새로 만들기 |
| Fi-T1 | 불 | 탱커 | 이그나골렘 (Igna Golem) | 기존 S02-T01 |
| Fi-T2 | 불 | 탱커 | 플레임벌워크 (Flamebulwark) | 기존 S02-T02 |
| Fi-T3 | 불 | 탱커 | 마그마크랩 (Magmacrab) | 🆕 새로 만들기 |
| Fi-M1 | 불 | 근딜 | 플레임클로 (Flameclaw) | 기존 S02-M01 |
| Fi-M2 | 불 | 근딜 | 블레이즈혼 (Blazehorn) | 기존 S02-M02 |
| Fi-M3 | 불 | 근딜 | 신더팽 (Cinderfang) | 🆕 새로 만들기 |
| Fi-R1 | 불 | 원딜 | 엠버윙 (Emberwing) | 기존 S02-R01 |
| Fi-R2 | 불 | 원딜 | 스파크호그 (Sparkhog) | 🆕 새로 만들기 |
| Fi-R3 | 불 | 원딜 | 애쉬드레이크 (Ashdrake) | 🆕 새로 만들기 |
| Fi-H1 | 불 | 힐러 | 플라모라 (Flamora) | 기존 S02-H01 |
| Fi-S1 | 불 | 서포터 | 하스펍 (Hearthpup) | 🆕 새로 만들기 |
| Fi-S2 | 불 | 서포터 | 킨들핀치 (Kindlefinch) | 🆕 새로 만들기 |
| W-T1 | 물 | 탱커 | 쉘나이트 (Shellknight) | 기존 S03-T01 |
| W-T2 | 물 | 탱커 | 타이드가드 (Tide Guard) | 기존 S03-T02 |
| W-T3 | 물 | 탱커 | 아쿠아골렘 (Aqua Golem) | 기존 S03-T03 |
| W-M1 | 물 | 근딜 | 웨이브팽 (Wavefang) | 기존 S03-M01 |
| W-M2 | 물 | 근딜 | 마리실 (Marisyl) | 기존 S03-M02 |
| W-M3 | 물 | 근딜 | 코랄스트라이크 (Coralstrike) | 기존 S03-M03 |
| W-R1 | 물 | 원딜 | 타이드킷 (Tidekit) | 기존 S03-R01 |
| W-R2 | 물 | 원딜 | 퍼퍼샷 (Puffershot) | 🆕 새로 만들기 |
| W-R3 | 물 | 원딜 | 아쿠아룬 (Aqualune) | 기존 S03-R03 · 확인 필요 |
| W-H1 | 물 | 힐러 | 아쿠아린 (Aqualyn) | 기존 S03-H01 |
| W-S1 | 물 | 서포터 | 아쿠아드론 (Aquadron) | 기존 S03-S01 |
| W-S2 | 물 | 서포터 | 버블롯 (Bubblot) | 🆕 새로 만들기 |
| Wi-T1 | 바람 | 탱커 | 클라우드터스크 (Cloudtusk) | 기존 S04-T01 |
| Wi-T2 | 바람 | 탱커 | 템페스트가드 (Tempest Guard) | 기존 S04-T02 |
| Wi-T3 | 바람 | 탱커 | 님버스램 (Nimbusram) | 🆕 새로 만들기 |
| Wi-M1 | 바람 | 근딜 | 에어로리스 (Aerolith) | 기존 S04-M01 |
| Wi-M2 | 바람 | 근딜 | 스카이워든 (Skywarden) | 기존 S04-M02 |
| Wi-M3 | 바람 | 근딜 | 스카이블레이드 (Skyblade) | 기존 S04-M03 |
| Wi-R1 | 바람 | 원딜 | 에어랄리스 (Aeralis) | 기존 S04-R01 |
| Wi-R2 | 바람 | 원딜 | 제피라 (Zephyra) | 기존 S04-R02 · 확인 필요 |
| Wi-R3 | 바람 | 원딜 | 스톰카이트 (Stormkite) | 🆕 새로 만들기 |
| Wi-H1 | 바람 | 힐러 | 실피아 (Sylphia) | 기존 S04-H01 |
| Wi-S1 | 바람 | 서포터 | 클라우디언 (Cloudavian) | 기존 S04-S01 |
| Wi-S2 | 바람 | 서포터 | 윈드차임 (Windchime) | 🆕 새로 만들기 |
| E-T1 | 대지 | 탱커 | 테라스톤 (Terrastone) | 기존 S05-T01 |
| E-T2 | 대지 | 탱커 | 테라벌워크 (Terra Bulwark) | 기존 S05-T02 |
| E-T3 | 대지 | 탱커 | 아이언딜로 (Irondillo) | 🆕 새로 만들기 |
| E-M1 | 대지 | 근딜 | 락터스크 (Rocktusk) | 기존 S05-M01 |
| E-M2 | 대지 | 근딜 | 시로코 알파 (Sirocco Alpha) | 기존 S05-M02 |
| E-M3 | 대지 | 근딜 | 쿼츠맨티스 (Quartzmantis) | 🆕 새로 만들기 |
| E-R1 | 대지 | 원딜 | 페블린 (Pebblin) | 기존 S05-R01 |
| E-R2 | 대지 | 원딜 | 볼더몰 (Bouldermole) | 🆕 새로 만들기 |
| E-R3 | 대지 | 원딜 | 지오드스콜피온 (Geodescorp) | 🆕 새로 만들기 |
| E-H1 | 대지 | 힐러 | 테라위스프 (Terrawisp) | 기존 S05-H01 |
| E-S1 | 대지 | 서포터 | 럼블렛 (Rumblet) | 기존 S05-S02 |
| E-S2 | 대지 | 서포터 | 듄페넥 (Dunefennec) | 🆕 새로 만들기 |

### F-T3 · 모스백 (Mossback) — 숲 탱커

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER MONSTER COLLECTION character sheet, 1536x1024 landscape, matching the layout of the attached reference sheet (for example S03-T01 Shellknight) panel for panel:
- TOP LEFT header: element emblem, role badge "FOREST TANKER 3", large name "Mossback", small epithet "(invent a short epithet)", element + role tags, a 2-line flavor description.
- TOP CENTER "EVOLUTION": three full-body poses side by side labeled "Lv.1", "Lv.10", "Lv.25" (small and cute -> grown -> majestic with more armor and ornaments; same species and color identity at every stage).
- TOP RIGHT "PORTRAIT & ICON": three rounded-square face portraits (Lv.1 / Lv.10 / Lv.25) on element-colored backgrounds, then a round element icon, then a character icon.
- Under the portraits "IN-GAME HEX TILE (IDLE)": the three evolution stages each standing on its own isometric hex tile, evenly spaced, nothing overlapping.
- BOTTOM "ANIMATION POSES & IN-GAME TILES": a grid with rows Lv.1 / Lv.10 / Lv.25 and columns IDLE, SKILL, WALK, HURT, KO/DEFEATED, every cell a small hex-tile sprite.
- Keep generous empty space between every panel item (they will be cut out automatically). Plain flat panel backgrounds.
Creature (모스백): a sturdy mossy tortoise with a small living tree and mushrooms on its domed shell; Lv.10 the shell becomes layered bark armor; Lv.25 an ancient guardian whose tree crown blossoms with glowing green runes. Quadruped tank.
It is a creature companion (an animal / beast / elemental being). It is NOT a wizard or mage: no robes, no pointed hats, no staffs, no spell books.
```

### F-R2 · 시드샷 (Seedshot) — 숲 원딜

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER MONSTER COLLECTION character sheet, 1536x1024 landscape, matching the layout of the attached reference sheet (for example S03-T01 Shellknight) panel for panel:
- TOP LEFT header: element emblem, role badge "FOREST RANGED DEALER 2", large name "Seedshot", small epithet "(invent a short epithet)", element + role tags, a 2-line flavor description.
- TOP CENTER "EVOLUTION": three full-body poses side by side labeled "Lv.1", "Lv.10", "Lv.25" (small and cute -> grown -> majestic with more armor and ornaments; same species and color identity at every stage).
- TOP RIGHT "PORTRAIT & ICON": three rounded-square face portraits (Lv.1 / Lv.10 / Lv.25) on element-colored backgrounds, then a round element icon, then a character icon.
- Under the portraits "IN-GAME HEX TILE (IDLE)": the three evolution stages each standing on its own isometric hex tile, evenly spaced, nothing overlapping.
- BOTTOM "ANIMATION POSES & IN-GAME TILES": a grid with rows Lv.1 / Lv.10 / Lv.25 and columns IDLE, SKILL, WALK, HURT, KO/DEFEATED, every cell a small hex-tile sprite.
- Keep generous empty space between every panel item (they will be cut out automatically). Plain flat panel backgrounds.
Creature (시드샷): a fluffy squirrel with an acorn-cap helmet that flings exploding seed pods from a vine slingshot held in its paws; Lv.10 leaf bandolier of seed pods; Lv.25 sleek forest ranger squirrel with a living-vine slingshot. (Replaces Mossmage.)
It is a creature companion (an animal / beast / elemental being). It is NOT a wizard or mage: no robes, no pointed hats, no staffs, no spell books.
```

### F-R3 · 쏜비틀 (Thornbeetle) — 숲 원딜

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER MONSTER COLLECTION character sheet, 1536x1024 landscape, matching the layout of the attached reference sheet (for example S03-T01 Shellknight) panel for panel:
- TOP LEFT header: element emblem, role badge "FOREST RANGED DEALER 3", large name "Thornbeetle", small epithet "(invent a short epithet)", element + role tags, a 2-line flavor description.
- TOP CENTER "EVOLUTION": three full-body poses side by side labeled "Lv.1", "Lv.10", "Lv.25" (small and cute -> grown -> majestic with more armor and ornaments; same species and color identity at every stage).
- TOP RIGHT "PORTRAIT & ICON": three rounded-square face portraits (Lv.1 / Lv.10 / Lv.25) on element-colored backgrounds, then a round element icon, then a character icon.
- Under the portraits "IN-GAME HEX TILE (IDLE)": the three evolution stages each standing on its own isometric hex tile, evenly spaced, nothing overlapping.
- BOTTOM "ANIMATION POSES & IN-GAME TILES": a grid with rows Lv.1 / Lv.10 / Lv.25 and columns IDLE, SKILL, WALK, HURT, KO/DEFEATED, every cell a small hex-tile sprite.
- Keep generous empty space between every panel item (they will be cut out automatically). Plain flat panel backgrounds.
Creature (쏜비틀): a round rhinoceros beetle whose back opens like a turret and shoots thorn spikes; Lv.10 armored stag beetle; Lv.25 heavy stag beetle with a thorn-cannon horn and moss armor.
It is a creature companion (an animal / beast / elemental being). It is NOT a wizard or mage: no robes, no pointed hats, no staffs, no spell books.
```

### F-S2 · 페탈모스 (Petalmoth) — 숲 서포터

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER MONSTER COLLECTION character sheet, 1536x1024 landscape, matching the layout of the attached reference sheet (for example S03-T01 Shellknight) panel for panel:
- TOP LEFT header: element emblem, role badge "FOREST SUPPORTER 2", large name "Petalmoth", small epithet "(invent a short epithet)", element + role tags, a 2-line flavor description.
- TOP CENTER "EVOLUTION": three full-body poses side by side labeled "Lv.1", "Lv.10", "Lv.25" (small and cute -> grown -> majestic with more armor and ornaments; same species and color identity at every stage).
- TOP RIGHT "PORTRAIT & ICON": three rounded-square face portraits (Lv.1 / Lv.10 / Lv.25) on element-colored backgrounds, then a round element icon, then a character icon.
- Under the portraits "IN-GAME HEX TILE (IDLE)": the three evolution stages each standing on its own isometric hex tile, evenly spaced, nothing overlapping.
- BOTTOM "ANIMATION POSES & IN-GAME TILES": a grid with rows Lv.1 / Lv.10 / Lv.25 and columns IDLE, SKILL, WALK, HURT, KO/DEFEATED, every cell a small hex-tile sprite.
- Keep generous empty space between every panel item (they will be cut out automatically). Plain flat panel backgrounds.
Creature (페탈모스): a round fuzzy moth with flower-petal wings that scatters glowing pollen to empower allies; Lv.10 larger patterned wings; Lv.25 majestic luna-moth with a flower crown and trailing pollen ribbons.
It is a creature companion (an animal / beast / elemental being). It is NOT a wizard or mage: no robes, no pointed hats, no staffs, no spell books.
```

### Fi-T3 · 마그마크랩 (Magmacrab) — 불 탱커

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER MONSTER COLLECTION character sheet, 1536x1024 landscape, matching the layout of the attached reference sheet (for example S03-T01 Shellknight) panel for panel:
- TOP LEFT header: element emblem, role badge "FIRE TANKER 3", large name "Magmacrab", small epithet "(invent a short epithet)", element + role tags, a 2-line flavor description.
- TOP CENTER "EVOLUTION": three full-body poses side by side labeled "Lv.1", "Lv.10", "Lv.25" (small and cute -> grown -> majestic with more armor and ornaments; same species and color identity at every stage).
- TOP RIGHT "PORTRAIT & ICON": three rounded-square face portraits (Lv.1 / Lv.10 / Lv.25) on element-colored backgrounds, then a round element icon, then a character icon.
- Under the portraits "IN-GAME HEX TILE (IDLE)": the three evolution stages each standing on its own isometric hex tile, evenly spaced, nothing overlapping.
- BOTTOM "ANIMATION POSES & IN-GAME TILES": a grid with rows Lv.1 / Lv.10 / Lv.25 and columns IDLE, SKILL, WALK, HURT, KO/DEFEATED, every cell a small hex-tile sprite.
- Keep generous empty space between every panel item (they will be cut out automatically). Plain flat panel backgrounds.
Creature (마그마크랩): a hermit crab carrying a volcanic rock shell with glowing lava cracks and one oversized claw used as a shield; Lv.10 obsidian plating; Lv.25 fortress crab whose shell is a small erupting volcano.
It is a creature companion (an animal / beast / elemental being). It is NOT a wizard or mage: no robes, no pointed hats, no staffs, no spell books.
```

### Fi-M3 · 신더팽 (Cinderfang) — 불 근딜

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER MONSTER COLLECTION character sheet, 1536x1024 landscape, matching the layout of the attached reference sheet (for example S03-T01 Shellknight) panel for panel:
- TOP LEFT header: element emblem, role badge "FIRE MELEE DEALER 3", large name "Cinderfang", small epithet "(invent a short epithet)", element + role tags, a 2-line flavor description.
- TOP CENTER "EVOLUTION": three full-body poses side by side labeled "Lv.1", "Lv.10", "Lv.25" (small and cute -> grown -> majestic with more armor and ornaments; same species and color identity at every stage).
- TOP RIGHT "PORTRAIT & ICON": three rounded-square face portraits (Lv.1 / Lv.10 / Lv.25) on element-colored backgrounds, then a round element icon, then a character icon.
- Under the portraits "IN-GAME HEX TILE (IDLE)": the three evolution stages each standing on its own isometric hex tile, evenly spaced, nothing overlapping.
- BOTTOM "ANIMATION POSES & IN-GAME TILES": a grid with rows Lv.1 / Lv.10 / Lv.25 and columns IDLE, SKILL, WALK, HURT, KO/DEFEATED, every cell a small hex-tile sprite.
- Keep generous empty space between every panel item (they will be cut out automatically). Plain flat panel backgrounds.
Creature (신더팽): a bipedal salamander lizard warrior with ember-tipped claws and a burning tail; Lv.10 scale armor; Lv.25 dragon-like salamander with obsidian armor plates and twin flame claws.
It is a creature companion (an animal / beast / elemental being). It is NOT a wizard or mage: no robes, no pointed hats, no staffs, no spell books.
```

### Fi-R2 · 스파크호그 (Sparkhog) — 불 원딜

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER MONSTER COLLECTION character sheet, 1536x1024 landscape, matching the layout of the attached reference sheet (for example S03-T01 Shellknight) panel for panel:
- TOP LEFT header: element emblem, role badge "FIRE RANGED DEALER 2", large name "Sparkhog", small epithet "(invent a short epithet)", element + role tags, a 2-line flavor description.
- TOP CENTER "EVOLUTION": three full-body poses side by side labeled "Lv.1", "Lv.10", "Lv.25" (small and cute -> grown -> majestic with more armor and ornaments; same species and color identity at every stage).
- TOP RIGHT "PORTRAIT & ICON": three rounded-square face portraits (Lv.1 / Lv.10 / Lv.25) on element-colored backgrounds, then a round element icon, then a character icon.
- Under the portraits "IN-GAME HEX TILE (IDLE)": the three evolution stages each standing on its own isometric hex tile, evenly spaced, nothing overlapping.
- BOTTOM "ANIMATION POSES & IN-GAME TILES": a grid with rows Lv.1 / Lv.10 / Lv.25 and columns IDLE, SKILL, WALK, HURT, KO/DEFEATED, every cell a small hex-tile sprite.
- Keep generous empty space between every panel item (they will be cut out automatically). Plain flat panel backgrounds.
Creature (스파크호그): a hedgehog whose quills are flaming spikes it fires at enemies; Lv.10 longer glowing quills; Lv.25 porcupine with a blazing quill crown. (Replaces Cinder Mage.)
It is a creature companion (an animal / beast / elemental being). It is NOT a wizard or mage: no robes, no pointed hats, no staffs, no spell books.
```

### Fi-R3 · 애쉬드레이크 (Ashdrake) — 불 원딜

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER MONSTER COLLECTION character sheet, 1536x1024 landscape, matching the layout of the attached reference sheet (for example S03-T01 Shellknight) panel for panel:
- TOP LEFT header: element emblem, role badge "FIRE RANGED DEALER 3", large name "Ashdrake", small epithet "(invent a short epithet)", element + role tags, a 2-line flavor description.
- TOP CENTER "EVOLUTION": three full-body poses side by side labeled "Lv.1", "Lv.10", "Lv.25" (small and cute -> grown -> majestic with more armor and ornaments; same species and color identity at every stage).
- TOP RIGHT "PORTRAIT & ICON": three rounded-square face portraits (Lv.1 / Lv.10 / Lv.25) on element-colored backgrounds, then a round element icon, then a character icon.
- Under the portraits "IN-GAME HEX TILE (IDLE)": the three evolution stages each standing on its own isometric hex tile, evenly spaced, nothing overlapping.
- BOTTOM "ANIMATION POSES & IN-GAME TILES": a grid with rows Lv.1 / Lv.10 / Lv.25 and columns IDLE, SKILL, WALK, HURT, KO/DEFEATED, every cell a small hex-tile sprite.
- Keep generous empty space between every panel item (they will be cut out automatically). Plain flat panel backgrounds.
Creature (애쉬드레이크): a small round dragon with ash-grey scales and a glowing magma belly that spits fireballs; Lv.10 bigger wings; Lv.25 proud drake with molten horn crest.
It is a creature companion (an animal / beast / elemental being). It is NOT a wizard or mage: no robes, no pointed hats, no staffs, no spell books.
```

### Fi-S1 · 하스펍 (Hearthpup) — 불 서포터

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER MONSTER COLLECTION character sheet, 1536x1024 landscape, matching the layout of the attached reference sheet (for example S03-T01 Shellknight) panel for panel:
- TOP LEFT header: element emblem, role badge "FIRE SUPPORTER 1", large name "Hearthpup", small epithet "(invent a short epithet)", element + role tags, a 2-line flavor description.
- TOP CENTER "EVOLUTION": three full-body poses side by side labeled "Lv.1", "Lv.10", "Lv.25" (small and cute -> grown -> majestic with more armor and ornaments; same species and color identity at every stage).
- TOP RIGHT "PORTRAIT & ICON": three rounded-square face portraits (Lv.1 / Lv.10 / Lv.25) on element-colored backgrounds, then a round element icon, then a character icon.
- Under the portraits "IN-GAME HEX TILE (IDLE)": the three evolution stages each standing on its own isometric hex tile, evenly spaced, nothing overlapping.
- BOTTOM "ANIMATION POSES & IN-GAME TILES": a grid with rows Lv.1 / Lv.10 / Lv.25 and columns IDLE, SKILL, WALK, HURT, KO/DEFEATED, every cell a small hex-tile sprite.
- Keep generous empty space between every panel item (they will be cut out automatically). Plain flat panel backgrounds.
Creature (하스펍): a chubby puppy carrying a glowing hearth-lantern on its back whose warmth boosts allies; Lv.10 lantern becomes a small brazier saddle; Lv.25 noble hound with a phoenix-shaped hearth. (Replaces Pyronomad.)
It is a creature companion (an animal / beast / elemental being). It is NOT a wizard or mage: no robes, no pointed hats, no staffs, no spell books.
```

### Fi-S2 · 킨들핀치 (Kindlefinch) — 불 서포터

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER MONSTER COLLECTION character sheet, 1536x1024 landscape, matching the layout of the attached reference sheet (for example S03-T01 Shellknight) panel for panel:
- TOP LEFT header: element emblem, role badge "FIRE SUPPORTER 2", large name "Kindlefinch", small epithet "(invent a short epithet)", element + role tags, a 2-line flavor description.
- TOP CENTER "EVOLUTION": three full-body poses side by side labeled "Lv.1", "Lv.10", "Lv.25" (small and cute -> grown -> majestic with more armor and ornaments; same species and color identity at every stage).
- TOP RIGHT "PORTRAIT & ICON": three rounded-square face portraits (Lv.1 / Lv.10 / Lv.25) on element-colored backgrounds, then a round element icon, then a character icon.
- Under the portraits "IN-GAME HEX TILE (IDLE)": the three evolution stages each standing on its own isometric hex tile, evenly spaced, nothing overlapping.
- BOTTOM "ANIMATION POSES & IN-GAME TILES": a grid with rows Lv.1 / Lv.10 / Lv.25 and columns IDLE, SKILL, WALK, HURT, KO/DEFEATED, every cell a small hex-tile sprite.
- Keep generous empty space between every panel item (they will be cut out automatically). Plain flat panel backgrounds.
Creature (킨들핀치): a bright songbird with ember feathers whose song raises morale; Lv.10 longer flame tail; Lv.25 phoenix-like songbird with flaming tail ribbons.
It is a creature companion (an animal / beast / elemental being). It is NOT a wizard or mage: no robes, no pointed hats, no staffs, no spell books.
```

### W-R2 · 퍼퍼샷 (Puffershot) — 물 원딜

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER MONSTER COLLECTION character sheet, 1536x1024 landscape, matching the layout of the attached reference sheet (for example S03-T01 Shellknight) panel for panel:
- TOP LEFT header: element emblem, role badge "WATER RANGED DEALER 2", large name "Puffershot", small epithet "(invent a short epithet)", element + role tags, a 2-line flavor description.
- TOP CENTER "EVOLUTION": three full-body poses side by side labeled "Lv.1", "Lv.10", "Lv.25" (small and cute -> grown -> majestic with more armor and ornaments; same species and color identity at every stage).
- TOP RIGHT "PORTRAIT & ICON": three rounded-square face portraits (Lv.1 / Lv.10 / Lv.25) on element-colored backgrounds, then a round element icon, then a character icon.
- Under the portraits "IN-GAME HEX TILE (IDLE)": the three evolution stages each standing on its own isometric hex tile, evenly spaced, nothing overlapping.
- BOTTOM "ANIMATION POSES & IN-GAME TILES": a grid with rows Lv.1 / Lv.10 / Lv.25 and columns IDLE, SKILL, WALK, HURT, KO/DEFEATED, every cell a small hex-tile sprite.
- Keep generous empty space between every panel item (they will be cut out automatically). Plain flat panel backgrounds.
Creature (퍼퍼샷): a pufferfish floating inside a water bubble that shoots water spikes; Lv.10 coral armor spines; Lv.25 armored puffer with coral cannons. (Replaces Neritha.)
It is a creature companion (an animal / beast / elemental being). It is NOT a wizard or mage: no robes, no pointed hats, no staffs, no spell books.
```

### W-S2 · 버블롯 (Bubblot) — 물 서포터

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER MONSTER COLLECTION character sheet, 1536x1024 landscape, matching the layout of the attached reference sheet (for example S03-T01 Shellknight) panel for panel:
- TOP LEFT header: element emblem, role badge "WATER SUPPORTER 2", large name "Bubblot", small epithet "(invent a short epithet)", element + role tags, a 2-line flavor description.
- TOP CENTER "EVOLUTION": three full-body poses side by side labeled "Lv.1", "Lv.10", "Lv.25" (small and cute -> grown -> majestic with more armor and ornaments; same species and color identity at every stage).
- TOP RIGHT "PORTRAIT & ICON": three rounded-square face portraits (Lv.1 / Lv.10 / Lv.25) on element-colored backgrounds, then a round element icon, then a character icon.
- Under the portraits "IN-GAME HEX TILE (IDLE)": the three evolution stages each standing on its own isometric hex tile, evenly spaced, nothing overlapping.
- BOTTOM "ANIMATION POSES & IN-GAME TILES": a grid with rows Lv.1 / Lv.10 / Lv.25 and columns IDLE, SKILL, WALK, HURT, KO/DEFEATED, every cell a small hex-tile sprite.
- Keep generous empty space between every panel item (they will be cut out automatically). Plain flat panel backgrounds.
Creature (버블롯): a sea otter holding a shell that blows protective bubble shields over allies; Lv.10 kelp scarf; Lv.25 otter with a glowing pearl and a bubble halo.
It is a creature companion (an animal / beast / elemental being). It is NOT a wizard or mage: no robes, no pointed hats, no staffs, no spell books.
```

### Wi-T3 · 님버스램 (Nimbusram) — 바람 탱커

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER MONSTER COLLECTION character sheet, 1536x1024 landscape, matching the layout of the attached reference sheet (for example S03-T01 Shellknight) panel for panel:
- TOP LEFT header: element emblem, role badge "WIND TANKER 3", large name "Nimbusram", small epithet "(invent a short epithet)", element + role tags, a 2-line flavor description.
- TOP CENTER "EVOLUTION": three full-body poses side by side labeled "Lv.1", "Lv.10", "Lv.25" (small and cute -> grown -> majestic with more armor and ornaments; same species and color identity at every stage).
- TOP RIGHT "PORTRAIT & ICON": three rounded-square face portraits (Lv.1 / Lv.10 / Lv.25) on element-colored backgrounds, then a round element icon, then a character icon.
- Under the portraits "IN-GAME HEX TILE (IDLE)": the three evolution stages each standing on its own isometric hex tile, evenly spaced, nothing overlapping.
- BOTTOM "ANIMATION POSES & IN-GAME TILES": a grid with rows Lv.1 / Lv.10 / Lv.25 and columns IDLE, SKILL, WALK, HURT, KO/DEFEATED, every cell a small hex-tile sprite.
- Keep generous empty space between every panel item (they will be cut out automatically). Plain flat panel backgrounds.
Creature (님버스램): a ram whose wool is a thick storm cloud and whose curled horns crackle with tiny sparks; Lv.10 bigger cloud mane; Lv.25 thunderhead ram with lightning-etched horns.
It is a creature companion (an animal / beast / elemental being). It is NOT a wizard or mage: no robes, no pointed hats, no staffs, no spell books.
```

### Wi-R3 · 스톰카이트 (Stormkite) — 바람 원딜

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER MONSTER COLLECTION character sheet, 1536x1024 landscape, matching the layout of the attached reference sheet (for example S03-T01 Shellknight) panel for panel:
- TOP LEFT header: element emblem, role badge "WIND RANGED DEALER 3", large name "Stormkite", small epithet "(invent a short epithet)", element + role tags, a 2-line flavor description.
- TOP CENTER "EVOLUTION": three full-body poses side by side labeled "Lv.1", "Lv.10", "Lv.25" (small and cute -> grown -> majestic with more armor and ornaments; same species and color identity at every stage).
- TOP RIGHT "PORTRAIT & ICON": three rounded-square face portraits (Lv.1 / Lv.10 / Lv.25) on element-colored backgrounds, then a round element icon, then a character icon.
- Under the portraits "IN-GAME HEX TILE (IDLE)": the three evolution stages each standing on its own isometric hex tile, evenly spaced, nothing overlapping.
- BOTTOM "ANIMATION POSES & IN-GAME TILES": a grid with rows Lv.1 / Lv.10 / Lv.25 and columns IDLE, SKILL, WALK, HURT, KO/DEFEATED, every cell a small hex-tile sprite.
- Keep generous empty space between every panel item (they will be cut out automatically). Plain flat panel backgrounds.
Creature (스톰카이트): a kite-shaped flying sky ray that slices wind blades from its fins; Lv.10 longer tail ribbons; Lv.25 thunder-striped sky ray with glowing fin edges.
It is a creature companion (an animal / beast / elemental being). It is NOT a wizard or mage: no robes, no pointed hats, no staffs, no spell books.
```

### Wi-S2 · 윈드차임 (Windchime) — 바람 서포터

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER MONSTER COLLECTION character sheet, 1536x1024 landscape, matching the layout of the attached reference sheet (for example S03-T01 Shellknight) panel for panel:
- TOP LEFT header: element emblem, role badge "WIND SUPPORTER 2", large name "Windchime", small epithet "(invent a short epithet)", element + role tags, a 2-line flavor description.
- TOP CENTER "EVOLUTION": three full-body poses side by side labeled "Lv.1", "Lv.10", "Lv.25" (small and cute -> grown -> majestic with more armor and ornaments; same species and color identity at every stage).
- TOP RIGHT "PORTRAIT & ICON": three rounded-square face portraits (Lv.1 / Lv.10 / Lv.25) on element-colored backgrounds, then a round element icon, then a character icon.
- Under the portraits "IN-GAME HEX TILE (IDLE)": the three evolution stages each standing on its own isometric hex tile, evenly spaced, nothing overlapping.
- BOTTOM "ANIMATION POSES & IN-GAME TILES": a grid with rows Lv.1 / Lv.10 / Lv.25 and columns IDLE, SKILL, WALK, HURT, KO/DEFEATED, every cell a small hex-tile sprite.
- Keep generous empty space between every panel item (they will be cut out automatically). Plain flat panel backgrounds.
Creature (윈드차임): a small round owl whose tail feathers are wind chimes that ring to cheer allies; Lv.10 crystal chimes; Lv.25 great owl with a halo of floating chimes.
It is a creature companion (an animal / beast / elemental being). It is NOT a wizard or mage: no robes, no pointed hats, no staffs, no spell books.
```

### E-T3 · 아이언딜로 (Irondillo) — 대지 탱커

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER MONSTER COLLECTION character sheet, 1536x1024 landscape, matching the layout of the attached reference sheet (for example S03-T01 Shellknight) panel for panel:
- TOP LEFT header: element emblem, role badge "EARTH TANKER 3", large name "Irondillo", small epithet "(invent a short epithet)", element + role tags, a 2-line flavor description.
- TOP CENTER "EVOLUTION": three full-body poses side by side labeled "Lv.1", "Lv.10", "Lv.25" (small and cute -> grown -> majestic with more armor and ornaments; same species and color identity at every stage).
- TOP RIGHT "PORTRAIT & ICON": three rounded-square face portraits (Lv.1 / Lv.10 / Lv.25) on element-colored backgrounds, then a round element icon, then a character icon.
- Under the portraits "IN-GAME HEX TILE (IDLE)": the three evolution stages each standing on its own isometric hex tile, evenly spaced, nothing overlapping.
- BOTTOM "ANIMATION POSES & IN-GAME TILES": a grid with rows Lv.1 / Lv.10 / Lv.25 and columns IDLE, SKILL, WALK, HURT, KO/DEFEATED, every cell a small hex-tile sprite.
- Keep generous empty space between every panel item (they will be cut out automatically). Plain flat panel backgrounds.
Creature (아이언딜로): an armadillo with iron-ore plated shell that curls into a rolling fortress; Lv.10 studded plates; Lv.25 massive armadillo with amber crystal spikes.
It is a creature companion (an animal / beast / elemental being). It is NOT a wizard or mage: no robes, no pointed hats, no staffs, no spell books.
```

### E-M3 · 쿼츠맨티스 (Quartzmantis) — 대지 근딜

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER MONSTER COLLECTION character sheet, 1536x1024 landscape, matching the layout of the attached reference sheet (for example S03-T01 Shellknight) panel for panel:
- TOP LEFT header: element emblem, role badge "EARTH MELEE DEALER 3", large name "Quartzmantis", small epithet "(invent a short epithet)", element + role tags, a 2-line flavor description.
- TOP CENTER "EVOLUTION": three full-body poses side by side labeled "Lv.1", "Lv.10", "Lv.25" (small and cute -> grown -> majestic with more armor and ornaments; same species and color identity at every stage).
- TOP RIGHT "PORTRAIT & ICON": three rounded-square face portraits (Lv.1 / Lv.10 / Lv.25) on element-colored backgrounds, then a round element icon, then a character icon.
- Under the portraits "IN-GAME HEX TILE (IDLE)": the three evolution stages each standing on its own isometric hex tile, evenly spaced, nothing overlapping.
- BOTTOM "ANIMATION POSES & IN-GAME TILES": a grid with rows Lv.1 / Lv.10 / Lv.25 and columns IDLE, SKILL, WALK, HURT, KO/DEFEATED, every cell a small hex-tile sprite.
- Keep generous empty space between every panel item (they will be cut out automatically). Plain flat panel backgrounds.
Creature (쿼츠맨티스): a praying mantis with quartz-crystal scythe arms; Lv.10 crystal armor; Lv.25 amethyst-blade mantis master.
It is a creature companion (an animal / beast / elemental being). It is NOT a wizard or mage: no robes, no pointed hats, no staffs, no spell books.
```

### E-R2 · 볼더몰 (Bouldermole) — 대지 원딜

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER MONSTER COLLECTION character sheet, 1536x1024 landscape, matching the layout of the attached reference sheet (for example S03-T01 Shellknight) panel for panel:
- TOP LEFT header: element emblem, role badge "EARTH RANGED DEALER 2", large name "Bouldermole", small epithet "(invent a short epithet)", element + role tags, a 2-line flavor description.
- TOP CENTER "EVOLUTION": three full-body poses side by side labeled "Lv.1", "Lv.10", "Lv.25" (small and cute -> grown -> majestic with more armor and ornaments; same species and color identity at every stage).
- TOP RIGHT "PORTRAIT & ICON": three rounded-square face portraits (Lv.1 / Lv.10 / Lv.25) on element-colored backgrounds, then a round element icon, then a character icon.
- Under the portraits "IN-GAME HEX TILE (IDLE)": the three evolution stages each standing on its own isometric hex tile, evenly spaced, nothing overlapping.
- BOTTOM "ANIMATION POSES & IN-GAME TILES": a grid with rows Lv.1 / Lv.10 / Lv.25 and columns IDLE, SKILL, WALK, HURT, KO/DEFEATED, every cell a small hex-tile sprite.
- Keep generous empty space between every panel item (they will be cut out automatically). Plain flat panel backgrounds.
Creature (볼더몰): a mole wearing a little mining helmet who hurls boulders; Lv.10 rock gauntlets; Lv.25 drill-gauntlet mole with an ore backpack. (Replaces Sandseer.)
It is a creature companion (an animal / beast / elemental being). It is NOT a wizard or mage: no robes, no pointed hats, no staffs, no spell books.
```

### E-R3 · 지오드스콜피온 (Geodescorp) — 대지 원딜

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER MONSTER COLLECTION character sheet, 1536x1024 landscape, matching the layout of the attached reference sheet (for example S03-T01 Shellknight) panel for panel:
- TOP LEFT header: element emblem, role badge "EARTH RANGED DEALER 3", large name "Geodescorp", small epithet "(invent a short epithet)", element + role tags, a 2-line flavor description.
- TOP CENTER "EVOLUTION": three full-body poses side by side labeled "Lv.1", "Lv.10", "Lv.25" (small and cute -> grown -> majestic with more armor and ornaments; same species and color identity at every stage).
- TOP RIGHT "PORTRAIT & ICON": three rounded-square face portraits (Lv.1 / Lv.10 / Lv.25) on element-colored backgrounds, then a round element icon, then a character icon.
- Under the portraits "IN-GAME HEX TILE (IDLE)": the three evolution stages each standing on its own isometric hex tile, evenly spaced, nothing overlapping.
- BOTTOM "ANIMATION POSES & IN-GAME TILES": a grid with rows Lv.1 / Lv.10 / Lv.25 and columns IDLE, SKILL, WALK, HURT, KO/DEFEATED, every cell a small hex-tile sprite.
- Keep generous empty space between every panel item (they will be cut out automatically). Plain flat panel backgrounds.
Creature (지오드스콜피온): a scorpion whose tail tip is a cracked geode that fires crystal shards; Lv.10 crystal plating; Lv.25 amber-crystal scorpion.
It is a creature companion (an animal / beast / elemental being). It is NOT a wizard or mage: no robes, no pointed hats, no staffs, no spell books.
```

### E-S2 · 듄페넥 (Dunefennec) — 대지 서포터

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER MONSTER COLLECTION character sheet, 1536x1024 landscape, matching the layout of the attached reference sheet (for example S03-T01 Shellknight) panel for panel:
- TOP LEFT header: element emblem, role badge "EARTH SUPPORTER 2", large name "Dunefennec", small epithet "(invent a short epithet)", element + role tags, a 2-line flavor description.
- TOP CENTER "EVOLUTION": three full-body poses side by side labeled "Lv.1", "Lv.10", "Lv.25" (small and cute -> grown -> majestic with more armor and ornaments; same species and color identity at every stage).
- TOP RIGHT "PORTRAIT & ICON": three rounded-square face portraits (Lv.1 / Lv.10 / Lv.25) on element-colored backgrounds, then a round element icon, then a character icon.
- Under the portraits "IN-GAME HEX TILE (IDLE)": the three evolution stages each standing on its own isometric hex tile, evenly spaced, nothing overlapping.
- BOTTOM "ANIMATION POSES & IN-GAME TILES": a grid with rows Lv.1 / Lv.10 / Lv.25 and columns IDLE, SKILL, WALK, HURT, KO/DEFEATED, every cell a small hex-tile sprite.
- Keep generous empty space between every panel item (they will be cut out automatically). Plain flat panel backgrounds.
Creature (듄페넥): a fennec fox with a sand drum strapped to its back whose rhythm weakens enemies; Lv.10 bigger drum with charms; Lv.25 desert fennec with a golden sun-drum. (Replaces Geomancer.)
It is a creature companion (an animal / beast / elemental being). It is NOT a wizard or mage: no robes, no pointed hats, no staffs, no spell books.
```

## 몬스터 30종

스피릿과 헷갈리지 않게 **'균열체'**로 통일: 몸에 보라색 육각 균열과 균열 수정, 붉은보라 눈빛. 비율은 스피릿과 같은 SD.
속성마다 6역할 — **근접 졸개 · 돌격대 · 방패 · 사수 · 치유체 · 저주체**. 시트에 일반·정예(대장) 두 모습을 함께 받습니다.

### MON-F-1 · 균열 덩굴뱀 (Riftvine Viper) — 숲 근접 졸개

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER RIFT MONSTER sheet, 1536x1024 landscape, same rendering style as the attached spirit reference sheets but clearly an ENEMY:
- Design language for all Rift monsters: the creature has been corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, slightly menacing eyes (red-violet glow), but still the same cute SD proportions as the spirits. Never a copy of any spirit.
- LEFT header: role badge "RIFT FOREST 1", name "Riftvine Viper", epithet, element tag.
- CENTER: two full-body poses side by side: "NORMAL" and "ELITE" (elite = bigger horns/spikes, gold-violet trim, small crown of rift crystals).
- RIGHT TOP: two rounded-square face portraits (NORMAL / ELITE).
- RIGHT MIDDLE "IN-GAME HEX TILE (IDLE)": NORMAL and ELITE each standing on an isometric hex tile with a dark violet rim.
- BOTTOM: row of hex-tile sprites: IDLE, ATTACK, WALK, HURT, KO (normal version only).
- Generous empty space between items, plain flat panel backgrounds.
Monster (균열 덩굴뱀, element FOREST, role 근접 졸개): a coiling vine snake with thorn fangs and leaf frills
```

### MON-F-2 · 가시멧돼지 (Brambleboar) — 숲 돌격대

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER RIFT MONSTER sheet, 1536x1024 landscape, same rendering style as the attached spirit reference sheets but clearly an ENEMY:
- Design language for all Rift monsters: the creature has been corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, slightly menacing eyes (red-violet glow), but still the same cute SD proportions as the spirits. Never a copy of any spirit.
- LEFT header: role badge "RIFT FOREST 2", name "Brambleboar", epithet, element tag.
- CENTER: two full-body poses side by side: "NORMAL" and "ELITE" (elite = bigger horns/spikes, gold-violet trim, small crown of rift crystals).
- RIGHT TOP: two rounded-square face portraits (NORMAL / ELITE).
- RIGHT MIDDLE "IN-GAME HEX TILE (IDLE)": NORMAL and ELITE each standing on an isometric hex tile with a dark violet rim.
- BOTTOM: row of hex-tile sprites: IDLE, ATTACK, WALK, HURT, KO (normal version only).
- Generous empty space between items, plain flat panel backgrounds.
Monster (가시멧돼지, element FOREST, role 돌격대): a charging boar covered in bramble spikes, charges in straight lines
```

### MON-F-3 · 썩은 그루터기 (Rotstump) — 숲 방패

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER RIFT MONSTER sheet, 1536x1024 landscape, same rendering style as the attached spirit reference sheets but clearly an ENEMY:
- Design language for all Rift monsters: the creature has been corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, slightly menacing eyes (red-violet glow), but still the same cute SD proportions as the spirits. Never a copy of any spirit.
- LEFT header: role badge "RIFT FOREST 3", name "Rotstump", epithet, element tag.
- CENTER: two full-body poses side by side: "NORMAL" and "ELITE" (elite = bigger horns/spikes, gold-violet trim, small crown of rift crystals).
- RIGHT TOP: two rounded-square face portraits (NORMAL / ELITE).
- RIGHT MIDDLE "IN-GAME HEX TILE (IDLE)": NORMAL and ELITE each standing on an isometric hex tile with a dark violet rim.
- BOTTOM: row of hex-tile sprites: IDLE, ATTACK, WALK, HURT, KO (normal version only).
- Generous empty space between items, plain flat panel backgrounds.
Monster (썩은 그루터기, element FOREST, role 방패): a walking rotten tree stump with a bark face, very sturdy
```

### MON-F-4 · 포자두꺼비 (Sporetoad) — 숲 사수

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER RIFT MONSTER sheet, 1536x1024 landscape, same rendering style as the attached spirit reference sheets but clearly an ENEMY:
- Design language for all Rift monsters: the creature has been corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, slightly menacing eyes (red-violet glow), but still the same cute SD proportions as the spirits. Never a copy of any spirit.
- LEFT header: role badge "RIFT FOREST 4", name "Sporetoad", epithet, element tag.
- CENTER: two full-body poses side by side: "NORMAL" and "ELITE" (elite = bigger horns/spikes, gold-violet trim, small crown of rift crystals).
- RIGHT TOP: two rounded-square face portraits (NORMAL / ELITE).
- RIGHT MIDDLE "IN-GAME HEX TILE (IDLE)": NORMAL and ELITE each standing on an isometric hex tile with a dark violet rim.
- BOTTOM: row of hex-tile sprites: IDLE, ATTACK, WALK, HURT, KO (normal version only).
- Generous empty space between items, plain flat panel backgrounds.
Monster (포자두꺼비, element FOREST, role 사수): a fat toad that spits glowing spore balls from a distance
```

### MON-F-5 · 이끼달팽이 (Mossnail) — 숲 치유체

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER RIFT MONSTER sheet, 1536x1024 landscape, same rendering style as the attached spirit reference sheets but clearly an ENEMY:
- Design language for all Rift monsters: the creature has been corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, slightly menacing eyes (red-violet glow), but still the same cute SD proportions as the spirits. Never a copy of any spirit.
- LEFT header: role badge "RIFT FOREST 5", name "Mossnail", epithet, element tag.
- CENTER: two full-body poses side by side: "NORMAL" and "ELITE" (elite = bigger horns/spikes, gold-violet trim, small crown of rift crystals).
- RIGHT TOP: two rounded-square face portraits (NORMAL / ELITE).
- RIGHT MIDDLE "IN-GAME HEX TILE (IDLE)": NORMAL and ELITE each standing on an isometric hex tile with a dark violet rim.
- BOTTOM: row of hex-tile sprites: IDLE, ATTACK, WALK, HURT, KO (normal version only).
- Generous empty space between items, plain flat panel backgrounds.
Monster (이끼달팽이, element FOREST, role 치유체): a big snail with a mossy shell that oozes healing sap onto allies
```

### MON-F-6 · 저주버섯 (Hexshroom) — 숲 저주체

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER RIFT MONSTER sheet, 1536x1024 landscape, same rendering style as the attached spirit reference sheets but clearly an ENEMY:
- Design language for all Rift monsters: the creature has been corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, slightly menacing eyes (red-violet glow), but still the same cute SD proportions as the spirits. Never a copy of any spirit.
- LEFT header: role badge "RIFT FOREST 6", name "Hexshroom", epithet, element tag.
- CENTER: two full-body poses side by side: "NORMAL" and "ELITE" (elite = bigger horns/spikes, gold-violet trim, small crown of rift crystals).
- RIGHT TOP: two rounded-square face portraits (NORMAL / ELITE).
- RIGHT MIDDLE "IN-GAME HEX TILE (IDLE)": NORMAL and ELITE each standing on an isometric hex tile with a dark violet rim.
- BOTTOM: row of hex-tile sprites: IDLE, ATTACK, WALK, HURT, KO (normal version only).
- Generous empty space between items, plain flat panel backgrounds.
Monster (저주버섯, element FOREST, role 저주체): a hopping mushroom whose purple spores weaken enemies
```

### MON-W-1 · 균열 피라냐 (Riftpiranha) — 물 근접 졸개

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER RIFT MONSTER sheet, 1536x1024 landscape, same rendering style as the attached spirit reference sheets but clearly an ENEMY:
- Design language for all Rift monsters: the creature has been corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, slightly menacing eyes (red-violet glow), but still the same cute SD proportions as the spirits. Never a copy of any spirit.
- LEFT header: role badge "RIFT WATER 1", name "Riftpiranha", epithet, element tag.
- CENTER: two full-body poses side by side: "NORMAL" and "ELITE" (elite = bigger horns/spikes, gold-violet trim, small crown of rift crystals).
- RIGHT TOP: two rounded-square face portraits (NORMAL / ELITE).
- RIGHT MIDDLE "IN-GAME HEX TILE (IDLE)": NORMAL and ELITE each standing on an isometric hex tile with a dark violet rim.
- BOTTOM: row of hex-tile sprites: IDLE, ATTACK, WALK, HURT, KO (normal version only).
- Generous empty space between items, plain flat panel backgrounds.
Monster (균열 피라냐, element WATER, role 근접 졸개): a piranha with stubby legs that walks on land, big teeth
```

### MON-W-2 · 작살상어 (Harpoon Shark) — 물 돌격대

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER RIFT MONSTER sheet, 1536x1024 landscape, same rendering style as the attached spirit reference sheets but clearly an ENEMY:
- Design language for all Rift monsters: the creature has been corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, slightly menacing eyes (red-violet glow), but still the same cute SD proportions as the spirits. Never a copy of any spirit.
- LEFT header: role badge "RIFT WATER 2", name "Harpoon Shark", epithet, element tag.
- CENTER: two full-body poses side by side: "NORMAL" and "ELITE" (elite = bigger horns/spikes, gold-violet trim, small crown of rift crystals).
- RIGHT TOP: two rounded-square face portraits (NORMAL / ELITE).
- RIGHT MIDDLE "IN-GAME HEX TILE (IDLE)": NORMAL and ELITE each standing on an isometric hex tile with a dark violet rim.
- BOTTOM: row of hex-tile sprites: IDLE, ATTACK, WALK, HURT, KO (normal version only).
- Generous empty space between items, plain flat panel backgrounds.
Monster (작살상어, element WATER, role 돌격대): a small shark with a harpoon-shaped snout that dashes forward
```

### MON-W-3 · 따개비거북 (Barnacle Turtle) — 물 방패

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER RIFT MONSTER sheet, 1536x1024 landscape, same rendering style as the attached spirit reference sheets but clearly an ENEMY:
- Design language for all Rift monsters: the creature has been corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, slightly menacing eyes (red-violet glow), but still the same cute SD proportions as the spirits. Never a copy of any spirit.
- LEFT header: role badge "RIFT WATER 3", name "Barnacle Turtle", epithet, element tag.
- CENTER: two full-body poses side by side: "NORMAL" and "ELITE" (elite = bigger horns/spikes, gold-violet trim, small crown of rift crystals).
- RIGHT TOP: two rounded-square face portraits (NORMAL / ELITE).
- RIGHT MIDDLE "IN-GAME HEX TILE (IDLE)": NORMAL and ELITE each standing on an isometric hex tile with a dark violet rim.
- BOTTOM: row of hex-tile sprites: IDLE, ATTACK, WALK, HURT, KO (normal version only).
- Generous empty space between items, plain flat panel backgrounds.
Monster (따개비거북, element WATER, role 방패): a turtle crusted with barnacles, a slow wall
```

### MON-W-4 · 먹물문어 (Inkpus) — 물 사수

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER RIFT MONSTER sheet, 1536x1024 landscape, same rendering style as the attached spirit reference sheets but clearly an ENEMY:
- Design language for all Rift monsters: the creature has been corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, slightly menacing eyes (red-violet glow), but still the same cute SD proportions as the spirits. Never a copy of any spirit.
- LEFT header: role badge "RIFT WATER 4", name "Inkpus", epithet, element tag.
- CENTER: two full-body poses side by side: "NORMAL" and "ELITE" (elite = bigger horns/spikes, gold-violet trim, small crown of rift crystals).
- RIGHT TOP: two rounded-square face portraits (NORMAL / ELITE).
- RIGHT MIDDLE "IN-GAME HEX TILE (IDLE)": NORMAL and ELITE each standing on an isometric hex tile with a dark violet rim.
- BOTTOM: row of hex-tile sprites: IDLE, ATTACK, WALK, HURT, KO (normal version only).
- Generous empty space between items, plain flat panel backgrounds.
Monster (먹물문어, element WATER, role 사수): a small octopus that shoots ink blobs from range
```

### MON-W-5 · 물방울해파리 (Dew Jelly) — 물 치유체

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER RIFT MONSTER sheet, 1536x1024 landscape, same rendering style as the attached spirit reference sheets but clearly an ENEMY:
- Design language for all Rift monsters: the creature has been corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, slightly menacing eyes (red-violet glow), but still the same cute SD proportions as the spirits. Never a copy of any spirit.
- LEFT header: role badge "RIFT WATER 5", name "Dew Jelly", epithet, element tag.
- CENTER: two full-body poses side by side: "NORMAL" and "ELITE" (elite = bigger horns/spikes, gold-violet trim, small crown of rift crystals).
- RIGHT TOP: two rounded-square face portraits (NORMAL / ELITE).
- RIGHT MIDDLE "IN-GAME HEX TILE (IDLE)": NORMAL and ELITE each standing on an isometric hex tile with a dark violet rim.
- BOTTOM: row of hex-tile sprites: IDLE, ATTACK, WALK, HURT, KO (normal version only).
- Generous empty space between items, plain flat panel backgrounds.
Monster (물방울해파리, element WATER, role 치유체): a floating jellyfish whose glowing drops heal monsters
```

### MON-W-6 · 소용돌이장어 (Whirl Eel) — 물 저주체

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER RIFT MONSTER sheet, 1536x1024 landscape, same rendering style as the attached spirit reference sheets but clearly an ENEMY:
- Design language for all Rift monsters: the creature has been corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, slightly menacing eyes (red-violet glow), but still the same cute SD proportions as the spirits. Never a copy of any spirit.
- LEFT header: role badge "RIFT WATER 6", name "Whirl Eel", epithet, element tag.
- CENTER: two full-body poses side by side: "NORMAL" and "ELITE" (elite = bigger horns/spikes, gold-violet trim, small crown of rift crystals).
- RIGHT TOP: two rounded-square face portraits (NORMAL / ELITE).
- RIGHT MIDDLE "IN-GAME HEX TILE (IDLE)": NORMAL and ELITE each standing on an isometric hex tile with a dark violet rim.
- BOTTOM: row of hex-tile sprites: IDLE, ATTACK, WALK, HURT, KO (normal version only).
- Generous empty space between items, plain flat panel backgrounds.
Monster (소용돌이장어, element WATER, role 저주체): an eel that spins small whirlpools to weaken defense
```

### MON-Fi-1 · 불똥도마뱀 (Emberskink) — 불 근접 졸개

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER RIFT MONSTER sheet, 1536x1024 landscape, same rendering style as the attached spirit reference sheets but clearly an ENEMY:
- Design language for all Rift monsters: the creature has been corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, slightly menacing eyes (red-violet glow), but still the same cute SD proportions as the spirits. Never a copy of any spirit.
- LEFT header: role badge "RIFT FIRE 1", name "Emberskink", epithet, element tag.
- CENTER: two full-body poses side by side: "NORMAL" and "ELITE" (elite = bigger horns/spikes, gold-violet trim, small crown of rift crystals).
- RIGHT TOP: two rounded-square face portraits (NORMAL / ELITE).
- RIGHT MIDDLE "IN-GAME HEX TILE (IDLE)": NORMAL and ELITE each standing on an isometric hex tile with a dark violet rim.
- BOTTOM: row of hex-tile sprites: IDLE, ATTACK, WALK, HURT, KO (normal version only).
- Generous empty space between items, plain flat panel backgrounds.
Monster (불똥도마뱀, element FIRE, role 근접 졸개): a quick little lizard with a spark tail
```

### MON-Fi-2 · 화염코뿔소 (Blaze Rhino) — 불 돌격대

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER RIFT MONSTER sheet, 1536x1024 landscape, same rendering style as the attached spirit reference sheets but clearly an ENEMY:
- Design language for all Rift monsters: the creature has been corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, slightly menacing eyes (red-violet glow), but still the same cute SD proportions as the spirits. Never a copy of any spirit.
- LEFT header: role badge "RIFT FIRE 2", name "Blaze Rhino", epithet, element tag.
- CENTER: two full-body poses side by side: "NORMAL" and "ELITE" (elite = bigger horns/spikes, gold-violet trim, small crown of rift crystals).
- RIGHT TOP: two rounded-square face portraits (NORMAL / ELITE).
- RIGHT MIDDLE "IN-GAME HEX TILE (IDLE)": NORMAL and ELITE each standing on an isometric hex tile with a dark violet rim.
- BOTTOM: row of hex-tile sprites: IDLE, ATTACK, WALK, HURT, KO (normal version only).
- Generous empty space between items, plain flat panel backgrounds.
Monster (화염코뿔소, element FIRE, role 돌격대): a stocky rhino with a flaming horn that charges
```

### MON-Fi-3 · 용암덩이 (Magma Chunk) — 불 방패

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER RIFT MONSTER sheet, 1536x1024 landscape, same rendering style as the attached spirit reference sheets but clearly an ENEMY:
- Design language for all Rift monsters: the creature has been corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, slightly menacing eyes (red-violet glow), but still the same cute SD proportions as the spirits. Never a copy of any spirit.
- LEFT header: role badge "RIFT FIRE 3", name "Magma Chunk", epithet, element tag.
- CENTER: two full-body poses side by side: "NORMAL" and "ELITE" (elite = bigger horns/spikes, gold-violet trim, small crown of rift crystals).
- RIGHT TOP: two rounded-square face portraits (NORMAL / ELITE).
- RIGHT MIDDLE "IN-GAME HEX TILE (IDLE)": NORMAL and ELITE each standing on an isometric hex tile with a dark violet rim.
- BOTTOM: row of hex-tile sprites: IDLE, ATTACK, WALK, HURT, KO (normal version only).
- Generous empty space between items, plain flat panel backgrounds.
Monster (용암덩이, element FIRE, role 방패): a living lump of cooled lava with a molten core, very tough
```

### MON-Fi-4 · 화산박쥐 (Lava Bat) — 불 사수

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER RIFT MONSTER sheet, 1536x1024 landscape, same rendering style as the attached spirit reference sheets but clearly an ENEMY:
- Design language for all Rift monsters: the creature has been corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, slightly menacing eyes (red-violet glow), but still the same cute SD proportions as the spirits. Never a copy of any spirit.
- LEFT header: role badge "RIFT FIRE 4", name "Lava Bat", epithet, element tag.
- CENTER: two full-body poses side by side: "NORMAL" and "ELITE" (elite = bigger horns/spikes, gold-violet trim, small crown of rift crystals).
- RIGHT TOP: two rounded-square face portraits (NORMAL / ELITE).
- RIGHT MIDDLE "IN-GAME HEX TILE (IDLE)": NORMAL and ELITE each standing on an isometric hex tile with a dark violet rim.
- BOTTOM: row of hex-tile sprites: IDLE, ATTACK, WALK, HURT, KO (normal version only).
- Generous empty space between items, plain flat panel backgrounds.
Monster (화산박쥐, element FIRE, role 사수): a bat with magma-veined wings that drops fireballs
```

### MON-Fi-5 · 재부엉이 (Ash Owl) — 불 치유체

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER RIFT MONSTER sheet, 1536x1024 landscape, same rendering style as the attached spirit reference sheets but clearly an ENEMY:
- Design language for all Rift monsters: the creature has been corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, slightly menacing eyes (red-violet glow), but still the same cute SD proportions as the spirits. Never a copy of any spirit.
- LEFT header: role badge "RIFT FIRE 5", name "Ash Owl", epithet, element tag.
- CENTER: two full-body poses side by side: "NORMAL" and "ELITE" (elite = bigger horns/spikes, gold-violet trim, small crown of rift crystals).
- RIGHT TOP: two rounded-square face portraits (NORMAL / ELITE).
- RIGHT MIDDLE "IN-GAME HEX TILE (IDLE)": NORMAL and ELITE each standing on an isometric hex tile with a dark violet rim.
- BOTTOM: row of hex-tile sprites: IDLE, ATTACK, WALK, HURT, KO (normal version only).
- Generous empty space between items, plain flat panel backgrounds.
Monster (재부엉이, element FIRE, role 치유체): a sooty owl that fans warm embers to mend monsters
```

### MON-Fi-6 · 그을음 정령 (Soot Wisp) — 불 저주체

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER RIFT MONSTER sheet, 1536x1024 landscape, same rendering style as the attached spirit reference sheets but clearly an ENEMY:
- Design language for all Rift monsters: the creature has been corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, slightly menacing eyes (red-violet glow), but still the same cute SD proportions as the spirits. Never a copy of any spirit.
- LEFT header: role badge "RIFT FIRE 6", name "Soot Wisp", epithet, element tag.
- CENTER: two full-body poses side by side: "NORMAL" and "ELITE" (elite = bigger horns/spikes, gold-violet trim, small crown of rift crystals).
- RIGHT TOP: two rounded-square face portraits (NORMAL / ELITE).
- RIGHT MIDDLE "IN-GAME HEX TILE (IDLE)": NORMAL and ELITE each standing on an isometric hex tile with a dark violet rim.
- BOTTOM: row of hex-tile sprites: IDLE, ATTACK, WALK, HURT, KO (normal version only).
- Generous empty space between items, plain flat panel backgrounds.
Monster (그을음 정령, element FIRE, role 저주체): a smoky blob with ember eyes whose smoke lowers enemy defense
```

### MON-Wi-1 · 칼바람족제비 (Gale Weasel) — 바람 근접 졸개

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER RIFT MONSTER sheet, 1536x1024 landscape, same rendering style as the attached spirit reference sheets but clearly an ENEMY:
- Design language for all Rift monsters: the creature has been corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, slightly menacing eyes (red-violet glow), but still the same cute SD proportions as the spirits. Never a copy of any spirit.
- LEFT header: role badge "RIFT WIND 1", name "Gale Weasel", epithet, element tag.
- CENTER: two full-body poses side by side: "NORMAL" and "ELITE" (elite = bigger horns/spikes, gold-violet trim, small crown of rift crystals).
- RIGHT TOP: two rounded-square face portraits (NORMAL / ELITE).
- RIGHT MIDDLE "IN-GAME HEX TILE (IDLE)": NORMAL and ELITE each standing on an isometric hex tile with a dark violet rim.
- BOTTOM: row of hex-tile sprites: IDLE, ATTACK, WALK, HURT, KO (normal version only).
- Generous empty space between items, plain flat panel backgrounds.
Monster (칼바람족제비, element WIND, role 근접 졸개): a ferret with sickle-shaped tail blades
```

### MON-Wi-2 · 번개매 (Bolt Falcon) — 바람 돌격대

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER RIFT MONSTER sheet, 1536x1024 landscape, same rendering style as the attached spirit reference sheets but clearly an ENEMY:
- Design language for all Rift monsters: the creature has been corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, slightly menacing eyes (red-violet glow), but still the same cute SD proportions as the spirits. Never a copy of any spirit.
- LEFT header: role badge "RIFT WIND 2", name "Bolt Falcon", epithet, element tag.
- CENTER: two full-body poses side by side: "NORMAL" and "ELITE" (elite = bigger horns/spikes, gold-violet trim, small crown of rift crystals).
- RIGHT TOP: two rounded-square face portraits (NORMAL / ELITE).
- RIGHT MIDDLE "IN-GAME HEX TILE (IDLE)": NORMAL and ELITE each standing on an isometric hex tile with a dark violet rim.
- BOTTOM: row of hex-tile sprites: IDLE, ATTACK, WALK, HURT, KO (normal version only).
- Generous empty space between items, plain flat panel backgrounds.
Monster (번개매, element WIND, role 돌격대): a falcon wrapped in tiny lightning that dives fast
```

### MON-Wi-3 · 구름거북 (Cloud Turtle) — 바람 방패

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER RIFT MONSTER sheet, 1536x1024 landscape, same rendering style as the attached spirit reference sheets but clearly an ENEMY:
- Design language for all Rift monsters: the creature has been corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, slightly menacing eyes (red-violet glow), but still the same cute SD proportions as the spirits. Never a copy of any spirit.
- LEFT header: role badge "RIFT WIND 3", name "Cloud Turtle", epithet, element tag.
- CENTER: two full-body poses side by side: "NORMAL" and "ELITE" (elite = bigger horns/spikes, gold-violet trim, small crown of rift crystals).
- RIGHT TOP: two rounded-square face portraits (NORMAL / ELITE).
- RIGHT MIDDLE "IN-GAME HEX TILE (IDLE)": NORMAL and ELITE each standing on an isometric hex tile with a dark violet rim.
- BOTTOM: row of hex-tile sprites: IDLE, ATTACK, WALK, HURT, KO (normal version only).
- Generous empty space between items, plain flat panel backgrounds.
Monster (구름거북, element WIND, role 방패): a turtle floating on a thick cloud, a sturdy blocker
```

### MON-Wi-4 · 돌풍벌 (Gust Wasp) — 바람 사수

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER RIFT MONSTER sheet, 1536x1024 landscape, same rendering style as the attached spirit reference sheets but clearly an ENEMY:
- Design language for all Rift monsters: the creature has been corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, slightly menacing eyes (red-violet glow), but still the same cute SD proportions as the spirits. Never a copy of any spirit.
- LEFT header: role badge "RIFT WIND 4", name "Gust Wasp", epithet, element tag.
- CENTER: two full-body poses side by side: "NORMAL" and "ELITE" (elite = bigger horns/spikes, gold-violet trim, small crown of rift crystals).
- RIGHT TOP: two rounded-square face portraits (NORMAL / ELITE).
- RIGHT MIDDLE "IN-GAME HEX TILE (IDLE)": NORMAL and ELITE each standing on an isometric hex tile with a dark violet rim.
- BOTTOM: row of hex-tile sprites: IDLE, ATTACK, WALK, HURT, KO (normal version only).
- Generous empty space between items, plain flat panel backgrounds.
Monster (돌풍벌, element WIND, role 사수): a wasp that shoots compressed air stingers from range
```

### MON-Wi-5 · 깃털박새 (Plume Tit) — 바람 치유체

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER RIFT MONSTER sheet, 1536x1024 landscape, same rendering style as the attached spirit reference sheets but clearly an ENEMY:
- Design language for all Rift monsters: the creature has been corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, slightly menacing eyes (red-violet glow), but still the same cute SD proportions as the spirits. Never a copy of any spirit.
- LEFT header: role badge "RIFT WIND 5", name "Plume Tit", epithet, element tag.
- CENTER: two full-body poses side by side: "NORMAL" and "ELITE" (elite = bigger horns/spikes, gold-violet trim, small crown of rift crystals).
- RIGHT TOP: two rounded-square face portraits (NORMAL / ELITE).
- RIGHT MIDDLE "IN-GAME HEX TILE (IDLE)": NORMAL and ELITE each standing on an isometric hex tile with a dark violet rim.
- BOTTOM: row of hex-tile sprites: IDLE, ATTACK, WALK, HURT, KO (normal version only).
- Generous empty space between items, plain flat panel backgrounds.
Monster (깃털박새, element WIND, role 치유체): a fluffy bird whose feather down heals monsters
```

### MON-Wi-6 · 회오리여우 (Whirl Fox) — 바람 저주체

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER RIFT MONSTER sheet, 1536x1024 landscape, same rendering style as the attached spirit reference sheets but clearly an ENEMY:
- Design language for all Rift monsters: the creature has been corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, slightly menacing eyes (red-violet glow), but still the same cute SD proportions as the spirits. Never a copy of any spirit.
- LEFT header: role badge "RIFT WIND 6", name "Whirl Fox", epithet, element tag.
- CENTER: two full-body poses side by side: "NORMAL" and "ELITE" (elite = bigger horns/spikes, gold-violet trim, small crown of rift crystals).
- RIGHT TOP: two rounded-square face portraits (NORMAL / ELITE).
- RIGHT MIDDLE "IN-GAME HEX TILE (IDLE)": NORMAL and ELITE each standing on an isometric hex tile with a dark violet rim.
- BOTTOM: row of hex-tile sprites: IDLE, ATTACK, WALK, HURT, KO (normal version only).
- Generous empty space between items, plain flat panel backgrounds.
Monster (회오리여우, element WIND, role 저주체): a fox with a tornado tail that confuses and weakens
```

### MON-E-1 · 자갈딱정벌레 (Gravel Beetle) — 대지 근접 졸개

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER RIFT MONSTER sheet, 1536x1024 landscape, same rendering style as the attached spirit reference sheets but clearly an ENEMY:
- Design language for all Rift monsters: the creature has been corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, slightly menacing eyes (red-violet glow), but still the same cute SD proportions as the spirits. Never a copy of any spirit.
- LEFT header: role badge "RIFT EARTH 1", name "Gravel Beetle", epithet, element tag.
- CENTER: two full-body poses side by side: "NORMAL" and "ELITE" (elite = bigger horns/spikes, gold-violet trim, small crown of rift crystals).
- RIGHT TOP: two rounded-square face portraits (NORMAL / ELITE).
- RIGHT MIDDLE "IN-GAME HEX TILE (IDLE)": NORMAL and ELITE each standing on an isometric hex tile with a dark violet rim.
- BOTTOM: row of hex-tile sprites: IDLE, ATTACK, WALK, HURT, KO (normal version only).
- Generous empty space between items, plain flat panel backgrounds.
Monster (자갈딱정벌레, element EARTH, role 근접 졸개): a small beetle with a pebble shell
```

### MON-E-2 · 암석들소 (Boulder Bison) — 대지 돌격대

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER RIFT MONSTER sheet, 1536x1024 landscape, same rendering style as the attached spirit reference sheets but clearly an ENEMY:
- Design language for all Rift monsters: the creature has been corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, slightly menacing eyes (red-violet glow), but still the same cute SD proportions as the spirits. Never a copy of any spirit.
- LEFT header: role badge "RIFT EARTH 2", name "Boulder Bison", epithet, element tag.
- CENTER: two full-body poses side by side: "NORMAL" and "ELITE" (elite = bigger horns/spikes, gold-violet trim, small crown of rift crystals).
- RIGHT TOP: two rounded-square face portraits (NORMAL / ELITE).
- RIGHT MIDDLE "IN-GAME HEX TILE (IDLE)": NORMAL and ELITE each standing on an isometric hex tile with a dark violet rim.
- BOTTOM: row of hex-tile sprites: IDLE, ATTACK, WALK, HURT, KO (normal version only).
- Generous empty space between items, plain flat panel backgrounds.
Monster (암석들소, element EARTH, role 돌격대): a bison with rock horns and a stone hump that charges
```

### MON-E-3 · 바위게 (Rock Crab) — 대지 방패

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER RIFT MONSTER sheet, 1536x1024 landscape, same rendering style as the attached spirit reference sheets but clearly an ENEMY:
- Design language for all Rift monsters: the creature has been corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, slightly menacing eyes (red-violet glow), but still the same cute SD proportions as the spirits. Never a copy of any spirit.
- LEFT header: role badge "RIFT EARTH 3", name "Rock Crab", epithet, element tag.
- CENTER: two full-body poses side by side: "NORMAL" and "ELITE" (elite = bigger horns/spikes, gold-violet trim, small crown of rift crystals).
- RIGHT TOP: two rounded-square face portraits (NORMAL / ELITE).
- RIGHT MIDDLE "IN-GAME HEX TILE (IDLE)": NORMAL and ELITE each standing on an isometric hex tile with a dark violet rim.
- BOTTOM: row of hex-tile sprites: IDLE, ATTACK, WALK, HURT, KO (normal version only).
- Generous empty space between items, plain flat panel backgrounds.
Monster (바위게, element EARTH, role 방패): a crab with a boulder shell, a solid wall
```

### MON-E-4 · 모래거미 (Sand Spider) — 대지 사수

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER RIFT MONSTER sheet, 1536x1024 landscape, same rendering style as the attached spirit reference sheets but clearly an ENEMY:
- Design language for all Rift monsters: the creature has been corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, slightly menacing eyes (red-violet glow), but still the same cute SD proportions as the spirits. Never a copy of any spirit.
- LEFT header: role badge "RIFT EARTH 4", name "Sand Spider", epithet, element tag.
- CENTER: two full-body poses side by side: "NORMAL" and "ELITE" (elite = bigger horns/spikes, gold-violet trim, small crown of rift crystals).
- RIGHT TOP: two rounded-square face portraits (NORMAL / ELITE).
- RIGHT MIDDLE "IN-GAME HEX TILE (IDLE)": NORMAL and ELITE each standing on an isometric hex tile with a dark violet rim.
- BOTTOM: row of hex-tile sprites: IDLE, ATTACK, WALK, HURT, KO (normal version only).
- Generous empty space between items, plain flat panel backgrounds.
Monster (모래거미, element EARTH, role 사수): a spider that flings sand balls and webs from range
```

### MON-E-5 · 진흙도롱뇽 (Mud Newt) — 대지 치유체

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER RIFT MONSTER sheet, 1536x1024 landscape, same rendering style as the attached spirit reference sheets but clearly an ENEMY:
- Design language for all Rift monsters: the creature has been corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, slightly menacing eyes (red-violet glow), but still the same cute SD proportions as the spirits. Never a copy of any spirit.
- LEFT header: role badge "RIFT EARTH 5", name "Mud Newt", epithet, element tag.
- CENTER: two full-body poses side by side: "NORMAL" and "ELITE" (elite = bigger horns/spikes, gold-violet trim, small crown of rift crystals).
- RIGHT TOP: two rounded-square face portraits (NORMAL / ELITE).
- RIGHT MIDDLE "IN-GAME HEX TILE (IDLE)": NORMAL and ELITE each standing on an isometric hex tile with a dark violet rim.
- BOTTOM: row of hex-tile sprites: IDLE, ATTACK, WALK, HURT, KO (normal version only).
- Generous empty space between items, plain flat panel backgrounds.
Monster (진흙도롱뇽, element EARTH, role 치유체): a newt that coats monsters in healing mud
```

### MON-E-6 · 균열 수정벌레 (Shard Mite) — 대지 저주체

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER RIFT MONSTER sheet, 1536x1024 landscape, same rendering style as the attached spirit reference sheets but clearly an ENEMY:
- Design language for all Rift monsters: the creature has been corrupted by hex-shaped rifts — glowing violet #8A5CFF cracks on its body, one embedded hexagonal rift crystal, slightly menacing eyes (red-violet glow), but still the same cute SD proportions as the spirits. Never a copy of any spirit.
- LEFT header: role badge "RIFT EARTH 6", name "Shard Mite", epithet, element tag.
- CENTER: two full-body poses side by side: "NORMAL" and "ELITE" (elite = bigger horns/spikes, gold-violet trim, small crown of rift crystals).
- RIGHT TOP: two rounded-square face portraits (NORMAL / ELITE).
- RIGHT MIDDLE "IN-GAME HEX TILE (IDLE)": NORMAL and ELITE each standing on an isometric hex tile with a dark violet rim.
- BOTTOM: row of hex-tile sprites: IDLE, ATTACK, WALK, HURT, KO (normal version only).
- Generous empty space between items, plain flat panel backgrounds.
Monster (균열 수정벌레, element EARTH, role 저주체): a mite with violet crystal shards whose hum weakens enemies
```

## 중간보스 10 · 보스 10

5판마다 중간보스(대장), 10판마다 장 보스, 100판은 최종 보스(2단계 모습 포함). 게임에서는 한 칸을 차지하지만 1.5배 크게 그립니다.

### MID-5 · 가시멧돼지 대장 (Thornback Alpha) — 5판 중간보스 · 숲

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER ELITE (MID-BOSS) sheet, 1536x1024 landscape, same rendering style as the attached reference sheets, epic and readable:
- LEFT: header with a crown/skull boss badge "ELITE · STAGE 5", name "Thornback Alpha", epithet, element tags.
- CENTER: one large full-body key art of the boss in a dynamic pose (about 45% of the sheet width).
- RIGHT TOP: two rounded-square face portraits (calm / enraged).
- RIGHT MIDDLE "IN-GAME HEX TILE": the boss standing on ONE isometric hex tile but drawn 1.5x larger than a normal unit, with a glowing gold-violet boss rim on the tile.
- BOTTOM: hex-tile sprites: IDLE, ATTACK, SKILL, HURT, KO.
- Same rift corruption language as the Rift monsters (violet hex cracks, rift crystals) plus a boss aura.
- Generous empty space between items, plain flat panel backgrounds.
Boss (가시멧돼지 대장, stage 5, element 숲): a huge bramble boar alpha with a bark-and-thorn mane
```

### MID-15 · 따개비 대왕거북 (Barnacle King) — 15판 중간보스 · 물

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER ELITE (MID-BOSS) sheet, 1536x1024 landscape, same rendering style as the attached reference sheets, epic and readable:
- LEFT: header with a crown/skull boss badge "ELITE · STAGE 15", name "Barnacle King", epithet, element tags.
- CENTER: one large full-body key art of the boss in a dynamic pose (about 45% of the sheet width).
- RIGHT TOP: two rounded-square face portraits (calm / enraged).
- RIGHT MIDDLE "IN-GAME HEX TILE": the boss standing on ONE isometric hex tile but drawn 1.5x larger than a normal unit, with a glowing gold-violet boss rim on the tile.
- BOTTOM: hex-tile sprites: IDLE, ATTACK, SKILL, HURT, KO.
- Same rift corruption language as the Rift monsters (violet hex cracks, rift crystals) plus a boss aura.
- Generous empty space between items, plain flat panel backgrounds.
Boss (따개비 대왕거북, stage 15, element 물): an enormous barnacle turtle with a sunken-ship-wood shell
```

### MID-25 · 화염코뿔소 대장 (Inferno Rhino) — 25판 중간보스 · 불

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER ELITE (MID-BOSS) sheet, 1536x1024 landscape, same rendering style as the attached reference sheets, epic and readable:
- LEFT: header with a crown/skull boss badge "ELITE · STAGE 25", name "Inferno Rhino", epithet, element tags.
- CENTER: one large full-body key art of the boss in a dynamic pose (about 45% of the sheet width).
- RIGHT TOP: two rounded-square face portraits (calm / enraged).
- RIGHT MIDDLE "IN-GAME HEX TILE": the boss standing on ONE isometric hex tile but drawn 1.5x larger than a normal unit, with a glowing gold-violet boss rim on the tile.
- BOTTOM: hex-tile sprites: IDLE, ATTACK, SKILL, HURT, KO.
- Same rift corruption language as the Rift monsters (violet hex cracks, rift crystals) plus a boss aura.
- Generous empty space between items, plain flat panel backgrounds.
Boss (화염코뿔소 대장, stage 25, element 불): a giant rhino with a burning crown horn and magma armor
```

### MID-35 · 번개매 여왕 (Storm Falcon Queen) — 35판 중간보스 · 바람

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER ELITE (MID-BOSS) sheet, 1536x1024 landscape, same rendering style as the attached reference sheets, epic and readable:
- LEFT: header with a crown/skull boss badge "ELITE · STAGE 35", name "Storm Falcon Queen", epithet, element tags.
- CENTER: one large full-body key art of the boss in a dynamic pose (about 45% of the sheet width).
- RIGHT TOP: two rounded-square face portraits (calm / enraged).
- RIGHT MIDDLE "IN-GAME HEX TILE": the boss standing on ONE isometric hex tile but drawn 1.5x larger than a normal unit, with a glowing gold-violet boss rim on the tile.
- BOTTOM: hex-tile sprites: IDLE, ATTACK, SKILL, HURT, KO.
- Same rift corruption language as the Rift monsters (violet hex cracks, rift crystals) plus a boss aura.
- Generous empty space between items, plain flat panel backgrounds.
Boss (번개매 여왕, stage 35, element 바람): a great falcon with a crest of lightning feathers
```

### MID-45 · 암석들소 대장 (Granite Bison Chief) — 45판 중간보스 · 대지

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER ELITE (MID-BOSS) sheet, 1536x1024 landscape, same rendering style as the attached reference sheets, epic and readable:
- LEFT: header with a crown/skull boss badge "ELITE · STAGE 45", name "Granite Bison Chief", epithet, element tags.
- CENTER: one large full-body key art of the boss in a dynamic pose (about 45% of the sheet width).
- RIGHT TOP: two rounded-square face portraits (calm / enraged).
- RIGHT MIDDLE "IN-GAME HEX TILE": the boss standing on ONE isometric hex tile but drawn 1.5x larger than a normal unit, with a glowing gold-violet boss rim on the tile.
- BOTTOM: hex-tile sprites: IDLE, ATTACK, SKILL, HURT, KO.
- Same rift corruption language as the Rift monsters (violet hex cracks, rift crystals) plus a boss aura.
- Generous empty space between items, plain flat panel backgrounds.
Boss (암석들소 대장, stage 45, element 대지): a colossal bison with granite horns and crystal hump
```

### MID-55 · 독포자 두꺼비왕 (Spore Toad King) — 55판 중간보스 · 숲

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER ELITE (MID-BOSS) sheet, 1536x1024 landscape, same rendering style as the attached reference sheets, epic and readable:
- LEFT: header with a crown/skull boss badge "ELITE · STAGE 55", name "Spore Toad King", epithet, element tags.
- CENTER: one large full-body key art of the boss in a dynamic pose (about 45% of the sheet width).
- RIGHT TOP: two rounded-square face portraits (calm / enraged).
- RIGHT MIDDLE "IN-GAME HEX TILE": the boss standing on ONE isometric hex tile but drawn 1.5x larger than a normal unit, with a glowing gold-violet boss rim on the tile.
- BOTTOM: hex-tile sprites: IDLE, ATTACK, SKILL, HURT, KO.
- Same rift corruption language as the Rift monsters (violet hex cracks, rift crystals) plus a boss aura.
- Generous empty space between items, plain flat panel backgrounds.
Boss (독포자 두꺼비왕, stage 55, element 숲): a giant toad crowned with poisonous mushrooms
```

### MID-65 · 증기 장어 (Steam Eel) — 65판 중간보스 · 물·불

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER ELITE (MID-BOSS) sheet, 1536x1024 landscape, same rendering style as the attached reference sheets, epic and readable:
- LEFT: header with a crown/skull boss badge "ELITE · STAGE 65", name "Steam Eel", epithet, element tags.
- CENTER: one large full-body key art of the boss in a dynamic pose (about 45% of the sheet width).
- RIGHT TOP: two rounded-square face portraits (calm / enraged).
- RIGHT MIDDLE "IN-GAME HEX TILE": the boss standing on ONE isometric hex tile but drawn 1.5x larger than a normal unit, with a glowing gold-violet boss rim on the tile.
- BOTTOM: hex-tile sprites: IDLE, ATTACK, SKILL, HURT, KO.
- Same rift corruption language as the Rift monsters (violet hex cracks, rift crystals) plus a boss aura.
- Generous empty space between items, plain flat panel backgrounds.
Boss (증기 장어, stage 65, element 물·불): a huge eel half water half lava, breathing steam
```

### MID-75 · 모래폭풍 전갈 (Duststorm Scorpion) — 75판 중간보스 · 바람·대지

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER ELITE (MID-BOSS) sheet, 1536x1024 landscape, same rendering style as the attached reference sheets, epic and readable:
- LEFT: header with a crown/skull boss badge "ELITE · STAGE 75", name "Duststorm Scorpion", epithet, element tags.
- CENTER: one large full-body key art of the boss in a dynamic pose (about 45% of the sheet width).
- RIGHT TOP: two rounded-square face portraits (calm / enraged).
- RIGHT MIDDLE "IN-GAME HEX TILE": the boss standing on ONE isometric hex tile but drawn 1.5x larger than a normal unit, with a glowing gold-violet boss rim on the tile.
- BOTTOM: hex-tile sprites: IDLE, ATTACK, SKILL, HURT, KO.
- Same rift corruption language as the Rift monsters (violet hex cracks, rift crystals) plus a boss aura.
- Generous empty space between items, plain flat panel backgrounds.
Boss (모래폭풍 전갈, stage 75, element 바람·대지): a giant scorpion trailing a small sandstorm
```

### MID-85 · 균열 키메라 새끼 (Chimera Whelp) — 85판 중간보스 · 숲·물·불

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER ELITE (MID-BOSS) sheet, 1536x1024 landscape, same rendering style as the attached reference sheets, epic and readable:
- LEFT: header with a crown/skull boss badge "ELITE · STAGE 85", name "Chimera Whelp", epithet, element tags.
- CENTER: one large full-body key art of the boss in a dynamic pose (about 45% of the sheet width).
- RIGHT TOP: two rounded-square face portraits (calm / enraged).
- RIGHT MIDDLE "IN-GAME HEX TILE": the boss standing on ONE isometric hex tile but drawn 1.5x larger than a normal unit, with a glowing gold-violet boss rim on the tile.
- BOTTOM: hex-tile sprites: IDLE, ATTACK, SKILL, HURT, KO.
- Same rift corruption language as the Rift monsters (violet hex cracks, rift crystals) plus a boss aura.
- Generous empty space between items, plain flat panel backgrounds.
Boss (균열 키메라 새끼, stage 85, element 숲·물·불): a young chimera with leaf, water and fire features
```

### MID-95 · 균열 사냥개 (Rift Warhound) — 95판 중간보스 · 모든 속성

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER ELITE (MID-BOSS) sheet, 1536x1024 landscape, same rendering style as the attached reference sheets, epic and readable:
- LEFT: header with a crown/skull boss badge "ELITE · STAGE 95", name "Rift Warhound", epithet, element tags.
- CENTER: one large full-body key art of the boss in a dynamic pose (about 45% of the sheet width).
- RIGHT TOP: two rounded-square face portraits (calm / enraged).
- RIGHT MIDDLE "IN-GAME HEX TILE": the boss standing on ONE isometric hex tile but drawn 1.5x larger than a normal unit, with a glowing gold-violet boss rim on the tile.
- BOTTOM: hex-tile sprites: IDLE, ATTACK, SKILL, HURT, KO.
- Same rift corruption language as the Rift monsters (violet hex cracks, rift crystals) plus a boss aura.
- Generous empty space between items, plain flat panel backgrounds.
Boss (균열 사냥개, stage 95, element 모든 속성): a large armored hound made of rift crystal with five element gems
```

### BOSS-10 · 고목 수호수 (Rift Treant) — 10판 장 보스 · 숲

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER CHAPTER BOSS sheet, 1536x1024 landscape, same rendering style as the attached reference sheets, epic and readable:
- LEFT: header with a crown/skull boss badge "BOSS · STAGE 10", name "Rift Treant", epithet, element tags.
- CENTER: one large full-body key art of the boss in a dynamic pose (about 45% of the sheet width).
- RIGHT TOP: two rounded-square face portraits (calm / enraged).
- RIGHT MIDDLE "IN-GAME HEX TILE": the boss standing on ONE isometric hex tile but drawn 1.5x larger than a normal unit, with a glowing gold-violet boss rim on the tile.
- BOTTOM: hex-tile sprites: IDLE, ATTACK, SKILL, HURT, KO.
- Same rift corruption language as the Rift monsters (violet hex cracks, rift crystals) plus a boss aura.
- Generous empty space between items, plain flat panel backgrounds.
Boss (고목 수호수, stage 10, element 숲): a colossal corrupted tree beast with root claws and a hollow glowing face
```

### BOSS-20 · 심해 레비아탄 (Abyss Leviathan) — 20판 장 보스 · 물

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER CHAPTER BOSS sheet, 1536x1024 landscape, same rendering style as the attached reference sheets, epic and readable:
- LEFT: header with a crown/skull boss badge "BOSS · STAGE 20", name "Abyss Leviathan", epithet, element tags.
- CENTER: one large full-body key art of the boss in a dynamic pose (about 45% of the sheet width).
- RIGHT TOP: two rounded-square face portraits (calm / enraged).
- RIGHT MIDDLE "IN-GAME HEX TILE": the boss standing on ONE isometric hex tile but drawn 1.5x larger than a normal unit, with a glowing gold-violet boss rim on the tile.
- BOTTOM: hex-tile sprites: IDLE, ATTACK, SKILL, HURT, KO.
- Same rift corruption language as the Rift monsters (violet hex cracks, rift crystals) plus a boss aura.
- Generous empty space between items, plain flat panel backgrounds.
Boss (심해 레비아탄, stage 20, element 물): a sea serpent rising from a whirlpool, pearl horns, rift cracks along its fins
```

### BOSS-30 · 화산 와이번 (Volcano Wyvern) — 30판 장 보스 · 불

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER CHAPTER BOSS sheet, 1536x1024 landscape, same rendering style as the attached reference sheets, epic and readable:
- LEFT: header with a crown/skull boss badge "BOSS · STAGE 30", name "Volcano Wyvern", epithet, element tags.
- CENTER: one large full-body key art of the boss in a dynamic pose (about 45% of the sheet width).
- RIGHT TOP: two rounded-square face portraits (calm / enraged).
- RIGHT MIDDLE "IN-GAME HEX TILE": the boss standing on ONE isometric hex tile but drawn 1.5x larger than a normal unit, with a glowing gold-violet boss rim on the tile.
- BOTTOM: hex-tile sprites: IDLE, ATTACK, SKILL, HURT, KO.
- Same rift corruption language as the Rift monsters (violet hex cracks, rift crystals) plus a boss aura.
- Generous empty space between items, plain flat panel backgrounds.
Boss (화산 와이번, stage 30, element 불): a wyvern with obsidian scales and a lava-filled chest, wings dripping embers
```

### BOSS-40 · 뇌운 그리폰 (Thunder Griffin) — 40판 장 보스 · 바람

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER CHAPTER BOSS sheet, 1536x1024 landscape, same rendering style as the attached reference sheets, epic and readable:
- LEFT: header with a crown/skull boss badge "BOSS · STAGE 40", name "Thunder Griffin", epithet, element tags.
- CENTER: one large full-body key art of the boss in a dynamic pose (about 45% of the sheet width).
- RIGHT TOP: two rounded-square face portraits (calm / enraged).
- RIGHT MIDDLE "IN-GAME HEX TILE": the boss standing on ONE isometric hex tile but drawn 1.5x larger than a normal unit, with a glowing gold-violet boss rim on the tile.
- BOTTOM: hex-tile sprites: IDLE, ATTACK, SKILL, HURT, KO.
- Same rift corruption language as the Rift monsters (violet hex cracks, rift crystals) plus a boss aura.
- Generous empty space between items, plain flat panel backgrounds.
Boss (뇌운 그리폰, stage 40, element 바람): a griffin made of storm clouds and feathers, lightning mane
```

### BOSS-50 · 거신 장수풍뎅이 (Colossus Beetle) — 50판 장 보스 · 대지

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER CHAPTER BOSS sheet, 1536x1024 landscape, same rendering style as the attached reference sheets, epic and readable:
- LEFT: header with a crown/skull boss badge "BOSS · STAGE 50", name "Colossus Beetle", epithet, element tags.
- CENTER: one large full-body key art of the boss in a dynamic pose (about 45% of the sheet width).
- RIGHT TOP: two rounded-square face portraits (calm / enraged).
- RIGHT MIDDLE "IN-GAME HEX TILE": the boss standing on ONE isometric hex tile but drawn 1.5x larger than a normal unit, with a glowing gold-violet boss rim on the tile.
- BOTTOM: hex-tile sprites: IDLE, ATTACK, SKILL, HURT, KO.
- Same rift corruption language as the Rift monsters (violet hex cracks, rift crystals) plus a boss aura.
- Generous empty space between items, plain flat panel backgrounds.
Boss (거신 장수풍뎅이, stage 50, element 대지): a gigantic rhinoceros beetle with a mountain-like shell and crystal horn
```

### BOSS-60 · 가시 여왕 사마귀 (Thornqueen Mantis) — 60판 장 보스 · 숲

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER CHAPTER BOSS sheet, 1536x1024 landscape, same rendering style as the attached reference sheets, epic and readable:
- LEFT: header with a crown/skull boss badge "BOSS · STAGE 60", name "Thornqueen Mantis", epithet, element tags.
- CENTER: one large full-body key art of the boss in a dynamic pose (about 45% of the sheet width).
- RIGHT TOP: two rounded-square face portraits (calm / enraged).
- RIGHT MIDDLE "IN-GAME HEX TILE": the boss standing on ONE isometric hex tile but drawn 1.5x larger than a normal unit, with a glowing gold-violet boss rim on the tile.
- BOTTOM: hex-tile sprites: IDLE, ATTACK, SKILL, HURT, KO.
- Same rift corruption language as the Rift monsters (violet hex cracks, rift crystals) plus a boss aura.
- Generous empty space between items, plain flat panel backgrounds.
Boss (가시 여왕 사마귀, stage 60, element 숲): a regal mantis with rose-thorn scythes and a flower crown
```

### BOSS-70 · 증기 크라켄 (Steam Kraken) — 70판 장 보스 · 물·불

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER CHAPTER BOSS sheet, 1536x1024 landscape, same rendering style as the attached reference sheets, epic and readable:
- LEFT: header with a crown/skull boss badge "BOSS · STAGE 70", name "Steam Kraken", epithet, element tags.
- CENTER: one large full-body key art of the boss in a dynamic pose (about 45% of the sheet width).
- RIGHT TOP: two rounded-square face portraits (calm / enraged).
- RIGHT MIDDLE "IN-GAME HEX TILE": the boss standing on ONE isometric hex tile but drawn 1.5x larger than a normal unit, with a glowing gold-violet boss rim on the tile.
- BOTTOM: hex-tile sprites: IDLE, ATTACK, SKILL, HURT, KO.
- Same rift corruption language as the Rift monsters (violet hex cracks, rift crystals) plus a boss aura.
- Generous empty space between items, plain flat panel backgrounds.
Boss (증기 크라켄, stage 70, element 물·불): a kraken whose tentacles are half water half magma, wreathed in steam
```

### BOSS-80 · 모래폭풍 로크 (Sandstorm Roc) — 80판 장 보스 · 바람·대지

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER CHAPTER BOSS sheet, 1536x1024 landscape, same rendering style as the attached reference sheets, epic and readable:
- LEFT: header with a crown/skull boss badge "BOSS · STAGE 80", name "Sandstorm Roc", epithet, element tags.
- CENTER: one large full-body key art of the boss in a dynamic pose (about 45% of the sheet width).
- RIGHT TOP: two rounded-square face portraits (calm / enraged).
- RIGHT MIDDLE "IN-GAME HEX TILE": the boss standing on ONE isometric hex tile but drawn 1.5x larger than a normal unit, with a glowing gold-violet boss rim on the tile.
- BOTTOM: hex-tile sprites: IDLE, ATTACK, SKILL, HURT, KO.
- Same rift corruption language as the Rift monsters (violet hex cracks, rift crystals) plus a boss aura.
- Generous empty space between items, plain flat panel backgrounds.
Boss (모래폭풍 로크, stage 80, element 바람·대지): a giant roc bird with stone-plated wings carrying a sandstorm
```

### BOSS-90 · 혼돈 키메라 (Chaos Chimera) — 90판 장 보스 · 숲·물·불

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER CHAPTER BOSS sheet, 1536x1024 landscape, same rendering style as the attached reference sheets, epic and readable:
- LEFT: header with a crown/skull boss badge "BOSS · STAGE 90", name "Chaos Chimera", epithet, element tags.
- CENTER: one large full-body key art of the boss in a dynamic pose (about 45% of the sheet width).
- RIGHT TOP: two rounded-square face portraits (calm / enraged).
- RIGHT MIDDLE "IN-GAME HEX TILE": the boss standing on ONE isometric hex tile but drawn 1.5x larger than a normal unit, with a glowing gold-violet boss rim on the tile.
- BOTTOM: hex-tile sprites: IDLE, ATTACK, SKILL, HURT, KO.
- Same rift corruption language as the Rift monsters (violet hex cracks, rift crystals) plus a boss aura.
- Generous empty space between items, plain flat panel backgrounds.
Boss (혼돈 키메라, stage 90, element 숲·물·불): a three-headed chimera (forest stag, water serpent, fire lion) fused by rift cracks
```

### BOSS-100 · 헥사 포식자 · 균열의 군주 (Hexa Devourer, Lord of the Rift) — 100판 최종 보스 · 모든 속성

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create one HEXA FRONTIER FINAL BOSS sheet, 1536x1024 landscape, same rendering style as the attached reference sheets, epic and readable:
- LEFT: header with a crown/skull boss badge "FINAL · STAGE 100", name "Hexa Devourer, Lord of the Rift", epithet, element tags.
- CENTER: one large full-body key art of the boss in a dynamic pose (about 45% of the sheet width).
- RIGHT TOP: two rounded-square face portraits (calm / enraged).
- RIGHT MIDDLE "IN-GAME HEX TILE": the boss standing on ONE isometric hex tile but drawn 1.5x larger than a normal unit, with a glowing gold-violet boss rim on the tile.
- BOTTOM: hex-tile sprites: IDLE, ATTACK, SKILL, HURT, KO, PHASE 2 (rift armor broken, crystals blazing).
- Same rift corruption language as the Rift monsters (violet hex cracks, rift crystals) plus a boss aura.
- Generous empty space between items, plain flat panel backgrounds.
Boss (헥사 포식자 · 균열의 군주, stage 100, element 모든 속성): a colossal rift dragon made of shattered hex tiles, five element crystals orbiting it
```

## 기술 이펙트

8프레임(4×2) 스프라이트 시트, 투명 배경. 기술 16종 + 공통 효과(타격·치명타·기절·레벨업·쓰러짐·진화). 속성 기술 3종은 속성마다 한 장씩.

### FX-hit_basic · 기본 타격

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a game skill effect sprite sheet, 1536x1024, TRANSPARENT background, a 4 x 2 grid of 8 animation frames read left-to-right, top-to-bottom (each frame 384x512), effect centered in every frame and the same scale in every frame.
Style: HEXA FRONTIER painterly anime VFX — soft glow, crisp stylized shapes, small sparkle particles, no characters, no text. The effect must read on top of a small hex-tile unit (unit occupies the lower-middle of the frame).
Effect: a quick white slash spark impact with small star sparks (generic basic attack hit)
Colors: white and warm gold
```

### FX-hit_crit · 치명타

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a game skill effect sprite sheet, 1536x1024, TRANSPARENT background, a 4 x 2 grid of 8 animation frames read left-to-right, top-to-bottom (each frame 384x512), effect centered in every frame and the same scale in every frame.
Style: HEXA FRONTIER painterly anime VFX — soft glow, crisp stylized shapes, small sparkle particles, no characters, no text. The effect must read on top of a small hex-tile unit (unit occupies the lower-middle of the frame).
Effect: a big starburst impact with radial speed lines and a gold flash (critical hit)
Colors: gold and white
```

### FX-taunt · 도발

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a game skill effect sprite sheet, 1536x1024, TRANSPARENT background, a 4 x 2 grid of 8 animation frames read left-to-right, top-to-bottom (each frame 384x512), effect centered in every frame and the same scale in every frame.
Style: HEXA FRONTIER painterly anime VFX — soft glow, crisp stylized shapes, small sparkle particles, no characters, no text. The effect must read on top of a small hex-tile unit (unit occupies the lower-middle of the frame).
Effect: a red shout shockwave ring expanding from the unit with an angry vein icon shape
Colors: red and orange
```

### FX-shieldbash · 방패 강타

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a game skill effect sprite sheet, 1536x1024, TRANSPARENT background, a 4 x 2 grid of 8 animation frames read left-to-right, top-to-bottom (each frame 384x512), effect centered in every frame and the same scale in every frame.
Style: HEXA FRONTIER painterly anime VFX — soft glow, crisp stylized shapes, small sparkle particles, no characters, no text. The effect must read on top of a small hex-tile unit (unit occupies the lower-middle of the frame).
Effect: a heavy shield slam: stone-colored impact crater ring plus spinning dizzy stars
Colors: steel grey, gold stars
```

### FX-power · 강타

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a game skill effect sprite sheet, 1536x1024, TRANSPARENT background, a 4 x 2 grid of 8 animation frames read left-to-right, top-to-bottom (each frame 384x512), effect centered in every frame and the same scale in every frame.
Style: HEXA FRONTIER painterly anime VFX — soft glow, crisp stylized shapes, small sparkle particles, no characters, no text. The effect must read on top of a small hex-tile unit (unit occupies the lower-middle of the frame).
Effect: a powerful single downward slash leaving a thick bright arc and a ground crack
Colors: white-gold
```

### FX-whirl · 회오리 베기

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a game skill effect sprite sheet, 1536x1024, TRANSPARENT background, a 4 x 2 grid of 8 animation frames read left-to-right, top-to-bottom (each frame 384x512), effect centered in every frame and the same scale in every frame.
Style: HEXA FRONTIER painterly anime VFX — soft glow, crisp stylized shapes, small sparkle particles, no characters, no text. The effect must read on top of a small hex-tile unit (unit occupies the lower-middle of the frame).
Effect: a 360-degree spinning blade wind ring around the unit (covers the 6 surrounding hexes)
Colors: pale cyan and white
```

### FX-drain · 흡수

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a game skill effect sprite sheet, 1536x1024, TRANSPARENT background, a 4 x 2 grid of 8 animation frames read left-to-right, top-to-bottom (each frame 384x512), effect centered in every frame and the same scale in every frame.
Style: HEXA FRONTIER painterly anime VFX — soft glow, crisp stylized shapes, small sparkle particles, no characters, no text. The effect must read on top of a small hex-tile unit (unit occupies the lower-middle of the frame).
Effect: dark red life-wisps flowing from the target back to the attacker
Colors: crimson and pink
```

### FX-snipe · 저격

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a game skill effect sprite sheet, 1536x1024, TRANSPARENT background, a 4 x 2 grid of 8 animation frames read left-to-right, top-to-bottom (each frame 384x512), effect centered in every frame and the same scale in every frame.
Style: HEXA FRONTIER painterly anime VFX — soft glow, crisp stylized shapes, small sparkle particles, no characters, no text. The effect must read on top of a small hex-tile unit (unit occupies the lower-middle of the frame).
Effect: a single glowing arrow streak with a target reticle flash at impact
Colors: gold and white
```

### FX-volley · 화살비

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a game skill effect sprite sheet, 1536x1024, TRANSPARENT background, a 4 x 2 grid of 8 animation frames read left-to-right, top-to-bottom (each frame 384x512), effect centered in every frame and the same scale in every frame.
Style: HEXA FRONTIER painterly anime VFX — soft glow, crisp stylized shapes, small sparkle particles, no characters, no text. The effect must read on top of a small hex-tile unit (unit occupies the lower-middle of the frame).
Effect: many small arrows falling in a circle area with dust puffs
Colors: brown wood and silver
```

### FX-heal · 치유

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a game skill effect sprite sheet, 1536x1024, TRANSPARENT background, a 4 x 2 grid of 8 animation frames read left-to-right, top-to-bottom (each frame 384x512), effect centered in every frame and the same scale in every frame.
Style: HEXA FRONTIER painterly anime VFX — soft glow, crisp stylized shapes, small sparkle particles, no characters, no text. The effect must read on top of a small hex-tile unit (unit occupies the lower-middle of the frame).
Effect: soft green rising leaves and sparkles with a plus-shaped glow
Colors: green and white
```

### FX-massheal · 치유의 비

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a game skill effect sprite sheet, 1536x1024, TRANSPARENT background, a 4 x 2 grid of 8 animation frames read left-to-right, top-to-bottom (each frame 384x512), effect centered in every frame and the same scale in every frame.
Style: HEXA FRONTIER painterly anime VFX — soft glow, crisp stylized shapes, small sparkle particles, no characters, no text. The effect must read on top of a small hex-tile unit (unit occupies the lower-middle of the frame).
Effect: a gentle rain of glowing droplets and petals over an area
Colors: green, aqua and white
```

### FX-cheer · 격려

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a game skill effect sprite sheet, 1536x1024, TRANSPARENT background, a 4 x 2 grid of 8 animation frames read left-to-right, top-to-bottom (each frame 384x512), effect centered in every frame and the same scale in every frame.
Style: HEXA FRONTIER painterly anime VFX — soft glow, crisp stylized shapes, small sparkle particles, no characters, no text. The effect must read on top of a small hex-tile unit (unit occupies the lower-middle of the frame).
Effect: rising golden musical notes and an upward arrow aura
Colors: gold and orange
```

### FX-weaken · 약화

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a game skill effect sprite sheet, 1536x1024, TRANSPARENT background, a 4 x 2 grid of 8 animation frames read left-to-right, top-to-bottom (each frame 384x512), effect centered in every frame and the same scale in every frame.
Style: HEXA FRONTIER painterly anime VFX — soft glow, crisp stylized shapes, small sparkle particles, no characters, no text. The effect must read on top of a small hex-tile unit (unit occupies the lower-middle of the frame).
Effect: a sinking violet mist with a broken-shield silhouette
Colors: violet and grey
```

### FX-command · 지휘

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a game skill effect sprite sheet, 1536x1024, TRANSPARENT background, a 4 x 2 grid of 8 animation frames read left-to-right, top-to-bottom (each frame 384x512), effect centered in every frame and the same scale in every frame.
Style: HEXA FRONTIER painterly anime VFX — soft glow, crisp stylized shapes, small sparkle particles, no characters, no text. The effect must read on top of a small hex-tile unit (unit occupies the lower-middle of the frame).
Effect: a waving banner flash and a golden ring pulse spreading out
Colors: gold and navy
```

### FX-starbolt · 별빛탄

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a game skill effect sprite sheet, 1536x1024, TRANSPARENT background, a 4 x 2 grid of 8 animation frames read left-to-right, top-to-bottom (each frame 384x512), effect centered in every frame and the same scale in every frame.
Style: HEXA FRONTIER painterly anime VFX — soft glow, crisp stylized shapes, small sparkle particles, no characters, no text. The effect must read on top of a small hex-tile unit (unit occupies the lower-middle of the frame).
Effect: a small shooting star projectile with a sparkling trail and star burst
Colors: white, pale gold and lilac
```

### FX-elstrike · 속성 일격 ×5

> 속성별 5장은 같은 프롬프트에서 속성만 바꿔 5번 생성

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a game skill effect sprite sheet, 1536x1024, TRANSPARENT background, a 4 x 2 grid of 8 animation frames read left-to-right, top-to-bottom (each frame 384x512), effect centered in every frame and the same scale in every frame.
Style: HEXA FRONTIER painterly anime VFX — soft glow, crisp stylized shapes, small sparkle particles, no characters, no text. The effect must read on top of a small hex-tile unit (unit occupies the lower-middle of the frame).
Effect: an element-infused claw/blade strike on one target. Generate one image per element (5 images, same layout): water splash slash / fire flame slash / forest leaf slash / earth rock slash / wind gale slash
Colors: use the element palette of the version
```

### FX-elbolt · 원소탄 ×5

> 속성별 5장은 같은 프롬프트에서 속성만 바꿔 5번 생성

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a game skill effect sprite sheet, 1536x1024, TRANSPARENT background, a 4 x 2 grid of 8 animation frames read left-to-right, top-to-bottom (each frame 384x512), effect centered in every frame and the same scale in every frame.
Style: HEXA FRONTIER painterly anime VFX — soft glow, crisp stylized shapes, small sparkle particles, no characters, no text. The effect must read on top of a small hex-tile unit (unit occupies the lower-middle of the frame).
Effect: an element projectile flying with a trail, then bursting on impact. Generate one image per element (5 images, same layout): water orb, fire ball, leaf-seed bolt, rock shard, wind blade
Colors: use the element palette of the version
```

### FX-blast · 원소 폭발 ×5

> 속성별 5장은 같은 프롬프트에서 속성만 바꿔 5번 생성

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a game skill effect sprite sheet, 1536x1024, TRANSPARENT background, a 4 x 2 grid of 8 animation frames read left-to-right, top-to-bottom (each frame 384x512), effect centered in every frame and the same scale in every frame.
Style: HEXA FRONTIER painterly anime VFX — soft glow, crisp stylized shapes, small sparkle particles, no characters, no text. The effect must read on top of a small hex-tile unit (unit occupies the lower-middle of the frame).
Effect: an area explosion covering a target hex and its 6 neighbors. Generate one image per element (5 images, same layout): tidal splash, firestorm, thorn bloom, earth spikes, cyclone
Colors: use the element palette of the version
```

### FX-status_stun · 기절 별

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a game skill effect sprite sheet, 1536x1024, TRANSPARENT background, a 4 x 2 grid of 8 animation frames read left-to-right, top-to-bottom (each frame 384x512), effect centered in every frame and the same scale in every frame.
Style: HEXA FRONTIER painterly anime VFX — soft glow, crisp stylized shapes, small sparkle particles, no characters, no text. The effect must read on top of a small hex-tile unit (unit occupies the lower-middle of the frame).
Effect: looping 3 small dizzy stars circling above a head (8-frame loop)
Colors: yellow
```

### FX-levelup · 레벨 업

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a game skill effect sprite sheet, 1536x1024, TRANSPARENT background, a 4 x 2 grid of 8 animation frames read left-to-right, top-to-bottom (each frame 384x512), effect centered in every frame and the same scale in every frame.
Style: HEXA FRONTIER painterly anime VFX — soft glow, crisp stylized shapes, small sparkle particles, no characters, no text. The effect must read on top of a small hex-tile unit (unit occupies the lower-middle of the frame).
Effect: a golden pillar of light with rising sparkles and an upward chevron
Colors: gold and white
```

### FX-ko_poof · 쓰러짐

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a game skill effect sprite sheet, 1536x1024, TRANSPARENT background, a 4 x 2 grid of 8 animation frames read left-to-right, top-to-bottom (each frame 384x512), effect centered in every frame and the same scale in every frame.
Style: HEXA FRONTIER painterly anime VFX — soft glow, crisp stylized shapes, small sparkle particles, no characters, no text. The effect must read on top of a small hex-tile unit (unit occupies the lower-middle of the frame).
Effect: a soft cartoon smoke poof with small stars fading out
Colors: grey-white
```

### FX-evolve · 진화

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a game skill effect sprite sheet, 1536x1024, TRANSPARENT background, a 4 x 2 grid of 8 animation frames read left-to-right, top-to-bottom (each frame 384x512), effect centered in every frame and the same scale in every frame.
Style: HEXA FRONTIER painterly anime VFX — soft glow, crisp stylized shapes, small sparkle particles, no characters, no text. The effect must read on top of a small hex-tile unit (unit occupies the lower-middle of the frame).
Effect: a swirling cocoon of light that bursts into sparkles
Colors: element-neutral white with rainbow sparkles
```

## 전투 화면 요소 · 헥사

**헥사 제안**: 지금 전장 바닥은 평평한 단색 육각형이고, 스피릿은 자기 시트의 입체(아이소메트릭) 헥사 위에 서 있어서 바닥과 유닛 받침의 시점이 다릅니다. 장(지역)마다 **살짝 기울어진 2.5D 헥사 타일 세트**를 새로 만들어 바닥을 바꾸는 것을 추천합니다(유닛 받침과 같은 질감·두께). 지역 6종 × 지형 8종.
그 밖에 범위 표시, 발판 링, 체력 막대, 상태·속성·역할·행동 아이콘, 차례 배너, 숫자 글꼴, 카드·미리보기 틀 — 모두 **글자 없이** 받아 게임이 한글을 얹습니다.

### TILE · 숲 들판 (1장·6장)

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
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
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
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
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
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
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
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
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
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
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
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
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

A set of flat semi-transparent pointy-top hexagon overlays (same size as the terrain tiles), TRANSPARENT background, arranged in a grid with space between them: (1) blue MOVE range, (2) red ATTACK target, (3) gold SKILL area, (4) faint red ENEMY THREAT, (5) bright gold SELECTED outline ring, (6) green HEAL target, (7) small gold path dot, (8) dashed gold destination marker. Soft inner glow, clean edges, no text.
```

### UI · 유닛 발판 링

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

A set of glowing oval base rings that sit under a unit standing on a hex, TRANSPARENT background: ally (blue), enemy (red), boss (gold-violet with small crown), selected (gold pulse), acted/exhausted (desaturated grey). Each ring as a separate item with space between.
```

### UI · 체력·SP 막대

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Small HP and SP bar frames for above unit heads and for the unit card, TRANSPARENT background: unit-head bar frame (thin, rounded, dark), HP fills (ally green, enemy red, boss gold), SP fill (blue), XP fill (violet), shield/armor overlay. Also a large unit-card bar frame version. No text, no numbers.
```

### UI · 상태 아이콘

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

A sheet of 12 small round status icons, 128x128 each, TRANSPARENT background, consistent style (gold rim, navy disc): stun (dizzy stars), attack up (sword up arrow), defense down (cracked shield), taunt (shout), guard (shield glow), poison (green drop), burn (flame), heal over time (leaf), speed up (wing), leader (crown), elite (rift crystal), boss (skull crown). No text.
```

### UI · 속성 아이콘

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Five round element icons, 256x256 each, TRANSPARENT background, matching the element icons on the HEXA FRONTIER reference sheets: water drop, fire flame, forest leaf, earth mountain, wind swirl — plus the advantage chart graphic: five icons in a pentagon with curved arrows water->fire->forest->earth->wind->water.
```

### UI · 역할 아이콘

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Seven role icons, 256x256, TRANSPARENT background, gold-on-navy emblem style: tank (shield), physical melee (sword), magic melee (glowing claw), physical ranged (bow), magic ranged (orb with sparkles, NOT a wizard hat), healer (leaf heart), supporter (horn/banner).
```

### UI · 행동 버튼 아이콘

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Action button icons for the battle bottom panel, 256x256, TRANSPARENT background, consistent gold-on-navy style: attack (crossed swords), skill (star burst), item (satchel), wait (hourglass), undo move (curved arrow), end turn (flag with arrow), auto-battle OFF (sleeping robot), auto ON (robot), auto 2x (robot with >>), auto 4x (robot with >>>>), surrender (white flag), help (question compass).
```

### UI · 차례 배너

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Wide ribbon banners for battle phase announcements, TRANSPARENT background, NO TEXT (text will be added by the game): ally phase banner (blue-gold ribbon with compass star), enemy phase banner (crimson-violet ribbon with rift crystal), victory banner (gold laurel ribbon with trophy), defeat banner (grey broken ribbon), boss warning banner (red-violet with skull crown).
```

### UI · 피해 숫자 글꼴

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

A bitmap number font sheet for floating damage numbers, TRANSPARENT background: digits 0-9, plus '+', '-', '!' in four color styles in rows: normal hit (white with dark outline), advantage hit (orange, bigger, slightly bouncy), weak hit (grey-blue, smaller), heal (green). Chunky, game-like, highly legible, each glyph separated with space.
```

### UI · 공격 미리보기·유닛 카드 틀

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
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
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
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
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
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
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
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
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
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
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
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
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
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
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a mobile game UI mockup, 1024x1536 portrait (phone screen 9:19.5 safe area), for HEXA FRONTIER, a hex-grid turn-based tactics RPG with cute elemental spirit creatures.
Use the HEXA FRONTIER UI chrome language: deep navy panels, warm gold trim, parchment cream cards, compass-star emblem, rounded corners, generous touch targets (min 44 px).
All visible UI text must be KOREAN (Hangul), short and legible. Show realistic content, not lorem ipsum.
Draw THREE result screens side by side in one 1536x1024 landscape image:
(1) VICTORY: gold banner "승리!", stage "27 · 마그마 굴", stars 3/3, rewards (🪙 +276, item icon, 🔶 성장의 결정), level-up list with portraits ("웨이브팽 21 → 22").
(2) NEW SPIRIT JOINS: a dramatic reveal of a new spirit "퍼퍼샷 합류!" with its full art on a hex pedestal, element and role tags, button "부대에서 보기".
(3) DEFEAT: muted banner "패배…", reason line, and helpful next-step buttons: "앞 판에서 경험치 벌기", "편성 바꾸기 (▲상성 추천)", "장비 바꾸기", "다시 도전".
```

### 8단계 · 부대 탭 (목록 + 스피릿 상세)

> 결정할 것: 목록 정렬·필터(속성/역할) · 진화 단계 보여 주기 · 장비 3칸·성장의 결정 위치

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a mobile game UI mockup, 1024x1536 portrait (phone screen 9:19.5 safe area), for HEXA FRONTIER, a hex-grid turn-based tactics RPG with cute elemental spirit creatures.
Use the HEXA FRONTIER UI chrome language: deep navy panels, warm gold trim, parchment cream cards, compass-star emblem, rounded corners, generous touch targets (min 44 px).
All visible UI text must be KOREAN (Hangul), short and legible. Show realistic content, not lorem ipsum.
Draw TWO phone screens side by side (1536x1024 landscape):
(1) 부대 list: filter chips by element (💧🔥🌿⛰️🌪️) and role (탱커/근딜/원딜/힐러/서포터), a 4-column grid of spirit cards (portrait, level, element dot, role icon, small "출전" badge on party members).
(2) Spirit detail for "쉘나이트": large art on a hex pedestal with evolution track (Lv.1 → Lv.10 → Lv.25, current stage highlighted), stats (체력, 공격, 방어, 마법방어, 이동력, 사거리, SP), two skills (one locked until Lv.5), equipment slots (무기/갑옷/장신구), XP bar, button "🔶 성장의 결정 쓰기".
```

### 9단계 · 도감 탭 (스피릿 60종)

> 결정할 것: 미발견 표시(실루엣/물음표) · 속성별 페이지 vs 한 화면 · 수집률 보상

```
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
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
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
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
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
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
[HEXA FRONTIER STYLE BIBLE v1 — keep identical across all images]
- Art style: cute-but-heroic chibi fantasy creatures, 2.5D painterly anime illustration, clean dark-brown line art, soft cel shading with subtle painted texture, gentle rim light. Match the attached HEXA FRONTIER reference sheets exactly (same rendering, line weight, saturation).
- Proportions: big head, compact body (SD 1:2 to 1:2.5). Silhouette must read clearly at 64 px.
- Lighting: key light from upper-left, warm ambient fill, soft contact shadow under every unit.
- Element palettes: WATER sky-blue #4AA3FF + teal + pearl white; FIRE ember orange #FF7A45 + crimson + gold sparks; FOREST leaf green #5CC46A + moss + small flowers; EARTH sand ochre #C9A063 + slate stone + amber crystals; WIND mint #7FE0D0 + white feathers + cloud wisps.
- Game units stand on an isometric pointy-top hexagon tile (same camera angle as the reference), the tile is about 30% of the sprite height.
- UI chrome language: deep navy panels #16233B, warm gold trim #C9A95A, parchment cream #F7EFD9, rounded corners, small compass-star motif (the HEXA FRONTIER emblem).
- No watermarks, no logos other than the HEXA FRONTIER compass emblem. Text only where the prompt asks for it.

Create a mobile game UI mockup, 1024x1536 portrait (phone screen 9:19.5 safe area), for HEXA FRONTIER, a hex-grid turn-based tactics RPG with cute elemental spirit creatures.
Use the HEXA FRONTIER UI chrome language: deep navy panels, warm gold trim, parchment cream cards, compass-star emblem, rounded corners, generous touch targets (min 44 px).
All visible UI text must be KOREAN (Hangul), short and legible. Show realistic content, not lorem ipsum.
Create a UI component kit sheet (1536x1024 landscape, TRANSPARENT background, NO TEXT inside components — text is added by the game) in the chosen direction ({choice}):
primary button (normal/pressed/disabled), secondary button (3 states), small round icon button, tab bar background, top status bar background, panel frame (9-slice friendly: clear corners and straight edges), popup frame with header ribbon, bottom sheet frame with grab handle, toast bubble, red notification badge, gold stage-node hexagon (locked/open/cleared/current/boss/elite), progress bar frame, star (empty/full), divider ornament with compass star.
```
