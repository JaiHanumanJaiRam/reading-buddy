import { LEVELS, THEMES } from '../data/books';

export default function ThemeSelector({ level, onSelect, onBack }) {
  const lvlMeta = LEVELS.find((l) => l.id === level);

  return (
    <div className="screen theme-screen">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <div className="level-badge">
        {'⭐'.repeat(lvlMeta.stars)} {lvlMeta.label} · {lvlMeta.ageLabel}
      </div>
      <p className="subtitle">Pick your favourite theme!</p>
      <div className="theme-grid">
        {THEMES.map((t) => (
          <button
            key={t.id}
            className="theme-card"
            style={{ '--tc-color': t.color, '--tc-bg': t.bg }}
            onClick={() => onSelect(t.id)}
          >
            <span className="theme-emoji">{t.emoji}</span>
            <span className="theme-label">{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
