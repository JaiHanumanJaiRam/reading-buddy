const KEY = 'rb-progress-v1';

// ── Load / Save ───────────────────────────────────────────────────────
const load = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) ?? {}; }
  catch { return {}; }
};
const save = (data) => {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
};

// ── Record one attempt ────────────────────────────────────────────────
// playerName: string, e.g. 'Agastyah'
// payload: { level, theme, text, correct, attempts }
export const recordAttempt = (playerName, payload) => {
  const data = load();
  if (!data[playerName]) data[playerName] = [];
  const now   = new Date();
  const date  = now.toISOString().slice(0, 10); // 'YYYY-MM-DD'
  data[playerName].push({ ...payload, date, ts: now.getTime() });
  save(data);
};

// ── Daily summary for one player ──────────────────────────────────────
// Returns last `days` entries as:
// [{ date, correct, total, pct, byLevel: {1:n, 2:n, ...}, byTheme: {dino:n} }]
export const getDailySummary = (playerName, days = 30) => {
  const entries = (load()[playerName] ?? []);
  const map = {};
  entries.forEach(({ date, correct, level, theme }) => {
    if (!map[date]) map[date] = { correct: 0, total: 0, byLevel: {}, byTheme: {} };
    map[date].total++;
    if (correct) {
      map[date].correct++;
      map[date].byLevel[level] = (map[date].byLevel[level] ?? 0) + 1;
      map[date].byTheme[theme] = (map[date].byTheme[theme] ?? 0) + 1;
    }
  });
  return Object.entries(map)
    .sort(([a], [b]) => b.localeCompare(a))  // newest first
    .slice(0, days)
    .map(([date, d]) => ({
      date,
      correct: d.correct,
      total:   d.total,
      pct:     d.total ? Math.round((d.correct / d.total) * 100) : 0,
      byLevel: d.byLevel,
      byTheme: d.byTheme,
    }));
};

// ── Lifetime totals ───────────────────────────────────────────────────
export const getLifetimeTotals = (playerName) => {
  const entries = load()[playerName] ?? [];
  const correct = entries.filter(e => e.correct).length;
  return { total: entries.length, correct, pct: entries.length ? Math.round(correct / entries.length * 100) : 0 };
};

// ── Current streak (consecutive calendar days with ≥1 correct) ────────
export const getStreak = (playerName) => {
  const summary = getDailySummary(playerName, 365);
  if (!summary.length) return 0;
  // summary is newest-first
  let streak = 0;
  const today = new Date().toISOString().slice(0, 10);
  let expected = today;
  for (const { date, correct } of summary) {
    if (date !== expected) break;
    if (correct > 0) streak++;
    // Step back one calendar day
    const d = new Date(expected);
    d.setDate(d.getDate() - 1);
    expected = d.toISOString().slice(0, 10);
  }
  return streak;
};

// ── Clear all data ────────────────────────────────────────────────────
export const clearAll = () => localStorage.removeItem(KEY);
