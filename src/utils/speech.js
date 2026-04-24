// ── ElevenLabs TTS ────────────────────────────────────────────────────
// "Sarah" — soft, warm, kid-friendly voice
const EL_VOICE = 'EXAVITQu4vr4xnSDxMaL';
const EL_MODEL = 'eleven_turbo_v2_5';
const _elCache = new Map(); // text → blob URL, persists for the session

export const getELKey = () => localStorage.getItem('rb_el_key') || '';
export const setELKey = (k) => k ? localStorage.setItem('rb_el_key', k) : localStorage.removeItem('rb_el_key');

const _playUrl = (url) => new Promise((res) => {
  const a = new Audio(url);
  a.onended = res; a.onerror = res;
  a.play().catch(res);
});

const _speakEL = (text) => {
  const key = getELKey();
  if (!key) return null;
  if (_elCache.has(text)) return _playUrl(_elCache.get(text));
  return fetch(`https://api.elevenlabs.io/v1/text-to-speech/${EL_VOICE}`, {
    method: 'POST',
    headers: { 'xi-api-key': key, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      model_id: EL_MODEL,
      voice_settings: { stability: 0.72, similarity_boost: 0.75, style: 0.08, use_speaker_boost: false },
      speed: 0.82,
    }),
  })
    .then(r => { if (!r.ok) throw new Error(r.status); return r.blob(); })
    .then(blob => { const url = URL.createObjectURL(blob); _elCache.set(text, url); return _playUrl(url); })
    .catch(err => { console.warn('[EL]', err); return null; });
};

// ── Browser TTS fallback ──────────────────────────────────────────────
let _voices = [];
const _refresh = () => { _voices = window.speechSynthesis.getVoices(); };
_refresh();
window.speechSynthesis.addEventListener('voiceschanged', _refresh);

const VOICE_PREF = ['Samantha (Enhanced)', 'Samantha', 'Karen', 'Google US English', 'Microsoft Zira'];
export const pickVoice = () => {
  for (const name of VOICE_PREF) {
    const v = _voices.find(v => v.name === name || v.name.startsWith(name));
    if (v) return v;
  }
  return _voices.find(v => v.lang?.startsWith('en')) ?? null;
};

const _speakTTS = (text, { rate = 0.82, pitch = 0.82 } = {}) =>
  new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(text);
    u.volume = 1; u.lang = 'en-US'; u.rate = rate; u.pitch = pitch;
    const v = pickVoice(); if (v) u.voice = v;
    const ms = Math.max(1200, (text.length / rate) * 88 + 600);
    const t = setTimeout(resolve, ms);
    const done = () => { clearTimeout(t); resolve(); };
    u.onend = done;
    u.onerror = (e) => { console.warn('[TTS]', e.error, text); done(); };
    if (window.speechSynthesis.paused) window.speechSynthesis.resume();
    window.speechSynthesis.speak(u);
  });

// ── speak — tries ElevenLabs first, falls back to browser TTS ─────────
export const speak = async (text, opts = {}) => {
  const el = _speakEL(text);
  if (el) { const result = await el; if (result !== null) return result; }
  return _speakTTS(text, opts);
};

export const speakLetter = (letter) => speak(letter.toLowerCase(), { rate: 0.5, pitch: 0.75 });
export const cancelSpeech = () => window.speechSynthesis.cancel();
export const delay = (ms) => new Promise(r => setTimeout(r, ms));

// ── Detect browser ────────────────────────────────────────────────────
export const isChromeOnMac = () =>
  /Macintosh/.test(navigator.userAgent) &&
  /Chrome/.test(navigator.userAgent) &&
  !/Edg|OPR|Brave/.test(navigator.userAgent) &&
  !/Safari\/[0-9]/.test(navigator.userAgent.replace(/Chrome\/[0-9.]+/, ''));

// ── Speech recognition ────────────────────────────────────────────────
export const listenForSpeech = (timeoutMs = 12000) =>
  new Promise((resolve) => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { resolve('__NOT_SUPPORTED__'); return; }
    const rec = new SR();
    rec.continuous = false; rec.interimResults = false;
    rec.lang = 'en-US'; rec.maxAlternatives = 3;
    let done = false;
    const finish = (v) => { if (done) return; done = true; clearTimeout(t); resolve(v); };
    const t = setTimeout(() => { try { rec.stop(); } catch {} finish(''); }, timeoutMs);
    rec.onresult = (e) => {
      let best = '';
      for (let i = 0; i < e.results[0].length; i++)
        if (e.results[0][i].transcript.length > best.length)
          best = e.results[0][i].transcript;
      finish(best.trim());
    };
    rec.onerror = () => finish('');
    rec.onend   = () => finish('');
    try { rec.start(); } catch { finish(''); }
  });

// ── Speech comparison ─────────────────────────────────────────────────
export const checkSpeech = (spoken, target) => {
  const norm = s => s.toLowerCase().replace(/[^a-z\s]/g, '').trim().split(/\s+/).filter(Boolean);
  const sw = norm(spoken), tw = norm(target);
  if (!tw.length) return false;
  if (!sw.length) return false;

  // Fuzzy match: exact OR either word starts with enough of the other
  // (catches soft/cut-off speech, e.g. "bi" → "big", "fas" → "fast")
  const fuzzy = (t, s) => {
    if (s === t) return true;
    const minLen = Math.max(2, Math.ceil(Math.min(t.length, s.length) * 0.7));
    return t.startsWith(s.slice(0, minLen)) || s.startsWith(t.slice(0, minLen));
  };

  const score = tw.filter(t => sw.some(s => fuzzy(t, s))).length / tw.length;
  return score >= 0.5; // was 0.65 — more forgiving for soft-spoken kids
};

// ── Audio beeps ───────────────────────────────────────────────────────
let _ctx = null;
const _ac = () => {
  if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (_ctx.state === 'suspended') _ctx.resume();
  return _ctx;
};
export const playRewardSound = () => {
  try {
    const ctx = _ac();
    [523, 659, 784, 1047, 1319].forEach((f, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = f; o.type = 'sine';
      const t = ctx.currentTime + i * 0.13;
      g.gain.setValueAtTime(0.4, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      o.start(t); o.stop(t + 0.45);
    });
  } catch {}
};
export const playTryAgainSound = () => {
  try {
    const ctx = _ac(), o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.value = 300; o.type = 'sine';
    g.gain.setValueAtTime(0.25, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.5);
  } catch {}
};

// Layered sawtooth + triangle sweep → friendly dino roar
export const playDinoRoar = (short = false) => {
  try {
    const ctx = _ac();
    const now = ctx.currentTime;
    const dur = short ? 0.65 : 1.1;
    [[50, 'sawtooth', 0.28], [80, 'triangle', 0.18], [120, 'sine', 0.09]].forEach(([freq, type, vol]) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = type;
      o.frequency.setValueAtTime(freq * 0.55, now);
      o.frequency.exponentialRampToValueAtTime(freq * 2.8, now + dur * 0.22);
      o.frequency.exponentialRampToValueAtTime(freq * 0.65, now + dur * 0.88);
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(vol, now + 0.05);
      g.gain.setValueAtTime(vol, now + dur * 0.6);
      g.gain.exponentialRampToValueAtTime(0.001, now + dur);
      o.start(now); o.stop(now + dur + 0.05);
    });
  } catch {}
};
