import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TacticsApp } from '../tacticsui/TacticsApp';
import './styles.css';
import '../tacticsui/tactics.css';

// D109: 헥사 전술 전투 (턴제). 이전 사냥 RPG는 src/rpgui/RpgApp.tsx에 그대로 남아 있음
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TacticsApp />
  </StrictMode>,
);
