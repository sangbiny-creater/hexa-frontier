import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RpgApp } from '../rpgui/RpgApp';
import './styles.css';
import '../rpgui/rpg.css';

// D72: 헥사 들판 사냥 RPG. (이전 판 화면은 src/ui/App.tsx에 남아 있음)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RpgApp />
  </StrictMode>,
);
