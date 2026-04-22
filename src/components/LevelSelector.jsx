import { useState } from 'react';
import { LEVELS } from '../data/books';
import { delay, getELKey, isChromeOnMac, playDinoRoar, setELKey, speak } from '../utils/speech';

const LEVEL_COLORS = [
  { bg: '#fff3e0', border: '#ff9800', text: '#e65100' },
  { bg: '#e8f5e9', border: '#4caf50', text: '#2e7d32' },
  { bg: '#e3f2fd', border: '#2196f3', text: '#1565c0' },
  { bg: '#fce4ec', border: '#e91e63', text: '#880e4f' },
  { bg: '#ede7f6', border: '#9c27b0', text: '#4a148c' },
  { bg: '#e0f2f1', border: '#009688', text: '#004d40' },
];

export default function LevelSelector({ onSelect, onBack }) {
  const [testState,   setTestState]   = useState('idle'); // idle | speaking | done
  const [apiKey,      setApiKey]      = useState(getELKey);
  const [keyDraft,    setKeyDraft]    = useState(getELKey);
  const [showKeyInput,setShowKeyInput]= useState(!getELKey());
  const showSafariWarning = isChromeOnMac();

  const handleSaveKey = () => {
    setELKey(keyDraft.trim());
    setApiKey(keyDraft.trim());
    setShowKeyInput(false);
  };

  const handleTestSound = () => {
    setTestState('speaking');
    (async () => {
      playDinoRoar(true);
      await delay(700);
      await speak('Hi there!', { rate: 0.88, pitch: 0.86 });
      await delay(110);
      await speak('I am Reading Buddy!', { rate: 0.85, pitch: 0.82 });
      await delay(100);
      await speak('Can you hear me?', { rate: 0.86, pitch: 0.84 });
      setTestState('done');
    })();
  };

  return (
    <div className="screen level-screen">
      {onBack && <button className="back-btn" onClick={onBack}>← Back</button>}
      <h1 className="app-title">📖 Reading Buddy</h1>

      {/* Safari recommendation — only shown on macOS Chrome */}
      {showSafariWarning && (
        <div className="browser-banner">
          <span className="browser-banner-icon">⚠️</span>
          <div>
            <strong>Use Safari for best sound!</strong><br />
            Chrome on Mac blocks the reading voice. Open this page in
            Safari for full sound and a kid-friendly voice.
            <br />
            <span style={{ fontSize: '0.85em', opacity: 0.8 }}>
              Copy the URL from Chrome and paste it into Safari.
            </span>
          </div>
        </div>
      )}

      {/* ElevenLabs API key setup */}
      <div className="el-key-section">
        {apiKey ? (
          <div className="el-key-saved">
            <span>🎙️ ElevenLabs voice active</span>
            <button className="el-key-change" onClick={() => setShowKeyInput(v => !v)}>
              {showKeyInput ? 'Cancel' : 'Change'}
            </button>
          </div>
        ) : (
          <p className="el-key-prompt">
            🎙️ Add an <strong>ElevenLabs API key</strong> for a natural voice!{' '}
            <a href="https://elevenlabs.io" target="_blank" rel="noreferrer">Get a free key →</a>
          </p>
        )}
        {showKeyInput && (
          <div className="el-key-row">
            <input
              className="el-key-input"
              type="password"
              placeholder="Paste API key here…"
              value={keyDraft}
              onChange={e => setKeyDraft(e.target.value)}
            />
            <button className="el-key-save" onClick={handleSaveKey}>Save</button>
          </div>
        )}
      </div>

      {/* Sound test button */}
      <div className="sound-test-row">
        <button
          className={`sound-test-btn ${testState === 'done' ? 'sound-ok' : ''}`}
          onClick={handleTestSound}
          disabled={testState === 'speaking'}
        >
          {testState === 'speaking' ? '🔊 Speaking…' :
           testState === 'done'     ? '✅ Sound works — choose a level!' :
                                     '🔊 Tap to Test Sound'}
        </button>
      </div>

      <p className="subtitle">Choose your reading level</p>
      <div className="level-grid">
        {LEVELS.map((lvl, i) => {
          const c = LEVEL_COLORS[i];
          return (
            <button
              key={lvl.id}
              className="level-card"
              style={{ '--lc-bg': c.bg, '--lc-border': c.border, '--lc-text': c.text }}
              onClick={() => onSelect(lvl.id)}
            >
              <div className="level-stars">{'⭐'.repeat(lvl.stars)}</div>
              <div className="level-name">{lvl.label}</div>
              <div className="level-age">{lvl.ageLabel}</div>
              <div className="level-desc">{lvl.description}</div>
            </button>
          );
        })}
      </div>
      <p className="level-hint">💡 Start at Level 1 and work your way up!</p>
    </div>
  );
}
