import { THEMES } from '../data/books';

const THEME_EMOJIS = {
  dino:      ['🦕', '🦖', '🌿'],
  cars:      ['🚗', '🚕', '🏎️'],
  animals:   ['🐶', '🐱', '🐰'],
  firetruck: ['🚒', '🔔', '💧'],
  ocean:     ['🐠', '🐚', '🌊'],
  farm:      ['🐄', '🐔', '🌻'],
};

export default function EncouragementScreen({ message, theme, onTryAgain }) {
  const emojis = THEME_EMOJIS[theme] ?? ['⭐', '💫', '✨'];

  return (
    <div className="screen encourage-screen">
      <div className="encourage-content">
        <div className="encourage-emojis">
          {emojis.map((e, i) => (
            <span key={i} className={`enc-emoji enc-emoji-${i}`}>{e}</span>
          ))}
        </div>
        <h2 className="encourage-title">Keep Trying!</h2>
        <p className="encourage-msg">{message}</p>
        <div className="encourage-hearts">❤️ ❤️ ❤️</div>
        <button className="try-again-btn" onClick={onTryAgain}>
          🔄 Try Again!
        </button>
      </div>
    </div>
  );
}
