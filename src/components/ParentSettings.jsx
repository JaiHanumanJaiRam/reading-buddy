import { useState } from 'react';
import { LEVELS } from '../data/books';
import { delay, getELKey, setELKey, speak } from '../utils/speech';

const LEVEL_COLORS = [
  { bg: '#fff3e0', border: '#ff9800', text: '#e65100' },
  { bg: '#e8f5e9', border: '#4caf50', text: '#2e7d32' },
  { bg: '#e3f2fd', border: '#2196f3', text: '#1565c0' },
  { bg: '#fce4ec', border: '#e91e63', text: '#880e4f' },
  { bg: '#ede7f6', border: '#9c27b0', text: '#4a148c' },
  { bg: '#e0f2f1', border: '#009688', text: '#004d40' },
];

export default function ParentSettings({ currentLevel, onLevelChange, onBack, onProgress }) {
  const [apiKey,       setApiKey]       = useState(getELKey);
  const [keyDraft,     setKeyDraft]     = useState(getELKey);
  const [showKeyInput, setShowKeyInput] = useState(!getELKey());
  const [testState,    setTestState]    = useState('idle');

  const handleSaveKey = () => {
    setELKey(keyDraft.trim());
    setApiKey(keyDraft.trim());
    setShowKeyInput(false);
  };

  const handleTestSound = () => {
    setTestState('speaking');
    (async () => {
      await speak('Hi there!', { rate: 0.88, pitch: 0.86 });
      await delay(110);
      await speak('I am Reading Buddy!', { rate: 0.85, pitch: 0.82 });
      setTestState('done');
    })();
  };

  return (
    <div className="screen settings-screen">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <h2 className="settings-title">Parent Settings</h2>

      <div className="settings-section">
        <p className="settings-label">Reading Level</p>
        <div className="level-grid">
          {LEVELS.map((lvl, i) => {
            const c = LEVEL_COLORS[i];
            return (
              <button
                key={lvl.id}
                className={`level-card ${lvl.id === currentLevel ? 'level-card-active' : ''}`}
                style={{ '--lc-bg': c.bg, '--lc-border': c.border, '--lc-text': c.text }}
                onClick={() => onLevelChange(lvl.id)}
              >
                <div className="level-stars">{'⭐'.repeat(lvl.stars)}</div>
                <div className="level-name">{lvl.label}</div>
                <div className="level-age">{lvl.ageLabel}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="settings-section">
        <p className="settings-label">Voice</p>
        <div className="el-key-section" style={{ margin: 0 }}>
          {apiKey ? (
            <div className="el-key-saved">
              <span>🎙️ ElevenLabs active</span>
              <button className="el-key-change" onClick={() => setShowKeyInput(v => !v)}>
                {showKeyInput ? 'Cancel' : 'Change'}
              </button>
            </div>
          ) : (
            <p className="el-key-prompt">
              Add an <strong>ElevenLabs API key</strong> for a natural voice.{' '}
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
        <div className="sound-test-row" style={{ marginTop: 10 }}>
          <button
            className={`sound-test-btn ${testState === 'done' ? 'sound-ok' : ''}`}
            onClick={handleTestSound}
            disabled={testState === 'speaking'}
          >
            {testState === 'speaking' ? '🔊 Speaking…' :
             testState === 'done'     ? '✅ Sounds good!' : '🔊 Test Voice'}
          </button>
        </div>
      </div>

      <button className="progress-nav-btn" onClick={onProgress}>
        📊 See Progress
      </button>
    </div>
  );
}
