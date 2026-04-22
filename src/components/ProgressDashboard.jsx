import { THEMES } from '../data/books';
import { getDailySummary, getLifetimeTotals, getStreak } from '../utils/progress';

const PLAYERS = [
  { name: 'Agastyah', emoji: '🦕', color: '#388e3c' },
  { name: 'Arihant',  emoji: '🚀', color: '#1565c0' },
];

const fmtDate = (iso) => {
  const [y, m, d] = iso.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[+m - 1]} ${+d}`;
};

function PlayerProgress({ player }) {
  const summary  = getDailySummary(player.name, 14);
  const totals   = getLifetimeTotals(player.name);
  const streak   = getStreak(player.name);

  const maxTotal = summary.reduce((m, d) => Math.max(m, d.total), 1);

  return (
    <div className="pd-player">
      <div className="pd-player-header" style={{ '--pd-color': player.color }}>
        <span className="pd-emoji">{player.emoji}</span>
        <div className="pd-player-info">
          <h2 className="pd-name">{player.name}</h2>
          <div className="pd-stats-row">
            <span className="pd-stat">🔥 {streak} day streak</span>
            <span className="pd-stat">⭐ {totals.correct} correct</span>
            <span className="pd-stat">📝 {totals.total} tried</span>
            <span className="pd-stat">🎯 {totals.pct}% accuracy</span>
          </div>
        </div>
      </div>

      {summary.length === 0 ? (
        <p className="pd-empty">No sessions yet — start reading to see progress!</p>
      ) : (
        <div className="pd-table-wrap">
          <table className="pd-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Progress</th>
                <th>Correct</th>
                <th>Tried</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((row) => {
                const barPct   = Math.round((row.total / maxTotal) * 100);
                const fillPct  = row.total ? Math.round((row.correct / row.total) * 100) : 0;
                const stars    = fillPct >= 90 ? '⭐⭐⭐'
                               : fillPct >= 60 ? '⭐⭐'
                               : fillPct >= 30 ? '⭐'
                               : '–';
                return (
                  <tr key={row.date}>
                    <td className="pd-date">{fmtDate(row.date)}</td>
                    <td className="pd-bar-cell">
                      <div className="pd-bar-bg">
                        <div
                          className="pd-bar-fill"
                          style={{
                            width: `${barPct}%`,
                            '--bar-color': player.color,
                          }}
                        >
                          <div
                            className="pd-bar-correct"
                            style={{ width: `${fillPct}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="pd-num correct">{row.correct}</td>
                    <td className="pd-num">{row.total}</td>
                    <td className="pd-stars">{stars}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function ProgressDashboard({ onBack }) {
  return (
    <div className="screen pd-screen">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <h1 className="pd-title">📊 Progress Report</h1>
      <div className="pd-players">
        {PLAYERS.map((p) => <PlayerProgress key={p.name} player={p} />)}
      </div>
    </div>
  );
}
