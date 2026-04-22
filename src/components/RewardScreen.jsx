import { THEMES } from '../data/books';

const STARS_EMOJIS = ['⭐', '🌟', '✨', '💫', '🌠'];
const THEME_CHEERS = {
  dino:      ['🦕', '🦖', '🌿', '🥳', '🎉'],
  cars:      ['🚗', '🏎️', '🚕', '🎉', '🏆'],
  animals:   ['🐶', '🐱', '🐰', '🥳', '🎉'],
  firetruck: ['🚒', '🔔', '💧', '🥳', '🎉'],
  ocean:     ['🐠', '🐚', '🌊', '🥳', '🎉'],
  farm:      ['🐄', '🐔', '🌻', '🥳', '🎉'],
};

export default function RewardScreen({
  childName, sentence, theme, onNext,
  isBookComplete = false,
  nextPlayerName = null, // set in two-player mode
  scores = null,         // { PlayerName: {correct, total} }
  players = null,
}) {
  const themeMeta = THEMES.find(t => t.id === theme) ?? { emoji: '⭐' };
  const cheers    = THEME_CHEERS[theme] ?? STARS_EMOJIS;

  const confetti = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    emoji: STARS_EMOJIS[i % STARS_EMOJIS.length],
    left: Math.random() * 90 + 5,
    delay: Math.random() * 1.5,
    duration: 1.5 + Math.random(),
    size: 1.5 + Math.random() * 1.5,
  }));

  const nextLabel = isBookComplete
    ? '🏠 Home'
    : nextPlayerName
    ? `➡️ ${nextPlayerName}'s Turn!`
    : '➡️ Next Word!';

  const title = isBookComplete
    ? `🎊 Amazing ${childName}! 🎊`
    : `🌟 Well done ${childName}! 🌟`;

  return (
    <div className="screen reward-screen" style={{ background: themeMeta.bg }}>
      <div className="confetti-container" aria-hidden>
        {confetti.map(c => (
          <span key={c.id} className="confetti-piece" style={{
            left: `${c.left}%`,
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.duration}s`,
            fontSize: `${c.size}rem`,
          }}>{c.emoji}</span>
        ))}
      </div>

      <div className="reward-content">
        <div className="reward-character bounce">{themeMeta.emoji}</div>
        <h1 className="reward-title">{title}</h1>
        <div className="reward-sentence">"{sentence}"</div>
        <p className="reward-msg">
          {isBookComplete ? 'You finished! You are a superstar! 🌟' : 'You read that perfectly!'}
        </p>
        <div className="stars-row">⭐⭐⭐</div>

        {/* Two-player scoreboard on reward screen */}
        {scores && players && (
          <div className="reward-scoreboard">
            {players.map(name => (
              <div key={name} className={`reward-score-chip ${name === childName ? 'reward-score-active' : ''}`}>
                <span className="reward-score-name">{name}</span>
                <span className="reward-score-val">
                  {scores[name].correct}/{scores[name].total}
                  {' '}{scores[name].total > 0
                    ? `(${Math.round(scores[name].correct/scores[name].total*100)}%)`
                    : ''}
                </span>
              </div>
            ))}
          </div>
        )}

        <button className="next-btn" onClick={onNext}>{nextLabel}</button>
      </div>
    </div>
  );
}
