import { getStreak } from '../utils/progress';

const PLAYERS = [
  { name: 'Agastyah', emoji: '🦕', color: '#2e7d32', bg: '#e8f5e9' },
  { name: 'Arihant',  emoji: '🚀', color: '#1565c0', bg: '#e3f2fd' },
];

export default function HomeScreen({ onSinglePlayer, onTwoPlayer, onSettings }) {
  return (
    <div className="home-screen">
      <button className="settings-gear" onClick={onSettings}>⚙️</button>
      <div className="home-panels">
        {PLAYERS.map((p) => {
          const streak = getStreak(p.name);
          return (
            <button
              key={p.name}
              className="home-panel"
              style={{ '--panel-bg': p.bg, '--panel-color': p.color }}
              onClick={() => onSinglePlayer(p.name)}
            >
              <span className="home-panel-emoji">{p.emoji}</span>
              <span className="home-panel-name">{p.name}</span>
              {streak > 0 && <span className="home-streak">🔥 {streak}d</span>}
            </button>
          );
        })}
      </div>
      <button className="together-bar" onClick={onTwoPlayer}>
        🦕🚀 Play Together
      </button>
    </div>
  );
}
